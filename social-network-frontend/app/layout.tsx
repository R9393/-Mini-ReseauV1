'use client';
import './globals.css';
import { ConfigProvider } from 'antd';
import theme from '@/theme/themeConfig';
import Header from '@/components/layout/Header';
import  useStore  from '@/store/store';
import { useEffect } from 'react';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const { fetchCurrentUser } = useStore();
  
  useEffect(() => {
    fetchCurrentUser();
  }, [fetchCurrentUser]);

  return (
    <html lang="en">
      <body>
        <ConfigProvider theme={theme}>
          <div className="min-h-screen bg-gray-50">
            <Header />
            <main className="container mx-auto px-4 py-6 max-w-4xl">
              {children}
            </main>
          </div>
        </ConfigProvider>
      </body>
    </html>
  );
}