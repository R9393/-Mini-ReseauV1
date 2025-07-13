'use client';
import { Button, Form, Input } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import useStore from '@/store/store';
import { useRouter } from 'next/navigation';

export default function LoginForm() {
  const [form] = Form.useForm();
  const { login, loading, error } = useStore();
  const router = useRouter();

  const onFinish = async (values: { username: string; password: string }) => {
    await login(values.username, values.password);
    router.push('/feed');
  };

  return (
    <Form
      form={form}
      name="login"
      initialValues={{ remember: true }}
      onFinish={onFinish}
      autoComplete="off"
    >
      {error && <div className="text-red-500 text-sm mb-4">{error}</div>}
      
      <Form.Item
        name="username"
        rules={[{ required: true, message: 'Please input your username!' }]}
      >
        <Input 
          prefix={<UserOutlined />} 
          placeholder="Username" 
          size="large"
        />
      </Form.Item>

      <Form.Item
        name="password"
        rules={[{ required: true, message: 'Please input your password!' }]}
      >
        <Input.Password 
          prefix={<LockOutlined />} 
          placeholder="Password" 
          size="large"
        />
      </Form.Item>

      <Form.Item>
        <Button 
          type="primary" 
          htmlType="submit" 
          loading={loading}
          className="w-full bg-[#ff4500] hover:bg-[#e03e00] border-none"
          size="large"
        >
          Login
        </Button>
      </Form.Item>
      
      <div className="text-center mt-4">
        <p className="text-sm text-gray-600">
          Don't have an account?{' '}
          <a href="/register" className="text-[#ff4500] hover:underline">
            Register
          </a>
        </p>
      </div>
    </Form>
  );
}