import { AsyncLocalStorage } from 'async_hooks';

export interface UserContextData {
  id: string;
  email: string;
  name: string;
  roles: string[];
  sub: string;
}

class UserContextStorage {
  private readonly storage: AsyncLocalStorage<UserContextData>;

  constructor() {
    this.storage = new AsyncLocalStorage<UserContextData>();
  }

  run<R>(user: UserContextData, callback: () => R): R {
    return this.storage.run(user, callback);
  }

  getStore(): UserContextData | undefined {
    return this.storage.getStore();
  }

  getCurrentUser(): UserContextData {
    const user = this.storage.getStore();
    if (!user) {
      throw new Error('No user in context');
    }
    return user;
  }
}

export const userContext = new UserContextStorage();