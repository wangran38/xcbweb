<template>
    <div style=" margin: 30px;">
        <div style="margin: 20px;">
            <el-input v-model="formData.title" placeholder="请输入标题"></el-input>
        </div>

        <div style="margin: 20px;">
            <el-input type="textarea" v-model="formData.description" placeholder="请简要描述"></el-input>
        </div>
        <div style="margin: 20px;">
            <el-input v-model="formData.coverImg" placeholder="请输入封面图网络地址"></el-input>
        </div>
        <div style="margin: 20px; display: flex;  align-items: center;">
            <div style="margin: 5px; font-weight: bold;">
                请输入资讯分类
                <el-input v-model="formData.category_name" placeholder="请输入资讯分类"></el-input>
                <!-- <el-select v-model="formData.category_name" placeholder="请选择">
                    <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value">
                    </el-option>
                </el-select> -->
            </div>
            <div style="margin: 5px;">
                <el-button type="success" @click="release">发布资讯</el-button>
                <el-button type="danger" @click="clearContent">清空内容</el-button>
            </div>
        </div>



        <Toolbar style="border-bottom: 1px solid #ccc" :editor="editor" :defaultConfig="toolbarConfig" :mode="mode" />
        <Editor style="height: 500px; overflow-y: hidden;" v-model="formData.content" :defaultConfig="editorConfig"
            :mode="mode" @onCreated="onCreated" />
    </div>

</template>

<script>
import { addnews } from '../../../api/informationManagement'
import Vue from 'vue'
import { Editor, Toolbar } from '@wangeditor/editor-for-vue'

export default Vue.extend({
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
            options: [
                {
                    value: '热点',
                    label: '热点'
                },
                {
                    value: '科技',
                    label: '科技'
                },
                {
                    value: '财经',
                    label: '财经'
                },
                {
                    value: '体育',
                    label: '体育'
                },
                {
                    value: '娱乐',
                    label: '娱乐'
                },
            ],
            editor: null, // 富文本实例
            toolbarConfig: {

            },
            editorConfig: { placeholder: '请输入内容...' },
            mode: 'default', // or 'simple'
        }
    },
    methods: {
        async release() {
            let data = await addnews(this.formData)
            console.log(data)
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
        onCreated(editor) {
            this.editor = Object.seal(editor)
            // 图片上传配置
            var editorConfig = this.editor.getMenuConfig('uploadImage')
            editorConfig.server = 'https://image.xcbdsc.com/group1/upload'
            editorConfig.fieldName = 'file'
            editorConfig.meta['output'] = 'json2'
        },
    },
    mounted() {

    },
    beforeDestroy() {
        const editor = this.editor
        if (editor == null) return
        editor.destroy() // 组件销毁时，及时销毁编辑器
    },
})
</script>
