import { faker } from '@faker-js/faker';
import { sample } from 'lodash';

// ----------------------------------------------------------------------

const users = [...Array(7)].map(() => ({
    id: faker.datatype.uuid(),
    name: sample(['CD-IELTS', 'IELTS SPEAKING', 'CD-IELTS']),
    testId: `CD-IELTS Academic ${faker.datatype.number({ min: 1, max: 25 })}`,
    totalTime: sample(['0.30', '0.30', '0.10', '0.20', '1.15']),
    totalQuestions: faker.datatype.number({ min: 5, max: 30 }),
    type: sample(['0.20', '0.25', '0.20', '1.0']),
    submission: faker.datatype.number({ min: 3, max: 7 }),
  }));

export default users;
