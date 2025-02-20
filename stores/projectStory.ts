import {defineStore} from 'pinia';
import Cookies from 'universal-cookie';

const cookie = new Cookies();


export const useProjectStore = defineStore('useProject', {
    state: () =>({
        projects: [] as {
            id: number,
            title: string,
            description: string,
            deadline: string,
            createdAt: any,
            status: string,
        }[],
        CurrentProject:{
            id: 0,
            title: '',
            description: '',
            deadline: '',
            createdAt: '',
            status: '',
            notesCount: 0
        },
        page: 1,
        isEmptyPro: false,
        isLoading: false,
        error: null as string | null,
        example: '',
    }),


    getters: {
        currentProject: (state) => state.CurrentProject,
        isProjectLoading: (state) => state.isLoading,
    },


    actions:{

        async  createProject({title, description, deadline, status}: {title:string, description:string, deadline:string,  status:string}){
            this.isLoading = true;
            this.error = null;
            const token = cookie.get('token');
            
            try {
                console.log('Making API request with data:', {title, description, deadline, status});
                
                const response = await fetch('http://localhost:2123/api/projects', {
                    method: 'POST',
                    headers: {
                        'Accept': 'application/ld+json',
                        'Content-Type': 'application/ld+json',
                        'Authorization': `Bearer ${token}`
                    },
                    body: JSON.stringify({
                        title,
                        description,
                        deadline,
                        status,
                        createdAt: new Date().toISOString()
                    })
                });

                if (!response.ok) {
                    const errorData = await response.json();
                    console.error('Server error:', errorData);
                    throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
                }

                const data = await response.json();
                console.log("Project created successfully:", data);

                this.projects.unshift({
                    id: data.id,
                    title: data.title,
                    description: data.description,
                    deadline: data.deadline,
                    createdAt: data.createdAt,
                    status: data.status
                });

                return data;
            } catch(error) {
                console.error("Error creating project:", error);
                this.error = error instanceof Error ? error.message : 'Failed to create project';
                throw error;
            } finally {
                this.isLoading = false;
            }
        },

        async fetchProjects(){
            const token = cookie.get('token');
            try{
                const response = await fetch(`http://localhost:2123/api/projects?page=${this.page}`,
                    {
                        method: "GET",
                        headers: {
                            'Accept': 'application/ld+json',
                            'Authorization': `Bearer ${token}`
                        }     
                    });

                const data = await response.json();
                this.projects = [];
                console.log(data);
                if(data.totalItems >= 1){
                    this.isEmptyPro = false;
                    this.projects = data.member.map((item: any) => ({
                        id: item.id,
                        title: item.title,
                        description: item.description,
                        deadline: item.deadline,
                        createdAt: item.createdAt,
                        status: item.status,
                    }));
                } else {
                    this.isEmptyPro = true;
                }
            
            }catch(error){
                console.error('Error occurred:', error);
                this.isEmptyPro = true;
                this.projects = [];
            }
        },

        async fetchProjectById(id: number) {
            const token = cookie.get('token');
            this.isLoading = true;
            this.error = null;

            try {
                const response = await fetch(`http://localhost:2123/api/projects/${id}`, {
                    method: 'GET',
                    headers: {
                        'Accept': 'application/ld+json',
                        'Authorization': `Bearer ${token}`,
                        // 'Cache-Control': 'no-cache'
                    }
                });
                
                if (!response.ok) {
                    throw new Error('Failed to fetch project');
                }

                const data = await response.json();
                
                // Update state atomically
                this.CurrentProject = {
                    id: data.id,
                    title: data.title,
                    description: data.description,
                    deadline: data.deadline,
                    createdAt: data.createdAt,
                    status: data.status,
                    notesCount: data.notesCount,
                };
            } catch (error) {
                console.error("Error occurred while fetching project:", error);
                this.error = error instanceof Error ? error.message : 'An error occurred';
                throw error;
            } finally {
                this.isLoading = false;
            }
        },

        async deleteProject(id:number){
            const  token = cookie.get('token')
            try{
                const response =  await fetch(`http://localhost:2123/api/projects/${id}`, {
                    method: 'Delete',
                    headers:{
                        'accept': '*/*',
                        'Authorization': `Bearer ${token}`,
                    }
                });

            }catch(error){
                console.error('Error occured', error);
            }
        },

        async updateProject(id: number, data: any) {
            const token = cookie.get('token');
            this.isLoading = true;
            try {
                const response = await fetch(`http://localhost:2123/api/projects/${id}`, {
                    method: 'PATCH',
                    headers: {
                        'Accept': 'application/ld+json',
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/merge-patch+json'
                    },
                    body: JSON.stringify(data)
                });

                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }

                const updatedProject = await response.json();
                
                this.CurrentProject = {
                    id: updatedProject.id,
                    title: updatedProject.title,
                    description: updatedProject.description,
                    deadline: updatedProject.deadline,
                    createdAt: updatedProject.createdAt,
                    status: updatedProject.status,
                    notesCount: updatedProject.notesCount
                };

                const projectIndex = this.projects.findIndex(p => p.id === id);
                if (projectIndex !== -1) {
                    this.projects[projectIndex] = this.CurrentProject;
                }

                return updatedProject;
            } catch (error) {
                console.error('Error occurred while updating project:', error);
                throw error;
            } finally {
                this.isLoading = false;
            }
        }

    }
})