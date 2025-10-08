import { NextResponse } from 'next/server'
import { cartAPI } from '@/lib/supabase-db'

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('userId')

    if (!userId) {
      return NextResponse.json(
        { error: 'User ID is required' },
        { status: 400 }
      )
    }

    const { data: cartItems, error } = await cartAPI.getItems(userId)

    if (error) {
      console.error('Error fetching cart:', error)
      return NextResponse.json(
        { error: 'Failed to fetch cart items' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      cartItems: cartItems || [],
      count: cartItems?.length || 0
    })

  } catch (error) {
    console.error('Cart API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function POST(request) {
  try {
    const { userId, productId, quantity = 1 } = await request.json()

    if (!userId || !productId) {
      return NextResponse.json(
        { error: 'User ID and Product ID are required' },
        { status: 400 }
      )
    }

    const { data, error } = await cartAPI.addItem(userId, productId, quantity)

    if (error) {
      console.error('Error adding to cart:', error)
      return NextResponse.json(
        { error: 'Failed to add item to cart' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      message: 'Item added to cart',
      data
    })

  } catch (error) {
    console.error('Add to cart error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function PUT(request) {
  try {
    const { userId, productId, quantity } = await request.json()

    if (!userId || !productId || quantity === undefined) {
      return NextResponse.json(
        { error: 'User ID, Product ID, and quantity are required' },
        { status: 400 }
      )
    }

    const { data, error } = await cartAPI.updateQuantity(userId, productId, quantity)

    if (error) {
      console.error('Error updating cart:', error)
      return NextResponse.json(
        { error: 'Failed to update cart item' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      message: 'Cart updated',
      data
    })

  } catch (error) {
    console.error('Update cart error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function DELETE(request) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('userId')
    const productId = searchParams.get('productId')
    const clearAll = searchParams.get('clearAll')

    if (!userId) {
      return NextResponse.json(
        { error: 'User ID is required' },
        { status: 400 }
      )
    }

    let result
    if (clearAll === 'true') {
      result = await cartAPI.clearCart(userId)
    } else if (!productId) {
      return NextResponse.json(
        { error: 'Product ID is required when not clearing all' },
        { status: 400 }
      )
    } else {
      result = await cartAPI.removeItem(userId, productId)
    }

    const { error } = result

    if (error) {
      console.error('Error removing from cart:', error)
      return NextResponse.json(
        { error: 'Failed to remove item from cart' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      message: clearAll === 'true' ? 'Cart cleared' : 'Item removed from cart'
    })

  } catch (error) {
    console.error('Remove from cart error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}