import { UserDetails } from 'src/interface/user';

export const printAgeGroup = (userDetails: UserDetails[]) => {
  try {
    const ageGroups = {
      '< 20': 0,
      '20 to 40': 0,
      '40 to 60': 0,
      '> 60': 0,
    };

    userDetails.forEach(({ age }) => {
      if (age < 20) {
        ageGroups['< 20'] += 1;
      } else if (age <= 40) {
        ageGroups['20 to 40'] += 1;
      } else if (age <= 60) {
        ageGroups['40 to 60'] += 1;
      } else {
        ageGroups['> 60'] += 1;
      }
    });

    const totalUsers = userDetails.length;

    const ageGroupPercentages = Object.keys(ageGroups).map((group) => {
      return {
        'Age-Group': group,
        '% Distribution': ((ageGroups[group] / totalUsers) * 100).toFixed(2),
      };
    });
    // Print the Age Group Distribution
    console.table(ageGroupPercentages);
  } catch (error) {
    console.error('Error while printing the Age Group', error);
    throw error;
  }
};
