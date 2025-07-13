'use client';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { Button, Avatar, Input, Dropdown, MenuProps } from 'antd';
import { UserOutlined, LogoutOutlined } from '@ant-design/icons';
import  useStore  from '@/store/store';

const { Search } = Input;

export default function Header() {
  const { user, logout } = useStore();
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = async () => {
    await logout();
    router.push('/login');
  };

  if (pathname.startsWith('/login') || pathname.startsWith('/register')) {
    return null;
  }

  const items: MenuProps['items'] = [
    {
      key: 'profile',
      label: (
        <Link href={`/profile/${user?.username}`}>
          Profile
        </Link>
      ),
    },
    {
      key: 'followers',
      label: (
        <Link href="/followers">
          Followers
        </Link>
      ),
    },
    {
      key: 'following',
      label: (
        <Link href="/following">
          Following
        </Link>
      ),
    },
    {
      type: 'divider',
    },
    {
      key: 'logout',
      label: 'Logout',
      icon: <LogoutOutlined />,
      onClick: handleLogout,
    },
  ];

  return (
    <header className="bg-[#ff4500] text-white p-4 shadow-md">
      <div className="container mx-auto flex justify-between items-center">
        <Link href="/feed" className="text-xl font-bold flex items-center">
          <div className="bg-white text-[#ff4500] rounded-full w-8 h-8 flex items-center justify-center mr-2">
            R
          </div>
          Reddit-like
        </Link>
        
        <div className="flex-1 mx-4">
          <Search 
            placeholder="Search..." 
            onSearch={(value) => console.log(value)}
            enterButton
          />
        </div>
        
        <div>
          {user ? (
            <Dropdown menu={{ items }} trigger={['click']}>
              <div className="flex items-center cursor-pointer">
                <Avatar 
                  icon={<UserOutlined />} 
                  className="mr-2" 
                  style={{ backgroundColor: '#fff', color: '#ff4500' }}
                />
                <span className="text-white">u/{user.username}</span>
              </div>
            </Dropdown>
          ) : (
            <div className="flex space-x-2">
              <Button href="/login" className="bg-white text-[#ff4500] border-none">
                Login
              </Button>
              <Button href="/register" className="bg-white text-[#ff4500] border-none">
                Register
              </Button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}