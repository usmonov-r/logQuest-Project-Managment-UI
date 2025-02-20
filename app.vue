<template>
  <div :class="{ 'dark': isDark }">
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch, provide } from 'vue';
import '@/assets/css/dark-mode.css';

const isDark = ref(false);

// Provide isDark to all child components
provide('isDark', isDark);

onMounted(() => {
  const savedTheme = localStorage.getItem('theme');
  isDark.value = savedTheme === 'dark';
  updateTheme();
});

watch(isDark, () => {
  updateTheme();
  localStorage.setItem('theme', isDark.value ? 'dark' : 'light');
});

const updateTheme = () => {
  if (isDark.value) {
    document.documentElement.classList.add('dark');
  } else {
    document.documentElement.classList.remove('dark');
  }
};
</script>

<style>
/* Base styles */
:root {
  color-scheme: light;
}

:root.dark {
  color-scheme: dark;
}

/* Transitions */
.project-card,
.modal-content,
input,
select,
textarea,
button,
.bg-white,
.bg-gray-50,
.bg-gray-100 {
  transition: background-color 0.3s ease, border-color 0.3s ease, color 0.3s ease, box-shadow 0.3s ease;
}

/* Gradient text */
.gradient-text {
  @apply bg-gradient-to-r from-indigo-500 to-purple-600;
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
}
</style>
