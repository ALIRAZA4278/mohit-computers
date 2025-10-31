import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase-db'

export async function POST(request) {
  try {
    // Update first 5 products to have stock_quantity = 0 for testing
    const { data: products } = await supabase
      .from('products')
      .select('id, name')
      .limit(5)

    if (!products || products.length === 0) {
      return NextResponse.json({ error: 'No products found' }, { status: 404 })
    }

    // Update these products to stock_quantity = 0
    const updates = []
    for (const product of products) {
      const { error } = await supabase
        .from('products')
        .update({ stock_quantity: 0 })
        .eq('id', product.id)

      if (error) {
        updates.push({ name: product.name, success: false, error: error.message })
      } else {
        updates.push({ name: product.name, success: true })
      }
    }

    return NextResponse.json({
      success: true,
      message: 'Updated 5 products to stock_quantity = 0 for testing',
      updates: updates
    })

  } catch (error) {
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    )
  }
}

export async function DELETE(request) {
  try {
    // Reset all products back to stock_quantity = 999
    const { data, error } = await supabase
      .from('products')
      .update({ stock_quantity: 999 })
      .eq('stock_quantity', 0)
      .select()

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({
      success: true,
      message: 'Reset all out-of-stock products back to 999',
      count: data?.length || 0
    })

  } catch (error) {
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    )
  }
}
