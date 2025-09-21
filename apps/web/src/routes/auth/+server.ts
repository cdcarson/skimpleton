import * as arctic from 'arctic';
import type { RequestEvent } from './$types';
import { resolve } from '$app/paths';
import { GITHUB_CLIENT_ID, GITHUB_CLIENT_SECRET } from '$env/static/private';
import { redirect } from '@sveltejs/kit';

export const POST = async (event: RequestEvent) => {
  const state = arctic.generateState();
  const redirectURI = 'https://skimpleton-web.vercel.app/auth/github'
  const github = new arctic.GitHub(
    GITHUB_CLIENT_ID,
    GITHUB_CLIENT_SECRET,
    redirectURI
  );
  event.cookies.set('state', state, {
    secure: true,
    path: '/',
    httpOnly: true,
    sameSite: 'lax',
    maxAge: 60 * 10 // 10 min
  });
  throw redirect(302, github.createAuthorizationURL(state, ['read:user']));
};
