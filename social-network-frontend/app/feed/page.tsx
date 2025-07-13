'use client';
import { useEffect, useState } from 'react';
import PostCard from '@/components/feed/PostCard';
import CreatePost from '@/components/feed/CreatePost';
import api from '@/lib/api';
import useStore from '@/store/store';
import { Post } from '@/types';
import { Card, Empty, Skeleton } from 'antd';
import type { AxiosError } from 'axios';

export default function FeedPage() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useStore();

  useEffect(() => {
    const fetchFeed = async () => {
      try {
        const response = await api.get<Post[]>('/feed');
        setPosts(response.data);
      } catch (error) {
        console.error('Failed to fetch feed:', error);
        
        // Vérification de type pour AxiosError
        if (isAxiosError(error)) {
          console.error('Axios error details:', {
            message: error.message,
            config: error.config,
            response: error.response?.data
          });
        }
      } finally {
        setLoading(false);
      }
    };

    fetchFeed();
  }, []);

  // Fonction de vérification de type pour AxiosError
  const isAxiosError = (error: any): error is AxiosError => {
    return error.isAxiosError === true;
  };

  const handlePostCreated = (newPost: Post) => {
    setPosts([newPost, ...posts]);
  };

  const handlePostDeleted = (postId: number) => {
    setPosts(posts.filter(post => post.id !== postId));
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <Skeleton active paragraph={{ rows: 4 }} />
        <Skeleton active paragraph={{ rows: 4 }} />
        <Skeleton active paragraph={{ rows: 4 }} />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {user && <CreatePost onPostCreated={handlePostCreated} />}
      
      <h1 className="text-2xl font-bold text-gray-800">Your Feed</h1>
      
      {posts.length === 0 ? (
        <Card>
          <Empty description="No posts to display. Follow some users to see their posts!" />
        </Card>
      ) : (
        <div className="space-y-4">
          {posts.map(post => (
            <PostCard 
              key={post.id} 
              post={post} 
              onDelete={handlePostDeleted}
              currentUserId={user?.id}
            />
          ))}
        </div>
      )}
    </div>
  );
}