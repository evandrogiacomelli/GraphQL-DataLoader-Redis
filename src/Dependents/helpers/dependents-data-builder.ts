import { Dependents } from '@/Dependents/graphql/models/dependents'
import { faker } from '@faker-js/faker'

export function DependentsDataBuilder(props: Partial<Dependents>): Omit<Dependents, 'id'> {
  return {
    name: props.name ?? faker.person.fullName(),
    email: props.email ?? faker.internet.email(),
    createdAt: props.createdAt ?? new Date(),
  }
}
