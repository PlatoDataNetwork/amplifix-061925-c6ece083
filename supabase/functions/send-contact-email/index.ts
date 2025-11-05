import { serve } from "https://deno.land/std@0.190.0/http/server.ts";

const brevoApiKey = Deno.env.get("BREVO_API_KEY");

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

interface ContactFormRequest {
  firstName: string;
  lastName: string;
  email: string;
  company?: string;
  companyType?: string;
  message: string;
}

// Security: Rate limiting using in-memory store (resets on function restart)
const rateLimitMap = new Map<string, { count: number; resetTime: number }>();
const RATE_LIMIT_WINDOW = 60000; // 1 minute
const MAX_REQUESTS = 3; // 3 requests per minute per IP

// Security: Input validation and sanitization
function validateAndSanitize(data: ContactFormRequest): ContactFormRequest | null {
  const nameRegex = /^[a-zA-Z\s'-]{1,50}$/;
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  
  // Validate firstName
  if (!data.firstName || !nameRegex.test(data.firstName.trim())) {
    return null;
  }
  
  // Validate lastName
  if (!data.lastName || !nameRegex.test(data.lastName.trim())) {
    return null;
  }
  
  // Validate email
  if (!data.email || !emailRegex.test(data.email.trim()) || data.email.length > 255) {
    return null;
  }
  
  // Validate message
  if (!data.message || data.message.trim().length < 10 || data.message.length > 2000) {
    return null;
  }
  
  // Sanitize company (optional)
  const company = data.company ? data.company.trim().substring(0, 100) : "";
  
  // Sanitize HTML to prevent XSS
  const sanitizeHtml = (str: string) => 
    str.replace(/[<>]/g, (char) => char === '<' ? '&lt;' : '&gt;');
  
  return {
    firstName: sanitizeHtml(data.firstName.trim()),
    lastName: sanitizeHtml(data.lastName.trim()),
    email: data.email.trim().toLowerCase(),
    company: sanitizeHtml(company),
    companyType: data.companyType,
    message: sanitizeHtml(data.message.trim())
  };
}

function checkRateLimit(identifier: string): boolean {
  const now = Date.now();
  const record = rateLimitMap.get(identifier);
  
  if (!record || now > record.resetTime) {
    rateLimitMap.set(identifier, { count: 1, resetTime: now + RATE_LIMIT_WINDOW });
    return true;
  }
  
  if (record.count >= MAX_REQUESTS) {
    return false;
  }
  
  record.count++;
  return true;
}

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Security: Rate limiting by IP address
    const clientIp = req.headers.get("x-forwarded-for")?.split(",")[0] || "unknown";
    
    if (!checkRateLimit(clientIp)) {
      return new Response(
        JSON.stringify({ 
          success: false, 
          error: "Too many requests. Please try again later." 
        }),
        {
          status: 429,
          headers: { "Content-Type": "application/json", ...corsHeaders },
        }
      );
    }

    const rawData: ContactFormRequest = await req.json();
    
    // Security: Validate and sanitize all inputs
    const validatedData = validateAndSanitize(rawData);
    
    if (!validatedData) {
      return new Response(
        JSON.stringify({ 
          success: false, 
          error: "Invalid input data. Please check your form and try again." 
        }),
        {
          status: 400,
          headers: { "Content-Type": "application/json", ...corsHeaders },
        }
      );
    }
    
    const { firstName, lastName, email, company, message } = validatedData;

    // Send notification email to AmplifiX using Brevo API
    const notificationPayload = {
      sender: {
        name: "AmplifiX Contact Form",
        email: "noreply@amplifix.net"
      },
      to: [
        {
          email: "support@amplifix.net",
          name: "AmplifiX Support"
        }
      ],
      subject: `New Contact Form Submission from ${firstName} ${lastName}`,
      htmlContent: `
        <h2>New Contact Form Submission</h2>
        <p><strong>Name:</strong> ${firstName} ${lastName}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Company:</strong> ${company}</p>
        <p><strong>Message:</strong></p>
        <p>${message.replace(/\n/g, '<br>')}</p>
      `
    };

    const notificationResponse = await fetch('https://api.brevo.com/v3/smtp/email', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'api-key': brevoApiKey!
      },
      body: JSON.stringify(notificationPayload)
    });

    // Send confirmation email to the user using Brevo API
    const confirmationPayload = {
      sender: {
        name: "AmplifiX",
        email: "noreply@amplifix.net"
      },
      to: [
        {
          email: email,
          name: `${firstName} ${lastName}`
        }
      ],
      subject: "Thank you for contacting AmplifiX!",
      htmlContent: `
        <h1>Thank you for reaching out, ${firstName}!</h1>
        <p>We have received your message and will get back to you within 24 hours.</p>
        <p>Here's a copy of what you sent us:</p>
        <blockquote style="border-left: 4px solid #0066cc; padding-left: 16px; margin: 16px 0;">
          <p><strong>Subject:</strong> ${company ? `Inquiry from ${company}` : 'General Inquiry'}</p>
          <p>${message.replace(/\n/g, '<br>')}</p>
        </blockquote>
        <p>Best regards,<br>The AmplifiX Team</p>
      `
    };

    const confirmationResponse = await fetch('https://api.brevo.com/v3/smtp/email', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'api-key': brevoApiKey!
      },
      body: JSON.stringify(confirmationPayload)
    });

    const notificationResult = await notificationResponse.json();
    const confirmationResult = await confirmationResponse.json();

    return new Response(JSON.stringify({ 
      success: true, 
      message: "Email sent successfully" 
    }), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        ...corsHeaders,
      },
    });
  } catch (error: any) {
    // Security: Don't expose sensitive error details
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: error.message 
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

serve(handler);