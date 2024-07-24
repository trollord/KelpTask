import { Test, TestingModule } from '@nestjs/testing';
import { AppService } from './app.service';
import { Client } from 'pg';
import * as readCsvHelper from './helpers/read-csv';
import * as convertRawJsonToObjectHelper from './helpers/raw-json-to-object';
import * as uploadDataToDbHelper from './helpers/upload-data-to-db';
import * as printAgeGroupHelper from './helpers/print-age-group';
import { mockUserDetails } from './utils/testdata';

describe('AppService', () => {
  let appService: AppService;
  let mockClient: jest.Mocked<Client>;

  beforeEach(async () => {
    mockClient = {
      query: jest.fn(),
    } as any;

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AppService,
        {
          provide: 'DATABASE_CONNECTION',
          useValue: mockClient,
        },
      ],
    }).compile();

    appService = module.get<AppService>(AppService);
  });

  it('should be defined', () => {
    expect(appService).toBeDefined();
  });

  describe('csvToJson', () => {
    it('should process CSV file and return user details', async () => {
      jest.spyOn(readCsvHelper, 'readCsv').mockResolvedValue(mockUserDetails);
      jest.spyOn(convertRawJsonToObjectHelper, 'convertRawJsonToObject');
      jest.spyOn(uploadDataToDbHelper, 'uploadDataToDb');
      jest.spyOn(printAgeGroupHelper, 'printAgeGroup');
      const result = await appService.csvToJson();

      expect(result).toEqual({ data: mockUserDetails });
      expect(readCsvHelper.readCsv).toHaveBeenCalled();
      expect(
        convertRawJsonToObjectHelper.convertRawJsonToObject,
      ).toHaveBeenCalledWith(mockUserDetails);
      expect(uploadDataToDbHelper.uploadDataToDb).toHaveBeenCalledWith(
        mockClient,
        mockUserDetails,
      );
      expect(printAgeGroupHelper.printAgeGroup).toHaveBeenCalledWith(
        mockUserDetails,
      );
    });

    it('should return error when table does not exist', async () => {
      jest.spyOn(readCsvHelper, 'readCsv').mockRejectedValue({ code: '42P01' });
      const result = await appService.csvToJson();

      expect(result).toEqual({
        error:
          'Database table does not exist. Please create the table before uploading data.',
      });
    });

    it('should return generic error for other errors', async () => {
      jest
        .spyOn(readCsvHelper, 'readCsv')
        .mockRejectedValue(new Error('Some error'));

      const result = await appService.csvToJson();
      expect(result).toEqual({
        error: 'An error occurred while processing the CSV file.',
      });
    });
  });
});
