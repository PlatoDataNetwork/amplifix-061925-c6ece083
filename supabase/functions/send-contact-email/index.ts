import { serve } from "https://deno.land/std@0.190.0/http/server.ts";

const brevoApiKey = Deno.env.get("RESEND_API_KEY"); // Using same secret name for Brevo API key

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

interface ContactFormRequest {
  firstName: string;
  lastName: string;
  email: string;
  company: string;
  message: string;
}

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { firstName, lastName, email, company, message }: ContactFormRequest = await req.json();

    console.log("Received contact form submission:", { firstName, lastName, email, company });

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

    console.log("Emails sent successfully:", { 
      notification: notificationResult, 
      confirmation: confirmationResult 
    });

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
    console.error("Error in send-contact-email function:", error);
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