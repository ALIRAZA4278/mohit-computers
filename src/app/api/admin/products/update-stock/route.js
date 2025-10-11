import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase-db';

// POST - Update existing products with default stock values
export async function POST() {
  try {
    console.log('Starting stock update for existing products...');

    // First, get all products that need stock updates
    const { data: products, error: fetchError } = await supabase
      .from('products')
      .select('id, name, stock_quantity, in_stock, is_active')
      .or('stock_quantity.is.null,in_stock.is.null,stock_quantity.eq.0');

    if (fetchError) {
      console.error('Error fetching products:', fetchError);
      return NextResponse.json({
        success: false,
        error: fetchError.message
      }, { status: 500 });
    }

    console.log(`Found ${products?.length || 0} products that need stock updates`);

    if (!products || products.length === 0) {
      return NextResponse.json({
        success: true,
        message: 'No products need stock updates',
        updated: 0
      });
    }

    // Update products with default stock values
    const updates = products.map(product => ({
      id: product.id,
      stock_quantity: product.stock_quantity || 999, // Default to 999 if null or 0
      in_stock: product.in_stock !== null ? product.in_stock : true, // Default to true if null
    }));

    // Perform bulk update
    const { data: updatedProducts, error: updateError } = await supabase
      .from('products')
      .upsert(updates, { onConflict: 'id' })
      .select('id, name, stock_quantity, in_stock');

    if (updateError) {
      console.error('Error updating products:', updateError);
      return NextResponse.json({
        success: false,
        error: updateError.message
      }, { status: 500 });
    }

    // Get final counts
    const { data: stats, error: statsError } = await supabase
      .from('products')
      .select('stock_quantity, in_stock, is_active');

    let totalProducts = 0;
    let availableProducts = 0;
    let lowStockProducts = 0;
    let outOfStockProducts = 0;

    if (stats && !statsError) {
      totalProducts = stats.length;
      stats.forEach(product => {
        const isAvailable = product.is_active && product.in_stock && product.stock_quantity > 0;
        if (isAvailable) {
          availableProducts++;
          if (product.stock_quantity <= 5) {
            lowStockProducts++;
          }
        } else {
          outOfStockProducts++;
        }
      });
    }

    console.log('Stock update completed successfully');

    return NextResponse.json({
      success: true,
      message: 'Products stock updated successfully',
      updated: updatedProducts?.length || 0,
      stats: {
        totalProducts,
        availableProducts,
        lowStockProducts,
        outOfStockProducts
      }
    });

  } catch (error) {
    console.error('Stock update error:', error);
    return NextResponse.json({
      success: false,
      error: error.message
    }, { status: 500 });
  }
}

// GET - Check current stock status
export async function GET() {
  try {
    const { data: stats, error } = await supabase
      .from('products')
      .select('stock_quantity, in_stock, is_active, name');

    if (error) {
      return NextResponse.json({
        success: false,
        error: error.message
      }, { status: 500 });
    }

    let totalProducts = 0;
    let availableProducts = 0;
    let lowStockProducts = 0;
    let outOfStockProducts = 0;
    let needsUpdate = 0;

    const sampleProducts = [];

    if (stats) {
      totalProducts = stats.length;
      stats.forEach(product => {
        // Check if product needs stock update
        if (product.stock_quantity === null || product.stock_quantity === 0 || product.in_stock === null) {
          needsUpdate++;
        }

        const isAvailable = product.is_active && product.in_stock && product.stock_quantity > 0;
        if (isAvailable) {
          availableProducts++;
          if (product.stock_quantity <= 5) {
            lowStockProducts++;
          }
        } else {
          outOfStockProducts++;
        }

        // Add first 5 products as samples
        if (sampleProducts.length < 5) {
          sampleProducts.push({
            name: product.name,
            stock_quantity: product.stock_quantity,
            in_stock: product.in_stock,
            is_active: product.is_active
          });
        }
      });
    }

    return NextResponse.json({
      success: true,
      stats: {
        totalProducts,
        availableProducts,
        lowStockProducts,
        outOfStockProducts,
        needsUpdate
      },
      sampleProducts,
      message: needsUpdate > 0 ? `${needsUpdate} products need stock updates` : 'All products have stock values'
    });

  } catch (error) {
    console.error('Stock check error:', error);
    return NextResponse.json({
      success: false,
      error: error.message
    }, { status: 500 });
  }
}
