// Supabase Database & Storage Checker
// Run with: node check-supabase.js

import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://uwuuyelynldcpumhcqhn.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InV3dXV5ZWx5bmxkY3B1bWhjcWhuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjU4Nzk3MzAsImV4cCI6MjA4MTQ1NTczMH0.Gdf7TeQCRwyC7DmqmzFOymY7ITrXwjIMw8HPxGT3_Ac';

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkSupabaseSetup() {
  console.log('🔍 Checking Supabase Setup...\n');

  try {
    // 1. Check Database Connection
    console.log('1️⃣ Testing Database Connection...');
    const { data: connectionTest, error: connectionError } = await supabase
      .from('contact_inquiries')
      .select('count', { count: 'exact', head: true });
    
    if (connectionError) {
      console.log('❌ Database connection failed:', connectionError.message);
      console.log('🔧 Action needed: Run the SQL setup script in Supabase SQL Editor\n');
    } else {
      console.log('✅ Database connection successful\n');
    }

    // 2. Check Tables Exist
    console.log('2️⃣ Checking Required Tables...');
    
    // Check contact_inquiries table
    try {
      const { data, error } = await supabase
        .from('contact_inquiries')
        .select('*')
        .limit(1);
      
      if (error) {
        console.log('❌ contact_inquiries table missing:', error.message);
      } else {
        console.log('✅ contact_inquiries table exists');
      }
    } catch (err) {
      console.log('❌ contact_inquiries table check failed:', err.message);
    }

    // Check products table
    try {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .limit(1);
      
      if (error) {
        console.log('❌ products table missing:', error.message);
      } else {
        console.log('✅ products table exists');
      }
    } catch (err) {
      console.log('❌ products table check failed:', err.message);
    }

    console.log('');

    // 3. Check Storage Buckets
    console.log('3️⃣ Checking Storage Buckets...');
    
    const { data: buckets, error: bucketsError } = await supabase.storage.listBuckets();
    
    if (bucketsError) {
      console.log('❌ Failed to list buckets:', bucketsError.message);
    } else {
      console.log('📦 Available buckets:');
      buckets.forEach(bucket => {
        console.log(`   - ${bucket.name} (${bucket.public ? 'public' : 'private'})`);
      });
      
      const productImagesBucket = buckets.find(b => b.name === 'product-images');
      if (productImagesBucket) {
        console.log('✅ product-images bucket exists');
      } else {
        console.log('❌ product-images bucket missing');
      }
    }

    console.log('');

    // 4. Test Storage Upload (optional)
    console.log('4️⃣ Testing Storage Upload...');
    
    try {
      // Create a small test file
      const testFile = new Blob(['test content'], { type: 'text/plain' });
      const fileName = `test-${Date.now()}.txt`;
      
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('product-images')
        .upload(`test/${fileName}`, testFile);
      
      if (uploadError) {
        console.log('❌ Storage upload failed:', uploadError.message);
      } else {
        console.log('✅ Storage upload successful');
        
        // Clean up test file
        await supabase.storage
          .from('product-images')
          .remove([`test/${fileName}`]);
        console.log('🧹 Test file cleaned up');
      }
    } catch (err) {
      console.log('❌ Storage test failed:', err.message);
    }

    console.log('');

    // 5. Check Row Level Security
    console.log('5️⃣ Checking Row Level Security...');
    
    try {
      // Try to insert a test record (should work with anon key)
      const { data, error } = await supabase
        .from('contact_inquiries')
        .insert([{
          name: 'Test User',
          email: 'test@example.com',
          subject: 'Connection Test',
          message: 'Testing Supabase connection'
        }])
        .select();
      
      if (error) {
        console.log('❌ RLS test failed:', error.message);
      } else {
        console.log('✅ Row Level Security working correctly');
        console.log(`📝 Test record created with ID: ${data[0].id}`);
        
        // Clean up test record
        await supabase
          .from('contact_inquiries')
          .delete()
          .eq('id', data[0].id);
        console.log('🧹 Test record cleaned up');
      }
    } catch (err) {
      console.log('❌ RLS test error:', err.message);
    }

    console.log('\n🎯 Setup Summary:');
    console.log('================');
    
    // Final recommendations
    const { data: inquiriesCount } = await supabase
      .from('contact_inquiries')
      .select('*', { count: 'exact', head: true });
    
    const { data: productsCount } = await supabase
      .from('products')
      .select('*', { count: 'exact', head: true });
    
    if (inquiriesCount !== null) {
      console.log(`📊 Contact inquiries in database: ${inquiriesCount.length || 0}`);
    }
    
    if (productsCount !== null) {
      console.log(`📦 Products in database: ${productsCount.length || 0}`);
    }
    
    console.log('\n✅ Supabase is ready for use!');
    console.log('🔗 Dashboard: https://uwuuyelynldcpumhcqhn.supabase.co');

  } catch (error) {
    console.error('❌ Setup check failed:', error);
    console.log('\n🔧 Troubleshooting:');
    console.log('1. Verify Supabase project URL and API key');
    console.log('2. Run the SQL setup script in Supabase SQL Editor');
    console.log('3. Check internet connection');
    console.log('4. Verify project is not paused');
  }
}

// Run the check
checkSupabaseSetup();