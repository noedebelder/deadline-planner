import { redirect } from '@sveltejs/kit';

export async function GET({ cookies }) {
  cookies.delete('userId', { path: '/' });
  cookies.delete('userId', { path: '' });
  cookies.delete('session', { path: '/' });
  throw redirect(303, '/login');
}
