import { defineStore } from "pinia";
import Cookies from "universal-cookie";

const cookie =  new Cookies();

const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: 'numeric',
        minute: 'numeric',
        hour12: true
    });
}

export const useNotesStore = defineStore('useNotes', {
    state: () => ({
        currentNotes: [] as {
            id: string,
            title: string,
            workTime: string,
            content: string,
            formattedDate: string,
            createdAt: string
        }[]
    }),

    actions: {
        async createNote({title, workTime, content, project_id}:{title:string, workTime:string, content:string, project_id:number}){
            const token = cookie.get('token');
            try {
                const response = await fetch(`http://localhost:2123/api/notes`,
                    {
                        method: 'POST',
                        headers: {
                            'Accept': 'application/ld+json',
                            'Authorization': `Bearer ${token}`,
                            'Content-Type': 'application/ld+json'
                        },
                        body: JSON.stringify({
                            title: title,
                            workTime: workTime,
                            content: content,
                            createdAt: new Date().toISOString(),
                            project: `api/projects/${project_id}`
                        })
                    });

                console.log("DATA from notes post req", await response.json());
            } catch(error) {
                console.error('Error occurred while creating note', error);
            }
        },

        async fetchNote(id:number){
            const token = cookie.get('token');
            try {
                const response = await fetch(`http://localhost:2123/api/projects/${id}`,
                    {
                        method: 'GET',
                        headers: {
                            'Accept': 'application/ld+json',
                            'Content-Type': 'application/ld+json',
                            'Authorization': `Bearer ${token}`
                        },
                    }
                );

                const data = await response.json();
                console.log("Raw API response:", data);
                console.log("Raw notes data:", data.notes);
                
                this.currentNotes = []
                data.notes.forEach((note:any) => {
                    const noteId = note['@id'] || note._id || note.id;
                    console.log("Note raw data:", note);
                    const createdAt = note.createdAt || new Date().toISOString();
                    const processedNote = {
                        id: noteId,
                        title: note.title,
                        workTime: note.workTime,
                        content: note.content,
                        formattedDate: formatDate(createdAt),
                        createdAt: createdAt
                    };
                    console.log("Processing note:", processedNote);
                    this.currentNotes.push(processedNote);
                });
            } catch(error) {
                console.error('Error occurred', error);
            }
        }
    }
});