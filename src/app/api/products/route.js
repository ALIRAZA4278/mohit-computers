import { NextResponse } from 'next/server'
import { productsAPI } from '@/lib/supabase-db'

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url)
    const category = searchParams.get('category')
    const search = searchParams.get('search')
    const featured = searchParams.get('featured')
    const limit = parseInt(searchParams.get('limit')) || 50

    let result

    if (search) {
      result = await productsAPI.search(search)
    } else if (category) {
      result = await productsAPI.getByCategory(category)
    } else if (featured) {
      result = await productsAPI.getFeatured()
    } else {
      result = await productsAPI.getAll(limit)
    }

    const { data: products, error } = result

    if (error) {
      console.error('Error fetching products:', error)
      return NextResponse.json(
        { error: 'Failed to fetch products' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      products: products || [],
      count: products?.length || 0
    })

  } catch (error) {
    console.error('Products API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function POST(request) {
  try {
    const productData = await request.json()

    // Generate slug if not provided
    if (!productData.slug) {
      productData.slug = productData.name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)+/g, '')
    }

    const { data: product, error } = await productsAPI.create(productData)

    if (error) {
      console.error('Error creating product:', error)
      return NextResponse.json(
        { error: 'Failed to create product' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      product
    }, { status: 201 })

  } catch (error) {
    console.error('Create product error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}