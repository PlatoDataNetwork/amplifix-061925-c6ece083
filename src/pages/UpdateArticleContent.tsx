import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card } from '@/components/ui/card';
import { useUpdateArticle } from '@/hooks/useUpdateArticle';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

const UpdateArticleContent = () => {
  const navigate = useNavigate();
  const { updateArticle, isUpdating } = useUpdateArticle();
  const [content, setContent] = useState('');
  const [isAdmin, setIsAdmin] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const updatedContent = `Pimax Unveils Dream Air Prototypes and Addresses Frequently Asked Questions

Pimax, a leading innovator in the virtual reality (VR) industry, has once again captured the attention of tech enthusiasts and VR aficionados with the unveiling of its latest prototypes, the "Dream Air." Known for pushing the boundaries of immersive technology, Pimax has built a reputation for delivering high-resolution, wide field-of-view (FOV) headsets that cater to both gamers and professionals. The Dream Air prototypes represent a bold step forward in the company's mission to redefine the VR experience. In this article, we'll explore the key features of the Dream Air prototypes, their potential impact on the VR landscape, and answers to some of the most frequently asked questions about this exciting new development.



 What is the Pimax Dream Air?

The Pimax Dream Air is a lightweight, next-generation VR headset prototype designed to deliver a highly immersive experience while prioritizing comfort and accessibility. Unlike Pimax's previous high-end models, which are known for their ultra-wide FOV and cutting-edge specifications, the Dream Air is being positioned as a more versatile and user-friendly device. It aims to cater to a broader audience, including casual users, fitness enthusiasts, and those seeking a more portable VR solution. The Dream Air prototypes are still in the development phase, but early reports suggest that they will feature a sleek, minimalist design, improved ergonomics, and advanced display technology. Pimax has also hinted at incorporating mixed reality (MR) capabilities, making the Dream Air a potential competitor in both the VR and MR markets.



 Key Features of the Dream Air Prototypes

While Pimax has not yet released the full technical specifications of the Dream Air, the prototypes showcased during the unveiling event highlight several innovative features:

1. Lightweight Design  
   One of the standout features of the Dream Air is its lightweight construction. Pimax has focused on reducing the bulkiness often associated with VR headsets, making the Dream Air more comfortable for extended use. This design is particularly appealing for fitness applications and casual gaming.

2. High-Resolution Displays  
   Staying true to its legacy, Pimax is expected to equip the Dream Air with high-resolution displays that deliver crisp visuals and vibrant colors. Early prototypes suggest a resolution comparable to the company's flagship models, ensuring a premium visual experience.

3. Wide Field of View  
   Pimax is renowned for its ultra-wide FOV, and the Dream Air is no exception. The prototypes reportedly feature a FOV that surpasses most competitors in the lightweight VR category, providing users with a more immersive experience.

4. Mixed Reality Integration  
   The Dream Air prototypes include front-facing cameras, hinting at potential MR capabilities. This feature would allow users to seamlessly blend virtual and real-world environments, opening up new possibilities for gaming, productivity, and creative applications.

5. Wireless Connectivity  
   Pimax has confirmed that the Dream Air will support wireless connectivity, eliminating the need for cumbersome cables and enhancing user freedom of movement. This feature is particularly beneficial for active VR experiences, allowing users to move naturally without being tethered to a PC or gaming console. The wireless functionality is expected to leverage advanced low-latency transmission technology, ensuring minimal lag and maintaining the high-quality visual experience that Pimax is known for. This makes the Dream Air an attractive option for fitness applications, room-scale gaming, and social VR experiences where mobility is essential.

<ul class="plato-post-bottom-links">
	<li class="plato-post-bottom-link-article-source"><span>Source Link:</span> <a href="https://platodata.ai/pimax-reveals-dream-air-prototypes-and-answers-key-questions/" target="_blank">https://platodata.ai/pimax-reveals-dream-air-prototypes-and-answers-key-questions/</a></li>
</ul>`;

  useEffect(() => {
    checkAdminStatus();
    setContent(updatedContent);
  }, []);

  const checkAdminStatus = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        toast.error('Please log in as an admin');
        navigate('/login');
        return;
      }

      const { data: roleData } = await supabase
        .from('user_roles')
        .select('role')
        .eq('user_id', user.id)
        .eq('role', 'admin')
        .maybeSingle();

      if (!roleData) {
        toast.error('Admin access required');
        navigate('/');
        return;
      }

      setIsAdmin(true);
    } catch (error) {
      console.error('Error checking admin status:', error);
      toast.error('Error verifying admin status');
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdate = async () => {
    try {
      await updateArticle(2650394, content);
      toast.success('Article updated! Refresh the page to see changes.');
      setTimeout(() => {
        navigate('/intel/external/2650394');
      }, 1500);
    } catch (error) {
      console.error('Error updating article:', error);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Loading...</p>
      </div>
    );
  }

  if (!isAdmin) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background p-8">
      <Card className="max-w-4xl mx-auto p-6">
        <h1 className="text-2xl font-bold mb-4">Update Article Content</h1>
        <p className="text-muted-foreground mb-4">
          Article ID: 2650394 - The paragraph about prototypes will be moved right after "VR solution"
        </p>
        
        <Textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          className="min-h-[500px] font-mono text-sm mb-4"
        />
        
        <div className="flex gap-4">
          <Button 
            onClick={handleUpdate} 
            disabled={isUpdating}
          >
            {isUpdating ? 'Updating...' : 'Update Article'}
          </Button>
          <Button 
            variant="outline" 
            onClick={() => navigate('/intel/external/2650394')}
          >
            Cancel
          </Button>
        </div>
      </Card>
    </div>
  );
};

export default UpdateArticleContent;
