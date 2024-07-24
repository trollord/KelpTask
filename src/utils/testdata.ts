import { UserDetails } from 'src/interface/user';

export const mockUserDetails: UserDetails[] = [
  {
    name: {
      firstName: 'John',
      lastName: 'Doe',
    },
    age: 30,
    address: {
      street: '1234 Elm St',
      city: 'Springfield',
      state: 'IL',
      zip: 62701,
    },
  },
];
