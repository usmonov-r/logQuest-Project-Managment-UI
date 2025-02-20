import Cookies from "universal-cookie";

export default defineNuxtRouteMiddleware((to, from) => {
    const cookie = new Cookies();
    
    // Check if we're on the client side
    if (typeof window !== 'undefined') {
        const token = cookie.get('token');
        const isAuthRoute = to.path.startsWith('/auth');
        
        // Save the intended destination for non-auth routes
        if (!isAuthRoute) {
            cookie.set('routePath', to.fullPath, {
                path: '/',
                secure: true,
                sameSite: 'strict'
            });
        }

        // If no token and trying to access protected route
        if (!token && !isAuthRoute) {
            console.log('Unauthorized access attempt, redirecting to login');
            return navigateTo('/auth/login');
        }

        // If has token and trying to access auth routes
        if (token && isAuthRoute) {
            const savedPath = cookie.get('routePath') || '/project/dashboard';
            cookie.remove('routePath');
            return navigateTo(savedPath);
        }
    }
})