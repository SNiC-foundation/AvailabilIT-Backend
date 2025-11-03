import dotenv from 'dotenv';
import * as Sentry from '@sentry/node';
import { nodeProfilingIntegration } from '@sentry/profiling-node';

import createApp from './app';

dotenv.config();

Sentry.init({
  enabled: process.env.NODE_ENV === 'production',
  release: process.env.VERSION,
  dsn: process.env.SENTRY_DSN,
  integrations: [
    nodeProfilingIntegration(),
  ],
  tracesSampleRate: 1.0,
  profilesSampleRate: 1.0,
});

createApp();
