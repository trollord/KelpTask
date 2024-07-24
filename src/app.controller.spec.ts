import { Test, TestingModule } from '@nestjs/testing';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DatabaseModule } from './database/database.module';
import { mockUserDetails } from './utils/testdata';

describe('AppController', () => {
  let appController: AppController;
  let appService: AppService;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      imports: [DatabaseModule],
      controllers: [AppController],
      providers: [
        {
          provide: AppService,
          useValue: {
            csvToJson: jest.fn(),
          },
        },
      ],
    }).compile();

    appController = app.get<AppController>(AppController);
    appService = app.get<AppService>(AppService);
  });

  describe('csvToJson', () => {
    it('should call csvToJson method of AppService', async () => {
      const mockResult = { data: mockUserDetails };
      jest.spyOn(appService, 'csvToJson').mockResolvedValue(mockResult);

      const result = await appController.csvToJson();

      expect(appService.csvToJson).toHaveBeenCalled();
      expect(result).toBe(mockResult);
    });

    it('should handle errors from csvToJson method', async () => {
      const mockError = { error: 'An error occurred' };
      jest.spyOn(appService, 'csvToJson').mockResolvedValue(mockError);

      const result = await appController.csvToJson();

      expect(appService.csvToJson).toHaveBeenCalled();
      expect(result).toBe(mockError);
    });
  });
});
