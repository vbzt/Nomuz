
export interface ChatUser {
  user_id: string;
  user_name: string;
  user: { id: string; name: string; profilePicture?: string };
}