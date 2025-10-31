import { NextResponse } from 'next/server'
import { productsAPI } from '@/lib/supabase-db'

export async function GET(request) {
  try {
    const result = await productsAPI.getAll(1000, false) // Get all products including inactive
    const { data: products, error } = result

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    // Check stock quantities
    const stockStats = {
      total: products?.length || 0,
      in_stock_field_true: products?.filter(p => p.in_stock === true).length || 0,
      in_stock_field_false: products?.filter(p => p.in_stock === false).length || 0,
      in_stock_field_null: products?.filter(p => p.in_stock === null || p.in_stock === undefined).length || 0,
      stock_qty_positive: products?.filter(p => p.stock_quantity > 0).length || 0,
      stock_qty_zero: products?.filter(p => p.stock_quantity === 0).length || 0,
      stock_qty_null: products?.filter(p => p.stock_quantity === null || p.stock_quantity === undefined).length || 0,
      stock_999: products?.filter(p => p.stock_quantity === 999).length || 0,
      active: products?.filter(p => p.is_active === true).length || 0,
      inactive: products?.filter(p => p.is_active === false).length || 0,
    }

    // Sample products with different stock status
    const samples = {
      in_stock_true: products?.filter(p => p.in_stock === true).slice(0, 2).map(p => ({
        name: p.name,
        in_stock: p.in_stock,
        stock_quantity: p.stock_quantity,
        is_active: p.is_active
      })),
      in_stock_false: products?.filter(p => p.in_stock === false).slice(0, 2).map(p => ({
        name: p.name,
        in_stock: p.in_stock,
        stock_quantity: p.stock_quantity,
        is_active: p.is_active
      })),
      stock_qty_zero: products?.filter(p => p.stock_quantity === 0).slice(0, 2).map(p => ({
        name: p.name,
        in_stock: p.in_stock,
        stock_quantity: p.stock_quantity,
        is_active: p.is_active
      }))
    }

    return NextResponse.json({
      success: true,
      stats: stockStats,
      samples: samples
    })

  } catch (error) {
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    )
  }
}
