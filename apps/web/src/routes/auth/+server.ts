import * as arctic from 'arctic';
import type { RequestEvent } from './$types';
import { resolve } from '$app/paths';
import { GITHUB_CLIENT_ID, GITHUB_CLIENT_SECRET } from '$env/static/private';
import { redirect } from '@sveltejs/kit';

export const POST = async (event: RequestEvent) => {
  const state = arctic.generateState();
  const redirectURI = new URL(resolve('/auth/github'), event.url.origin)
  const github = new arctic.GitHub(
    GITHUB_CLIENT_ID,
    GITHUB_CLIENT_SECRET,
    redirectURI.href
  );
  event.cookies.set('state', state, {
    secure: true,
    path: '/',
    httpOnly: true,
    maxAge: 60 * 10 // 10 min
  });
  throw redirect(302, github.createAuthorizationURL(state, ['read:user']));
};
