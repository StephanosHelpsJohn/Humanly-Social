import type { Metadata } from 'next';
import { Playfair_Display, Poppins } from 'next/font/google';
import './globals.css';

const playfairDisplay = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-recoleta',
  weight: ['700', '800', '900'],
});

const poppins = Poppins({
  subsets: ['latin'],
  variable: '--font-poppins',
  weight: ['400', '500', '600'],
});

export const metadata: Metadata = {
  title: 'Humanly Social',
  description: 'UGC Analytics & Ops',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${playfairDisplay.variable} ${poppins.variable} font-poppins bg-off-white text-deep-space antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
