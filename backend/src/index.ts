import dotenv from 'dotenv';
import * as Sentry from '@sentry/node';
import { nodeProfilingIntegration } from '@sentry/profiling-node';

import createApp from './app';

dotenv.config();

Sentry.init({
  enabled: process.env.NODE_ENV === 'production',
  release: process.env.VERSION,
  dsn: 'https://b763eb8c0abbd42bd71b0aa4d058ebe0@o56951.ingest.us.sentry.io/4507942790234112',
  integrations: [
    nodeProfilingIntegration(),
  ],
  tracesSampleRate: 1.0,
  profilesSampleRate: 1.0,
});

createApp();
