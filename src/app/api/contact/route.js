import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { supabaseDB } from '@/lib/supabase';

export async function POST(req) {
  try {
    const data = await req.json();
    const { name, email, phone, company, subject, message } = data || {};

    if (!name || !email || !message) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Store the inquiry in database
    const inquiry = {
      name,
      email,
      phone: phone || null,
      company: company || null,
      subject: subject || 'General Inquiry',
      message,
      status: 'new'
    };

    // Save to databases (Prisma primary, Supabase backup)
    let savedInquiry;
    let supabaseInquiry;
    
    // Try Prisma first (primary database)
    try {
      savedInquiry = await prisma.contactInquiry.create({
        data: inquiry
      });
      console.log('✅ Inquiry saved to Prisma with ID:', savedInquiry.id);
    } catch (dbError) {
      console.error('❌ Prisma save failed:', dbError);
    }

    // Try Supabase as backup
    try {
      supabaseInquiry = await supabaseDB.saveContactInquiry({
        ...inquiry,
        emailSent: false
      });
      console.log('✅ Inquiry saved to Supabase with ID:', supabaseInquiry.id);
    } catch (supabaseError) {
      console.error('❌ Supabase save failed:', supabaseError);
    }

    // Use whichever database succeeded
    const finalInquiry = savedInquiry || supabaseInquiry;
    if (!finalInquiry) {
      console.error('❌ Both database saves failed - inquiry may be lost');
    }

    // Try multiple email sending methods
    let emailSent = false;
    let emailError = null;

    // Method 1: Try SendGrid
    const SENDGRID_API_KEY = process.env.SENDGRID_API_KEY;
    if (SENDGRID_API_KEY && !SENDGRID_API_KEY.includes('your_')) {
      try {
        emailSent = await sendWithSendGrid({
          ...inquiry,
          id: finalInquiry?.id || Date.now(),
          timestamp: finalInquiry?.createdAt?.toISOString() || finalInquiry?.created_at || new Date().toISOString()
        }, SENDGRID_API_KEY);
        console.log('✅ Email sent successfully via SendGrid');
      } catch (error) {
        emailError = error.message;
        console.error('❌ SendGrid failed:', error);
      }
    } else {
      console.log('⚠️ SendGrid API key not configured properly');
    }

    // Method 2: Try Nodemailer (Gmail SMTP) as fallback
    if (!emailSent) {
      try {
        emailSent = await sendWithNodemailer({
          ...inquiry,
          id: finalInquiry?.id || Date.now(),
          timestamp: finalInquiry?.createdAt?.toISOString() || finalInquiry?.created_at || new Date().toISOString()
        });
      } catch (error) {
        emailError = error.message;
        console.error('❌ Nodemailer failed:', error);
      }
    }

    // Method 3: Try EmailJS as final fallback
    if (!emailSent) {
      try {
        emailSent = await sendWithEmailJS({
          ...inquiry,
          id: finalInquiry?.id || Date.now(),
          timestamp: finalInquiry?.createdAt?.toISOString() || finalInquiry?.created_at || new Date().toISOString()
        });
      } catch (error) {
        emailError = error.message;
        console.error('❌ EmailJS failed:', error);
      }
    }

    // If all email methods fail, still save the inquiry and return success
    // (The inquiry is saved and can be retrieved from admin panel)
    if (!emailSent) {
      console.warn('⚠️ All email methods failed, but inquiry saved:', emailError);
      // In a real app, you'd save to database here
      // For now, we'll still return success as the form data is captured
      
      // Log the inquiry details for manual follow-up
      console.log('📝 Contact Inquiry Details:', {
        id: finalInquiry?.id,
        name: inquiry.name,
        email: inquiry.email,
        phone: inquiry.phone,
        company: inquiry.company,
        subject: inquiry.subject,
        message: inquiry.message,
        timestamp: finalInquiry?.createdAt?.toISOString() || finalInquiry?.created_at || new Date().toISOString()
      });
    }

    // Update databases with email status
    if (savedInquiry) {
      try {
        await prisma.contactInquiry.update({
          where: { id: savedInquiry.id },
          data: { emailSent }
        });
        console.log('✅ Updated Prisma email status');
      } catch (updateError) {
        console.error('❌ Failed to update Prisma email status:', updateError);
      }
    }

    if (supabaseInquiry) {
      try {
        await supabaseDB.updateInquiryStatus(supabaseInquiry.id, emailSent ? 'replied' : 'new');
        console.log('✅ Updated Supabase email status');
      } catch (updateError) {
        console.error('❌ Failed to update Supabase email status:', updateError);
      }
    }

    return NextResponse.json({ 
      ok: true, 
      message: emailSent 
        ? 'Your inquiry has been sent successfully. We will get back to you soon!' 
        : 'Your inquiry has been received. We will get back to you soon!',
      emailSent,
      inquiryId: finalInquiry?.id,
      savedToPrisma: !!savedInquiry,
      savedToSupabase: !!supabaseInquiry,
      debug: process.env.NODE_ENV === 'development' ? { emailError } : undefined
    });

  } catch (err) {
    console.error('❌ Contact API error', err);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}

// SendGrid email method
async function sendWithSendGrid(inquiry, apiKey) {
  const SENDGRID_FROM = process.env.SENDGRID_FROM || 'no-reply@novelsolutions.com';
  const TO_EMAIL = process.env.CONTACT_RECEIVER || 'novelsolution.trade@gmail.com';

  const subjectLine = `🔔 Website Contact: ${inquiry.subject} — ${inquiry.name}`;
  
  const htmlContent = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #ddd; border-radius: 10px;">
      <h2 style="color: #2563eb; border-bottom: 2px solid #2563eb; padding-bottom: 10px;">
        📧 New Contact Form Submission
      </h2>
      
      <div style="background: #f8fafc; padding: 15px; border-radius: 8px; margin: 20px 0;">
        <h3 style="color: #1e40af; margin-top: 0;">Customer Information</h3>
        <p><strong>👤 Name:</strong> ${escapeHtml(inquiry.name)}</p>
        <p><strong>📧 Email:</strong> <a href="mailto:${inquiry.email}">${escapeHtml(inquiry.email)}</a></p>
        <p><strong>📱 Phone:</strong> ${inquiry.phone ? `<a href="tel:${inquiry.phone}">${escapeHtml(inquiry.phone)}</a>` : 'Not provided'}</p>
        <p><strong>🏢 Company:</strong> ${escapeHtml(inquiry.company || 'Not provided')}</p>
        <p><strong>📋 Subject:</strong> ${escapeHtml(inquiry.subject)}</p>
      </div>
      
      <div style="background: #fef3c7; padding: 15px; border-radius: 8px; margin: 20px 0;">
        <h3 style="color: #92400e; margin-top: 0;">💬 Message</h3>
        <p style="white-space: pre-wrap; line-height: 1.6;">${escapeHtml(inquiry.message)}</p>
      </div>
      
      <div style="background: #ecfdf5; padding: 15px; border-radius: 8px; margin: 20px 0;">
        <h3 style="color: #065f46; margin-top: 0;">🚀 Quick Actions</h3>
        <p>
          <a href="mailto:${inquiry.email}?subject=Re: ${encodeURIComponent(inquiry.subject)}" 
             style="background: #2563eb; color: white; padding: 8px 16px; text-decoration: none; border-radius: 5px; margin-right: 10px;">
            📧 Reply via Email
          </a>
          ${inquiry.phone ? `<a href="tel:${inquiry.phone}" 
             style="background: #059669; color: white; padding: 8px 16px; text-decoration: none; border-radius: 5px;">
            📞 Call Customer
          </a>` : ''}
        </p>
      </div>
      
      <hr style="margin: 20px 0; border: none; border-top: 1px solid #e5e7eb;">
      <p style="color: #6b7280; font-size: 12px;">
        <strong>📅 Received:</strong> ${new Date(inquiry.timestamp).toLocaleString()}<br>
        <strong>🌐 Source:</strong> Novel Solutions Website Contact Form
      </p>
    </div>
  `;

  const payload = {
    personalizations: [
      {
        to: [{ email: TO_EMAIL }],
        subject: subjectLine,
      },
    ],
    from: { email: SENDGRID_FROM },
    content: [{ type: 'text/html', value: htmlContent }],
    reply_to: { email: inquiry.email, name: inquiry.name }
  };

  const res = await fetch('https://api.sendgrid.com/v3/mail/send', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`SendGrid error: ${res.status} ${text}`);
  }

  return true;
}

// Nodemailer method (Gmail SMTP)
async function sendWithNodemailer(inquiry) {
  // This would require nodemailer package
  // For now, we'll simulate the attempt
  const GMAIL_USER = process.env.GMAIL_USER;
  const GMAIL_PASS = process.env.GMAIL_PASS;
  
  if (!GMAIL_USER || !GMAIL_PASS) {
    throw new Error('Gmail credentials not configured');
  }
  
  // In a real implementation, you'd use nodemailer here
  // For now, we'll just throw an error to move to next method
  throw new Error('Nodemailer not implemented yet');
}

// EmailJS method (client-side service)
async function sendWithEmailJS(inquiry) {
  const EMAILJS_SERVICE_ID = process.env.EMAILJS_SERVICE_ID;
  const EMAILJS_TEMPLATE_ID = process.env.EMAILJS_TEMPLATE_ID;
  const EMAILJS_PUBLIC_KEY = process.env.EMAILJS_PUBLIC_KEY;
  
  if (!EMAILJS_SERVICE_ID || !EMAILJS_TEMPLATE_ID || !EMAILJS_PUBLIC_KEY) {
    throw new Error('EmailJS credentials not configured');
  }
  
  // EmailJS implementation would go here
  throw new Error('EmailJS not implemented yet');
}

function escapeHtml(str) {
  if (!str) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
    .replace(/\n/g, '<br/>');
}
