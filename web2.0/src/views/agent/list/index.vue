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
        <div v-show="searchSeen"
            style="margin: 10px; display: flex; align-items: center; justify-content: space-between; width: 700px;">
            <regionSelectionVue :ref="regionSelectionRef"></regionSelectionVue>
            <div>用户ID <el-input style="width: 100px;"></el-input></div>
            <div>手机号 <el-input style="width: 100px;"></el-input></div>

            <el-button type="success">搜索</el-button>
        </div>

        <el-table :key="tableKey" v-loading="listLoading" :data="list" border fit highlight-current-row
            style="width: 100%;" @sort-change="sortChange">

            <el-table-column label="ID" align="center">
                <template slot-scope="{row}">
                    <span>{{ row.Id }}</span>
                </template>
            </el-table-column>

            <el-table-column label="用户id" align="center">
                <template slot-scope="{row}">
                    <span>{{ row.userid }}</span>
                </template>
            </el-table-column>

            <el-table-column label="代理商名称" align="center">
                <template slot-scope="{row}">
                    <span>{{ row.nickname }}</span>
                </template>
            </el-table-column>
            <el-table-column label="代理商手机号" align="center">
                <template slot-scope="{row}">
                    <span>{{ row.phone }}</span>
                </template>
            </el-table-column>
            <el-table-column label="类型" align="center">
                <template slot-scope="{row}">
                    <span v-if="row.type == 1">省级代理</span>
                    <span v-else>市县区级代理</span>
                </template>
            </el-table-column>
            <el-table-column label="代理商邮箱" align="center">
                <template slot-scope="{row}">
                    <span>{{ row.email }}</span>
                </template>
            </el-table-column>



            <el-table-column label="创建时间" align="center">
                <template slot-scope="{row}">
                    <span>{{ initTime(row.Created) }}</span>
                </template>
            </el-table-column>
            <el-table-column label="操作" align="center">
                <template slot-scope="{row}">
                    <div style="display: flex;">
                        <el-button type="success" v-if="row.status == 2" size="small" disabled>已同意</el-button>
                        <el-button type="success" v-else @click="editItem(row)" size="small">同意</el-button>
                        <el-button type="danger" size="small" @click="editItem(row, true)">删除</el-button>
                    </div>
                    <!-- <el-button type="danger">拒绝申请</el-button> -->
                </template>
            </el-table-column>


            <!-- <el-table-column label="操作" align="center">
                <template>
                    <el-button size="small" type="success" @click="editItem(row)">修改处理状态</el-button>
                </template>
            </el-table-column> -->
        </el-table>

        <pagination v-show="total > 0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit"
            @pagination="getComplaintList" />

    </div>
</template>

<script>
import regionSelectionVue from '@/components/regionSelection'

import { agentDataList, approved, rmroved } from '@/api/agent'
import waves from '@/directive/waves'
import Pagination from '@/components/Pagination'
import { myMixin } from '@/utils/public'


export default {
    name: '',
    mixins: [myMixin],
    components: { Pagination, regionSelectionVue },
    directives: { waves },
    data() {
        return {
            regionSelectionRef: null,
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
        this.getComplaintList()
    },
    methods: {

        // 修改处理状态 同时处理同意申请和删除申请
        async editItem(row, Class = false) {
            if (Class) {
                let data = await rmroved({ id: row.Id })
                if (data.code == 200) {
                    this.$message({
                        message: '删除成功',
                        type: 'success'
                    });
                    this.getComplaintList()
                }
            } else {
                let data = await approved({ id: row.Id, status: 2 })
                if (data.code == 200) {
                    this.$message({
                        message: '操作成功',
                        type: 'success'
                    });
                    this.getComplaintList()
                }
            }


        },
        handleClose(done) {
            this.$confirm('确认关闭？')
                .then(_ => {
                    done();
                })
                .catch(_ => { });
        },
        getComplaintList() {
            this.listLoading = true
            agentDataList(this.listQuery).then(response => {
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
            console.log(this.regionSelectionRef)
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
