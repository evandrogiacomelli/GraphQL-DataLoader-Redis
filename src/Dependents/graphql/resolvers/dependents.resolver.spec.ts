import { Test, TestingModule } from '@nestjs/testing';
import { DependentsResolver } from './dependents.resolver';

describe('DependentsResolver', () => {
  let resolver:  DependentsResolver;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [DependentsResolver],
    }).compile();

    resolver = module.get<DependentsResolver>(DependentsResolver);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });
});
