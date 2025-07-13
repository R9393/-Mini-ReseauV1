import Link from 'next/link';
import { Button, Avatar } from 'antd';
import { UserOutlined } from '@ant-design/icons';

interface UserCardProps {
  user: any;
}

export default function UserCard({ user }: UserCardProps) {
  return (
    <div className="bg-white rounded-lg shadow overflow-hidden">
      <div className="p-4">
        <div className="flex items-center">
          <Avatar 
            icon={<UserOutlined />}
            size={48}
            className="bg-gray-300 mr-4"
          />
          <div>
            <Link href={`/profile/${user.username}`} className="font-semibold hover:underline block">
              u/{user.username}
            </Link>
            <p className="text-gray-600 text-sm mt-1 line-clamp-2">{user.bio}</p>
          </div>
        </div>
        
        <div className="mt-4">
          <Link href={`/profile/${user.username}`}>
            <Button className="w-full bg-gray-100 text-gray-800 hover:bg-gray-200">
              View Profile
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}