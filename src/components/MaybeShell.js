"use client";

import React from 'react';
import { usePathname } from 'next/navigation';
import Navbar from './Navbar';
import Footer from './Footer';

export default function MaybeShell({ children }) {
  const pathname = usePathname() || '';

  // If we're on an admin route, render children only (no navbar/footer)
  if (pathname.startsWith('/admin')) {
    return <div className="min-h-screen">{children}</div>;
  }

  // Otherwise render the normal site shell
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  );
}
