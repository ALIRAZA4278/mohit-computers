/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '*.supabase.co',
        port: '',
        pathname: '/storage/v1/object/public/**',
      },
      {
        protocol: 'https',
        hostname: 'supabase.com',
        port: '',
        pathname: '/**',
      },
      // Add your specific Supabase project domain when you get it
      // Example: {
      //   protocol: 'https',
      //   hostname: 'xyzcompany.supabase.co',
      //   port: '',
      //   pathname: '/storage/v1/object/public/**',
      // }
    ],
  },
};

export default nextConfig;
