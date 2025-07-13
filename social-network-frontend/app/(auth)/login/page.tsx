'use client';
import LoginForm from '@/components/auth/LoginForm';
import { useRouter } from 'next/navigation';
import useStore from '@/store/store';
import { useEffect } from 'react';
import { Card } from 'antd';

export default function LoginPage() {
  const { user } = useStore();
  const router = useRouter();

  useEffect(() => {
    if (user) {
      router.push('/feed');
    }
  }, [user, router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <Card title="Login to Your Account" className="w-full max-w-md">
        <LoginForm />
      </Card>
    </div>
  );
}