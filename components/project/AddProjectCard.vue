<template>
    <div @click="$emit('click')" class="project-card bg-white rounded-xl shadow-sm overflow-hidden relative fade-in hover:shadow-md transition-all duration-300 cursor-pointer" style="animation-delay: 0.1s">
        <div class="block h-full">
            <div class="card-shine"></div>
            <div class="p-6 flex flex-col items-center justify-center h-full min-h-[200px]">
                <div class="text-gray-300 hover:text-indigo-500 transition-colors duration-300 mb-4">
                    <i class="fas fa-plus text-[64px]"></i>
                </div>
                <h3 class="text-lg font-medium text-gray-600 hover:text-gray-900 transition-colors duration-300">Add New Project</h3>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
defineEmits<{
    (e: 'click'): void
}>();
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
