<template>
    <div class="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 sticky top-24 h-fit">
        <!-- Project Header -->
        <div class="mb-6">
            <h1 class="text-2xl font-bold text-gray-900 dark:text-gray-100">{{ project.title }}</h1>
            <div class="flex items-center space-x-2 mt-2">
                <span class="px-3 py-1 bg-green-100 dark:bg-green-900 text-green-600 dark:text-green-300 rounded-full text-sm font-medium capitalize">{{ project.status }}</span>
                <span class="text-gray-500 dark:text-gray-400">•</span>
                <span class="text-gray-600 dark:text-gray-300">Deadline {{ project.deadline }}</span>
            </div>
        </div>

        <!-- Project Stats -->
        <div class="bg-gray-50 dark:bg-gray-700 rounded-xl p-6 mb-4">
            <div class="grid grid-cols-2 gap-6">
                <div class="flex flex-col">
                    <span class="text-sm text-gray-500 dark:text-gray-400">Total Time Spent</span>
                    <span class="text-2xl font-bold text-gray-900 dark:text-gray-100">{{ formatTotalTime(totalTime) }}</span>
                </div>
                <div class="flex flex-col">
                    <span class="text-sm text-gray-500 dark:text-gray-400">Notes Count</span>
                    <span class="text-2xl font-bold text-gray-900 dark:text-gray-100">{{ notesCount }}</span>
                </div>
            </div>
        </div>

        <!-- Project Description -->
        <div class="mb-6">
            <h3 class="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Description</h3>
            <p class="text-gray-600 dark:text-gray-400 text-sm">{{ project.description }}</p>
        </div>

        <!-- Project Actions -->
        <div class="flex flex-col space-y-2">
            <button 
                @click="$emit('edit')" 
                class="w-full bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 py-2 px-4 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition duration-300 flex items-center justify-center space-x-2"
            >
                <i class="fas fa-edit"></i>
                <span>Edit Project</span>
            </button>
            <button 
                @click="$emit('delete')" 
                class="w-full bg-red-100 dark:bg-red-900/50 text-red-600 dark:text-red-300 py-2 px-4 rounded-lg hover:bg-red-200 dark:hover:bg-red-900 transition duration-300 flex items-center justify-center space-x-2"
            >
                <i class="fas fa-trash"></i>
                <span>Delete Project</span>
            </button>
        </div>
    </div>
</template>

<script setup lang="ts">
const props = defineProps<{
    project: {
        title: string;
        status: string;
        deadline: string;
        description: string;
    };
    totalTime: number;
    notesCount: number;
}>();

const emit = defineEmits<{
    (e: 'edit'): void;
    (e: 'delete'): void;
}>();

const formatTotalTime = (totalHours: number) => {
    if (!totalHours || isNaN(totalHours)) return '0h';
    
    const wholeHours = Math.floor(totalHours);
    const decimalMinutes = (totalHours - wholeHours) * 60;
    const roundedMinutes = Math.round(decimalMinutes);
    
    if (wholeHours === 0) {
        return `${roundedMinutes}m`;
    } else if (roundedMinutes === 0) {
        return `${wholeHours}h`;
    } else {
        return `${wholeHours}h ${roundedMinutes}m`;
    }
};
</script>
