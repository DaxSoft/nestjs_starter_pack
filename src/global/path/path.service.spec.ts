import { Test, TestingModule } from '@nestjs/testing';
import { PathRouteService } from './path.service';

describe('PathRouteService', () => {
  let service: PathRouteService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PathRouteService],
    }).compile();

    service = module.get<PathRouteService>(PathRouteService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
