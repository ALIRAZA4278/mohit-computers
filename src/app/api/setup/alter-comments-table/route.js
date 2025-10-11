import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function POST() {
  try {
    // Simple ALTER TABLE command to change blog_id type
    const { error } = await supabase
      .rpc('exec_sql', {
        sql: 'ALTER TABLE comments ALTER COLUMN blog_id TYPE VARCHAR(255);'
      });

    if (error) {
      console.error('Error altering table:', error);
      return NextResponse.json(
        { error: 'Failed to alter table', details: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json({ 
      success: true, 
      message: 'Comments table blog_id column updated to VARCHAR(255)' 
    });

  } catch (error) {
    console.error('Error in table alteration:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: error.message },
      { status: 500 }
    );
  }
}
