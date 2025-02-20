<script setup lang="ts">
import { useProjectStore } from '~/stores/projectStory';
import { useNotesStore } from '~/stores/notesStory';
import { onMounted, ref, computed, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';

// Import components
import ProjectSidebar from '~/components/project/ProjectSidebar.vue';
import QuickNoteForm from '~/components/project/QuickNoteForm.vue';
import NotesTimeline from '~/components/project/NotesTimeline.vue';

definePageMeta({
    middleware: 'auth',
    layout: 'default'
});

const router = useRoute();
const route = useRouter();
const title = router.params.title;
const id = Number(router.query.id);

const getProject = useProjectStore();
const getNotes = useNotesStore();

const isLoading = ref(true);
const showDeleteConfirm = ref(false);
const showEditForm = ref(false);
const editedProject = ref({
    title: '',
    status: '',
    deadline: ''
});

const isSubmitting = ref(false);
const selectedNote = ref();
const showDetailModal = ref(false);

// Use computed properties for reactivity
const project = computed(() => getProject.CurrentProject || {});
const notes = computed(() => getNotes.currentNotes || []);

// Watch for project changes to update form
watch(project, (newProject) => {
    if (newProject && showEditForm.value) {
        editedProject.value = {
            title: newProject.title || '',
            status: newProject.status || '',
            deadline: newProject.deadline || ''
        };
    }
}, { deep: true });

const calculateTotalProjectTime = computed(() => {
    const notesList = notes.value;
    if (!notesList || !Array.isArray(notesList)) {
        return 0;
    }
    
    return notesList.reduce((total, note) => {
        if (!note || !note.workTime) return total;
        const timeValue = parseFloat(note.workTime) || 0;
        return total + timeValue;
    }, 0);
});

const openEditForm = () => {
    editedProject.value = {
        title: project.value.title || '',
        status: project.value.status || '',
        deadline: project.value.deadline || ''
    };
    showEditForm.value = true;
};

const updateProject = async () => {
    if (!editedProject.value.title.trim()) {
        return;
    }

    try {
        isSubmitting.value = true;
        await getProject.updateProject(id, editedProject.value);
        showEditForm.value = false;
        // Refresh project data after update
        await getProject.fetchProjectById(id);
    } catch (error) {
        console.error('Error updating project:', error);
    } finally {
        isSubmitting.value = false;
    }
};

const deleteProject = async () => {
    try {
        isSubmitting.value = true;
        await getProject.deleteProject(id);
        route.push('/project/dashboard');
    } catch (error) {
        console.error('Error deleting project:', error);
    } finally {
        isSubmitting.value = false;
    }
};

const createNote = async (noteData: { title: string; content: string; workTime: string }) => {
    if (!noteData.title.trim() || !noteData.content.trim()) {
        return;
    }

    try {
        isSubmitting.value = true;
        await getNotes.createNote({
            ...noteData,
            project_id: id
        });
        await getNotes.fetchNote(id);
    } catch (error) {
        console.error('Error creating note:', error);
    } finally {
        isSubmitting.value = false;
    }
};

const openNoteDetail = (note: any) => {
    console.log("Opening note detail:", note);
    if (!note) return;
    selectedNote.value = note;
    showDetailModal.value = true;
};

const closeNoteDetail = () => {
    showDetailModal.value = false;
    selectedNote.value = null;
};

const formatTimeSpent = (totalHours: number) => {
    if (!totalHours || isNaN(totalHours)) return '0m';
    
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

// Load initial data
const loadData = async () => {
    try {
        isLoading.value = true;
        // Clear notes before fetching new ones
        getNotes.$reset();
        // Wait for both operations to complete
        await Promise.all([
            getProject.fetchProjectById(id),
            getNotes.fetchNote(id)
        ]);
    } catch (error) {
        console.error('Error loading project data:', error);
    } finally {
        isLoading.value = false;
    }
};

onMounted(loadData);
</script>

<template>
    <div class="min-h-screen bg-gray-50 dark:bg-gray-900">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <!-- Loading State -->
            <div v-if="isLoading" class="flex justify-center items-center h-64">
                <div class="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
            </div>

            <!-- Main Content -->
            <div v-else class="grid grid-cols-1 lg:grid-cols-4 gap-2">
                <!-- Sidebar -->
                <ProjectSidebar
                    :project="project"
                    :totalTime="calculateTotalProjectTime"
                    :notesCount="notes.length"
                    @edit="openEditForm"
                    @delete="showDeleteConfirm = true"
                />

                <!-- Main Content Area -->
                <div class="lg:col-span-3 space-y-8">
                    <!-- Quick Note Form -->
                    <QuickNoteForm
                        :isSubmitting="isSubmitting"
                        @submit="createNote"
                    />

                    <!-- Notes Timeline -->
                    <NotesTimeline
                        :notes="notes"
                        @view="openNoteDetail"
                    />
                </div>
            </div>

            <!-- Edit Project Modal -->
            <TransitionRoot appear :show="showEditForm" as="template">
                <Dialog as="div" @close="showEditForm = false" class="relative z-50">
                    <TransitionChild
                        enter="duration-300 ease-out"
                        enter-from="opacity-0"
                        enter-to="opacity-100"
                        leave="duration-200 ease-in"
                        leave-from="opacity-100"
                        leave-to="opacity-0"
                    >
                        <div class="fixed inset-0 bg-black/30 backdrop-blur-sm" />
                    </TransitionChild>

                    <div class="fixed inset-0 overflow-y-auto">
                        <div class="flex min-h-full items-center justify-center p-4">
                            <TransitionChild
                                enter="duration-300 ease-out"
                                enter-from="opacity-0 scale-95"
                                enter-to="opacity-100 scale-100"
                                leave="duration-200 ease-in"
                                leave-from="opacity-100 scale-100"
                                leave-to="opacity-0 scale-95"
                            >
                                <DialogPanel class="w-full max-w-md transform overflow-hidden rounded-2xl bg-white dark:bg-gray-800 p-6 text-left align-middle shadow-xl transition-all">
                                    <DialogTitle as="h3" class="text-lg font-medium leading-6 text-gray-900 dark:text-gray-100">
                                        Edit Project
                                    </DialogTitle>

                                    <form @submit.prevent="updateProject" class="mt-4 space-y-4">
                                        <div>
                                            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">Title</label>
                                            <input
                                                type="text"
                                                v-model="editedProject.title"
                                                class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white sm:text-sm"
                                                required
                                            />
                                        </div>
                                        <div>
                                            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">Status</label>
                                            <select
                                                v-model="editedProject.status"
                                                class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white sm:text-sm"
                                            >
                                                <option value="active">Active</option>
                                                <option value="completed">Completed</option>
                                                <option value="on-hold">On Hold</option>
                                            </select>
                                        </div>
                                        <div>
                                            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">Deadline</label>
                                            <input
                                                type="date"
                                                v-model="editedProject.deadline"
                                                class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white sm:text-sm"
                                            />
                                        </div>
                                        <div class="mt-6 flex justify-end space-x-3">
                                            <button
                                                type="button"
                                                @click="showEditForm = false"
                                                class="inline-flex justify-center rounded-md border border-transparent px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2"
                                            >
                                                Cancel
                                            </button>
                                            <button
                                                type="submit"
                                                class="inline-flex justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2"
                                                :disabled="isSubmitting"
                                            >
                                                Save Changes
                                            </button>
                                        </div>
                                    </form>
                                </DialogPanel>
                            </TransitionChild>
                        </div>
                    </div>
                </Dialog>
            </TransitionRoot>

            <!-- Delete Confirmation Modal -->
            <TransitionRoot appear :show="showDeleteConfirm" as="template">
                <Dialog as="div" @close="showDeleteConfirm = false" class="relative z-50">
                    <TransitionChild
                        enter="duration-300 ease-out"
                        enter-from="opacity-0"
                        enter-to="opacity-100"
                        leave="duration-200 ease-in"
                        leave-from="opacity-100"
                        leave-to="opacity-0"
                    >
                        <div class="fixed inset-0 bg-black/30 backdrop-blur-sm" />
                    </TransitionChild>

                    <div class="fixed inset-0 overflow-y-auto">
                        <div class="flex min-h-full items-center justify-center p-4">
                            <TransitionChild
                                enter="duration-300 ease-out"
                                enter-from="opacity-0 scale-95"
                                enter-to="opacity-100 scale-100"
                                leave="duration-200 ease-in"
                                leave-from="opacity-100 scale-100"
                                leave-to="opacity-0 scale-95"
                            >
                                <DialogPanel class="w-full max-w-md transform overflow-hidden rounded-2xl bg-white dark:bg-gray-800 p-6 text-left align-middle shadow-xl transition-all">
                                    <DialogTitle as="h3" class="text-lg font-medium leading-6 text-gray-900 dark:text-gray-100">
                                        Delete Project
                                    </DialogTitle>
                                    <div class="mt-2">
                                        <p class="text-sm text-gray-500 dark:text-gray-400">
                                            Are you sure you want to delete this project? This action cannot be undone.
                                        </p>
                                    </div>

                                    <div class="mt-6 flex justify-end space-x-3">
                                        <button
                                            type="button"
                                            @click="showDeleteConfirm = false"
                                            class="inline-flex justify-center rounded-md border border-transparent px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2"
                                        >
                                            Cancel
                                        </button>
                                        <button
                                            type="button"
                                            @click="deleteProject"
                                            class="inline-flex justify-center rounded-md border border-transparent bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-red-500 focus-visible:ring-offset-2"
                                        >
                                            Delete Project
                                        </button>
                                    </div>
                                </DialogPanel>
                            </TransitionChild>
                        </div>
                    </div>
                </Dialog>
            </TransitionRoot>

            <!-- Note Detail Modal -->
            <TransitionRoot appear :show="showDetailModal" as="template">
                <Dialog as="div" @close="closeNoteDetail" class="relative z-50">
                    <TransitionChild
                        enter="duration-300 ease-out"
                        enter-from="opacity-0"
                        enter-to="opacity-100"
                        leave="duration-200 ease-in"
                        leave-from="opacity-100"
                        leave-to="opacity-0"
                    >
                        <div class="fixed inset-0 bg-black/30 backdrop-blur-sm" />
                    </TransitionChild>

                    <div class="fixed inset-0 overflow-y-auto">
                        <div class="flex min-h-full items-center justify-center p-4">
                            <TransitionChild
                                enter="duration-300 ease-out"
                                enter-from="opacity-0 scale-95"
                                enter-to="opacity-100 scale-100"
                                leave="duration-200 ease-in"
                                leave-from="opacity-100 scale-100"
                                leave-to="opacity-0 scale-95"
                            >
                                <DialogPanel v-if="selectedNote" class="w-full max-w-2xl transform overflow-hidden rounded-2xl bg-white dark:bg-gray-800 p-6 text-left align-middle shadow-xl transition-all">
                                    <DialogTitle as="h3" class="text-lg font-medium leading-6 text-gray-900 dark:text-gray-100">
                                        {{ selectedNote.title }}
                                    </DialogTitle>
                                    <div class="mt-2">
                                        <div class="flex items-center space-x-4 text-sm text-gray-500 dark:text-gray-400 mb-4">
                                            <span>{{ selectedNote.formattedDate }}</span>
                                            <span class="px-2 py-1 bg-gradient-to-r from-indigo-500 to-purple-500 text-white rounded-full text-xs font-medium">
                                                {{ formatTimeSpent(Number(selectedNote.workTime)) }}
                                            </span>
                                        </div>
                                        <p class="text-gray-700 dark:text-gray-300 whitespace-pre-wrap">
                                            {{ selectedNote.content }}
                                        </p>
                                    </div>

                                    <div class="mt-6 flex justify-end">
                                        <button
                                            type="button"
                                            @click="closeNoteDetail"
                                            class="inline-flex justify-center rounded-md border border-transparent px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2"
                                        >
                                            Close
                                        </button>
                                    </div>
                                </DialogPanel>
                            </TransitionChild>
                        </div>
                    </div>
                </Dialog>
            </TransitionRoot>
        </div>
    </div>
</template>



<style scoped>
.timeline-line {
    @apply absolute left-4 top-0 h-full w-0.5 bg-gray-200 dark:bg-gray-700;
}

.timeline-dot {
    @apply absolute -left-6 top-1/2 w-3 h-3 rounded-full bg-gradient-to-r from-indigo-500 to-purple-500;
    transform: translateY(-50%);
}

.slide-in {
    animation: slideIn 0.3s ease-out;
}

@keyframes slideIn {
    from {
        opacity: 0;
        transform: translateX(-10px);
    }
    to {
        opacity: 1;
        transform: translateX(0);
    }
}
</style>