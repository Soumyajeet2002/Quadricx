import { AuthGuard } from '@nestjs/passport';
import {
  Injectable,
  ExecutionContext,
  UnauthorizedException,
  Logger,
} from '@nestjs/common';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  private readonly logger = new Logger(JwtAuthGuard.name);

  canActivate(context: ExecutionContext) {
    this.logger.debug('🔍 JwtAuthGuard: Checking authorization...');
    const request = context.switchToHttp().getRequest();
    const authHeader = request.headers['authorization'];

    if (!authHeader) {
      this.logger.error('❌ No Authorization header provided');
    } else {
      this.logger.debug(`📌 Authorization Header: ${authHeader}`);
    }

    return super.canActivate(context);
  }

  handleRequest(err: any, user: any, info: any) {
    if (err) {
      this.logger.error(`❌ Auth error: ${err}`);
      throw err;
    }

    if (!user) {
      this.logger.error(`❌ User not found. Reason: ${info?.message}`);
      this.logger.error(`ℹ️ Passport returned info: ${JSON.stringify(info)}`);
      throw new UnauthorizedException('Invalid or missing token');
    }

    this.logger.debug('✅ Authenticated user:', user);
    return user;
  }
}
