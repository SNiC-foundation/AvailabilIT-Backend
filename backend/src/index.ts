import dotenv from 'dotenv';
import * as Sentry from '@sentry/node';

import createApp from './app';

dotenv.config();

Sentry.init({
  enabled: process.env.NODE_ENV === 'production',
  release: process.env.VERSION,
  dsn: process.env.SENTRY_DSN,
  integrations: [],
  tracesSampleRate: 0,
  profilesSampleRate: 0,
  sendDefaultPii: true,
});

createApp();
