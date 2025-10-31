import { User } from '@/User/graphql/models/user'

export interface IUsersRepository {
  findById(id: string): Promise<User>;
  findAll(): Promise<User[]>;
}
