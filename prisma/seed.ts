import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('Limpando banco...')
  await prisma.post.deleteMany()
  await prisma.dependent.deleteMany()
  await prisma.user.deleteMany()

  console.log('Criando usuários...')
  const user1 = await prisma.user.create({
    data: {
      email: 'joao@example.com',
      name: 'João Silva',
    },
  })

  const user2 = await prisma.user.create({
    data: {
      email: 'maria@example.com',
      name: 'Maria Santos',
    },
  })

  const user3 = await prisma.user.create({
    data: {
      email: 'pedro@example.com',
      name: 'Pedro Costa',
    },
  })

  console.log('Criando posts...')
  await prisma.post.createMany({
    data: [
      { title: 'Post 1 do João', content: 'Conteúdo do post 1', authorId: user1.id },
      { title: 'Post 2 do João', content: 'Conteúdo do post 2', authorId: user1.id },
      { title: 'Post 3 do João', content: 'Conteúdo do post 3', authorId: user1.id },
      { title: 'Post 1 da Maria', content: 'Conteúdo do post 1', authorId: user2.id },
      { title: 'Post 2 da Maria', content: 'Conteúdo do post 2', authorId: user2.id },
      { title: 'Post 1 do Pedro', content: 'Conteúdo do post 1', authorId: user3.id },
    ],
  })

  console.log('Criando dependentes...')
  await prisma.dependent.createMany({
    data: [
      { email: 'dep1@example.com', name: 'Dependente 1 do João', userId: user1.id },
      { email: 'dep2@example.com', name: 'Dependente 2 do João', userId: user1.id },
      { email: 'dep3@example.com', name: 'Dependente 1 da Maria', userId: user2.id },
    ],
  })

  console.log(' Seed completo!')
  console.log(`
Dados criados:
- 3 usuários
- 6 posts (João: 3, Maria: 2, Pedro: 1)
- 3 dependentes (João: 2, Maria: 1)
  `)
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
