export interface User {
  id: number;
  username: string;
  bio?: string;
  createdAt?: string;
}

export interface UserProfile {
  id: number;
  username: string;
  bio?: string;
  createdAt: string;
  postsCount: number;
  followersCount: number;
  followingCount: number;
  isFollowing: boolean;
}

export interface Post {
  id: number;
  title: string;
  content: string;
  createdAt: string;
  votes: number;
  commentCount: number;
  author: {
    id: number;
    username: string;
  };
}

export interface Comment {
  id: number;
  content: string;
  createdAt: string;
  author: {
    id: number;
    username: string;
  };
}