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
        <regionSelectionVue v-show="searchSeen" :ref="regionSelectionRef"></regionSelectionVue>
        <el-table :key="tableKey" v-loading="listLoading" :data="list" border fit highlight-current-row
            style="width: 100%;" @sort-change="sortChange">
            <el-table-column label="订单号" align="center">
                <template slot-scope="{row}">
                    <span>{{ row.out_trade_no }}</span>
                </template>
            </el-table-column>
            <el-table-column label="总平台运营收入" align="center">
                <template slot-scope="{row}">
                    <span>{{ (row.level1money).toFixed(2) }}</span>
                </template>
            </el-table-column>
            <el-table-column label="省级代理商" align="center">
                <template slot-scope="{row}">
                    <span>{{ (row.level2money).toFixed(2) }}</span>
                </template>
            </el-table-column>
            <el-table-column label="税金税费" align="center">
                <template slot-scope="{row}">
                    <span>{{ (row.level3money).toFixed(2) }}</span>
                </template>
            </el-table-column>
            <el-table-column label="市县代理商" align="center">
                <template slot-scope="{row}">
                    <span>{{ (row.level4money).toFixed(2) }}</span>
                </template>
            </el-table-column>
            <el-table-column label="发展商家收入" align="center">
                <template slot-scope="{row}">
                    <span>{{ (row.level5money).toFixed(2) }}</span>
                </template>
            </el-table-column>
            <el-table-column label="发展会员收入" align="center">
                <template slot-scope="{row}">
                    <span>{{ (row.level6money).toFixed(2) }}</span>
                </template>
            </el-table-column>
            <el-table-column label="会员消费返积分" align="center">
                <template slot-scope="{row}">
                    <span>{{ (row.level7money).toFixed(2) }}</span>
                </template>
            </el-table-column>

            <el-table-column label="创建时间" align="center">
                <template slot-scope="{row}">
                    <span>{{ initTime(row.createtime) }}</span>
                </template>
            </el-table-column>
            <!-- <el-table-column label="操作" align="center">
                <template slot-scope="{row}">
                    <el-tag type="success" v-if="row.status == 2" size="large">已同意</el-tag>
                    <el-button type="success" v-else @click="editItem(row)" size="small">同意申请</el-button>
                </template>
            </el-table-column> -->

        </el-table>

        <pagination v-show="total > 0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit"
            @pagination="getComplaintList" />

    </div>
</template>

<script>
import regionSelectionVue from '@/components/regionSelection'

import { revenueDetailList } from '@/api/agent'
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

        // 修改处理状态
        async editItem(row) {

            let data = await approved({ id: row.Id, status: 2 })
            if (data.code == 200) {
                this.$message({
                    message: '操作成功',
                    type: 'success'
                });
                this.getComplaintList()
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
            revenueDetailList(this.listQuery).then(response => {
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
