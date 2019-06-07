import {User} from "./user";

export interface UserGroup {
  name: string;
  creator: User;
  users: Array<User>;
  created_at?: string;
  updated_at?: string;
}
