import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase-db';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('q');

    if (!query || query.length < 2) {
      return NextResponse.json({ suggestions: [] });
    }

    // Search in products table for suggestions
    const { data: products, error } = await supabase
      .from('products')
      .select('id, name, category_id, brand, slug')
      .or(`name.ilike.%${query}%, brand.ilike.%${query}%, processor.ilike.%${query}%`)
      .eq('is_active', true)
      .limit(10)
      .order('name');

    if (error) {
      console.error('Error fetching search suggestions:', error);
      return NextResponse.json({ suggestions: [] });
    }

    // Format suggestions with categories
    const suggestions = products.map(product => ({
      id: product.id,
      name: product.name,
      brand: product.brand,
      category: product.category_id,
      slug: product.slug,
      type: 'product'
    }));

    // Also search for categories
    const { data: categories, error: categoryError } = await supabase
      .from('categories')
      .select('id, name, slug')
      .ilike('name', `%${query}%`)
      .eq('is_active', true)
      .limit(3);

    if (!categoryError && categories) {
      const categorySuggestions = categories.map(category => ({
        id: category.id,
        name: category.name,
        slug: category.slug,
        type: 'category'
      }));
      suggestions.push(...categorySuggestions);
    }

    // Add popular search terms if query is short
    if (query.length <= 3) {
      const popularTerms = [
        { name: 'HP Laptops', type: 'popular' },
        { name: 'Dell Laptops', type: 'popular' },
        { name: 'SSD Storage', type: 'popular' },
        { name: 'RAM Memory', type: 'popular' },
        { name: 'Chromebook', type: 'popular' }
      ].filter(term => 
        term.name.toLowerCase().includes(query.toLowerCase())
      );
      
      suggestions.push(...popularTerms);
    }

    return NextResponse.json({ suggestions: suggestions.slice(0, 10) });

  } catch (error) {
    console.error('Search suggestions error:', error);
    return NextResponse.json({ suggestions: [] });
  }
}
