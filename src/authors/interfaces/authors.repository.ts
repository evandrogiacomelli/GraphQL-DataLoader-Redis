import { ICreateAuthor } from '@/authors/interfaces/create-author'
import { Author } from '@/authors/graphql/models/author'

export type SearchParams = {
  page?: number;
  perPage?: number;
  filter?: string | null;
  sort?: string | null
  sortDir?: 'asc' | 'desc' | null;
}

export type SearchResult = {
  items: Author[];
  currentPage: number;
  perPage: number;
  lastPage: number;
  total: number;
}

export interface IAuthorsRepository {
  sortableFields: string[];
  create(data: ICreateAuthor) : Promise<Author>;
  update(author: Author) : Promise<Author>;
  delete(id: String) : Promise<Author>;
  findById(id: string) : Promise<Author>;
  findByEmail(email: string) : Promise<Author>;
  search(params: SearchParams) : Promise<SearchResult>;
  get(id: string) : Promise<Author>;
}
