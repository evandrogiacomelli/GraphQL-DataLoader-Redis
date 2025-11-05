# DataLoader com Redis usando Composição

## Como Funciona

```
┌───────────────────────────────────────────────────────────┐
│                    RESOLVER (GraphQL)                     │
│                                                           │
│  @ResolveField(() => [Dependents])                        │
│  async dependents(@Parent() user: User) {                 │
│    return this.dependentsLoader.load(user.id)             │
│  }                                                        │
└────────────────────┬──────────────────────────────────────┘
                     │ .load(userId)
                     ▼
┌───────────────────────────────────────────────────────────┐
│              DependentsLoader (NestJS Service)            │
│                                                           │
│  private loader: CachedBatchLoader                        │
│                                                           │
│  load(userId: string) {                                   │
│    return this.loader.load(userId)                        │
│  }                                                        │
└────────────────────┬──────────────────────────────────────┘
                     │
                     ▼
┌───────────────────────────────────────────────────────────┐
│        CachedBatchLoader (Wrapper Genérico)               │
│                                                           │
│  private dataLoader: DataLoader     (composição)          │
│  private cache: CacheAdapter        (composição)          │
│                                                           │
│  async load(key: K) {                                     │
│    1. Checa Redis                                         │
│    const cached = await cache.load(key)                   │
│    if (cached != null) return cached                      │
│                                                           │
│    2. Delega para DataLoader                              │
│    const result = await dataLoader.load(key)              │
│                                                           │
│    3. Salva no Redis                                      │
│    await cache.save(key, result, 3600)                    │
│    return result                                          │
│  }                                                        │
└─────────┬──────────────────────────┬──────────────────────┘
          │                          │
          ▼                          ▼
   ┌─────────────────┐      ┌──────────────────────┐
   │ CacheAdapter<V> │      │ DataLoader<K, V>     │
   │   (genérico)    │      │   (biblioteca)       │
   │                 │      │                      │
   │ .load(key)      │      │ Executa batchLoadFn  │
   │ .save(key,val)  │      │ passado no construtor│
   └────────┬────────┘      │                      │
            │               │ async (userIds) =>   │
            ▼               │   Prisma.findMany    │
      ┌──────────────┐      └──────────┬───────────┘
      │ CacheService │                 │
      │              │                 ▼
      │ .get(key)    │         ┌──────────────────┐
      │ .set(key)    │         │  Prisma (Banco)  │
      └──────────────┘         │                  │
                               │ SELECT * FROM    │
                               │ dependents WHERE │
                               │ userId IN (...)  │
                               └──────────────────┘
```

## Estrutura de Classes

```
DependentsLoader (Injectable NestJS)
    |
    └─ usa CachedBatchLoader<string, Dependents[]>
           |
           ├─ usa DataLoader<K, V> (composição)
           |
           └─ usa CacheAdapter<V> (composição)
```

O fluxo é:
1. DependentsLoader possui uma instância de CachedBatchLoader
2. CachedBatchLoader possui DataLoader e CacheAdapter como propriedades
3. No método load(), primeiro tenta buscar do cache Redis
4. Se não encontrar, delega para o DataLoader interno
5. DataLoader executa o batchLoadFn com batching automático
6. Resultado é salvo no Redis antes de retornar

## Características

- CachedBatchLoader é genérico `<K, V>` e reutilizável
- CacheAdapter adapta o CacheService do NestJS
- DataLoader fica encapsulado como propriedade privada
- Fácil trocar implementação de cache injetando outra dependência
- Fácil mockar em testes