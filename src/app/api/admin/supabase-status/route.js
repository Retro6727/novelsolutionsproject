import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function GET() {
  try {
    const checks = {
      connection: false,
      contactInquiriesTable: false,
      productsTable: false,
      productImagesBucket: false,
      rowLevelSecurity: false
    };

    let status = 'error';
    let message = 'Supabase setup incomplete';
    const details = [];

    // 1. Test basic connection
    try {
      const { data, error } = await supabase
        .from('contact_inquiries')
        .select('count', { count: 'exact', head: true });
      
      if (!error) {
        checks.connection = true;
        details.push('✅ Database connection successful');
      } else {
        details.push(`❌ Connection failed: ${error.message}`);
      }
    } catch (err) {
      details.push(`❌ Connection error: ${err.message}`);
    }

    // 2. Check contact_inquiries table
    try {
      const { data, error } = await supabase
        .from('contact_inquiries')
        .select('*')
        .limit(1);
      
      if (!error) {
        checks.contactInquiriesTable = true;
        details.push('✅ contact_inquiries table exists');
      } else {
        details.push(`❌ contact_inquiries table: ${error.message}`);
      }
    } catch (err) {
      details.push(`❌ contact_inquiries table error: ${err.message}`);
    }

    // 3. Check products table
    try {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .limit(1);
      
      if (!error) {
        checks.productsTable = true;
        details.push('✅ products table exists');
      } else {
        details.push(`❌ products table: ${error.message}`);
      }
    } catch (err) {
      details.push(`❌ products table error: ${err.message}`);
    }

    // 4. Check storage bucket
    try {
      const { data: buckets, error } = await supabase.storage.listBuckets();
      
      if (!error) {
        const productImagesBucket = buckets.find(b => b.name === 'product-images');
        if (productImagesBucket) {
          checks.productImagesBucket = true;
          details.push('✅ product-images bucket exists');
        } else {
          details.push('❌ product-images bucket missing');
        }
      } else {
        details.push(`❌ Storage check failed: ${error.message}`);
      }
    } catch (err) {
      details.push(`❌ Storage error: ${err.message}`);
    }

    // 5. Test Row Level Security (try to insert)
    try {
      const { data, error } = await supabase
        .from('contact_inquiries')
        .insert([{
          name: 'RLS Test',
          email: 'rls-test@example.com',
          subject: 'RLS Test',
          message: 'Testing Row Level Security'
        }])
        .select();
      
      if (!error && data && data.length > 0) {
        checks.rowLevelSecurity = true;
        details.push('✅ Row Level Security working');
        
        // Clean up test record
        await supabase
          .from('contact_inquiries')
          .delete()
          .eq('id', data[0].id);
      } else {
        details.push(`❌ RLS test failed: ${error?.message || 'Unknown error'}`);
      }
    } catch (err) {
      details.push(`❌ RLS test error: ${err.message}`);
    }

    // Determine overall status
    const passedChecks = Object.values(checks).filter(Boolean).length;
    const totalChecks = Object.keys(checks).length;

    if (passedChecks === totalChecks) {
      status = 'ready';
      message = 'Supabase is fully configured and ready';
    } else if (passedChecks > 0) {
      status = 'setup-needed';
      message = `Supabase partially configured (${passedChecks}/${totalChecks} checks passed)`;
    } else {
      status = 'error';
      message = 'Supabase setup required - run SQL script';
    }

    return NextResponse.json({
      ok: true,
      status,
      message,
      checks,
      details,
      passedChecks,
      totalChecks,
      setupInstructions: status !== 'ready' ? [
        '1. Go to https://uwuuyelynldcpumhcqhn.supabase.co',
        '2. Open SQL Editor',
        '3. Run the content from supabase-setup.sql',
        '4. Refresh this page'
      ] : null
    });

  } catch (error) {
    console.error('❌ Supabase status check failed:', error);
    return NextResponse.json({
      ok: false,
      status: 'error',
      message: 'Failed to check Supabase status',
      error: error.message,
      setupInstructions: [
        '1. Check environment variables',
        '2. Verify Supabase project URL and API key',
        '3. Run SQL setup script',
        '4. Check internet connection'
      ]
    }, { status: 500 });
  }
}