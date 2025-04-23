<template>
    <div>
        富文本
        <markdown-editor v-model="content" />

    </div>

</template>

<script>
import MarkdownEditor from '@/components/MarkdownEditor'
export default {
    name: '',
    data() {
        return {
            content: ''
        }
    }
}
</script>

<style></style>
