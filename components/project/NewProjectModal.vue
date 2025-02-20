<template>
    <div v-if="modelValue" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div class="bg-white rounded-xl shadow-lg w-full max-w-3xl mx-4 max-h-[90vh] overflow-y-auto">
            <div class="p-6">
                <div class="flex justify-between items-center mb-6">
                    <h2 class="text-2xl font-bold text-gray-900">Create New Project</h2>
                    <button @click="$emit('update:modelValue', false)" class="text-gray-500 hover:text-gray-700">
                        <i class="fas fa-times text-xl"></i>
                    </button>
                </div>

                <form @submit.prevent="saveProject" class="space-y-6">
                    <!-- Title Input -->
                    <div class="space-y-2">
                        <label for="title" class="block text-sm font-medium text-gray-700">Project Title</label>
                        <input v-model="title" type="text" id="title" required
                            class="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                            placeholder="Enter project title">
                    </div>

                    <!-- Description Input -->
                    <div class="space-y-2">
                        <label for="description" class="block text-sm font-medium text-gray-700">Description</label>
                        <textarea v-model="description" id="description" required
                            @input="handleDescriptionInput"
                            class="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 h-32"
                            placeholder="Enter project description"></textarea>
                        <div class="text-sm text-gray-500 text-right">{{ description.length }}/200</div>
                    </div>

                    <!-- Deadline Input -->
                    <div class="space-y-2">
                        <label for="deadline" class="block text-sm font-medium text-gray-700">Deadline</label>
                        <input v-model="deadline" type="text" id="deadline" required
                            class="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                            placeholder="Select deadline">
                    </div>

                    <!-- Status Selection -->
                    <div class="space-y-2">
                        <label class="block text-sm font-medium text-gray-700">Status</label>
                        <div class="grid grid-cols-3 gap-4">
                            <button type="button" 
                                @click="handleStatusChange('planning')"
                                :class="[
                                    'px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200',
                                    status === 'planning' 
                                        ? 'bg-yellow-100 text-yellow-600 border-2 border-yellow-200'
                                        : 'bg-gray-50 text-gray-600 hover:bg-gray-100'
                                ]">
                                Planning
                            </button>
                            
                            <button type="button"
                                @click="handleStatusChange('in-progress')"
                                :class="[
                                    'px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200',
                                    status === 'in-progress'
                                        ? 'bg-orange-100 text-orange-600 border-2 border-orange-200'
                                        : 'bg-gray-50 text-gray-600 hover:bg-gray-100'
                                ]">
                                In Progress
                            </button>
                            
                            <button type="button"
                                @click="handleStatusChange('on-hold')"
                                :class="[
                                    'px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200',
                                    status === 'on-hold'
                                        ? 'bg-blue-100 text-blue-600 border-2 border-blue-200'
                                        : 'bg-gray-50 text-gray-600 hover:bg-gray-100'
                                ]">
                                On Hold
                            </button>
                        </div>
                    </div>

                    <!-- Error Message -->
                    <div v-if="formError" class="text-red-500 text-sm">{{ formError }}</div>

                    <!-- Form Actions -->
                    <div class="flex justify-end space-x-3">
                        <button type="button" 
                            @click="$emit('update:modelValue', false)" 
                            :disabled="isSubmitting"
                            class="px-4 py-2 text-gray-700 hover:text-gray-900 disabled:opacity-50">
                            Cancel
                        </button>
                        <button type="submit"
                            :disabled="isSubmitting"
                            class="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed">
                            {{ isSubmitting ? 'Creating...' : 'Create Project' }}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from 'vue';
import flatpickr from 'flatpickr';
import 'flatpickr/dist/flatpickr.css';
import { useProjectStore } from '~/stores/projectStory';

const props = defineProps<{
    modelValue: boolean
}>();

const emit = defineEmits<{
    (e: 'update:modelValue', value: boolean): void
}>();

const useProjects = useProjectStore();

// Form data
const title = ref('');
const description = ref('');
const deadline = ref('');
const status = ref('');
const isSubmitting = ref(false);
const formError = ref('');

const resetForm = () => {
    title.value = '';
    description.value = '';
    deadline.value = '';
    status.value = '';
    formError.value = '';
};

const saveProject = async () => {
    if (!status.value) {
        formError.value = 'Please select a project status';
        return;
    }

    if (!title.value || !description.value || !deadline.value) {
        formError.value = 'Please fill in all required fields';
        return;
    }

    try {
        isSubmitting.value = true;
        formError.value = '';
        
        await useProjects.createProject({
            title: title.value,
            description: description.value,
            deadline: deadline.value,
            status: status.value
        });

        await useProjects.fetchProjects();
        emit('update:modelValue', false);
        resetForm();
    } catch (error) {
        console.error('Error creating project:', error);
        formError.value = 'Failed to create project. Please try again.';
    } finally {
        isSubmitting.value = false;
    }
};

// Character counter for description
const handleDescriptionInput = (event: Event) => {
    const target = event.target as HTMLTextAreaElement;
    if (target.value.length > 200) {
        target.value = target.value.substring(0, 200);
        description.value = target.value;
    }
};

// Status change handler
const handleStatusChange = (value: string) => {
    status.value = value;
};

// Initialize flatpickr when modal opens
const initializeFlatpickr = () => {
    setTimeout(() => {
        const deadlineInput = document.querySelector('#deadline');
        if (deadlineInput) {
            flatpickr(deadlineInput, {
                minDate: 'today',
                dateFormat: 'Y-m-d',
                altInput: true,
                altFormat: 'F j, Y',
                animate: true
            });
        }
    }, 100);
};

watch(() => props.modelValue, (newValue) => {
    if (newValue) {
        initializeFlatpickr();
    }
});
</script>
