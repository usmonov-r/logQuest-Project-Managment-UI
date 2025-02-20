import {defineStore} from 'pinia';
import Cookies from 'universal-cookie';

const cookies = new Cookies();

export const useAuthStore = defineStore('usersAuth', {
    state: () => ({
        email: '',
        errorMessage: {key:'', detail:''},
    }),

    actions: {

        async getUsername(){
          
        },

        async loginUser({ email, password }: { email: string, password: string }){
            try{
                const response = await fetch('http://localhost:2123/api/users/auth', {
                    method: 'Post',
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ email, password })
                });

                const data = await response.json();
                
                if (!response.ok) {
                    this.errorMessage = { 
                        key: 'login', 
                        detail: data.message || 'Invalid email or password. Please try again.' 
                    };
                    return;
                }

                const token = data.token;
                const cookie = new Cookies();
                
                cookie.set('token', token, {
                    path: '/',
                    secure: true,
                    sameSite: 'strict',
                    maxAge: 3600,
                });

                this.email = email;
                this.errorMessage = { key: '', detail: '' };

                const savedPath = cookie.get('routePath') || '/project/dashboard';
                cookie.remove('routePath');
                
                navigateTo(savedPath);
                
            } catch (error: any) {
                this.errorMessage = { 
                    key: 'login', 
                    detail: 'An error occurred while trying to log in. Please try again.' 
                };
                console.error('Login error:', error);
            }
        },

        async signupUser({ email, password, username }: { email: string, password: string, username: string }){
            try{
                const response = await fetch("http://localhost:2123/api/users/my-user", {
                    method: 'POST',
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        username,
                        email,
                        password
                    })
                });

                if (!response.ok) {
                    const errorData = await response.json();
                    this.errorMessage = {
                        key: 'signup',
                        detail: errorData.detail || 'Failed to create account. Please try again.'
                    };
                    return false;
                }
                
                const data = await response.json();
                
                // Clear error message on success
                this.errorMessage = { key: '', detail: '' };
                
                this.email = email;
                
                navigateTo('/auth/login');
                
                return true;
            } catch (error) {
                console.error('Error during signup:', error);
                this.errorMessage = {
                    key: 'signup',
                    detail: 'An error occurred while creating your account. Please try again.'
                };
                return false;
            }
        },

        logOut() {
            try {
                cookies.remove('token', {
                    path: '/',
                    secure: true,
                    sameSite: 'strict'
                });

                this.email = '';
                this.errorMessage = { key: '', detail: '' };
                
                navigateTo('/auth/login');
            } catch (error) {
                console.error('Error during logout:', error);
            }
        },

        redirectUser(to:any, from:any){ 
            const token = cookies.get('token')
            if(token && (to.fullPath === '/signup' || to.fullPath === '/login')){
              console.log("REDIRECT TO /")
              window.location.href = '/'
          }}

    }
})