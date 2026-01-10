// Helper function for interacting with localStorage safely
function getLocalStorageItem(key) {
  if (typeof window === 'undefined') return null;
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : null;
  } catch (error) {
    console.error('Error getting from localStorage:', error);
    return null;
  }
}

function setLocalStorageItem(key, value) {
  if (typeof window === 'undefined') return;
  try {
    const jsonString = JSON.stringify(value);
    
    // Check if the data is too large (localStorage limit is usually 5-10MB)
    if (jsonString.length > 4 * 1024 * 1024) { // 4MB limit to be safe
      console.warn('Data too large for localStorage, attempting to optimize...');
      throw new Error('Data too large');
    }
    
    localStorage.setItem(key, jsonString);
  } catch (error) {
    if (error.name === 'QuotaExceededError' || error.message.includes('quota') || error.message === 'Data too large') {
      console.error('localStorage quota exceeded. Attempting to clean up and retry...');
      
      // Try to clean up old data and retry
      try {
        // Clear old cart data if it exists
        localStorage.removeItem(key);
        
        // If it's cart data, try to save a minimal version
        if (key === 'novelsols_cart' && Array.isArray(value)) {
          const minimalCart = value.map(item => ({
            id: item.id,
            name: item.name,
            price: item.price,
            quantity: item.quantity,
            sku: item.sku || '',
            category: item.category || '',
            // Don't store large image data - we'll fetch it when needed
            image: getOptimizedImageReference(item.image)
          }));
          
          localStorage.setItem(key, JSON.stringify(minimalCart));
          console.log('✅ Cart saved with optimized data structure');
          return;
        }
        
        localStorage.setItem(key, JSON.stringify(value));
      } catch (retryError) {
        console.error('Failed to save to localStorage even after cleanup:', retryError);
        // Show user-friendly error
        if (typeof window !== 'undefined') {
          alert('Cart storage is full. Please clear your browser data or try again.');
        }
      }
    } else {
      console.error('Error setting to localStorage:', error);
    }
  }
}

// Optimize image reference for storage
function getOptimizedImageReference(image) {
  if (!image) return '';
  
  // If it's a large base64 string, don't store it
  if (typeof image === 'string' && image.startsWith('data:') && image.length > 1000) {
    return ''; // We'll fetch the image from the product API when needed
  }
  
  // If it's a URL, store it
  if (typeof image === 'string' && image.startsWith('http')) {
    return image;
  }
  
  // If it's an emoji or small string, store it
  if (typeof image === 'string' && image.length < 100) {
    return image;
  }
  
  // For other cases, don't store large data
  return '';
}

// Get the cart from localStorage
export function getCart() {
  const cart = getLocalStorageItem('novelsols_cart');
  return cart ? cart : [];
}

// Set the cart to localStorage
export function setCart(cart) {
  setLocalStorageItem('novelsols_cart', cart);
}

// Track the last visited product page
export function setLastProductPage(productId) {
  if (typeof window === 'undefined') return;
  setLocalStorageItem('novelsols_last_product', productId);
}

// Get the last visited product page
export function getLastProductPage() {
  return getLocalStorageItem('novelsols_last_product');
}

// Fetch product image for cart display (since we don't store large images)
export async function getProductImage(productId) {
  try {
    const response = await fetch('/api/product');
    if (!response.ok) return null;
    
    const products = await response.json();
    const product = products.find(p => Number(p.id) === Number(productId));
    
    return product?.image || null;
  } catch (error) {
    console.error('Error fetching product image:', error);
    return null;
  }
}

// Enhanced cart getter that can optionally fetch missing images
export async function getCartWithImages() {
  const cart = getCart();
  
  // If cart is empty, return it as is
  if (!cart || cart.length === 0) return cart;
  
  // Check if any items are missing images
  const itemsNeedingImages = cart.filter(item => !item.image);
  
  if (itemsNeedingImages.length === 0) return cart;
  
  // Fetch product data for items missing images
  try {
    const response = await fetch('/api/product');
    if (!response.ok) return cart;
    
    const products = await response.json();
    
    // Update cart items with images
    const updatedCart = cart.map(item => {
      if (!item.image) {
        const product = products.find(p => Number(p.id) === Number(item.id));
        if (product?.image) {
          return { ...item, image: getOptimizedImageReference(product.image) };
        }
      }
      return item;
    });
    
    return updatedCart;
  } catch (error) {
    console.error('Error fetching images for cart:', error);
    return cart;
  }
}

// Add an item to the cart
export function addToCart(product, quantity = 1) {
  if (typeof window === 'undefined') return [];
  
  // Track the product page this item was added from
  setLastProductPage(product.id);
  
  // Fetch existing cart
  const cart = getCart();
  
  // Find the product in the cart
  const existingProduct = cart.find(item => Number(item.id) === Number(product.id));
  
  // Update quantity or add new item to the cart
  if (existingProduct) {
    existingProduct.quantity += Number(quantity);
  } else {
    // Create optimized cart item (don't store large image data)
    const cartItem = {
      id: product.id,
      name: product.name,
      price: product.price,
      sku: product.sku || product.code || '',
      category: product.category || '',
      subcategory: product.subcategory || '',
      quantity: Number(quantity),
      // Optimize image storage
      image: getOptimizedImageReference(product.image)
    };
    
    cart.push(cartItem);
  }
  
  // Save the updated cart to localStorage with error handling
  try {
    setCart(cart);
    console.log('✅ Cart updated successfully');
  } catch (error) {
    console.error('❌ Failed to save cart:', error);
    // Still dispatch the event so UI updates, even if storage failed
  }
  
  // Dispatch custom event to notify other parts of the app
  try {
    window.dispatchEvent(new CustomEvent('novelsols_cart_changed', { detail: { cart } }));
  } catch (e) {
    console.error('Error dispatching cart changed event:', e);
  }

  return cart;
}

// Remove a product from the cart
export function removeFromCart(productId) {
  if (typeof window === 'undefined') return [];

  // Fetch the cart
  const cart = getCart();
  
  // Filter out the product to be removed
  const updatedCart = cart.filter(item => item.id !== productId);
  
  // Save the updated cart to localStorage
  setCart(updatedCart);
  
  // Dispatch custom event
  try {
    window.dispatchEvent(new CustomEvent('novelsols_cart_changed', { detail: { cart: updatedCart } }));
  } catch (e) {
    console.error('Error dispatching cart changed event:', e);
  }

  return updatedCart;
}

// Update the quantity of a product in the cart
export function updateQuantity(productId, newQuantity) {
  if (typeof window === 'undefined') return [];
  
  // Ensure valid quantity
  if (newQuantity <= 0) return removeFromCart(productId);
  
  // Fetch the cart
  const cart = getCart();
  
  // Find the product
  const product = cart.find(item => item.id === productId);
  
  // If product exists, update its quantity
  if (product) {
    product.quantity = newQuantity;
  }
  
  // Save the updated cart to localStorage
  setCart(cart);
  
  // Dispatch custom event
  try {
    window.dispatchEvent(new CustomEvent('novelsols_cart_changed', { detail: { cart } }));
  } catch (e) {
    console.error('Error dispatching cart changed event:', e);
  }

  return cart;
}

// Clear cart data (useful for cleanup)
export function clearCart() {
  if (typeof window === 'undefined') return;
  
  try {
    localStorage.removeItem('novelsols_cart');
    
    // Dispatch event to notify UI
    window.dispatchEvent(new CustomEvent('novelsols_cart_changed', { detail: { cart: [] } }));
    
    console.log('✅ Cart cleared successfully');
  } catch (error) {
    console.error('Error clearing cart:', error);
  }
}

// Get cart size in bytes (for debugging)
export function getCartSize() {
  if (typeof window === 'undefined') return 0;
  
  try {
    const cart = getCart();
    const size = JSON.stringify(cart).length;
    console.log(`Cart size: ${size} bytes (${(size / 1024).toFixed(2)} KB)`);
    return size;
  } catch (error) {
    console.error('Error calculating cart size:', error);
    return 0;
  }
}