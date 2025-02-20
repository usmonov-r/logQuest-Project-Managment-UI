<script setup lang="ts">

definePageMeta({
    middleware: 'auth',
})

</script>

<template>

<div class="bg-gray-50">
    <!-- Navigation -->

    <div class="max-w-7xl mx-auto px-4 py-8">
        <!-- Empty State -->
        <div class="min-h-[80vh] flex items-center justify-center">
            <div class="text-center max-w-2xl mx-auto relative">
                <!-- Background Decorations -->
                <div class="absolute top-0 right-0 -z-10 w-72 h-72 bg-purple-200 rounded-full blur-3xl opacity-30"></div>
                <div class="absolute bottom-0 left-0 -z-10 w-72 h-72 bg-indigo-200 rounded-full blur-3xl opacity-30"></div>


                
           <!-- Welcome Message -->
                <h1 class="text-4xl font-bold gradient-text mb-6">Welcome to Your Dashboard!</h1>
                <p class="text-gray-600 text-lg mb-12">Start tracking your first project and keep everything organized in one place.</p>

            <!-- Getting Started Steps -->
                <div class="space-y-8 mb-12">
                    <div class="feature-card p-6 rounded-xl shadow-lg max-w-md mx-auto">
                        <div class="flex items-start space-x-4">
                            <div class="w-8 h-8 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center flex-shrink-0">
                                <span class="text-white font-medium">1</span>
                            </div>
                            <div class="text-left">
                                <h3 class="font-semibold text-gray-900 mb-1">Create Your First Project</h3>
                                <p class="text-gray-600">Click the button below to add your first project and start tracking progress.</p>
                            </div>
                        </div>
                    </div>

                    <div class="floating-arrow text-indigo-500 text-4xl">
                        <i class="fas fa-arrow-down"></i>
                    </div>

                    <!-- Add Project Button -->
                  <NuxtLink to="new-project">  <button class="pulse bg-black text-white px-8 py-4 rounded-xl font-medium hover:bg-gray-800 transition duration-300 flex items-center justify-center space-x-2 mx-auto">
                        <i class="fas fa-plus"></i>
                        <span>Create New Project</span>
                    </button>
                  </NuxtLink>
                </div>

               <!-- Quick Tips -->
                <div class="grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
                    <div class="feature-card p-4 rounded-xl">
                        <i class="fas fa-lightbulb text-xl text-indigo-600 mb-2"></i>
                        <h4 class="font-medium text-gray-900 mb-1">Set Clear Goals</h4>
                        <p class="text-sm text-gray-600">Define project objectives and milestones</p>
                    </div>
                    <div class="feature-card p-4 rounded-xl">
                        <i class="fas fa-users text-xl text-indigo-600 mb-2"></i>
                        <h4 class="font-medium text-gray-900 mb-1">Add Team Members</h4>
                        <p class="text-sm text-gray-600">Collaborate with your team effectively</p>
                    </div>
                    <div class="feature-card p-4 rounded-xl">
                        <i class="fas fa-chart-line text-xl text-indigo-600 mb-2"></i>
                        <h4 class="font-medium text-gray-900 mb-1">Track Progress</h4>
                        <p class="text-sm text-gray-600">Monitor project development in real-time</p>
                    </div>
                </div>

              <!-- IF THERE  IS PROJECT IN DB  -->
   </div>
        </div>
    </div>

    <!-- Help Button -->
    <div class="fixed bottom-6 right-6">
        <button class="bg-black text-white w-12 h-12 rounded-full flex items-center justify-center hover:bg-gray-800 transition duration-300 shadow-lg">
            <i class="fas fa-question"></i>
        </button>
    </div>
  </div>


</template>

<style>
.gradient-text {
    background: linear-gradient(to right, #6366f1, #a855f7);
    background-clip: text; /* Standard property */
    -webkit-background-clip: text; /* Webkit-specific property */
    -webkit-text-fill-color: transparent;
}

.pulse {
    animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}
@keyframes pulse {
    0%, 100% { opacity: 1; transform: scale(1); }
    50% { opacity: .8; transform: scale(1.05); }
}
.floating-arrow {
    animation: float 2s ease-in-out infinite;
}
@keyframes float {
    0%, 100% { transform: translateY(0); }
    50% { transform: translateY(-10px); }
}
.feature-card {
    background: rgba(255, 255, 255, 0.8);
    backdrop-filter: blur(10px);
    border: 1px solid rgba(255, 255, 255, 0.3);
}
</style>