import { Controller, Post, Body, UseGuards, Req, Get } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { EmailAuthService } from './email-auth.service';
import { SendOtpDto } from './dto/send-otp.dto';
import { VerifyOtpDto } from './dto/verify-otp.dto';
import { RefreshTokenDto } from './dto/refresh-token.dto';
import { LoginEmailDto } from './dto/login-email.dto';
import { JwtAuthGuard } from '../common/security/guards/jwt-auth.guard';

@ApiTags('Authentication')
@Controller('auth')
export class AuthController {
  constructor(
    private auth: AuthService,
    private emailAuth: EmailAuthService,
  ) {}

  @ApiOperation({ summary: 'Login with email and password' })
  @ApiResponse({ status: 200, description: 'Logged in successfully' })
  @ApiResponse({ status: 401, description: 'Invalid email or password' })
  @Post('login-email')
  loginWithEmail(@Body() dto: LoginEmailDto) {
    return this.emailAuth.login(dto);
  }

  @ApiOperation({ summary: 'Send OTP to user mobile' })
  @ApiResponse({ status: 201, description: 'OTP Sent Successfully' })
  @Post('send-otp')
  sendOtp(@Body() dto: SendOtpDto) {
    console.log("Sending OTP to mobile:", dto.mobile);
    return this.auth.sendOtp(dto.mobile);
  }

  @ApiOperation({ summary: 'Verify OTP and generate tokens' })
  @ApiResponse({ status: 200, description: 'OTP Verified Successfully' })
  @ApiResponse({ status: 401, description: 'Invalid OTP' })
  @Post('verify-otp')
  verify(@Body() dto: VerifyOtpDto) {
    return this.auth.verifyOtp(dto.mobile, dto.otp);
  }

  @ApiOperation({ summary: 'Refresh access token using refresh token' })
  @ApiResponse({ status: 200, description: 'Token Refreshed Successfully' })
  @ApiResponse({ status: 401, description: 'Invalid Refresh Token' })
  @Post('refresh')
  async refresh(@Body() dto: RefreshTokenDto) {
    const decoded: any = (await import('jsonwebtoken')).decode(dto.refreshToken);
    if (!decoded || !decoded.sub) throw new Error('Invalid token');
    return this.auth.refreshTokens(decoded.sub, dto.refreshToken);
  }

  @ApiBearerAuth('access-token')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Logout user and remove refresh token' })
  @ApiResponse({ status: 200, description: 'Logged Out Successfully' })
  @Post('logout')
  logout(@Req() req: any) {
    console.log("Logging out user:", req.user);
    return this.auth.logout(req.user.id);
  }

   @Get('welcome')
  welcome() {
    console.log("Sending OTP to mobile:");
    return {'hello': 'Welcome to the Identity Service API'};
  }
}
