# GraphQL DataLoader + Redis Cache

Projeto comparativo: **Herança vs Composição** para integrar DataLoader com cache Redis.

## O Problema

GraphQL tem problema N+1:
```typescript
// 3 users = 3 queries separadas
users.forEach(user => {
  db.query('SELECT * FROM dependents WHERE userId = ?', user.id)
})
```

DataLoader resolve com batching:
```typescript
// 3 users = 1 query agrupada
db.query('SELECT * FROM dependents WHERE userId IN (?, ?, ?)', [id1, id2, id3])
```

Mas o cache do DataLoader dura só a request. Precisamos Redis para persistir entre requests.

## As Duas Abordagens

### 1. Herança
```
DependentsLoader extends RevLoader extends DataLoader
```
- Sobrescreve `load()` para adicionar cache
- Ver: [demoLoader-heranca/RedisLoaderHeritance.md](src/User/loaders/demoLoader-heranca/RedisLoaderHeritance.md)

### 2. Composição
```
DependentsLoader -> usa CachedBatchLoader -> usa DataLoader + CacheAdapter
```
- DataLoader como propriedade interna
- Genérico e reutilizável
- Ver: [demoLoader-composicao/RedisLoaderComposition.md](src/User/loaders/demoLoader-composicao/RedisLoaderComposition.md)

## Estrutura

```
src/User/loaders/
├── demoLoader-heranca/
│   ├── RevLoader.ts
│   ├── CacheAdapter.ts
│   ├── DependentsLoader.ts
│   └── RedisLoaderHeritance.md
│
└── demoLoader-composicao/
    ├── CachedBatchLoader.ts
    ├── CacheAdapter.ts
    ├── DependentsLoader.ts
    └── RedisLoaderComposition.md
```

## Como Rodar

```bash
# Subir Redis
docker-compose up -d

# Instalar e rodar
pnpm install
pnpm prisma migrate dev
pnpm start:dev
```