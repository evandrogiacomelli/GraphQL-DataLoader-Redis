import { Injectable } from '@nestjs/common';

@Injectable()
export class IPAddressClassifier {
  classify(ipAddress: string): string {
    if (!ipAddress || !this.isValidIPv4(ipAddress)) {
      return 'unknown';
    }

    return this.extractClassC(ipAddress);
  }

  private isValidIPv4(ip: string): boolean {
    const ipv4Pattern = /^(\d{1,3}\.){3}\d{1,3}$/;
    return ipv4Pattern.test(ip);
  }

  private extractClassC(ip: string): string {
    const octets = ip.split('.');
    return `${octets[0]}.${octets[1]}.${octets[2]}`;
  }
}