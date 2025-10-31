import { Injectable, Scope } from '@nestjs/common'
import { PrismaService } from '@/database/prisma/prisma.service'
import DataLoader from 'dataloader'
import { Dependents } from '@/Dependents/graphql/models/dependents'



// criar uma nova instancia de dependents loader para cada req com nest
@Injectable({ scope: Scope.REQUEST })
export class DependentsLoader {
  constructor(private readonly prisma: PrismaService) {}

  public readonly batchLoad = new DataLoader<string, Dependents[]>(async (userIds) => {
    const dependents = await this.prisma.dependent.findMany({
      where: { userId: { in: userIds as string[] }}
    })

    const map = new Map<String, Dependents[]>();
    userIds.forEach((userId) => map.set(userId, []));

    for (const dependent of dependents) {
      map.get(dependent.userId)?.push(dependent);
    }

    return userIds.map((userId) => map.get(userId)!)
  })
}
