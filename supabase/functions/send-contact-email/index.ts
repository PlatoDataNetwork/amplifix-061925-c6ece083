import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { z } from "https://deno.land/x/zod@v3.22.4/mod.ts";

const brevoApiKey = Deno.env.get("BREVO_API_KEY");

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

// Validation schema
const contactSchema = z.object({
  firstName: z.string().trim().min(1, "First name is required").max(100, "First name must be less than 100 characters"),
  lastName: z.string().trim().min(1, "Last name is required").max(100, "Last name must be less than 100 characters"),
  email: z.string().trim().email("Invalid email address").max(255, "Email must be less than 255 characters"),
  company: z.string().trim().max(200, "Company name must be less than 200 characters"),
  companyType: z.string().optional(),
  message: z.string().trim().min(1, "Message is required").max(5000, "Message must be less than 5000 characters"),
});

interface ContactFormRequest {
  firstName: string;
  lastName: string;
  email: string;
  company: string;
  companyType?: string;
  message: string;
}

// HTML encoding function to prevent XSS
function escapeHtml(text: string): string {
  const map: Record<string, string> = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#039;'
  };
  return text.replace(/[&<>"']/g, (m) => map[m]);
}

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const rawData: ContactFormRequest = await req.json();

    // Validate input data
    const validationResult = contactSchema.safeParse(rawData);
    if (!validationResult.success) {
      console.error("Validation failed:", validationResult.error.errors);
      return new Response(
        JSON.stringify({ 
          success: false, 
          error: "Validation failed",
          details: validationResult.error.errors
        }),
        {
          status: 400,
          headers: { "Content-Type": "application/json", ...corsHeaders },
        }
      );
    }

    const { firstName, lastName, email, company, message } = validationResult.data;

    // HTML-encode all user inputs to prevent XSS
    const safeFirstName = escapeHtml(firstName);
    const safeLastName = escapeHtml(lastName);
    const safeEmail = escapeHtml(email);
    const safeCompany = escapeHtml(company);
    const safeMessage = escapeHtml(message).replace(/\n/g, '<br>');

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
      subject: `New Contact Form Submission from ${safeFirstName} ${safeLastName}`,
      htmlContent: `
        <h2>New Contact Form Submission</h2>
        <p><strong>Name:</strong> ${safeFirstName} ${safeLastName}</p>
        <p><strong>Email:</strong> ${safeEmail}</p>
        <p><strong>Company:</strong> ${safeCompany}</p>
        <p><strong>Message:</strong></p>
        <p>${safeMessage}</p>
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
          name: `${safeFirstName} ${safeLastName}`
        }
      ],
      subject: "Thank you for contacting AmplifiX!",
      htmlContent: `
        <h1>Thank you for reaching out, ${safeFirstName}!</h1>
        <p>We have received your message and will get back to you within 24 hours.</p>
        <p>Here's a copy of what you sent us:</p>
        <blockquote style="border-left: 4px solid #0066cc; padding-left: 16px; margin: 16px 0;">
          <p><strong>Subject:</strong> ${safeCompany ? `Inquiry from ${safeCompany}` : 'General Inquiry'}</p>
          <p>${safeMessage}</p>
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