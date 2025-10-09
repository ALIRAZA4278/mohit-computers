import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Authentication API
export const authAPI = {
  // Sign up new user
  async signUp(email, password, userData = {}) {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: userData
      }
    })
    return { data, error }
  },

  // Sign in user
  async signIn(email, password) {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    })
    return { data, error }
  },

  // Sign out user
  async signOut() {
    const { error } = await supabase.auth.signOut()
    return { error }
  },

  // Get current user
  async getCurrentUser() {
    const { data: { user }, error } = await supabase.auth.getUser()
    return { user, error }
  },

  // Update user profile
  async updateProfile(userId, profileData) {
    const { data, error } = await supabase
      .from('user_profiles')
      .upsert({ id: userId, ...profileData })
      .select()
      .single()
    return { data, error }
  },

  // Get user profile
  async getProfile(userId) {
    const { data, error } = await supabase
      .from('user_profiles')
      .select('*')
      .eq('id', userId)
      .single()
    return { data, error }
  }
}

// Products API
export const productsAPI = {
  // Get all products
  async getAll(limit = 5000, activeOnly = true) {
    let query = supabase
      .from('products')
      .select('*')
      .limit(limit)
      .order('created_at', { ascending: false });
    
    if (activeOnly) {
      query = query.eq('is_active', true);
    }
    
    const { data, error } = await query;
    return { data, error }
  },

  // Get product by slug
  async getBySlug(slug) {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('slug', slug)
      .eq('is_active', true)
      .single()
    return { data, error }
  },

  // Get product by ID (Admin)
  async getById(id) {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('id', id)
      .single()
    return { data, error }
  },

  // Get products by category
  async getByCategory(category) {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('category', category)
      .eq('is_active', true)
      .order('created_at', { ascending: false })
    return { data, error }
  },

  // Search products
  async search(query) {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .or(`name.ilike.%${query}%, description.ilike.%${query}%`)
      .eq('is_active', true)
      .limit(20)
    return { data, error }
  },

  // Get featured products
  async getFeatured() {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('is_featured', true)
      .eq('is_active', true)
      .limit(8)
    return { data, error }
  },

  // Create product (Admin)
  async create(productData) {
    const { data, error } = await supabase
      .from('products')
      .insert([productData])
      .select()
      .single()
    return { data, error }
  },

  // Update product (Admin)
  async update(id, productData) {
    const { data, error } = await supabase
      .from('products')
      .update(productData)
      .eq('id', id)
      .select()
      .single()
    return { data, error }
  },

  // Delete product (Admin)
  async delete(id) {
    const { error } = await supabase
      .from('products')
      .delete()
      .eq('id', id)
    return { error }
  }
}

// Categories API
export const categoriesAPI = {
  // Get all categories
  async getAll() {
    const { data, error } = await supabase
      .from('categories')
      .select('*')
      .eq('is_active', true)
      .order('name')
    return { data, error }
  },

  // Get category by slug
  async getBySlug(slug) {
    const { data, error } = await supabase
      .from('categories')
      .select('*')
      .eq('slug', slug)
      .single()
    return { data, error }
  },

  // Create category (Admin)
  async create(categoryData) {
    const { data, error } = await supabase
      .from('categories')
      .insert([categoryData])
      .select()
      .single()
    return { data, error }
  }
}

// Orders API
export const ordersAPI = {
  // Create new order
  async create(orderData) {
    const { data, error } = await supabase
      .from('orders')
      .insert([orderData])
      .select()
      .single()
    return { data, error }
  },

  // Get user orders
  async getUserOrders(userId) {
    const { data, error } = await supabase
      .from('orders')
      .select(`
        *,
        order_items(
          *,
          products(name, images, slug)
        )
      `)
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
    return { data, error }
  },

  // Get order by ID
  async getById(orderId) {
    const { data, error } = await supabase
      .from('orders')
      .select(`
        *,
        order_items(
          *,
          products(*)
        ),
        user_profiles(full_name, phone)
      `)
      .eq('id', orderId)
      .single()
    return { data, error }
  },

  // Update order status
  async updateStatus(orderId, status) {
    const { data, error } = await supabase
      .from('orders')
      .update({ status, updated_at: new Date() })
      .eq('id', orderId)
      .select()
      .single()
    return { data, error }
  },

  // Get all orders (Admin)
  async getAll(limit = 100) {
    const { data, error } = await supabase
      .from('orders')
      .select(`
        *,
        user_profiles(full_name, phone),
        order_items(quantity, unit_price, products(name))
      `)
      .order('created_at', { ascending: false })
      .limit(limit)
    return { data, error }
  }
}

// Cart API
export const cartAPI = {
  // Get cart items
  async getItems(userId) {
    const { data, error } = await supabase
      .from('cart_items')
      .select(`
        *,
        products(*)
      `)
      .eq('user_id', userId)
    return { data, error }
  },

  // Add item to cart
  async addItem(userId, productId, quantity = 1) {
    const { data, error } = await supabase
      .from('cart_items')
      .upsert({ 
        user_id: userId, 
        product_id: productId, 
        quantity 
      })
      .select()
    return { data, error }
  },

  // Update item quantity
  async updateQuantity(userId, productId, quantity) {
    const { data, error } = await supabase
      .from('cart_items')
      .update({ quantity })
      .eq('user_id', userId)
      .eq('product_id', productId)
      .select()
    return { data, error }
  },

  // Remove item from cart
  async removeItem(userId, productId) {
    const { error } = await supabase
      .from('cart_items')
      .delete()
      .eq('user_id', userId)
      .eq('product_id', productId)
    return { error }
  },

  // Clear cart
  async clearCart(userId) {
    const { error } = await supabase
      .from('cart_items')
      .delete()
      .eq('user_id', userId)
    return { error }
  }
}

// Blogs API
export const blogsAPI = {
  // Get all published blogs
  async getAll(limit = 50) {
    const { data, error } = await supabase
      .from('blogs')
      .select('*')
      .eq('status', 'published')
      .order('created_at', { ascending: false })
      .limit(limit)
    return { data, error }
  },

  // Get blog by slug
  async getBySlug(slug) {
    const { data, error } = await supabase
      .from('blogs')
      .select('*')
      .eq('slug', slug)
      .eq('status', 'published')
      .single()
    return { data, error }
  },

  // Get featured blogs
  async getFeatured() {
    const { data, error } = await supabase
      .from('blogs')
      .select('*')
      .eq('status', 'published')
      .order('views', { ascending: false })
      .limit(5)
    return { data, error }
  },

  // Create blog (Admin)
  async create(blogData) {
    const { data, error } = await supabase
      .from('blogs')
      .insert([blogData])
      .select()
      .single()
    return { data, error }
  },

  // Update blog (Admin)
  async update(id, blogData) {
    const { data, error } = await supabase
      .from('blogs')
      .update(blogData)
      .eq('id', id)
      .select()
      .single()
    return { data, error }
  },

  // Delete blog (Admin)
  async delete(id) {
    const { error } = await supabase
      .from('blogs')
      .delete()
      .eq('id', id)
    return { error }
  },

  // Increment views
  async incrementViews(id) {
    const { error } = await supabase.rpc('increment_blog_views', { blog_id: id })
    return { error }
  }
}

export default supabase