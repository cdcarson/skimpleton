import type { RequestEvent } from './$types';
import * as arctic from 'arctic';
import { GITHUB_CLIENT_ID, GITHUB_CLIENT_SECRET } from '$env/static/private';
import { error } from 'console';
import { resolve } from '$app/paths';
import { redirect } from '@sveltejs/kit';
export const GET = async (event: RequestEvent) => {
  const code = event.url.searchParams.get('code');
  const state = event.url.searchParams.get('state');

  const storedState = event.cookies.get('state');

  if (code === null || storedState === null || state !== storedState) {
    // 400
    throw error(400, 'Invalid request');
  }

  const redirectURI = 'https://skimpleton-web.vercel.app/auth/github';
  const github = new arctic.GitHub(
    GITHUB_CLIENT_ID,
    GITHUB_CLIENT_SECRET,
    redirectURI
  );

  let tokens: arctic.OAuth2Tokens | undefined = undefined;
  try {
    tokens = await github.validateAuthorizationCode(code);
  } catch (e) {
    if (e instanceof arctic.OAuth2RequestError) {
      // Invalid authorization code, credentials, or redirect URI
      throw error(
        400,
        'Invalid authorization code, credentials, or redirect URI'
      );
      // ...
    }
    if (e instanceof arctic.ArcticFetchError) {
      // Failed to call `fetch()`
      throw error(500, 'Failed to call `fetch()`');
    }
  }
  if (!tokens) {
    throw error(500, 'Failed to validate authorization code');
  }

  const accessToken = tokens.accessToken();

  const response = await fetch('https://api.github.com/user', {
    headers: {
      Authorization: `Bearer ${accessToken}`
    }
  });
  if (!response.ok) {
    throw error(500, 'Failed to fetch user');
  }
  const user = await response.json();
  console.log(user);
  throw redirect(302, '/');
};
