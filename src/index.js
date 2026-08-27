import { onRequest } from '../functions/api/quote.js';

export default {
  async fetch(request, env, context) {
    const url = new URL(request.url);

    if (url.pathname === '/api/quote') {
      return onRequest({ request, env, ctx: context });
    }

    return env.ASSETS.fetch(request);
  }
};