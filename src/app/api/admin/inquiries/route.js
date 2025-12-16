import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { supabaseDB } from '@/lib/supabase';

// GET - Fetch all contact inquiries
export async function GET() {
  let inquiries = [];
  let source = 'none';

  try {
    // Try Prisma first (primary database)
    try {
      inquiries = await prisma.contactInquiry.findMany({
        orderBy: { createdAt: 'desc' }
      });
      source = 'prisma';
      console.log('✅ Fetched inquiries from Prisma:', inquiries.length);
    } catch (prismaError) {
      console.error('❌ Prisma fetch failed:', prismaError);
      
      // Fallback to Supabase
      try {
        const supabaseInquiries = await supabaseDB.getContactInquiries();
        // Convert Supabase format to match Prisma format
        inquiries = supabaseInquiries.map(inquiry => ({
          id: inquiry.id,
          name: inquiry.name,
          email: inquiry.email,
          phone: inquiry.phone,
          company: inquiry.company,
          subject: inquiry.subject,
          message: inquiry.message,
          status: inquiry.status,
          emailSent: inquiry.email_sent,
          createdAt: inquiry.created_at,
          updatedAt: inquiry.updated_at
        }));
        source = 'supabase';
        console.log('✅ Fetched inquiries from Supabase:', inquiries.length);
      } catch (supabaseError) {
        console.error('❌ Supabase fetch failed:', supabaseError);
        throw new Error('Both databases failed');
      }
    }

    return NextResponse.json({ 
      ok: true, 
      inquiries,
      source,
      count: inquiries.length
    });

  } catch (error) {
    console.error('❌ Failed to fetch inquiries from both databases:', error);
    return NextResponse.json({ 
      error: 'Failed to fetch inquiries from both databases',
      inquiries: [],
      source: 'none'
    }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}

// PATCH - Update inquiry status
export async function PATCH(req) {
  try {
    const { id, status } = await req.json();

    if (!id || !status) {
      return NextResponse.json({ 
        error: 'Missing required fields' 
      }, { status: 400 });
    }

    if (!['new', 'replied', 'resolved'].includes(status)) {
      return NextResponse.json({ 
        error: 'Invalid status' 
      }, { status: 400 });
    }

    let updatedInquiry = null;
    let updateSource = 'none';

    // Try updating in Prisma first
    try {
      updatedInquiry = await prisma.contactInquiry.update({
        where: { id: parseInt(id) },
        data: { 
          status,
          updatedAt: new Date()
        }
      });
      updateSource = 'prisma';
      console.log(`✅ Inquiry ${id} status updated in Prisma to: ${status}`);
    } catch (prismaError) {
      console.error('❌ Prisma update failed:', prismaError);
      
      // Fallback to Supabase
      try {
        const supabaseResult = await supabaseDB.updateInquiryStatus(parseInt(id), status);
        updatedInquiry = {
          id: supabaseResult.id,
          name: supabaseResult.name,
          email: supabaseResult.email,
          phone: supabaseResult.phone,
          company: supabaseResult.company,
          subject: supabaseResult.subject,
          message: supabaseResult.message,
          status: supabaseResult.status,
          emailSent: supabaseResult.email_sent,
          createdAt: supabaseResult.created_at,
          updatedAt: supabaseResult.updated_at
        };
        updateSource = 'supabase';
        console.log(`✅ Inquiry ${id} status updated in Supabase to: ${status}`);
      } catch (supabaseError) {
        console.error('❌ Supabase update failed:', supabaseError);
        throw new Error('Both database updates failed');
      }
    }

    return NextResponse.json({ 
      ok: true, 
      inquiry: updatedInquiry,
      source: updateSource
    });

  } catch (error) {
    console.error('❌ Failed to update inquiry in both databases:', error);
    return NextResponse.json({ 
      error: 'Failed to update inquiry in both databases' 
    }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}

// DELETE - Delete inquiry (optional)
export async function DELETE(req) {
  try {
    const { id } = await req.json();

    if (!id) {
      return NextResponse.json({ 
        error: 'Missing inquiry ID' 
      }, { status: 400 });
    }

    await prisma.contactInquiry.delete({
      where: { id: parseInt(id) }
    });

    console.log(`✅ Inquiry ${id} deleted`);

    return NextResponse.json({ 
      ok: true, 
      message: 'Inquiry deleted successfully' 
    });

  } catch (error) {
    console.error('❌ Failed to delete inquiry:', error);
    return NextResponse.json({ 
      error: 'Failed to delete inquiry' 
    }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}