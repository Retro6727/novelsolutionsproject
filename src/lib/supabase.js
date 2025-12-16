import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn('⚠️ Supabase credentials not configured');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Database helper functions
export const supabaseDB = {
  // Contact Inquiries
  async saveContactInquiry(inquiry) {
    try {
      const { data, error } = await supabase
        .from('contact_inquiries')
        .insert([{
          name: inquiry.name,
          email: inquiry.email,
          phone: inquiry.phone,
          company: inquiry.company,
          subject: inquiry.subject,
          message: inquiry.message,
          status: inquiry.status || 'new',
          email_sent: inquiry.emailSent || false,
          created_at: new Date().toISOString()
        }])
        .select();

      if (error) throw error;
      console.log('✅ Inquiry saved to Supabase:', data[0]?.id);
      return data[0];
    } catch (error) {
      console.error('❌ Supabase save failed:', error);
      throw error;
    }
  },

  async getContactInquiries() {
    try {
      const { data, error } = await supabase
        .from('contact_inquiries')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('❌ Supabase fetch failed:', error);
      throw error;
    }
  },

  async updateInquiryStatus(id, status) {
    try {
      const { data, error } = await supabase
        .from('contact_inquiries')
        .update({ 
          status, 
          updated_at: new Date().toISOString() 
        })
        .eq('id', id)
        .select();

      if (error) throw error;
      return data[0];
    } catch (error) {
      console.error('❌ Supabase update failed:', error);
      throw error;
    }
  },

  // Products (future use)
  async saveProduct(product) {
    try {
      const { data, error } = await supabase
        .from('products')
        .insert([product])
        .select();

      if (error) throw error;
      return data[0];
    } catch (error) {
      console.error('❌ Supabase product save failed:', error);
      throw error;
    }
  },

  async getProducts() {
    try {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('❌ Supabase products fetch failed:', error);
      throw error;
    }
  }
};

// Storage helper functions
export const supabaseStorage = {
  async uploadProductImage(file, productId) {
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${productId}-${Date.now()}.${fileExt}`;
      const filePath = `products/${fileName}`;

      const { data, error } = await supabase.storage
        .from('product-images')
        .upload(filePath, file);

      if (error) throw error;

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('product-images')
        .getPublicUrl(filePath);

      return { path: filePath, url: publicUrl };
    } catch (error) {
      console.error('❌ Supabase upload failed:', error);
      throw error;
    }
  },

  async deleteProductImage(path) {
    try {
      const { error } = await supabase.storage
        .from('product-images')
        .remove([path]);

      if (error) throw error;
      return true;
    } catch (error) {
      console.error('❌ Supabase delete failed:', error);
      throw error;
    }
  }
};

export default supabase;