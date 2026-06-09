import type { Metadata } from 'next';
import { Inter, JetBrains_Mono, Playfair_Display } from 'next/font/google';
import './globals.css';
import { cn } from "@/lib/utils";
import { ThemeProvider } from '@/components/theme-provider';
import { TooltipProvider } from '@/components/ui/tooltip';
import AuthWrapper from '@/components/auth-wrapper';
import { AuthProvider } from '@/lib/auth-context';
import { TenantProvider } from '@/lib/tenant-context';

const inter = Inter({ subsets: ['latin'], variable: '--font-sans' });
const jetbrainsMono = JetBrains_Mono({ subsets: ['latin'], variable: '--font-mono' });
const playfair = Playfair_Display({ subsets: ['latin'], variable: '--font-serif' });

export const metadata: Metadata = {
  title: 'Rayn - Enterprise Legal AI Platform',
  description: 'Enterprise-grade multi-tenant legal AI platform with RBAC, real-time audit logging, AWS integration, and agentic AI capabilities.',
};

export default function RootLayout({children}: {children: React.ReactNode}) {
  return (
    <html lang="en" suppressHydrationWarning className={cn("font-sans", inter.variable, jetbrainsMono.variable, playfair.variable, "dark")}>
      <body suppressHydrationWarning className="font-sans antialiased text-[#F0F0F0] bg-[#050505] overflow-hidden selection:bg-emerald-500/30">
        <ThemeProvider defaultTheme="dark" storageKey="rayn-theme">
          <AuthProvider>
            <TenantProvider>
              <TooltipProvider>
                <AuthWrapper>
                  {children}
                </AuthWrapper>
              </TooltipProvider>
            </TenantProvider>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
