'use client';
import { useParams } from 'next/navigation';
import ProfileHeader from '@/components/profile/ProfileHeader';
import PostCard from '@/components/feed/PostCard';
import api from '@/lib/api';
import useStore from '@/store/store';
import { Post, UserProfile } from '@/types';
import { Card, Empty, Skeleton } from 'antd';
import { useState, useEffect } from 'react';

export default function ProfilePage() {
  const { username } = useParams();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [isFollowing, setIsFollowing] = useState(false);
  const [isLoadingFollow, setIsLoadingFollow] = useState(false);
  const { user } = useStore();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true);
        const [profileRes, postsRes] = await Promise.all([
          api.get(`/users/${username}`),
          api.get(`/users/${username}/posts`)
        ]);
        
        setProfile(profileRes.data);
        setPosts(postsRes.data);
        setIsFollowing(profileRes.data.isFollowing);
      } catch (error) {
        console.error('Failed to fetch profile:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [username]);

  const handleFollowToggle = async () => {
    if (!user) return;
    
    setIsLoadingFollow(true);
    try {
      if (isFollowing) {
        await api.delete(`/users/${username}/follow`);
      } else {
        await api.post(`/users/${username}/follow`);
      }
      setIsFollowing(!isFollowing);
      
      // Update follower count
      if (profile) {
        setProfile({
          ...profile,
          followersCount: isFollowing 
            ? profile.followersCount - 1 
            : profile.followersCount + 1
        });
      }
    } catch (error) {
      console.error('Failed to toggle follow:', error);
    } finally {
      setIsLoadingFollow(false);
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <Skeleton active avatar paragraph={{ rows: 3 }} />
        <Skeleton active paragraph={{ rows: 4 }} />
      </div>
    );
  }

  if (!profile) {
    return <Card><Empty description="User not found" /></Card>;
  }

  return (
    <div>
      <ProfileHeader 
        profile={profile} 
        isFollowing={isFollowing}
        onFollowToggle={handleFollowToggle}
        isLoadingFollow={isLoadingFollow}
        currentUserId={user?.id}
      />
      
      <div className="mt-8">
        <h2 className="text-xl font-bold mb-4">Posts</h2>
        
        {posts.length === 0 ? (
          <Card>
            <Empty description="No posts yet" />
          </Card>
        ) : (
          <div className="space-y-4">
            {posts.map(post => (
              <PostCard 
                key={post.id} 
                post={post} 
                onDelete={() => setPosts(posts.filter(p => p.id !== post.id))}
                currentUserId={user?.id}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}