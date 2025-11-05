# DataLoader com Redis usando Herança

## Fluxo da Implementação por Herança

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
│              DependentsLoader extends RevLoader           │
│                                                           │
│  Passa batchLoadFn pro super (RevLoader)                  │
│                                                           │
└────────────────────┬──────────────────────────────────────┘
                     │
                     ▼
┌───────────────────────────────────────────────────────────┐
│        RevLoader extends DataLoader                       │
│                                                           │
│  async load(key: string) {                                │
│    1. Checa Redis primeiro                                │
│    const cached = await redisService.load(key)            │
│                                                           │
│    if (cached != null) return cached                      │
│                                                           │
│    2. Se não tiver no cache, chama DataLoader original    │
│    const result = await super.load(key)                   │
│                                                           │
│    3. Salva resultado no Redis                            │
│    await redisService.save(key, result, 3600)             │
│                                                           │
│    return result                                          │
│  }                                                        │
└─────────┬──────────────────────────┬──────────────────────┘
          │                          │
          ▼                          ▼
   ┌─────────────────┐      ┌──────────────────────┐
   │  RedisService   │      │ DataLoader.load()    │
   │                 │      │ (método herdado)     │
   │ .load(key)      │      │                      │
   │ .save(key,val)  │      │ Executa batchLoadFn  │
   └────────┬────────┘      │ que foi passado      │
            │               │ no construtor        │
            ▼               │                      │
      ┌──────────────┐      │ async (userIds) =>   │
      │ CacheService │      │   Prisma.findMany    │
      │              │      └──────────┬───────────┘
      │ .get(key)    │                 │
      │ .set(key)    │                 ▼
      └──────────────┘         ┌──────────────────┐
                               │  Prisma (Banco)  │
                               │                  │
                               │ SELECT * FROM    │
                               │ dependents WHERE │
                               │ userId IN (...)  │
                               └──────────────────┘
```

## Hierarquia de Classes

```
DependentsLoader
    extends RevLoader
        extends DataLoader<string, Dependents[]>
            |
            └─ usa RedisService pra cache
```

O fluxo é:
1. DependentsLoader herda de RevLoader
2. RevLoader herda de DataLoader e sobrescreve o método load()
3. No load() sobrescrito, primeiro checa Redis
4. Se não tiver no cache, chama super.load() que é o DataLoader original
5. Salva resultado no Redis antes de retornar

## Problemas dessa abordagem (SOLID violado)

### 1. Single Responsibility Principle (SRP)

RevLoader está fazendo coisa demais:
- É um DataLoader (herda)
- Gerencia cache do Redis
- Controla fluxo de quando buscar cache vs banco

Deveria fazer só uma coisa. Isso dificulta testar e modificar.

### 2. Open/Closed Principle (OCP)

Se quiser mudar a estratégia de cache (tipo usar Memcached, ou outro provedor), precisa mexer na classe.

### 3. Liskov Substitution Principle (LSP)

Esse é o pior. RevLoader diz que é um DataLoader (porque herda), mas não se comporta como um.

O DataLoader original tem essas garantias:
- Batching: agrupa chamadas
- Cache interno durante a request
- load() retorna o que batchLoadFn retornar

Mas o RevLoader sobrescreve load() e pode retornar do Redis ANTES de chamar super.load(). Isso quebra o contrato porque:
- Se 10 requests chegarem pra key que NÃO está no cache, cada um vai chamar super.load() INDIVIDUALMENTE, a checagem do Redis está ANTES do batching
```

## Conclusão

A implementação por herança funciona mas viola vários princípios SOLID e tem bugs sutis (perda de batching em cenários específicos).

Composição é mais verbosa mas mais flexível, testável e alinhada com boas práticas. Em produção, isso importa porque facilita manutenção, debug e extensão do código.

Por isso a decisão foi refatorar pra composição mesmo sendo mais código inicialmente.
