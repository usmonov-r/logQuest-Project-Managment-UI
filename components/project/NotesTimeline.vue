<script setup lang="ts">
interface Note {
    title: string;
    content: string;
    workTime: string;
    formattedDate: string;
}

const props = defineProps<{
    notes: Note[];
}>();

const emit = defineEmits<{
    (e: 'view', note: Note): void;
}>();

const truncateContent = (content: string, maxLength: number = 100) => {
    if (!content) return '';
    if (content.length <= maxLength) return content;
    return content.slice(0, maxLength) + '...';
};

const formatTimeSpent = (totalHours: number) => {
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

const handleNoteClick = (note: Note) => {
    console.log("Note clicked:", note);
    emit('view', note);
};
</script>

<template>
    <div class="space-y-6 relative">
        <div class="timeline-line"></div>

        <template v-for="note in notes" :key="note.id">
            <div class="mb-8 hover:cursor-pointer" @click="handleNoteClick(note)">
                <h2 class="text-lg font-semibold text-gray-900 dark:text-gray-300 mb-4 pl-10">{{ note.formattedDate }}</h2>
                <!-- Note Card -->
                <div class="relative pl-10 slide-in">
                    <div class="timeline-dot"></div>
                    <div class="note-card bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm mb-6">
                        <div class="flex justify-between items-start mb-4">
                            <h3 class="font-semibold text-gray-900 dark:text-gray-300 capitalize">{{ note.title }}</h3>
                            <span class="px-2 py-1 bg-gradient-to-r from-indigo-500 to-purple-500 text-white rounded-full text-xs font-medium">
                                {{ formatTimeSpent(Number(note.workTime)) }}
                            </span>
                        </div>
                        <p class="text-gray-600 dark:text-gray-400 text-sm mb-4">{{ truncateContent(note.content) }}</p>
                        <div class="flex items-center justify-between text-sm">
                            <span class="text-gray-500 dark:text-gray-400">{{ note.formattedDate }}</span>
                            <button 
                                @click.stop="handleNoteClick(note)" 
                                class="text-indigo-600 dark:text-indigo-500 hover:text-indigo-700 dark:hover:text-indigo-600 font-medium flex items-center space-x-1"
                            >
                                <span>View Details</span>
                                <i class="fas fa-chevron-right text-xs"></i>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </template>
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
