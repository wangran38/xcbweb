<template>
    <div class="app-container">
        <div style="margin: 0 0 2% 0">
            <el-button v-waves class="filter-item" type="primary" icon="el-icon-search"
                @click="searchSeen = !searchSeen">
                查找
            </el-button>
            <el-button class="filter-item" style="margin-left: 10px" type="primary" icon="el-icon-edit"
                @click="handleCreate">
                添加
            </el-button>
        </div>
        <el-table :key="tableKey" v-loading="listLoading" :data="list" border fit highlight-current-row
            style="width: 100%;" @sort-change="sortChange">
            <el-table-column label="id" align="center">
                <template slot-scope="{row}">
                    <span>{{ row.id }}</span>
                </template>
            </el-table-column>
            <el-table-column label="资讯类型" align="center">
                <template slot-scope="{row}">
                    <span>{{ row.category_name }}</span>
                </template>
            </el-table-column>
            <el-table-column label="标题" align="center">
                <template slot-scope="{row}">
                    <span>{{ row.title }}</span>
                </template>
            </el-table-column>
            <el-table-column label="描述" align="center">
                <template slot-scope="{row}">
                    <span>{{ row.description }}</span>
                </template>
            </el-table-column>
            <el-table-column label="创建时间" align="center">
                <template slot-scope="{row}">
                    <span>{{ initTime(row.createtime) }}</span>
                </template>
            </el-table-column>
            <el-table-column label="操作" align="center">
                <template slot-scope="{row}">
                    <el-button type="primary" @click="editItem(row)" size="small">编辑</el-button>
                    <el-button type="danger" @click="deleteData(row.id)" size="small">删除</el-button>
                </template>
            </el-table-column>
        </el-table>

        <pagination v-show="total > 0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit"
            @pagination="getnewsList" />


        <el-dialog title="编辑资讯" :visible.sync="drawer" :before-close="handleClose">
            <el-input v-model="formData.title" placeholder="请输入标题"></el-input>
            <el-input type="textarea" v-model="formData.description" placeholder="请简要描述" height="50px"></el-input>
            <el-input v-model="formData.category_name" placeholder="请输入资讯分类"></el-input>
            <div style="margin: 5px;">
                <el-button type="success" @click="updateData">修改</el-button>
            </div>

            <Toolbar style="border-bottom: 1px solid #ccc;" :editor="null" mode="default" />
            <Editor style="height: 500px; overflow-y: hidden;" v-model="formData.content" mode="default"
                @onCreated="onCreated" />
        </el-dialog>
    </div>
</template>
<style>
.avatar-uploader .el-upload {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
}

.avatar-uploader .el-upload:hover {
    border-color: #409EFF;
}

.avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 100px;
    height: 100px;
    line-height: 100px;
    text-align: center;
}

.avatar {
    width: 100px;
    height: 100px;
    display: block;
}
</style>
<style lang="scss" scoped>
@import "~@/styles/mixin.scss";

.createPost-container {
    position: relative;

    .createPost-main-container {
        padding: 40px 45px 20px 50px;

        .postInfo-container {
            position: relative;
            @include clearfix;
            margin-bottom: 10px;

            .postInfo-container-item {
                float: left;
            }
        }
    }

    .word-counter {
        width: 40px;
        position: absolute;
        right: 10px;
        top: 0px;
    }
}

.article-textarea ::v-deep {
    textarea {
        padding-right: 40px;
        resize: none;
        border: none;
        border-radius: 0px;
        border-bottom: 1px solid #bfcbd9;
    }
}
</style>
<script>
import { Editor, Toolbar } from '@wangeditor/editor-for-vue'
import { editNews, newsList, delNews } from '@/api/informationManagement'
import waves from '@/directive/waves'
import Pagination from '@/components/Pagination'
import Tinymce from '@/components/Tinymce'
import { myMixin } from '@/utils/public'


export default {
    name: '',
    mixins: [myMixin],
    components: { Pagination, Tinymce, Editor, Toolbar },
    directives: { waves },
    data() {
        return {
            formData: {
                category_name: '',
                title: '',
                keywords: '',
                description: '',
                content: '',
            },
            drawer: false,
            direction: 'rtl', // 抽屉展开方向
            searchSeen: false,
            tableKey: 0,
            list: null,
            total: 0,
            listLoading: true,
            listQuery: {
                limit: 20,
                page: 1,
            },
            importanceOptions: [1, 2, 3],
            showReviewer: false,
            temp: {
                id: undefined,
                categroy_id: undefined,
                image: '',
                keywords: '',
                title: '',
                isshow: undefined,
                description: '',
                content: '',
            },
            imgurl: '',
            dialogFormVisible: false,
            dialogStatus: '',
            textMap: {
                update: '编辑',
                create: '新增'
            },
            dialogPvVisible: false,
            pvData: [],
            rules: {
                type: [{ required: true, message: 'type is required', trigger: 'change' }],
                timestamp: [{ type: 'date', required: true, message: 'timestamp is required', trigger: 'change' }],
                title: [{ required: true, message: '分类标题不能为空', trigger: 'blur' }]
            },
            downloadLoading: false,
            optionsdata: [],
        }

    },
    created() {
        this.getnewsList()
    },
    methods: {
        async updateData() {
            let data = await editNews(this.formData)
            if (data.code == 200) {
                this.$notify({
                    title: '修改成功',
                    message: '修改成功',
                    type: 'success',
                    duration: 2000
                })
                this.drawer = false
                this.getnewsList()
            } else {
                this.$notify({
                    title: 'Error',
                    message: data.msg,
                    type: 'error',
                    duration: 2000
                })
            }
        },
        editItem(item) {
            this.drawer = true
            if (item) {
                this.formData.title = item.title
                this.formData.description = item.description
                this.formData.category_name = item.category_name
                this.formData.content = item.content
                this.formData.id = item.id
            }
            console.log(item)
        },
        onCreated(editor) {
            this.editor = Object.seal(editor) // 一定要用 Object.seal() ，否则会报错
        },
        handleClose(done) {
            this.$confirm('确认关闭？')
                .then(_ => {
                    done();
                })
                .catch(_ => { });
        },
        getnewsList() {
            this.listLoading = true
            newsList(this.listQuery).then(response => {
                this.list = response.data.listdata
                this.total = response.data.totalnum
                setTimeout(() => {
                    this.listLoading = false
                }, 1.5 * 1000)
            })
        },
        sortChange(data) {
            const { prop, order } = data
            if (prop === 'Id') {
                this.sortByID(order)
            }
        },
        sortByID(order) {
            if (order === 'ascending') {
                this.listQuery.sort = '+id'
            } else {
                this.listQuery.sort = '-id'
            }
            this.handleFilter()
        },
        handleCreate() {
        },
        createData() {

        },
        deleteData(id) {
            console.log(id)
            this.$confirm('此操作将永久删除数据, 是否继续?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                delNews({ id: id }).then((res) => {
                    if (res.code = 200) {
                        this.getnewsList()
                        this.$message({
                            type: 'success',
                            message: '删除成功!'
                        });

                    }

                })

            }).catch((error) => {
                console.log(error)
                this.$message({
                    type: 'info',
                    message: '已取消删除'
                });
            });
        }




    }
}
</script>
