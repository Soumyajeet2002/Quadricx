import {
  Injectable,
  Inject,
  UnauthorizedException,
  Logger,
  Optional,
  InternalServerErrorException,
} from '@nestjs/common';
import { CACHE_MANAGER, Cache } from '@nestjs/cache-manager';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import { generateNumericOTP } from '../common/utils/crypto.util';
import { OtpEntity } from './entities/otp.entity';
import { OtpMongo } from './entities/otp.mongo.schema';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Model, Document } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { UserSqlEntity } from '../users/entities/user.sql.entity';
import { UserMongo } from '../users/entities/user.mongo.schema';
import { RoleSqlEntity } from '../role/entites/role.sql.entity';
import { SecureSecretsService } from 'src/common/service/secure-secrete.service';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);
  private readonly isMongo = process.env.DATABASE_TYPE === 'mongo';

  constructor(
    private readonly secureSecretsService: SecureSecretsService,

    @Inject(CACHE_MANAGER) private cache: Cache,
    private usersService: UsersService,
    private jwt: JwtService,

    @Optional() // <--- Make this optional
    @InjectRepository(OtpEntity)
    private otpRepo: Repository<OtpEntity>,


    @Optional() // <--- Make this optional
    @InjectModel(OtpMongo.name)
    private otpMongoModel?: Model<OtpMongo>
  ) {}

  private otpKey = (mobile: string) => `OTP_${mobile}`;
  private rateKey = (mobile: string) => `OTP_RATE_${mobile}`;
  private getUserId = (user: any) => user?._id?.toString() || user?.id;

  /** Type guard for Mongoose documents */
  private isMongooseDocument(obj: any): obj is Document {
    return obj && typeof obj.toObject === 'function';
  }

  /** Send OTP */
  async sendOtp(mobile: string) {
    try {
      console.log("mobile", mobile);

      // Check rate limit
      const rate =
        (await this.cache.get<number>(this.rateKey(mobile))) || 0;

      console.log("rate", rate);

      if (rate >= 5) {
        throw new UnauthorizedException("Too many OTP requests");
      }

      // Increase request count
      await this.cache.set(this.rateKey(mobile), rate + 1, 3600);

      // Generate OTP
      // const otp = generateNumericOTP(6);
      const otp = "123456";

      // Cache OTP for 5 minutes
      await this.cache.set(this.otpKey(mobile), otp, 300);

      // Expiry time
      const expiresAt = new Date(Date.now() + 5 * 60 * 1000);

      // Save OTP in database
      if (this.isMongo) {
        await this.otpMongoModel!.create({
          mobile,
          otp,
          createdAt: new Date(),
        });
      } else {
        console.log("PostgreSQL entry");

        const entity = this.otpRepo.create({
          mobile,
          otp,
          expires_at: expiresAt,
        });

        console.log("entity", entity);

        const otpSave = await this.otpRepo.save(entity);

        console.log("otp saved", otpSave);
      }

      this.logger.log(`Generated OTP for ${mobile}: ${otp}`);

      return {
        ok: true,
        ttl: 300,
      };
    } catch (err) {
      this.logger.error("Failed to send OTP", err.stack || err);

      // Re-throw known exceptions
      if (err instanceof UnauthorizedException) {
        throw err;
      }

      throw new InternalServerErrorException(
        "Failed to generate OTP. Please try again."
      );
    }
  }

  async verifyOtp(mobile: string, otp: string) {
    let stored = await this.cache.get<string>(this.otpKey(mobile));

    // fallback to DB
    if (!stored) {
      if (this.isMongo) {
        const record = await this.otpMongoModel!.findOne({ mobile }).sort({
          createdAt: -1,
        });
        if (!record) throw new UnauthorizedException('Invalid or expired OTP');
        stored = record.otp;
        await this.cache.set(this.otpKey(mobile), stored, 300);
      } else {
        const record = await this.otpRepo.findOne({
          where: { mobile },
          order: { created_at: 'DESC' },
        });
        if (!record) throw new UnauthorizedException('Invalid or expired OTP');
        stored = record.otp;
        await this.cache.set(this.otpKey(mobile), stored, 300);
      }
    }

    if (stored !== otp) throw new UnauthorizedException('Invalid OTP');

    // delete OTP after verification
    await this.cache.del(this.otpKey(mobile));
    await this.cache.del(this.rateKey(mobile));
    if (this.isMongo) {
      await this.otpMongoModel!.deleteMany({ mobile, otp });
    } else {
      await this.otpRepo.delete({ mobile, otp });
    }

    // find or create user
    let user: UserSqlEntity | UserMongo | null =
      await this.usersService.findByMobile(mobile);

    if (!user) {
      await this.usersService.create(mobile);
      user = await this.usersService.findByMobile(mobile);
    }

    if (!user) throw new UnauthorizedException('User creation failed');

    return this.generateTokensForUser(user);
  }

  /** Generate access and refresh tokens for verified/logged-in user */
  async generateTokensForUser(user: any) {
    let userObj = user;
    if (this.isMongo && this.isMongooseDocument(user)) {
      userObj = user.toObject();
    }

    // -------- JWT PART (RS256) --------

    const privateKey = await this.getPrivateKey('JWT_PRIVATE_KEY');

    if (!privateKey) {
      throw new Error('JWT_PRIVATE_KEY is not set');
    }

    // Access token payload (authorization data)
    const accessPayload = {
      sub: this.getUserId(userObj),
      mobile: userObj?.mobile,
      role: (userObj?.role as RoleSqlEntity)?.role_code ?? 0,
      roleUnqId: userObj?.role_unq_id ?? '0'
    };

    // Refresh token payload (minimal)
    const refreshPayload = {
      sub: this.getUserId(userObj),
      type: 'refresh',
    };

    const commonJwtOptions = {
      algorithm: 'RS256' as const,
      issuer: process.env.JWT_ISSUER,
      audience: process.env.JWT_AUDIENCE,
      keyid: process.env.JWT_KEY_ID,
      privateKey: privateKey,
    };

    const accessToken = this.jwt.sign(accessPayload, {
      ...commonJwtOptions,
      expiresIn: Number(process.env.JWT_EXPIRES_IN || 900), // 15 min
    });

    const refreshToken = this.jwt.sign(refreshPayload, {
      ...commonJwtOptions,
      expiresIn: Number(process.env.JWT_REFRESH_EXPIRES_IN || 604800), // 7 days
    });

    // Store refresh token hash (recommended)
    await this.usersService.saveRefreshTokenHash(
      this.getUserId(userObj),
      refreshToken,
    );

    return { accessToken, refreshToken };
  }

  /** Refresh tokens */
  async refreshTokens(userId: any, refreshToken: string) {
    try {
      const isValid = await this.usersService.validateRefreshToken(
        userId,
        refreshToken,
      );
      if (!isValid) throw new UnauthorizedException('Invalid refresh token');

      let user = await this.usersService.findByIdSafe(userId);
      if (!user) throw new UnauthorizedException('User not found');

      if (this.isMongo && this.isMongooseDocument(user)) user = user.toObject();

      const payload = {
        sub: this.getUserId(user),
        mobile: user?.mobile,
        role: user?.role ?? '0',
      };

      console.log('check pointiii--------', payload);
      // const accessToken = this.jwt.sign(payload, {
      //   expiresIn: parseInt(process.env.JWT_EXPIRES_IN || '3600'),
      // });
      // const newRefreshToken = this.jwt.sign(payload, {
      //   expiresIn: parseInt(process.env.JWT_REFRESH_EXPIRES_IN || '86400'),
      // });
      const privateKey = await this.getPrivateKey('JWT_PRIVATE_KEY');

      const commonJwtOptions = {
        algorithm: 'RS256' as const,
        issuer: process.env.JWT_ISSUER,
        audience: process.env.JWT_AUDIENCE,
        keyid: process.env.JWT_KEY_ID,
        privateKey: privateKey,
      };

      const accessToken = this.jwt.sign(payload, {
        ...commonJwtOptions,
        expiresIn: Number(process.env.JWT_EXPIRES_IN || 900),
      });

      const newRefreshToken = this.jwt.sign(
        { sub: this.getUserId(user), type: 'refresh' }, // keep minimal
        {
          ...commonJwtOptions,
          expiresIn: Number(process.env.JWT_REFRESH_EXPIRES_IN || 604800),
        },
      );

      await this.usersService.saveRefreshTokenHash(
        this.getUserId(user),
        newRefreshToken,
      );

      return { accessToken, refreshToken: newRefreshToken };
    } catch (err) {
      console.log(err, '----------');
      throw new InternalServerErrorException(
        err,
        'Something went wrong in refresh token',
      );
    }
  }

  /** Logout */
  async logout(userId: any) {
    await this.usersService.removeRefreshToken(userId);
    return { ok: true };
  }

  private async getPrivateKey(key: any): Promise<string> {
    try {
      const secretResponse =
        // await this.secureSecretsService.getSecret('JWT_PUBLIC_KEY');
        await this.secureSecretsService.getSecret(key);

      if (!secretResponse?.status || !secretResponse?.content) {
        throw new Error(
          `Failed to load JWT private key: ${secretResponse?.message || 'Unknown error'}`,
        );
      }
      return secretResponse.content;
    } catch (error) {
      this.logger.error('Failed to load JWT private key', error);
      throw new InternalServerErrorException('JWT private key not found');
    }
  }
}
