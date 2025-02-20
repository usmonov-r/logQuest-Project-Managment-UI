<script setup lang="ts">
import { ref, onMounted } from 'vue'
import flatpickr from 'flatpickr'
import 'flatpickr/dist/flatpickr.css'
import { useProjectStore } from '~/stores/projectStory';
// import { navigateTo } from 'vite-plugin-ssr/client/router';

// Define reactive references
const description = ref<HTMLTextAreaElement | null>(null)
const charCount = ref<number>(0)
const selectedPriority = ref<string>('low')
const title = ref('');
const setDescription = ref('');
const deadline = ref('');
const status = ref('');

console.log(status.value)
const setProject = useProjectStore();

const saveProject = async () =>{
    try {
        await setProject.createProject({
            title: title.value,
            description: setDescription.value,
            deadline: deadline.value,
            status: status.value
        })
        navigateTo("/project/dashboard")
    } catch (error) {
        console.error('Error creating project:', error)
    }
}


// Set middleware auth 
definePageMeta({
    middleware: 'auth',
})

// Initialize flatpickr
onMounted(() => {
    const deadlineInput = document.querySelector('#deadline')
    if (deadlineInput) {
        flatpickr(deadlineInput, {
            minDate: 'today',
            dateFormat: 'Y-m-d',
            altInput: true,
            altFormat: 'F j, Y',
            animate: true
        })
    }
})

// Character counter for description
const handleDescriptionInput = (event: Event) => {
    const target = event.target as HTMLTextAreaElement
    const count = target.value.length
    charCount.value = count
    
    if (count > 200) {
        target.value = target.value.substring(0, 200)
        charCount.value = 200
    }
}

// Priority button selection
// const handlePriorityClick = (priority: string, event: Event) => {
//     const buttons = document.querySelectorAll('[data-priority]')
//     buttons.forEach(btn => {
//         btn.classList.remove('border-indigo-500', 'text-indigo-600')
//     })
//     const button = event.currentTarget as HTMLElement
//     button.classList.add('border-indigo-500', 'text-indigo-600')
//     selectedPriority.value = priority
// }

// Status radio button animation
const handleStatusChange = (event: Event) => {
    const radio = event.target as HTMLInputElement
    status.value = radio.value // Update the status value directly
    
    // Update all radio dots
    const allDots = document.querySelectorAll('.radio-dot') as NodeListOf<HTMLElement>
    allDots.forEach(dot => {
        const input = dot.parentElement?.querySelector('input') as HTMLInputElement
        if (input && input.value === status.value) {
            dot.style.transform = 'scale(1)'
        } else {
            dot.style.transform = 'scale(0)'
        }
    })
}
</script>

<template>
<div class="bg-gray-50">
    <!-- Navigation -->


    <!-- Main Content -->
    <div class="max-w-3xl mx-auto px-4 py-8">
        <div class="mb-8 slide-in" style="animation-delay: 0.1s">
            <h1 class="text-2xl font-bold text-gray-900">Create New Project</h1>
            <p class="text-gray-600">Fill in the details below to create your new project</p>
        </div>

        <!-- Form Card -->
        <div class="bg-white rounded-xl shadow-sm p-6 form-card slide-in" style="animation-delay: 0.2s">
            <form @submit.prevent="saveProject" class="space-y-6">
                <!-- Title Input -->
                <div class="space-y-2">
                    <label for="title" class="block text-sm font-medium text-gray-700">Project Title</label>
                    <div class="input-focus-effect">
                        <input v-model="title" type="text" id="title" name="title" required
                            class="block w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
                            placeholder="Enter project title">
                    </div>
                </div>

                <!-- Description Input -->
                <div class="space-y-2">
                    <label for="description" class="block text-sm font-medium text-gray-700">Description</label>
                    <div class="input-focus-effect">
                        <textarea v-model="setDescription" id="description" name="description" rows="4" ref="description"
                            @input="handleDescriptionInput"
                            class="block w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all resize-none"
                            placeholder="Enter project description"></textarea>
                        <div class="mt-1 text-sm text-gray-500 flex justify-end">
                            <span>{{ charCount }}/200 characters</span>
                        </div>
                    </div>
                </div>
                {{ deadline }}
                <!-- Deadline Input -->
                <div class="space-y-2">
                    <label for="deadline" class="block text-sm font-medium text-gray-700">Deadline</label>
                    <div class="input-focus-effect relative">
                        <input v-model="deadline" type="text"   id="deadline" name="deadline" required
                            class="block w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
                            placeholder="Select deadline">
                        <div class="absolute right-3 top-2.5 text-gray-400">
                            <i class="fas fa-calendar"></i>
                        </div>
                    </div>
                </div>

                <!-- Priority Buttons -->
                <!-- <div class="space-y-2">
                    <label class="block text-sm font-medium text-gray-700">Priority</label>
                    <div class="flex space-x-4">
                        <button type="button" 
                            @click="handlePriorityClick('low', $event)"
                            class="px-4 py-2 rounded-lg border-2 border-gray-200 text-sm font-medium hover:border-indigo-500 hover:text-indigo-600 transition-all focus:outline-none focus:ring-2 focus:ring-indigo-500" 
                            data-priority="low">
                            Low
                        </button>
                        <button type="button"
                            @click="handlePriorityClick('medium', $event)"
                            class="px-4 py-2 rounded-lg border-2 border-gray-200 text-sm font-medium hover:border-indigo-500 hover:text-indigo-600 transition-all focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            data-priority="medium">
                            Medium
                        </button>
                        <button type="button"
                            @click="handlePriorityClick('high', $event)"
                            class="px-4 py-2 rounded-lg border-2 border-gray-200 text-sm font-medium hover:border-indigo-500 hover:text-indigo-600 transition-all focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            data-priority="high">
                            High
                        </button>
                    </div>
                </div> -->

                <!-- Status Radio Buttons -->
                <div class="space-y-2">
                    <label class="block text-sm font-medium text-gray-700">Status</label>
                    <div class="flex space-x-4">
                        <label class="inline-flex items-center">
                            <input v-model="status" type="radio" name="status" value="planning" @change="handleStatusChange" class="hidden">
                            <span class="w-4 h-4 border-2 rounded-full flex items-center justify-center" :class="{'border-indigo-500': status === 'planning', 'border-gray-300': status !== 'planning'}">
                                <span class="radio-dot w-2 h-2 bg-indigo-600 rounded-full absolute transform transition-transform" :style="{ transform: status === 'planning' ? 'scale(1)' : 'scale(0)' }"></span>
                            </span>
                            <span class="ml-2 text-sm text-gray-700">Planning</span>
                        </label>
                        <label class="inline-flex items-center">
                            <input v-model="status" type="radio" name="status" value="active" @change="handleStatusChange" class="hidden">
                            <span class="w-4 h-4 border-2 rounded-full flex items-center justify-center" :class="{'border-indigo-500': status === 'active', 'border-gray-300': status !== 'active'}">
                                <span class="radio-dot w-2 h-2 bg-indigo-600 rounded-full absolute transform transition-transform" :style="{ transform: status === 'active' ? 'scale(1)' : 'scale(0)' }"></span>
                            </span>
                            <span class="ml-2 text-sm text-gray-700">Active</span>
                        </label>
                        <label class="inline-flex items-center">
                            <input v-model="status" type="radio" name="status" value="onhold" @change="handleStatusChange" class="hidden">
                            <span class="w-4 h-4 border-2 rounded-full flex items-center justify-center" :class="{'border-indigo-500': status === 'onhold', 'border-gray-300': status !== 'onhold'}">
                                <span class="radio-dot w-2 h-2 bg-indigo-600 rounded-full absolute transform transition-transform" :style="{ transform: status === 'onhold' ? 'scale(1)' : 'scale(0)' }"></span>
                            </span>
                            <span class="ml-2 text-sm text-gray-700">On Hold</span>
                        </label>
                    </div>
                </div>

                <!-- Team Members -->
                <div class="space-y-2">
                    <label class="block text-sm font-medium text-gray-700">Team Members</label>
                    <div class="flex flex-wrap gap-2">
                        <div class="flex items-center space-x-2 px-3 py-1.5 bg-gray-100 rounded-full">
                            <img src="https://ui-avatars.com/api/?name=John+Doe&background=6366F1&color=fff" alt="John Doe" class="w-6 h-6 rounded-full">
                            <span class="text-sm text-gray-700">John Doe</span>
                            <button type="button" class="text-gray-400 hover:text-gray-600">
                                <i class="fas fa-times"></i>
                            </button>
                        </div>
                        <button type="button" class="px-3 py-1.5 bg-gray-100 rounded-full text-sm text-gray-600 hover:bg-gray-200 transition-colors">
                            <i class="fas fa-plus mr-1"></i>
                            Add Member
                        </button>
                    </div>
                </div>

                <!-- Submit Button -->
                <div class="pt-4">
                    <button type="submit" class="w-full bg-black text-white py-2 px-4 rounded-lg hover:bg-gray-800 transition duration-300 flex items-center justify-center space-x-2">
                        <i class="fas fa-plus"></i>
                        <span>Create Project</span>
                    </button>
                </div>
            </form>
        </div>
    </div>
</div>
</template>

<style scoped>
.gradient-text {
    background: linear-gradient(to right, #6366f1, #a855f7);
    background-clip: text; /* Standard property */
    -webkit-background-clip: text; /* Webkit-specific property */
    -webkit-text-fill-color: transparent;
}


.slide-in {
    animation: slideIn 0.5s ease-out forwards;
}

@keyframes slideIn {
    from {
        opacity: 0;
        transform: translateY(20px);
    }
    to {
        opacity: 1;
        transform: translateY(0);
    }
}

.form-card {
    transition: transform 0.3s ease;
}

.form-card:hover {
    transform: translateY(-2px);
}

.input-focus-effect input:focus,
.input-focus-effect textarea:focus {
    box-shadow: 0 0 0 2px rgba(99, 102, 241, 0.2);
}
</style>