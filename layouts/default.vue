<script setup lang="ts">
import { useAuthStore } from '~/stores/authStory';
import Cookies from 'universal-cookie';
import { ref, inject } from 'vue';

const cookie = new Cookies();
const token = cookie.get('token');
const auth = useAuthStore();
const showLogoutConfirm = ref(false);

// Get isDark from parent
const isDark = inject('isDark');

const handleLogoutClick = () => {
    showLogoutConfirm.value = true;
};

const confirmLogout = () => {
    auth.logOut();
    showLogoutConfirm.value = false;
};

const cancelLogout = () => {
    showLogoutConfirm.value = false;
};
</script>

<template>
<div class="min-h-screen bg-white dark:bg-gray-900 transition-colors duration-200">
    <!-- Navigation -->
    <nav class="bg-white/80 dark:bg-gray-800/80 backdrop-blur-md shadow-sm sticky top-0 z-50">
        <div class="max-w-7xl mx-auto px-4">
            <div class="flex justify-between items-center h-16">
                <!-- Logo and Brand -->
                <div class="flex items-center space-x-2">
                    <NuxtLink to="/" class="flex items-center space-x-2">
                        <span class="text-xl font-bold gradient-text dark:from-indigo-400 dark:to-purple-400">LogQuest</span>
                    </NuxtLink>
                </div>

                <!-- Navigation Links -->
                <div class="hidden md:flex items-center space-x-6">
                    <NuxtLink 
                        to="/project/dashboard" 
                        class="text-gray-600 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors duration-200 flex items-center space-x-1"
                        active-class="text-indigo-600 dark:text-indigo-400"
                    >
                        <i class="fas fa-th-large"></i>
                        <span>Dashboard</span>
                    </NuxtLink>
                </div>

                <!-- Right Side Actions -->
                <div class="flex items-center space-x-4">
                    <!-- Dark Mode Toggle Switch -->
                    <div class="flex items-center gap-2" >
                       
                        <div @click="isDark = !isDark" class="relative inline-flex h-6 w-11 items-center rounded-full bg-gray-200 dark:bg-gray-700 transition-colors duration-300 hover:cursor-pointer">
                            <button 
                                
                                class="inline-flex h-5 w-5 transform items-center justify-center rounded-full bg-white shadow-md ring-0 transition-transform duration-300"
                                :class="isDark ? 'translate-x-6' : 'translate-x-1'"
                            >
                                <i 
                                    class="fas text-xs"
                                    :class="isDark ? 'fa-sun text-yellow-500' : 'fa-moon text-gray-400'"
                                ></i>
                            </button>
                        </div>
                        <span class="text-sm font-medium text-gray-700 dark:text-gray-300">
                            {{ isDark ? 'Dark' : 'Light' }}
                        </span>
                    </div>

                    <!-- User Menu with Logout -->
                    <div class="flex items-center space-x-3">
                        <div class="h-8 w-8 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
                            <span class="text-white font-medium">U</span>
                        </div>
                        <div v-if="token">
                            <button @click="handleLogoutClick" class="text-gray-600 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 font-medium transition-colors duration-200 bg-transparent">
                                Logout
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </nav>

    <!-- Page Content -->
    <main class="max-w-7xl mx-auto px-4 py-6 text-gray-900 dark:text-gray-100">
        <slot />
    </main>

    <!-- Logout Confirmation Dialog -->
    <div v-if="showLogoutConfirm" class="fixed inset-0 bg-black/50 dark:bg-black/70 flex items-center justify-center z-50">
        <div class="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-sm mx-4">
            <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">Confirm Logout</h3>
            <p class="text-gray-600 dark:text-gray-300 mb-6">Are you sure you want to log out?</p>
            <div class="flex justify-end space-x-3">
                <button 
                    @click="cancelLogout"
                    class="px-4 py-2 text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-white font-medium transition-colors duration-200"
                >
                    Cancel
                </button>
                <button 
                    @click="confirmLogout"
                    class="px-4 py-2 bg-indigo-600 dark:bg-indigo-500 text-white rounded hover:bg-indigo-700 dark:hover:bg-indigo-600 transition-colors duration-200"
                >
                    Logout
                </button>
            </div>
        </div>
    </div>
</div>
</template>

<style>
/* Global dark mode styles */
html.dark {
    color-scheme: dark;
}

body {
    @apply transition-colors duration-200;
}
</style>

<style scoped>
.gradient-text {
    @apply bg-gradient-to-r from-indigo-500 to-purple-600 dark:from-indigo-400 dark:to-purple-400;
    -webkit-background-clip: text;
    background-clip: text;
    -webkit-text-fill-color: transparent;
}

/* Active link styles */
.router-link-active {
    @apply text-indigo-600 dark:text-indigo-400 font-medium;
}

/* Transition for hover effects */
.transition-all {
    transition-property: all;
    transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
    transition-duration: 300ms;
}
</style>