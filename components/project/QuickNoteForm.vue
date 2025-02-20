<template>
    <form @submit.prevent="handleSubmit" class="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6">
        <div class="space-y-4">
            <!-- Title Input -->
            <div>
                <label for="title" class="block text-sm font-medium text-gray-700 dark:text-gray-300">Title</label>
                <input
                    type="text"
                    id="title"
                    v-model="noteData.title"
                    class="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-gray-700 dark:text-white sm:text-xl p-4"
                    placeholder="Note title"
                    required
                />
            </div>

            <!-- Rich Text Editor -->
            <div>
                <label class="block text-md font-medium text-gray-700 dark:text-gray-300 mb-2">Content</label>
                <RichTextEditor
                    v-model="noteData.content"
                    class="mt-1 text-xl"
                    placeholder="Write your note..."
                />
            </div>

            <!-- Work Time Input -->
            <div class="mb-4">
                <label class="block text-md font-medium text-gray-700 dark:text-gray-300 mb-2">Time Spent</label>
                <div class="flex space-x-4 items-center">
                    <div class="flex-1">
                        <label class="block text-sm text-gray-600 dark:text-gray-400 mb-1">Hours</label>
                        <input
                            type="number"
                            v-model="noteData.hours"
                            min="0"
                            class="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white text-xl"
                            placeholder="0"
                        >
                    </div>
                    <div class="flex-1">
                        <label class="block text-sm text-gray-600 dark:text-gray-400 mb-1">Minutes</label>
                        <input
                            type="number"
                            v-model="noteData.minutes"
                            min="0"
                            max="59"
                            class="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white text-xl"
                            placeholder="0"
                        >
                    </div>
                    <div class="flex-1 pt-6">
                        <div class="text-sm text-gray-600 dark:text-gray-400">
                            Total: {{ formatTimeSpent(calculateTotalHours) }}
                        </div>
                    </div>
                </div>
            </div>

            <!-- Submit Button -->
            <div class="flex justify-end">
                <button
                    type="submit"
                    :disabled="isSubmitting"
                    class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    <span v-if="isSubmitting">
                        <i class="fas fa-spinner fa-spin mr-2"></i>
                        Saving...
                    </span>
                    <span v-else>
                        <i class="fas fa-plus mr-2"></i>
                        Add Note
                    </span>
                </button>
            </div>
        </div>
    </form>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import RichTextEditor from '~/components/editor/RichTextEditor.vue'

const props = defineProps<{
    isSubmitting: boolean
}>()

const emit = defineEmits<{
    (e: 'submit', data: { title: string, content: string, workTime: string }): void
}>()

const noteData = ref({
    title: '',
    content: '',
    hours: 0,
    minutes: 0
})

const calculateTotalHours = computed(() => {
    return Number(noteData.value.hours) + (Number(noteData.value.minutes) / 60)
})

const formatTimeSpent = (totalHours: number) => {
    const wholeHours = Math.floor(totalHours)
    const decimalMinutes = (totalHours - wholeHours) * 60
    const roundedMinutes = Math.round(decimalMinutes)
    
    if (wholeHours === 0) {
        return `${roundedMinutes}m`
    } else if (roundedMinutes === 0) {
        return `${wholeHours}h`
    } else {
        return `${wholeHours}h ${roundedMinutes}m`
    }
}

const handleSubmit = () => {
    emit('submit', {
        title: noteData.value.title,
        content: noteData.value.content,
        workTime: String(calculateTotalHours.value)
    })
    
    // Reset form after submission
    noteData.value = {
        title: '',
        content: '',
        hours: 0,
        minutes: 0
    }
}
</script>
