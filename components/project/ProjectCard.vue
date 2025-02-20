<template>
    <div :class="['project-card bg-white rounded-xl shadow-sm overflow-hidden relative fade-in', 
                  project.status === 'completed' ? 'completed-card' : '']" 
         :style="{'animation-delay': '0.1s'}">
        <NuxtLink :to="`/project/${project.title}?id=${project.id}`">
            <div class="card-shine"></div>
            <div class="p-6">
                <div class="flex justify-between items-start mb-4">
                    <span :class="[checkStatus(project.status), 'px-2 py-1 rounded-full text-xs font-medium']">
                        {{ project.status }}
                    </span>
                    <span class="text-sm text-gray-500">{{ formatDate(project.deadline) }}</span>
                </div>
                <h3 class="text-lg font-semibold text-gray-900 mb-2">{{ project.title }}</h3>
                <p class="text-gray-600 text-sm mb-4">{{ project.description }}</p>
                <div class="flex justify-between items-center">
                    <div class="flex items-center space-x-2">
                        <span class="text-sm text-gray-500">
                            <i class="far fa-clock mr-1"></i>
                            {{ formatDate(project.deadline) }}
                        </span>
                    </div>
                  
                </div>
            </div>
        </NuxtLink>
    </div>
</template>

<script setup lang="ts">
const props = defineProps<{
    project: {
        id: string;
        title: string;
        description: string;
        status: string;
        deadline: string;
    }
}>();

const checkStatus = (status: string): string => {
    switch(status){
        case 'in-progress':
            return 'bg-orange-100 text-orange-600';
        case 'planning':
            return 'bg-yellow-100 text-yellow-600';
        case 'on-hold':
            return 'bg-blue-100 text-blue-600';
        default:
            return 'bg-grey-100 text-grey-600';
    }
}

const formatDate = (dateString: string): string => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
    });
};
</script>

<style scoped>
.card-shine {
    position: absolute;
    top: 0;
    left: -100%;
    width: 200%;
    height: 100%;
    background: linear-gradient(
        45deg,
        transparent 0%,
        rgba(255, 255, 255, 0) 30%,
        rgba(255, 255, 255, 0.3) 40%,
        rgba(255, 255, 255, 0) 50%,
        transparent 100%
    );
    transition: all 0.5s ease;
}

.project-card:hover .card-shine {
    left: 100%;
}

.fade-in {
    opacity: 0;
    animation: fadeIn 0.5s ease-in forwards;
}

@keyframes fadeIn {
    from {
        opacity: 0;
        transform: translateY(10px);
    }
    to {
        opacity: 1;
        transform: translateY(0);
    }
}
</style>
