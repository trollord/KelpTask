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
      // have assumed the data as clean data and not validating the data

      // Read the CSV file
      const getJsonFromCsv = await readCsv(process.env.CSV_FILE);

      // Convert the raw JSON data to an array of objects
      const userDetails = await convertRawJsonToObject(getJsonFromCsv);
      
      // Upload the data to the database
      await uploadDataToDb(this.client, userDetails).then(() => {
        printAgeGroup(userDetails);
      });
      
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
