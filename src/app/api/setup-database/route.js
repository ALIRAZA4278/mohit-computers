import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

export async function GET(request) {
  try {
    // Create users table
    const { data, error } = await supabase.rpc('exec_sql', {
      sql: `
        -- Create users table
        CREATE TABLE IF NOT EXISTS users (
          id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
          email VARCHAR(255) UNIQUE NOT NULL,
          password VARCHAR(255) NOT NULL,
          name VARCHAR(255),
          wishlist JSONB DEFAULT '[]'::jsonb,
          orders JSONB DEFAULT '[]'::jsonb,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
          updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
        );

        -- Create index on email
        CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);

        -- Create update function
        CREATE OR REPLACE FUNCTION update_updated_at_column()
        RETURNS TRIGGER AS $$
        BEGIN
          NEW.updated_at = NOW();
          RETURN NEW;
        END;
        $$ LANGUAGE plpgsql;

        -- Create trigger
        DROP TRIGGER IF EXISTS update_users_updated_at ON users;
        CREATE TRIGGER update_users_updated_at
          BEFORE UPDATE ON users
          FOR EACH ROW
          EXECUTE FUNCTION update_updated_at_column();
      `
    });

    if (error) {
      return NextResponse.json(
        {
          success: false,
          error: error.message,
          hint: 'Please run the SQL manually in Supabase SQL Editor'
        },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Users table created successfully!',
      data
    });

  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: error.message,
        instruction: 'Please create the table manually in Supabase Dashboard → SQL Editor. Copy the SQL from create-users-table-now.sql file.'
      },
      { status: 500 }
    );
  }
}
