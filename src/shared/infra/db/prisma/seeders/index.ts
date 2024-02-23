import 'dotenv/config';
import { appConfig } from '../../../../config/app';
import { exampleSeeder } from './example';

const seed = async () => {
  await Promise.all([exampleSeeder()]);
};

if (appConfig.NODE_ENV !== 'production') {
  seed();
}
