import { Controller, Get } from '@nestjs/common';

/** GET /api/v1/health -- the smallest possible endpoint, to prove the server is up. */
@Controller('health')
export class HealthController {
  @Get()
  check(): { status: 'ok' } {
    return { status: 'ok' };
  }
}
