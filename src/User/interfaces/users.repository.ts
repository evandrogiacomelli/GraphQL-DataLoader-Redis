import { ICreateUser } from '@/User/interfaces/create-user'
import { User } from '@/User/graphql/models/user'

export type SearchParams = {
  page?: number;
  perPage?: number;
  filter?: string | null;
  sort?: string | null
  sortDir?: 'asc' | 'desc' | null;
}

export type SearchResult = {
  items: User[];
  currentPage: number;
  perPage: number;
  lastPage: number;
  total: number;
}

export interface IUsersRepository {
  sortableFields: string[];
  create(data: ICreateUser) : Promise<User>;
  update(author: User) : Promise<User>;
  delete(id: String) : Promise<User>;
  findById(id: string) : Promise<User>;
  findByEmail(email: string) : Promise<User>;
  search(params: SearchParams) : Promise<SearchResult>;
  get(id: string) : Promise<User>;
}
