export async function handle({ request, resolve }) {
    const response = await resolve(request);

    // If the user is trying to access the root path, redirect them to /home
    if (request.path === '/') {
        return { ...response, status: 302, redirect: '/home' };
    }

    // Otherwise, return the original response
    return response;
}