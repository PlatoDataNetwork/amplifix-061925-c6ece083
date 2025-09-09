import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "npm:resend@2.0.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

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

    // Send notification email to AmplifiX
    const notificationResponse = await resend.emails.send({
      from: "AmplifiX Contact Form <onboarding@resend.dev>",
      to: ["support@amplifix.net"],
      subject: `New Contact Form Submission from ${firstName} ${lastName}`,
      html: `
        <h2>New Contact Form Submission</h2>
        <p><strong>Name:</strong> ${firstName} ${lastName}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Company:</strong> ${company}</p>
        <p><strong>Message:</strong></p>
        <p>${message.replace(/\n/g, '<br>')}</p>
      `,
    });

    // Send confirmation email to the user
    const confirmationResponse = await resend.emails.send({
      from: "AmplifiX <onboarding@resend.dev>",
      to: [email],
      subject: "Thank you for contacting AmplifiX!",
      html: `
        <h1>Thank you for reaching out, ${firstName}!</h1>
        <p>We have received your message and will get back to you within 24 hours.</p>
        <p>Here's a copy of what you sent us:</p>
        <blockquote style="border-left: 4px solid #0066cc; padding-left: 16px; margin: 16px 0;">
          <p><strong>Subject:</strong> ${company ? `Inquiry from ${company}` : 'General Inquiry'}</p>
          <p>${message.replace(/\n/g, '<br>')}</p>
        </blockquote>
        <p>Best regards,<br>The AmplifiX Team</p>
      `,
    });

    console.log("Emails sent successfully:", { notificationResponse, confirmationResponse });

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