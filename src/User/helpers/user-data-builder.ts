import { User } from '@/User/graphql/models/user'
import { faker } from '@faker-js/faker'

export function UserDataBuilder(props: Partial<User>): Omit<User, 'id'> {
  return {
    name: props.name ?? faker.person.fullName(),
    email: props.email ?? faker.internet.email(),
    createdAt: props.createdAt ?? new Date(),
  }
}
