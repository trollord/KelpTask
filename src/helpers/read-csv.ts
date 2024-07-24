import * as fs from 'fs';
import * as csvParser from 'csv-parser';

export const readCsv = async (filePath: string): Promise<any[]> => {
  const results = [];

  return new Promise((resolve, reject) => {
    fs.createReadStream(filePath)
      .pipe(csvParser())
      .on('data', (data) => results.push(data))
      .on('end', () => resolve(results))
      .on('error', (error) => reject(error));
  });
};
