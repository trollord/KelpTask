import { Client } from 'pg';
import { UserDetails } from 'src/interface/user';

export const uploadDataToDb = async (
  client: Client,
  userDetails: UserDetails[],
) => {
  try {
    const insertDetails = userDetails.reduce(
      // Destructure the object to get the name, age, address, and record
      (str, { name, age, address, ...record }, i) => {
        str += `('${name.firstName} ${name.lastName}', ${age}, '${JSON.stringify(address)}', '${JSON.stringify(record)}')`;

        // Add comma if it is not the last record
        str += i === userDetails.length - 1 ? '' : ', ';
        return str;
      },
      '',
    );

    await client.query(
      `INSERT INTO public.users (name, age, address, additional_info) VALUES ${insertDetails}`,
    );
  } catch (error) {
    console.error('Error while uploading the Data to DB', error);
    throw error;
  }
};
