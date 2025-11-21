import { Injectable, CanActivate, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import { userContext, UserContextData } from '../context/user.context';

@Injectable()
export class KeycloakGuard implements CanActivate {
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = this.getRequest(context);
    const token = this.extractToken(request);

    if (!token) {
      throw new UnauthorizedException('No token provided');
    }

    const user = await this.validateToken(token);

    return new Promise((resolve) => {
      userContext.run(user, () => {
        resolve(true);
      });
    });
  }

  private getRequest(context: ExecutionContext) {
    const contextType = context.getType();

    if (contextType === 'http') {
      return context.switchToHttp().getRequest();
    }

    if (contextType as string === 'graphql') {
      const gqlContext = GqlExecutionContext.create(context);
      return gqlContext.getContext().req;
    }

    throw new Error('Unsupported context type');
  }

  private extractToken(request: any): string | null {
    const authHeader = request.headers.authorization;

    if (!authHeader) {
      return null;
    }

    const parts = authHeader.split(' ');
    if (parts.length !== 2 || parts[0] !== 'Bearer') {
      return null;
    }

    return parts[1];
  }

  private async validateToken(token: string): Promise<UserContextData> {
    try {
      const decoded = this.decodeToken(token);
      return {
        id: decoded.sub,
        email: decoded.email || '',
        name: decoded.name || decoded.preferred_username || '',
        roles: decoded.realm_access?.roles || [],
        sub: decoded.sub,
      };
    } catch (error) {
      throw new UnauthorizedException('Invalid token');
    }
  }

  private decodeToken(token: string): any {
    try {
      const parts = token.split('.');
      if (parts.length !== 3) {
        throw new Error('Invalid token format');
      }

      const payload = Buffer.from(parts[1], 'base64').toString('utf-8');
      return JSON.parse(payload);
    } catch (error) {
      throw new UnauthorizedException('Token decode failed');
    }
  }
}