<template>
        <nav class="bg-white/80 backdrop-blur-md shadow-sm sticky top-0 z-50">
        <div class="max-w-7xl mx-auto px-4">
            <div class="flex justify-between items-center h-16">
                <div class="flex items-center space-x-2">
                    <a href="main.html" class="flex items-center space-x-2">
                        <div class="w-8 h-8 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center">
                            <i class="fas fa-tasks text-white text-lg"></i>
                        </div>
                        <span class="text-xl font-bold gradient-text">ProjectTracker</span>
                    </a>
                </div>
                <div class="flex items-center space-x-6">
                    <div class="relative">
                        <input type="text" placeholder="Search projects..." class="bg-gray-100 px-4 py-2 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 w-64 transition-all duration-300">
                        <i class="fas fa-search absolute right-3 top-3 text-gray-400"></i>
                    </div>
                    <button class="text-gray-600 hover:text-indigo-600 relative">
                        <i class="fas fa-bell text-xl"></i>
                        <span class="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full"></span>
                    </button>
                    <div class="h-8 w-8 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
                        <span class="text-white font-medium">U</span>
                    </div>
                </div>
            </div>
        </div>
    </nav>
</template>