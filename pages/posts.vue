<script setup lang="ts">
import { useProjectStore } from '~/stores/projectStory';
import { onMounted } from 'vue';

const getProjects =  useProjectStore();

onMounted(()=>{
    getProjects.fetchProjects();
})


</script>

<template>

<div class="flex  justify-center items-center">
    <ul>
        <li>
            <div v-for="project in getProjects.projects"  class="pt-12" >
        {{ project.title}}  <br>
        {{ project.description}} <br>
        {{ project.deadline}} <br>
        {{ project.createdAt}} <br>
 
    </div> 
        </li>
    </ul>
   
</div>

</template>