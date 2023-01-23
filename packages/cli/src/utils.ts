import dotenv from 'dotenv';
import { resolve } from 'path';
import { REPO_ROOT_DIR } from './const';

export const loadEnvironmentVariables = () => {
  dotenv.config({ path: resolve(REPO_ROOT_DIR, '.env') });
  dotenv.config({ path: resolve(REPO_ROOT_DIR, '.env.local') });
};
