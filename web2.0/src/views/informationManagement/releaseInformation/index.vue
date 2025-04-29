<template>
    <div style=" margin: 30px;">
        <div style="margin: 20px;">
            <el-input v-model="formData.title" placeholder="请输入标题"></el-input>
        </div>

        <div style="margin: 20px;">
            <el-input type="textarea" v-model="formData.description" placeholder="请简要描述" height="50px"></el-input>
        </div>
        <div style="margin: 20px;">
            <el-input v-model="formData.coverImg" placeholder="请输入封面图网络地址"></el-input>
        </div>
        <div style="margin: 20px;">
            <el-input v-model="formData.category_name" placeholder="请输入资讯分类"></el-input>
        </div>

        <Toolbar style="border-bottom: 1px solid #ccc" :editor="editor" :mode="mode" />
        <Editor style="height: 500px; overflow-y: hidden;" v-model="formData.content" :defaultConfig="editorConfig"
            :mode="mode" @onCreated="onCreated" />
        <div style="margin: 5px;">
            <el-button type="success" @click="release">发布资讯</el-button>
            <el-button type="danger" @click="clearContent">清空内容</el-button>
        </div>
    </div>

</template>

<script>
import { addnews } from '../../../api/informationManagement'
import { Editor, Toolbar } from '@wangeditor/editor-for-vue'

export default {
    components: { Editor, Toolbar },
    data() {
        return {
            formData: {
                category_name: '',
                title: '',
                keywords: '',
                description: '',
                content: '',
                coverImg: ''
            },
            editor: null,
            html: '',
            editorConfig: { placeholder: '请输入内容...' },
            mode: 'default', // or 'simple'

        }
    },
    methods: {
        onCreated(editor) {
            this.editor = Object.seal(editor) // 一定要用 Object.seal() ，否则会报错
        },
        mounted() {
            // 模拟 ajax 请求，异步渲染编辑器
            setTimeout(() => {
                this.html = '<p>模拟 Ajax 异步设置内容 HTML</p>'
            }, 1500)
        },
        beforeDestroy() {
            const editor = this.editor
            if (editor == null) return
            editor.destroy() // 组件销毁时，及时销毁编辑器
        },
        async release() {
            console.log(this.formData)
            let data = await addnews(this.formData)
            if (data.code == 200) {
                this.$notify({
                    title: '发布成功',
                    message: '发布成功',
                    type: 'success',
                    duration: 2000
                })
                this.clearContent()
            } else {
                this.$notify({
                    title: 'Error',
                    message: data.msg,
                    type: 'error',
                    duration: 2000
                })
            }

        },
        clearContent() {
            this.formData = {
                category_name: '',
                title: '',
                keywords: '',
                description: '',
                content: ''
            }
        },

    }
}
</script>


<style>
.te-md-splitter {
    width: 100% !important;
}
</style>