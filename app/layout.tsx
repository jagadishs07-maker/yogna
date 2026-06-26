import type { Metadata } from 'next';
import './globals.css';
import { CartProvider } from '@/context/CartContext';
import CustomCursor from '@/components/CustomCursor';
import Navbar from '@/components/Navbar';
import CartDrawer from '@/components/CartDrawer';
import CartToast from '@/components/CartToast';

export const metadata: Metadata = {
  title: 'YOGNA — Corporate Hygiene Solutions',
  description: 'India\'s premier automated eco-friendly washroom hygiene systems. Touchless dispensers, bio-sanitizers, and feminine hygiene systems for commercial establishments.',
  keywords: ['corporate hygiene', 'washroom', 'touchless dispenser', 'bio-sanitizer', 'feminine hygiene', 'YOGNA'],
  openGraph: {
    title: 'YOGNA — Corporate Hygiene Solutions',
    description: 'Automated, eco-friendly washroom hygiene systems for commercial establishments.',
    type: 'website',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Inter:wght@300;400;500;600;700;900&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        <CartProvider>
          <CustomCursor />
          <Navbar />
          <CartDrawer />
          <CartToast />
          {children}
        </CartProvider>
      </body>
    </html>
  );
}
