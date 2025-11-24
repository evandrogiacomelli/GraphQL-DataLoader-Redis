import { Injectable } from '@nestjs/common';
import { UserAgentClass } from '../types/monitoring.types';

@Injectable()
export class UserAgentClassifier {
  classify(userAgent: string | undefined): UserAgentClass {
    if (!userAgent) {
      return 'unknown';
    }

    const lowerUA = userAgent.toLowerCase();

    if (this.isBot(lowerUA)) {
      return 'bot';
    }

    if (this.isMobile(lowerUA)) {
      return 'mobile';
    }

    if (this.isCLI(lowerUA)) {
      return 'cli';
    }

    if (this.isBrowser(lowerUA)) {
      return 'browser';
    }

    return 'unknown';
  }

  private isBot(userAgent: string): boolean {
    const botPatterns = ['bot', 'crawler', 'spider', 'scraper', 'slurp'];
    return botPatterns.some(pattern => userAgent.includes(pattern));
  }

  private isMobile(userAgent: string): boolean {
    const mobilePatterns = ['mobile', 'android', 'iphone', 'ipad', 'tablet'];
    return mobilePatterns.some(pattern => userAgent.includes(pattern));
  }

  private isCLI(userAgent: string): boolean {
    const cliPatterns = ['curl', 'wget', 'httpie', 'postman', 'insomnia'];
    return cliPatterns.some(pattern => userAgent.includes(pattern));
  }

  private isBrowser(userAgent: string): boolean {
    const browserPatterns = ['mozilla', 'chrome', 'safari', 'firefox', 'edge'];
    return browserPatterns.some(pattern => userAgent.includes(pattern));
  }
}