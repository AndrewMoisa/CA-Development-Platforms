export interface User {
  id: number;
  username: string;
  email: string;
  password_hash?: string;
}

export interface UserResponse {
  id: number;
  username: string;
  email: string;
}

export interface Article {
  id: number;
  title: string;
  body: string;
  category: string;
  submitted_by: number;
  created_at: Date;
}