import { Controller, Get, UseGuards } from '@nestjs/common';
import { GoogleAuthGuard } from './guards/gogle-auth.guard';

@Controller('auth')
export class AuthController {
  // Redirect form the Google
  @Get('google/redirect')
  @UseGuards(GoogleAuthGuard)
  handleRedirect() {
    return { msg: 'OK' };
  }
}
