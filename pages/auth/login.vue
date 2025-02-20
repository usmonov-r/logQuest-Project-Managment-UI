
<script setup lang="ts">
import { useAuthStore } from '~/stores/authStory';
import { onMounted, ref, onUnmounted } from 'vue';
import {useRouter} from 'vue-router'

const userAuth = useAuthStore()
const router = useRouter();

definePageMeta({
    middleware: 'auth',
});


const email = ref('');
const password = ref('');

const saveCredentials = async () => {
    await userAuth.loginUser({
        email: email.value,
        password: password.value
    });
}
// Reset error message when component unmounts
onUnmounted(() => {
    userAuth.errorMessage = { key: '', detail: '' };
});

</script>

<template>
   <div class="min-h-screen bg-gray-50 flex items-center justify-center p-4">
    <div class="w-full max-w-md">
        <!-- Logo -->
        <div class="text-center mb-8">
          
            <h1 class="text-2xl font-bold text-gray-900">Welcome back</h1>
            <p class="text-gray-600 mt-2">Sign in to continue to tract your projects</p>
        </div>

        <!-- Login Form -->
        <div class="form-container bg-white rounded-2xl shadow-sm p-8">
        <!-- Error Message -->
            <transition name="fade">
                <div v-if="userAuth.errorMessage.key === 'login'" 
                    class="mb-4 p-4 bg-red-50 border border-red-200 text-red-600 rounded-xl text-sm flex items-center">
                    <i class="fas fa-exclamation-circle mr-2"></i>
                    {{ userAuth.errorMessage.detail }}
                </div>
            </transition>
            <form @submit.prevent="saveCredentials" class="space-y-6">
                <div class="input-group">
                    <input  v-model="email" type="email" id="email" class="w-full px-4 py-3 rounded-xl" placeholder=" ">
                    <label for="email" class="floating-label">Email address</label>
                </div>

                <div class="input-group">
                    <input v-model="password" type="password" id="password" class="w-full px-4 py-3 rounded-xl" placeholder=" ">
                    <label for="password" class="floating-label">Password</label>
                </div>

                <div class="flex items-center justify-between text-sm">
                    <label class="flex items-center space-x-2 cursor-pointer">
                        <input type="checkbox" class="w-4 h-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500">
                        <span class="text-gray-600">Remember me</span>
                    </label>
                    <a href="#" class="text-indigo-600 hover:text-indigo-700 font-medium">Forgot password?</a>
                </div>

                <button type="submit" class="w-full gradient-bg text-white py-3 rounded-xl font-medium hover:opacity-90 transition-opacity">
                    Sign in
                </button>
            </form>



            <div class="mt-6 text-center">
                <span class="text-gray-600">Don't have an account?</span>
                <NuxtLink to="signup" class="text-indigo-600 hover:text-indigo-700 font-medium ml-1">Sign up</NuxtLink>
            </div>

            <div class="relative my-6">
                <div class="absolute inset-0 flex items-center">
                    <div class="w-full border-t border-gray-200"></div>
                </div>
                <div class="relative flex justify-center text-sm">
                    <span class="px-4 bg-white text-gray-500">Or continue with</span>
                </div>
            </div>

            <div class="grid grid-cols-2 gap-4">
                <button class="flex items-center justify-center px-4 py-3 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors">
                    <i class="fab fa-google text-gray-600 mr-2"></i>
                    <span class="text-gray-600 font-medium">Google</span>
                </button>
                <button class="flex items-center justify-center px-4 py-3 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors">
                    <i class="fab fa-github text-gray-600 mr-2"></i>
                    <span class="text-gray-600 font-medium">GitHub</span>
                </button>
            </div>
        </div>
    </div>
</div>

<!-- https://media.istockphoto.com/id/1388913352/ko/%EC%82%AC%EC%A7%84/%EC%82%AC%EB%9E%91%EC%8A%A4%EB%9F%AC%EC%9A%B4-%EC%82%AC%EC%97%85%EA%B0%80-%EC%98%A8%EB%9D%BC%EC%9D%B8-%ED%9A%8C%EC%9D%98%EC%97%90-%EC%B0%B8%EC%84%9D-%EB%AC%BC%EA%B1%B4%EC%9D%84-%EC%A0%81%EC%96%B4-%EB%91%A1%EB%8B%88%EB%8B%A4.jpg?s=1024x1024&w=is&k=20&c=g8AhlqAFVFfeu90GEH5ZLlaSEGSWK2zEjmxzWkQCceM= -->
</template>

<style>
.gradient-bg {
    background: linear-gradient(135deg, #6366F1, #A855F7);
}
.form-container {
    animation: slideUp 0.6s ease-out;
}
@keyframes slideUp {
    from {
        opacity: 0;
        transform: translateY(20px);
    }
    to {
        opacity: 1;
        transform: translateY(0);
    }
}
.input-group {
    position: relative;
    transition: all 0.3s ease;
}
.input-group input {
    background: transparent;
    border: 2px solid #e5e7eb;
    transition: all 0.3s ease;
}
.input-group input:focus {
    border-color: #6366F1;
    box-shadow: 0 0 0 4px rgba(99, 102, 241, 0.1);
}
.floating-label {
    position: absolute;
    left: 16px;
    top: 50%;
    transform: translateY(-50%);
    background: white;
    padding: 0 4px;
    color: #6B7280;
    transition: all 0.3s ease;
    pointer-events: none;
}
.input-group input:focus + .floating-label,
.input-group input:not(:placeholder-shown) + .floating-label {
    top: 0;
    font-size: 0.875rem;
    color: #6366F1;
}

/* Error message animation */
.fade-enter-active,
.fade-leave-active {
    transition: all 0.3s ease;
}
.fade-enter-from,
.fade-leave-to {
    opacity: 0;
    transform: translateY(-10px);
}
</style>