import dotenv from 'dotenv';
import path from 'path';
import * as readline from 'readline/promises';
import { initializeDataSource } from '../../src/database/dataSource';
import UserFactory from './factories/UserFactory';
import ActivityFactory from './factories/ActivityFactory';
import ProgramPartFactory from './factories/ProgramPartFactory';
import SpeakerFactory from './factories/SpeakerFactory';
import ParticipantFactory from './factories/ParticipantFactory';
import PartnerFactory from './factories/PartnerFactory';
import RoleFactory from './factories/RoleFactory';
import SubscribeActivityFactory from './factories/SubscribeActivityFactory';
import LocalAuthenticatorFactory from './factories/LocalAuthenticatorFactory';
import TicketFactory from './factories/TicketFactory';

const dotEnvPath = path.join(__dirname, '../../.env');
dotenv.config({ path: dotEnvPath });
const readlineInterface = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

const yesOrNo = async (question: string): Promise<boolean> => {
  const answer = await readlineInterface.question(question);
  return ['y', 'yes'].includes(answer.toLowerCase());
};

readlineInterface.write('Connecting to database...\n');

initializeDataSource().then(async (dataSource) => {
  await dataSource.dropDatabase();
  readlineInterface.write('Database dropped.\n');
  await dataSource.synchronize();
  readlineInterface.write('New models created inside database.\n');

  const activityFactory = new ActivityFactory(dataSource);
  const participantFactory = new ParticipantFactory(dataSource);
  const partnerFactory = new PartnerFactory(dataSource);
  const programPartFactory = new ProgramPartFactory(dataSource);
  const roleFactory = new RoleFactory(dataSource);
  const speakerFactory = new SpeakerFactory(dataSource);
  const subscribeActivityFactory = new SubscribeActivityFactory(dataSource);
  const userFactory = new UserFactory(dataSource);
  const localAuthFactory = new LocalAuthenticatorFactory(dataSource);
  const ticketFactory = new TicketFactory(dataSource);

  const [adminRole, volunteerRole, partnerRole] = await roleFactory.createFrontEndRoles();

  if (await yesOrNo('Do you want to add sample data to the database? (y/n) ')) {
    readlineInterface.write('Adding sample data to the database...\n');
    const users = await userFactory.createMultiple(15);
    await partnerFactory.createMultiple(1, 3, 5, 8);
    await participantFactory.createMultiple(users, 10);
    const programParts = await programPartFactory.createMultiple(3);
    const speakers = await speakerFactory.createMultiple(3);
    const activities = await activityFactory.createMultiple(programParts, speakers, 20, true);
    await subscribeActivityFactory.createMultiple(activities, 10);
    await localAuthFactory.createMultiple(10);
    await ticketFactory.createMultiple(10);
  } else {
    readlineInterface.write('No sample data added to the database.\n');
  }

  if (await yesOrNo('Do you want to add a super admin user? (y/n) ')) {
    const email = await readlineInterface.question('Enter the email for the super admin user: ');
    const password = await readlineInterface.question('Enter the password for the super admin user: ');
    readlineInterface.write('Creating super admin user...\n');

    await localAuthFactory.addAdmin(email, password, [adminRole, volunteerRole]);
  } else {
    readlineInterface.write('No super admin user created.\n');
  }

  readlineInterface.close();
});
