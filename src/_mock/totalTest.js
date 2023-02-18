import { faker } from '@faker-js/faker';
import { sample } from 'lodash';

// ----------------------------------------------------------------------

const totalTest = [...Array(15)].map((_, index) => {
  return {
    id: faker.datatype.uuid(),
    name: sample(['CD-IELTS', 'IELTS SPEAKING', 'CD-IELTS']),
    completation: faker.datatype.number({ min: 10, max: 100 }),
    date: faker.datatype.datetime({ min: 1577836800000, max: 1893456000000 }),
    totalQuestions: faker.datatype.number({ min: 5, max: 30 }),
    timeSpent: sample([['0.10', '0.13', '0.18', '0.05', '0.11']]),
    status: sample(['Finished', 'Pending', 'Continued']),
  };
});

export default totalTest;
