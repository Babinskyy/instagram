export type SignupCredentials = {
  email: string;
  username: string;
  password: string;
};
export type LoginCredentials = {
  email: string;
  password: string;
};
export type User = {
  id: number;
  username: string;
  email: string;
} | null;
// export type Post = {
//   id: number;
//   url: string;
//   caption: string;
// };
export type UserInfo = {
  posts: null | number;
  followers: null | number;
  following: null | number;
};
export type Post = {
  caption: string;
  created_at: string;
  id: number;
  likes: number[];
  owner_id: number;
  owner_username: string;
  url: string;
  editable: boolean;
};
