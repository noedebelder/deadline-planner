export async function load({ locals }) {
  return {
    user: locals.user ? {
      id: locals.user._id.toString(),
      username: locals.user.username,
      role: locals.user.role
    } : null
  };
}