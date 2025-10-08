import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import MaybeShell from '../components/MaybeShell';
import { AuthProvider } from '../context/AuthContext';
import { CartProvider } from '../context/CartContext';
import { WishlistProvider } from '../context/WishlistContext';
import { CompareProvider } from '../context/CompareContext';

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "mohit computers - Quality Used Laptops & Accessories",
  description: "Your trusted partner for high-quality used laptops, Chromebooks, and computer accessories. We provide reliable technology solutions at affordable prices.",
  keywords: "used laptops, refurbished laptops, Chromebook, computer accessories, RAM, SSD, HP, Dell, Lenovo",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <AuthProvider>
          <CartProvider>
            <WishlistProvider>
              <CompareProvider>
                <MaybeShell>
                  {children}
                </MaybeShell>
              </CompareProvider>
            </WishlistProvider>
          </CartProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
