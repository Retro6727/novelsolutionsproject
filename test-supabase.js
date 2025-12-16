// Quick test script for Supabase integration
// Run with: node test-supabase.js

import { supabaseDB } from './src/lib/supabase.js';

async function testSupabaseConnection() {
  console.log('🧪 Testing Supabase connection...');
  
  try {
    // Test saving a contact inquiry
    const testInquiry = {
      name: 'Test User',
      email: 'test@example.com',
      phone: '+91-1234567890',
      company: 'Test Company',
      subject: 'Test Subject',
      message: 'This is a test message to verify Supabase integration.',
      status: 'new',
      emailSent: false
    };

    console.log('📝 Saving test inquiry...');
    const savedInquiry = await supabaseDB.saveContactInquiry(testInquiry);
    console.log('✅ Test inquiry saved:', savedInquiry.id);

    console.log('📋 Fetching all inquiries...');
    const inquiries = await supabaseDB.getContactInquiries();
    console.log(`✅ Found ${inquiries.length} inquiries`);

    console.log('🔄 Updating inquiry status...');
    const updatedInquiry = await supabaseDB.updateInquiryStatus(savedInquiry.id, 'replied');
    console.log('✅ Status updated:', updatedInquiry.status);

    console.log('🎉 All tests passed! Supabase integration is working.');
    
  } catch (error) {
    console.error('❌ Test failed:', error);
    console.log('\n🔧 Setup required:');
    console.log('1. Run the SQL script in Supabase SQL Editor');
    console.log('2. Verify environment variables are set');
    console.log('3. Check Supabase project URL and API key');
  }
}

// Run the test
testSupabaseConnection();