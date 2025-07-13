import { Button, Avatar } from 'antd';
import { UserOutlined } from '@ant-design/icons';
import { UserProfile } from '@/types';

interface ProfileHeaderProps {
  profile: UserProfile;
  isFollowing: boolean;
  onFollowToggle: () => void;
  isLoadingFollow: boolean;
  currentUserId?: number;
}

export default function ProfileHeader({ 
  profile, 
  isFollowing, 
  onFollowToggle, 
  isLoadingFollow,
  currentUserId
}: ProfileHeaderProps) {
  const isCurrentUser = profile.id === currentUserId;

  return (
    <div className="bg-white rounded-lg shadow overflow-hidden">
      <div className="bg-gray-200 h-32"></div>
      
      <div className="p-6">
        <div className="flex items-start">
          <Avatar 
            icon={<UserOutlined />}
            size={80}
            className="bg-gray-300 -mt-12 border-4 border-white"
          />
          
          <div className="ml-6 flex-1">
            <div className="flex justify-between items-start">
              <div>
                <h1 className="text-2xl font-bold">u/{profile.username}</h1>
                <p className="text-gray-600 mt-1">{profile.bio}</p>
              </div>
              
              {!isCurrentUser && currentUserId && (
                <Button 
                  onClick={onFollowToggle}
                  loading={isLoadingFollow}
                  className={isFollowing 
                    ? 'bg-gray-200 text-gray-800 hover:bg-gray-300' 
                    : 'bg-[#ff4500] hover:bg-[#e03e00] text-white border-none'
                  }
                >
                  {isLoadingFollow 
                    ? 'Loading...' 
                    : isFollowing 
                      ? 'Unfollow' 
                      : 'Follow'
                  }
                </Button>
              )}
            </div>
            
            <div className="flex mt-6 space-x-8">
              <div className="text-center">
                <div className="text-2xl font-bold">{profile.postsCount}</div>
                <div className="text-gray-600">Posts</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold">{profile.followersCount}</div>
                <div className="text-gray-600">Followers</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold">{profile.followingCount}</div>
                <div className="text-gray-600">Following</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}