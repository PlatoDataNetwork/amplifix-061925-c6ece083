import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import { corsHeaders } from '../_shared/cors.ts'

interface VerticalInfo {
  id: string;
  name: string;
  slug: string;
  description?: string;
  icon?: string;
  rss_feed?: string;
  json_feed?: string;
}

interface ImportResult {
  vertical: string;
  slug: string;
  imported: number;
  skipped: number;
  errors: number;
  duration: number;
  status: 'completed' | 'failed' | 'partial';
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  const startTime = Date.now();

  // Verify authentication
  const authHeader = req.headers.get('Authorization');
  if (!authHeader) {
    return new Response(
      JSON.stringify({ success: false, error: 'Unauthorized' }),
      { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }

  try {
    // Create client for auth verification
    const supabaseAuth = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      {
        auth: { persistSession: false },
        global: { headers: { Authorization: authHeader } },
      }
    );

    const token = authHeader.replace('Bearer ', '');
    const { data: { user }, error: authError } = await supabaseAuth.auth.getUser(token);

    if (authError || !user) {
      return new Response(
        JSON.stringify({ success: false, error: 'Invalid token' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Check admin role
    const { data: hasAdminRole, error: roleError } = await supabaseAuth
      .rpc('has_role', { _user_id: user.id, _role: 'admin' });

    if (roleError || !hasAdminRole) {
      return new Response(
        JSON.stringify({ success: false, error: 'Admin access required' }),
        { status: 403, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log(`Admin ${user.email} starting Plato verticals import`);

    // Create service role client
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
      { auth: { persistSession: false } }
    );

    // Create realtime channel for progress updates
    const progressChannel = supabaseClient.channel(`plato-import-${user.id}`, {
      config: { broadcast: { self: true } }
    });
    
    await progressChannel.subscribe();

    const broadcastProgress = async (update: any) => {
      await progressChannel.send({
        type: 'broadcast',
        event: 'plato-import-progress',
        payload: update
      });
    };

    // Fetch verticals JSON
    console.log('🔄 Fetching verticals list from platodata.ai...');
    await broadcastProgress({
      phase: 'fetching-verticals',
      message: 'Fetching verticals list...'
    });

    const verticalsResponse = await fetch('https://platodata.ai/json/verticals/');
    if (!verticalsResponse.ok) {
      throw new Error('Failed to fetch verticals list');
    }

    const verticals: VerticalInfo[] = await verticalsResponse.json();
    console.log(`✓ Found ${verticals.length} verticals`);

    const results: ImportResult[] = [];
    let totalImported = 0;
    let totalSkipped = 0;
    let totalErrors = 0;

    await broadcastProgress({
      phase: 'processing',
      message: `Starting import of ${verticals.length} verticals...`,
      totalVerticals: verticals.length,
      processedCount: 0,
      imported: 0,
      skipped: 0,
      errors: 0
    });

    // Process each vertical
    for (let i = 0; i < verticals.length; i++) {
      const vertical = verticals[i];
      const verticalStartTime = Date.now();

      console.log(`\n[${i + 1}/${verticals.length}] Processing ${vertical.name} (${vertical.slug})...`);

      await broadcastProgress({
        phase: 'processing',
        message: `Importing ${vertical.name}...`,
        currentVertical: vertical.name,
        totalVerticals: verticals.length,
        processedCount: i,
        imported: totalImported,
        skipped: totalSkipped,
        errors: totalErrors,
        percentComplete: Math.round((i / verticals.length) * 100)
      });

      try {
        // Create import history record
        const { data: historyRecord } = await supabaseClient
          .from('import_history')
          .insert({
            vertical_slug: vertical.slug,
            status: 'in_progress',
            imported_by: user.id,
            started_at: new Date().toISOString()
          })
          .select()
          .single();

        const historyId = historyRecord?.id;

        // Call import-articles function for this vertical
        const { data: importData, error: importError } = await supabaseClient.functions.invoke('import-articles', {
          body: { vertical: vertical.slug },
          headers: { Authorization: authHeader }
        });

        const duration = Date.now() - verticalStartTime;
        const imported = importData?.insertedArticles || 0;
        const skipped = importData?.skippedArticles || 0;
        const errors = importError ? 1 : 0;

        totalImported += imported;
        totalSkipped += skipped;
        if (errors > 0) totalErrors++;

        const result: ImportResult = {
          vertical: vertical.name,
          slug: vertical.slug,
          imported,
          skipped,
          errors,
          duration,
          status: importError ? 'failed' : 'completed'
        };

        results.push(result);

        // Update import history
        if (historyId) {
          await supabaseClient
            .from('import_history')
            .update({
              imported_count: imported,
              skipped_count: skipped,
              error_count: errors,
              total_processed: imported + skipped,
              duration_ms: duration,
              completed_at: new Date().toISOString(),
              status: result.status
            })
            .eq('id', historyId);
        }

        console.log(`✓ ${vertical.name}: imported=${imported}, skipped=${skipped}, duration=${duration}ms`);

        // Broadcast individual vertical completion
        await broadcastProgress({
          phase: 'processing',
          message: `Completed ${vertical.name}`,
          currentVertical: vertical.name,
          totalVerticals: verticals.length,
          processedCount: i + 1,
          imported: totalImported,
          skipped: totalSkipped,
          errors: totalErrors,
          percentComplete: Math.round(((i + 1) / verticals.length) * 100),
          lastResult: result
        });

      } catch (error) {
        console.error(`Error importing ${vertical.name}:`, error);
        totalErrors++;
        results.push({
          vertical: vertical.name,
          slug: vertical.slug,
          imported: 0,
          skipped: 0,
          errors: 1,
          duration: Date.now() - verticalStartTime,
          status: 'failed'
        });
      }

      // Small delay between verticals
      await new Promise(resolve => setTimeout(resolve, 500));
    }

    const totalDuration = Date.now() - startTime;

    // Send final progress
    await broadcastProgress({
      phase: 'complete',
      message: 'Import complete!',
      totalVerticals: verticals.length,
      processedCount: verticals.length,
      imported: totalImported,
      skipped: totalSkipped,
      errors: totalErrors,
      percentComplete: 100
    });

    // Clean up channel
    await supabaseClient.removeChannel(progressChannel);

    console.log('\n✅ Plato import completed');
    console.log(`   📊 Total Verticals: ${verticals.length}`);
    console.log(`   ✅ Total Imported: ${totalImported}`);
    console.log(`   ⏭️  Total Skipped: ${totalSkipped}`);
    console.log(`   ❌ Total Errors: ${totalErrors}`);
    console.log(`   ⏱️  Total Duration: ${Math.round(totalDuration / 1000)}s`);

    return new Response(
      JSON.stringify({
        success: true,
        totalVerticals: verticals.length,
        totalImported,
        totalSkipped,
        totalErrors,
        duration: totalDuration,
        results
      }),
      { 
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );

  } catch (error) {
    console.error('Import error:', error);
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: error.message,
        duration: Date.now() - startTime
      }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  }
});
