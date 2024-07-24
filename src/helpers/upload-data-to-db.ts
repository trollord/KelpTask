import { Client } from 'pg';
import { UserDetails } from 'src/interface/user';

export const uploadDataToDb = async (
  client: Client,
  userDetails: UserDetails[],
) => {
  try {
    const insertDetails = userDetails.reduce(
      (str, { name, age, address, ...record }, i) => {
        const { firstName, lastName } = name;
        str += `('${firstName} ${lastName}', ${age}, '${JSON.stringify(address)}', '${JSON.stringify(record)}')`;
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
