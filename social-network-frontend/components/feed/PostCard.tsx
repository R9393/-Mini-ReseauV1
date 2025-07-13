import { useState } from 'react';
import { Card, Button, Avatar, List, Input, Form } from 'antd';
import { formatDistanceToNow } from 'date-fns';
import { ArrowUpOutlined, ArrowDownOutlined, MessageOutlined, DeleteOutlined } from '@ant-design/icons';
import api from '@/lib/api';
import { Post } from '@/types';

const { TextArea } = Input;

interface PostCardProps {
  post: Post;
  currentUserId?: number;
  onDelete: (postId: number) => void;
}

export default function PostCard({ post, currentUserId, onDelete }: PostCardProps) {
  const [showComments, setShowComments] = useState(false);
  const [comments, setComments] = useState<any[]>([]);
  const [newComment, setNewComment] = useState('');
  const [loadingComments, setLoadingComments] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [votes, setVotes] = useState(post.votes || 0);
  const [userVote, setUserVote] = useState<number | null>(null);

  const isAuthor = post.author.id === currentUserId;

  const fetchComments = async () => {
    setLoadingComments(true);
    try {
      const response = await api.get(`/posts/${post.id}/comments`);
      setComments(response.data);
    } catch (error) {
      console.error('Failed to fetch comments:', error);
    } finally {
      setLoadingComments(false);
    }
  };

  const handleToggleComments = () => {
    if (!showComments && comments.length === 0) {
      fetchComments();
    }
    setShowComments(!showComments);
  };

  const handleAddComment = async () => {
    if (!newComment.trim()) return;

    try {
      const response = await api.post(`/posts/${post.id}/comments`, { content: newComment });
      setComments([...comments, response.data]);
      setNewComment('');
    } catch (error) {
      console.error('Failed to add comment:', error);
    }
  };

  const handleDeletePost = async () => {
    setIsDeleting(true);
    try {
      await api.delete(`/posts/${post.id}`);
      onDelete(post.id);
    } catch (error) {
      console.error('Failed to delete post:', error);
    } finally {
      setIsDeleting(false);
    }
  };

  const handleVote = async (value: number) => {
    const newVote = userVote === value ? 0 : value;
    
    try {
      await api.post(`/posts/${post.id}/vote`, { value: newVote });
      
      // Calculate vote change
      let voteChange = 0;
      if (userVote === 1 && newVote === 0) voteChange = -1;
      else if (userVote === -1 && newVote === 0) voteChange = 1;
      else if (userVote === 0 && newVote === 1) voteChange = 1;
      else if (userVote === 0 && newVote === -1) voteChange = -1;
      else if (userVote === 1 && newVote === -1) voteChange = -2;
      else if (userVote === -1 && newVote === 1) voteChange = 2;
      
      setVotes(votes + voteChange);
      setUserVote(newVote);
    } catch (error) {
      console.error('Failed to vote:', error);
    }
  };

  // Vérification que createdAt est défini
  const createdAt = post.createdAt ? new Date(post.createdAt) : new Date();

  return (
    <Card 
      className="mb-4"
      actions={[
        <div className="flex items-center" onClick={handleToggleComments}>
          <MessageOutlined key="comment" />
          <span className="ml-2">{post.commentCount} Comments</span>
        </div>
      ]}
      extra={isAuthor && (
        <Button 
          icon={<DeleteOutlined />} 
          loading={isDeleting}
          onClick={handleDeletePost}
          danger
        />
      )}
    >
      <div className="flex">
        <div className="flex flex-col items-center mr-4">
          <Button 
            icon={<ArrowUpOutlined />} 
            shape="circle"
            type={userVote === 1 ? 'primary' : 'text'}
            className={userVote === 1 ? 'bg-[#ff4500] text-white' : ''}
            onClick={() => handleVote(1)}
          />
          <span className="my-1 font-bold">{votes}</span>
          <Button 
            icon={<ArrowDownOutlined />} 
            shape="circle"
            type={userVote === -1 ? 'primary' : 'text'}
            className={userVote === -1 ? 'bg-blue-500 text-white' : ''}
            onClick={() => handleVote(-1)}
          />
        </div>
        
        <div className="flex-1">
          <div className="flex items-center text-sm text-gray-500 mb-2">
            <span>Posted by </span>
            <a href={`/profile/${post.author.username}`} className="font-medium ml-1 hover:underline">
              u/{post.author.username}
            </a>
            <span className="mx-1">•</span>
            <span>{formatDistanceToNow(createdAt)} ago</span>
          </div>
          
          <h3 className="text-lg font-semibold text-gray-800 mb-2">{post.title}</h3>
          <p className="text-gray-700 mb-3">{post.content}</p>
        </div>
      </div>
      
      {showComments && (
        <div className="mt-4">
          <div className="mb-4">
            <TextArea
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="Add a comment..."
              rows={2}
            />
            <Button 
              type="primary"
              onClick={handleAddComment}
              className="mt-2 bg-[#ff4500] hover:bg-[#e03e00] border-none"
            >
              Comment
            </Button>
          </div>
          
          {loadingComments ? (
            <div>Loading comments...</div>
          ) : (
            <List
              itemLayout="horizontal"
              dataSource={comments}
              renderItem={comment => (
                <div className="flex items-start mb-4">
                  <Avatar 
                    icon={<UserOutlined />}
                    size="small"
                    className="mr-2 mt-1"
                  />
                  <div>
                    <div className="font-medium">u/{comment.author.username}</div>
                    <div>{comment.content}</div>
                    <div className="text-xs text-gray-500">
                      {formatDistanceToNow(new Date(comment.createdAt))} ago
                    </div>
                  </div>
                </div>
              )}
              locale={{ emptyText: 'No comments yet' }}
            />
          )}
        </div>
      )}
    </Card>
  );
}