import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class KeycloakService {
  private readonly keycloakUrl: string;
  private readonly realm: string;
  private readonly clientId: string;
  private readonly clientSecret: string;

  constructor(private readonly configService: ConfigService) {
    this.keycloakUrl = this.configService.get<string>('KEYCLOAK_URL', 'http://localhost:8080');
    this.realm = this.configService.get<string>('KEYCLOAK_REALM', 'ecommerce');
    this.clientId = this.configService.get<string>('KEYCLOAK_CLIENT_ID', 'api-client');
    this.clientSecret = this.configService.get<string>('KEYCLOAK_CLIENT_SECRET', '');
  }

  async verifyToken(token: string): Promise<any> {
    const url = `${this.keycloakUrl}/realms/${this.realm}/protocol/openid-connect/userinfo`;

    try {
      const response = await fetch(url, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Token validation failed');
      }

      return await response.json();
    } catch (error) {
      throw new Error('Token verification failed');
    }
  }

  getAuthUrl(): string {
    return `${this.keycloakUrl}/realms/${this.realm}/protocol/openid-connect/auth`;
  }

  getTokenUrl(): string {
    return `${this.keycloakUrl}/realms/${this.realm}/protocol/openid-connect/token`;
  }

  getLogoutUrl(): string {
    return `${this.keycloakUrl}/realms/${this.realm}/protocol/openid-connect/logout`;
  }
}