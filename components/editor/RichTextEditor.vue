<template>
    <div class="rich-text-editor">
        <!-- Editor Menu -->
        <div class="editor-menu flex items-center space-x-2 p-2 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 rounded-t-lg">
            <button
                v-for="item in menuItems"
                :key="item.icon"
                type="button"
                @click.prevent="item.action"
                :class="[
                    'p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors',
                    { 'bg-gray-100 dark:bg-gray-700': item.isActive?.() }
                ]"
                :title="item.title"
            >
                <i :class="['fas', item.icon]" :style="{ color: item.isActive?.() ? '#6366f1' : undefined }"></i>
            </button>
        </div>

        <!-- Editor Content -->
        <editor-content 
            :editor="editor" 
            class="prose dark:prose-invert max-w-none p-4 min-h-[200px] bg-white dark:bg-gray-800 rounded-b-lg focus:outline-none"
        />
    </div>
</template>

<script setup lang="ts">
import { useEditor, EditorContent } from '@tiptap/vue-3'
import StarterKit from '@tiptap/starter-kit'
import { computed, onBeforeUnmount, watch } from 'vue'

const props = defineProps<{
    modelValue: string
    placeholder?: string
}>()

const emit = defineEmits<{
    (e: 'update:modelValue', value: string): void
}>()

const editor = useEditor({
    content: props.modelValue,
    extensions: [
        StarterKit.configure({
            heading: {
                levels: [1, 2, 3]
            }
        })
    ],
    editorProps: {
        attributes: {
            class: 'prose-sm sm:prose dark:prose-invert focus:outline-none max-w-none'
        }
    },
    onUpdate: ({ editor }) => {
        emit('update:modelValue', editor.getHTML())
    }
})

// Watch for external changes
watch(() => props.modelValue, (newContent) => {
    const editorContent = editor.value?.getHTML()
    if (newContent !== editorContent) {
        editor.value?.commands.setContent(newContent, false)
    }
})

// Cleanup
onBeforeUnmount(() => {
    editor.value?.destroy()
})

const menuItems = computed(() => [
    {
        icon: 'fa-bold',
        title: 'Bold',
        action: () => editor.value?.chain().focus().toggleBold().run(),
        isActive: () => editor.value?.isActive('bold')
    },
    {
        icon: 'fa-italic',
        title: 'Italic',
        action: () => editor.value?.chain().focus().toggleItalic().run(),
        isActive: () => editor.value?.isActive('italic')
    },
    {
        icon: 'fa-list-ul',
        title: 'Bullet List',
        action: () => editor.value?.chain().focus().toggleBulletList().run(),
        isActive: () => editor.value?.isActive('bulletList')
    },
    {
        icon: 'fa-list-ol',
        title: 'Ordered List',
        action: () => editor.value?.chain().focus().toggleOrderedList().run(),
        isActive: () => editor.value?.isActive('orderedList')
    },
    {
        icon: 'fa-quote-right',
        title: 'Blockquote',
        action: () => editor.value?.chain().focus().toggleBlockquote().run(),
        isActive: () => editor.value?.isActive('blockquote')
    },
    {
        icon: 'fa-code',
        title: 'Code',
        action: () => editor.value?.chain().focus().toggleCode().run(),
        isActive: () => editor.value?.isActive('code')
    },
    {
        icon: 'fa-rotate-left',
        title: 'Undo',
        action: () => editor.value?.chain().focus().undo().run()
    },
    {
        icon: 'fa-rotate-right',
        title: 'Redo',
        action: () => editor.value?.chain().focus().redo().run()
    }
])
</script>

<style>
.ProseMirror {
    min-height: 200px;
}

.ProseMirror p.is-editor-empty:first-child::before {
    color: #adb5bd;
    content: attr(data-placeholder);
    float: left;
    height: 0;
    pointer-events: none;
}

/* Add proper spacing for lists */
.ProseMirror ul,
.ProseMirror ol {
    padding-left: 1rem;
}

.ProseMirror ul li,
.ProseMirror ol li {
    margin-bottom: 0.5rem;
}

/* Style blockquotes */
.ProseMirror blockquote {
    border-left: 4px solid #e5e7eb;
    padding-left: 1rem;
    color: #6b7280;
}

/* Style code blocks */
.ProseMirror code {
    background-color: #f3f4f6;
    padding: 0.2rem 0.4rem;
    border-radius: 0.25rem;
    font-size: 0.875em;
}

.dark .ProseMirror code {
    background-color: #374151;
}
</style>
