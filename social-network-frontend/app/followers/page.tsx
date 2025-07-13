'use client';
import { useState, useEffect } from 'react';
import UserCard from '@/components/profile/UserCard';
import api from '@/lib/api';
import { Card, Skeleton, Empty } from 'antd';

export default function FollowersPage() {
  const [followers, setFollowers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFollowers = async () => {
      try {
        const response = await api.get('/users/followers');
        setFollowers(response.data);
      } catch (error) {
        console.error('Failed to fetch followers:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchFollowers();
  }, []);

  if (loading) {
    return (
      <div className="space-y-4">
        <Skeleton active avatar paragraph={{ rows: 2 }} />
        <Skeleton active avatar paragraph={{ rows: 2 }} />
        <Skeleton active avatar paragraph={{ rows: 2 }} />
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Your Followers</h1>
      
      {followers.length === 0 ? (
        <Card>
          <Empty description="You don't have any followers yet" />
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {followers.map(user => (
            <UserCard key={user.id} user={user} />
          ))}
        </div>
      )}
    </div>
  );
}