export interface Directory {
  _id: string;
  user_create?: string;
  user_update?: string;
  parent_directory?: string;
  name: string;
  path?: string;
  date_create?: string;
}
