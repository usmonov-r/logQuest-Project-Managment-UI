<script setup lang="ts">
import { library } from '@fortawesome/fontawesome-svg-core'
import { faChartLine, faClipboardCheck, faClock, faGear, faTasks, faUsers } from '@fortawesome/free-solid-svg-icons'
import { useProjectStore } from '~/stores/projectStory';
import { onMounted } from 'vue';

definePageMeta({
  middleware: 'auth',
  layout: 'default'
});

const useProjects = useProjectStore();
onMounted(() =>{
    useProjects.fetchProjects();
})

console.log(useProjects.isEmptyPro)
// Add icons to the library
library.add(faTasks, faChartLine, faClipboardCheck, faClock, faGear, faUsers)
</script>

<template>
<div class="bg-gray-50">
    <!-- Hero Section -->
    <div class="pt-32 pb-20 overflow-hidden">
        <div class="max-w-5xl mx-auto px-4">
            <div class="relative">
                <!-- Background Decorations -->
                <div class="absolute top-0 right-0 -z-10 w-72 h-72 bg-purple-200 rounded-full blur-3xl opacity-30"></div>
                <div class="absolute bottom-0 left-0 -z-10 w-72 h-72 bg-indigo-200 rounded-full blur-3xl opacity-30"></div>
                
                <div class="text-center max-w-3xl mx-auto">
                    <h1 class="text-5xl font-bold mb-6 gradient-text">
                        Simplify Your Project Management
                    </h1>
                    <p class="text-xl text-gray-600 mb-10">
                        Clean, intuitive, and efficient project tracking for modern teams.
                    </p>
                        <NuxtLink to="project/dashboard" class="inline-block bg-black text-white font-medium px-8 py-3 rounded-lg hover:bg-gray-800 transition duration-300">
                            Start Tracking
                        </NuxtLink>
                </div>

                <!-- Floating Elements -->
                <div class="mt-16 grid grid-cols-3 gap-8">
                    <div class="floating animation-delay-100">
                        <div class="bg-white p-6 rounded-xl shadow-lg">
                            <div class="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center mb-4">
                                <FontAwesomeIcon icon="clock" class="text-indigo-600 text-xl" />
                            </div>
                            <h3 class="text-lg font-semibold mb-2">Time Tracking</h3>
                            <p class="text-gray-600">Monitor project timelines and team productivity effortlessly.</p>
                        </div>
                    </div>
                    <div class="floating animation-delay-200">
                        <div class="bg-white p-6 rounded-xl shadow-lg">
                            <div class="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
                                <FontAwesomeIcon icon="users" class="text-purple-600 text-xl" />
                            </div>
                            <h3 class="text-lg font-semibold mb-2">Team Collaboration</h3>
                            <p class="text-gray-600">Work together seamlessly with your team members.</p>
                        </div>
                    </div>
                    <div class="floating animation-delay-300">
                        <div class="bg-white p-6 rounded-xl shadow-lg">
                            <div class="w-12 h-12 bg-pink-100 rounded-lg flex items-center justify-center mb-4">
                                <FontAwesomeIcon icon="gear" class="text-pink-600 text-xl" />
                            </div>
                            <h3 class="text-lg font-semibold mb-2">Customization</h3>
                            <p class="text-gray-600">Tailor the platform to match your workflow perfectly.</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>



    <!-- Footer -->
    <footer class="py-8 border-t border-gray-200">
        <div class="max-w-5xl mx-auto px-4">
            <div class="flex justify-between items-center">
                <div class="flex items-center space-x-2">
                    <div class="w-6 h-6 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center">
                        <FontAwesomeIcon icon="tasks" class="text-white text-xs" />
                    </div>
                    <span class="text-sm font-medium gradient-text">logQuest</span>
                </div>
                <div class="text-sm text-gray-500">
                    &copy; 2023 logQuest. All rights reserved.
                </div>
            </div>
        </div>
    </footer>
</div>
</template>

<style>
.gradient-text {
    background: linear-gradient(to right, #6366f1, #a855f7);
    background-clip: text; /* Standard property */
    -webkit-background-clip: text; /* Webkit-specific property */
    -webkit-text-fill-color: transparent;
}
.floating {
    animation: float 4s ease-in-out infinite;
}
@keyframes float {
    0% { transform: translateY(0px); }
    50% { transform: translateY(-20px); }
    100% { transform: translateY(0px); }
}
.feature-card {
    background: rgba(255, 255, 255, 0.8);
    backdrop-filter: blur(10px);
    border: 1px solid rgba(255, 255, 255, 0.3);
}
</style>