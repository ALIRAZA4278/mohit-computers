import { NextResponse } from 'next/server';
import { productsAPI } from '@/lib/supabase-db';

// GET - Get all products (Admin)
export async function GET() {
  try {
    const { data: products, error } = await productsAPI.getAll(100, false);
    
    if (error) {
      return NextResponse.json(
        { success: false, error: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      products: products || []
    });
  } catch (error) {
    console.error('Error fetching products:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch products' },
      { status: 500 }
    );
  }
}

// POST - Create new product (Admin)
export async function POST(request) {
  try {
    const productData = await request.json();
    
    // Validate required fields
    if (!productData.name || !productData.category_id || !productData.price) {
      return NextResponse.json(
        { success: false, error: 'Name, category, and price are required' },
        { status: 400 }
      );
    }

    // Create slug from name
    const slug = productData.name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');

    // Prepare product data for database
    const dbProductData = {
      name: productData.name,
      slug: slug,
      category_id: productData.category_id,
      brand: productData.brand || null,
      price: parseFloat(productData.price),
      images: productData.images || [],
      featured_image: productData.featured_image || null,
      is_featured: productData.is_featured || false,
      is_active: productData.is_active !== false,
      condition: productData.condition || 'Good',
      warranty: productData.warranty || null,
      
      // Laptop specific fields
      processor: productData.processor || null,
      generation: productData.generation || null,
      ram: productData.ram || null,
      hdd: productData.hdd || null,
      display_size: productData.display_size || null,
      resolution: productData.resolution || null,
      integrated_graphics: productData.integrated_graphics || null,
      discrete_graphics: productData.discrete_graphics || null,
      touch_type: productData.touch_type || null,
      operating_features: productData.operating_features || null,
      extra_features: productData.extra_features || null,
      battery: productData.battery || null,
      charger_included: productData.charger_included || false,
      
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    const { data: product, error } = await productsAPI.create(dbProductData);
    
    if (error) {
      return NextResponse.json(
        { success: false, error: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Product created successfully',
      product
    });
  } catch (error) {
    console.error('Error creating product:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create product' },
      { status: 500 }
    );
  }
}
