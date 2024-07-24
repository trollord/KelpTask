/* eslint-disable prettier/prettier */
import { Inject, Injectable } from '@nestjs/common';
import { readCsv } from './helpers/read-csv';
import { convertRawJsonToObject } from './helpers/raw-json-to-object';
import { Client } from 'pg';
import { uploadDataToDb } from './helpers/upload-data-to-db';
import { printAgeGroup } from './helpers/print-age-group';
import { UserDetails } from './interface/user';

@Injectable()
export class AppService {

  constructor(
    @Inject('DATABASE_CONNECTION')
    private readonly client: Client,
  ) {}

  async csvToJson(): Promise<{ data?: UserDetails[]; error?: string }> {
    try {
      const rawJson = await readCsv(process.env.CSV_FILE);
      const userDetails = await convertRawJsonToObject(rawJson);
      
      await uploadDataToDb(this.client, userDetails);
      printAgeGroup(userDetails);

      return {data : userDetails}
    } catch (error) {
      if (error.code === '42P01') {
        return {
          error: 'Database table does not exist. Please create the table before uploading data.',
        };
      }

      return {
        error: 'An error occurred while processing the CSV file.',
      };
    }
  }
}
