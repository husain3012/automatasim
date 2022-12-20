export interface ExampleInterface {
  id: string;
  type: string;
  name: string;
  description?: string;
  data: string;
  createdAt?: string;
  author?: {
    id: string;
    name: string;
    avatar: string;
  };
}
