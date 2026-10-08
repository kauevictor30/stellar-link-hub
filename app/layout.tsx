import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'stellar-link-hub',
  description: 'Projeto gerado pelo ZenBrief',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR">
      <body className="antialiased">{children}</body>
    </html>
  );
}
