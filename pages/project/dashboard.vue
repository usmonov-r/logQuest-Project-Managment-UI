<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useProjectStore } from '~/stores/projectStory';
import { useAuthStore } from '~/stores/authStory';
import Cookies from 'universal-cookie';
import ProjectCard from '~/components/project/ProjectCard.vue';
import AddProjectCard from '~/components/project/AddProjectCard.vue';
import NewProjectModal from '~/components/project/NewProjectModal.vue';

definePageMeta({
    middleware: 'auth',
    layout: 'default'
});

const cookies = new Cookies();
const userAuth = useAuthStore();
const useProjects = useProjectStore();
const showNewProjectModal = ref(false);

onMounted(async() => {
    await useProjects.fetchProjects();
});

const openNewProjectModal = () => {
    showNewProjectModal.value = true;
};
</script>

<template>
<div class="bg-gray-50">
    <div class="max-w-7xl mx-auto px-4 py-8">
        <div class="flex justify-between items-center mb-8">
            <div>
                <h1 class="text-2xl font-bold text-gray-900">My Projects</h1>
            </div>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <AddProjectCard @click="openNewProjectModal" />
            <ProjectCard v-for="project in useProjects.projects" 
                        :key="project.id"
                        :project="project" />
        </div>
    </div>

    <NewProjectModal v-model="showNewProjectModal" />
</div>
</template>

<style scoped>
.gradient-text {
    background: linear-gradient(to right, #6366f1, #a855f7);
    background-clip: text; /* Standard property */
    -webkit-background-clip: text; /* Webkit-specific property */
    -webkit-text-fill-color: transparent;
}
.project-card {
    transition: all 0.3s ease;
}

.project-card:hover {
    transform: translateY(-4px);
}

.card-shine {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 100%;
    background: linear-gradient(
        45deg,
        transparent 0%,
        rgba(255, 255, 255, 0) 30%,
        rgba(255, 255, 255, 0.4) 40%,
        rgba(255, 255, 255, 0) 50%,
        transparent 100%
    );
    background-size: 200% 100%;
    background-position: 150% 0;
    transition: background-position 0.5s ease;
}

.project-card:hover .card-shine {
    background-position: -50% 0;
}

.completed-card {
    background: linear-gradient(135deg, #ecfdf5 0%, #f0fdfa 100%);
    border: 2px solid #6ee7b7;
    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
}

.completed-card:hover {
    box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
}

.completed-card .card-shine {
    background: linear-gradient(
        45deg,
        transparent 0%,
        rgba(110, 231, 183, 0) 30%,
        rgba(110, 231, 183, 0.2) 40%,
        rgba(110, 231, 183, 0) 50%,
        transparent 100%
    );
}

.completed-badge {
    background: linear-gradient(135deg, #059669 0%, #0d9488 100%);
    color: white;
    text-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
}

.fade-in {
    animation: fadeIn 0.5s ease-out forwards;
    opacity: 0;
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