'use client';
import { useState } from 'react';
import { Button, Input } from 'antd';
import api from '@/lib/api';
import { Post } from '@/types';

const { TextArea } = Input;

interface CreatePostProps {
  onPostCreated: (post: Post) => void;
}

export default function CreatePost({ onPostCreated }: CreatePostProps) {
  const [content, setContent] = useState('');
  const [title, setTitle] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async () => {
    if (!title.trim() || !content.trim()) {
      setError('Title and content are required');
      return;
    }
    
    setIsSubmitting(true);
    setError('');
    
    try {
      const response = await api.post('/posts', { title, content });
      onPostCreated(response.data);
      setTitle('');
      setContent('');
    } catch (error: any) {
      setError(error.response?.data?.error || 'Failed to create post');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow p-4 mb-6">
      <h2 className="text-lg font-semibold mb-3">Create a Post</h2>
      {error && <div className="text-red-500 text-sm mb-3">{error}</div>}
      
      <Input
        placeholder="Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        className="mb-3"
      />
      
      <TextArea
        placeholder="What's on your mind?"
        value={content}
        onChange={(e) => setContent(e.target.value)}
        rows={3}
        className="mb-3"
      />
      
      <Button 
        type="primary"
        onClick={handleSubmit}
        loading={isSubmitting}
        className="bg-[#ff4500] hover:bg-[#e03e00] border-none"
      >
        Post
      </Button>
    </div>
  );
}