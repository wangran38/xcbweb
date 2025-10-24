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
        <div class="filter-container" style="margin: 0 0 2% 0" v-if="searchSeen">
            <el-input v-model.number="listQuery.kname" placeholder="手机号" style="width: 200px" class="filter-item"
                @keyup.enter.native="handleFilter" />
            <el-select v-model="listQuery.status" style="width: 140px" class="filter-item" @change="handleFilter">
                <el-option v-for="item in statusOptions" :key="item.key" :label="item.label" :value="item.key" />
            </el-select>

            <el-button v-waves class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">
                提交
            </el-button>

            <!--<el-button v-waves :loading="downloadLoading" class="filter-item" type="primary" icon="el-icon-download" @click="handleDownload">
        下载表格
        </el-button>-->
            <!--<el-checkbox v-model="showReviewer" class="filter-item" style="margin-left:15px;" @change="tableKey=tableKey+1">
          展开列表
        </el-checkbox>-->
        </div>
        <el-table :key="tableKey" v-loading="listLoading" :data="list" border fit highlight-current-row
            style="width: 100%;" @sort-change="sortChange">
            <el-table-column label="ID" prop="id" sortable="custom" align="center" width="60"
                :class-name="getSortClass('id')">
                <template slot-scope="{row}">
                    <span>{{ row.Id }}</span>
                </template>
            </el-table-column>
            <!--<el-table-column label="申请人" width="110px" align="center">
        <template slot-scope="{row}">
         <el-avatar :src="row.user"></el-avatar>
        </template>
      </el-table-column>-->
            <el-table-column label="申请人" align="center">
                <template slot-scope="{row}">
                    <span>{{ row.bankusername }}</span>
                </template>
            </el-table-column>
            <el-table-column label="联系电话" width="110" align="center">
                <template slot-scope="{row}">
                    <span>{{ row.phone }}</span>
                </template>
            </el-table-column>
            <el-table-column label="地址" width="" align="center">
                <template slot-scope="{row}">
                    <span>{{ row.bankaddress }}</span>
                </template>
            </el-table-column>

            <el-table-column label="开户行" width="120" align="center">
                <template slot-scope="{row}">
                    <span>{{ row.bankname }}</span>
                </template>
            </el-table-column>

            <el-table-column label="银行卡卡号" width="180" align="center">
                <template slot-scope="{row}">
                    <span>{{ row.banknumber }}</span>
                </template>
            </el-table-column>
            <el-table-column label="申请金额" width="80" align="center">
                <template slot-scope="{row}">
                    <span>{{ row.shopmoney }}元</span>
                </template>
            </el-table-column>
            <el-table-column label="申请备注" width="130" align="center">
                <template slot-scope="{row}">
                    <span>{{ row.memo }}</span>
                </template>
            </el-table-column>
            <el-table-column label="申请状态" width="" align="center">
                <template slot-scope="{row}">
                    <span>{{ getstatusLable(row.status) }}</span>
                </template>
            </el-table-column>
            <el-table-column label="申请时间" width="200px" align="center">
                <template slot-scope="{row}">
                    <span>{{ initTime(row.Created) | initTime(row.Created, '{Y}-{m}-{d} {h}:{i}:{s}') }}</span>
                </template>
            </el-table-column>
            <el-table-column label="操作" align="center" width="200" class-name="small-padding fixed-width">
                <template slot-scope="{row,$index}">
                    <el-button v-if="row.status != 'published'" size="mini" type="success"
                        @click="handleModifyStatus(row, 'published')">
                        详细
                    </el-button>
                    <el-button type="primary" size="mini" @click="handleUpdate(row, $index)">
                        结清操作
                    </el-button>
                </template>
            </el-table-column>
        </el-table>

        <pagination v-show="total > 0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit"
            @pagination="getshopsorcelist" />

        <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible" :width="'60%'">
            <el-form ref="dataForm" :rules="rules" :model="temp" label-position="left" label-width="100px"
                style="width: 90%; margin-left:50px;">

                <el-form-item label="所属上级" prop="fid">
                    <el-cascader :options="optionsdata"
                        :props="{ checkStrictly: true, label: 'title', value: 'id', children: 'Children', emitPath: 'false' }"
                        clearable v-model="temp.categroy_id" value-key="id" @focus="groupoption" @onchange="groupoption"
                        placeholder="顶级菜单">
                    </el-cascader>
                </el-form-item>
                <!--<el-form-item label="Date" prop="timestamp">
            <el-date-picker v-model="temp.timestamp" type="datetime" placeholder="Please pick a date" />
          </el-form-item>-->
                <el-form-item label="信息标题" prop="title">
                    <el-input v-model="temp.title" />
                </el-form-item>
                <el-form-item label="信息图片" prop="image">
                    <el-upload class="avatar-uploader" action="http://img.szhfair.com/group1/upload"
                        :show-file-list="false" :on-success="handleAvatarSuccess" :before-upload="beforeAvatarUpload">
                        <img v-if="this.temp.image" :src="temp.image" class="avatar">

                        <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                    </el-upload>
                    <el-input v-model="temp.image" type="hidden" />
                </el-form-item>
                <el-form-item label="关键字" prop="keywords">
                    <el-input v-model="temp.keywords" />
                </el-form-item>


                <!--<el-form-item label="详细说明" prop="content">-->
                <!--<el-input type="textarea" :rows="2" v-model="temp.content" />-->
                <el-form-item prop="content" style="margin-bottom: 30px;">
                    <Tinymce ref="editor" v-model="temp.content" :height="500" />
                </el-form-item>


                <el-form-item label="是否显示" prop="isshow">
                    <el-switch v-model="temp.isshow" :active-value='1' :inactive-value='0'>
                    </el-switch>
                </el-form-item>


            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="dialogFormVisible = false">
                    取消
                </el-button>
                <el-button type="primary" @click="dialogStatus === 'create' ? createData() : updateData()">
                    提交
                </el-button>
            </div>
        </el-dialog>

        <el-dialog :visible.sync="dialogPvVisible" title="Reading statistics">
            <el-table :data="pvData" border fit highlight-current-row style="width: 100%">
                <el-table-column prop="key" label="Channel" />
                <el-table-column prop="pv" label="Pv" />
            </el-table>
            <span slot="footer" class="dialog-footer">
                <el-button type="primary" @click="dialogPvVisible = false">Confirm</el-button>
            </span>
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
import { changemoney, upshopmoney } from '@/api/financialManagement'
import waves from '@/directive/waves'
import { parseTime } from '@/utils'
import Pagination from '@/components/Pagination'
import Tinymce from '@/components/Tinymce'
import { myMixin } from '@/utils/public'



export default {
    name: '',
    mixins: [myMixin],
    components: { Pagination, Tinymce },
    directives: { waves },
    filters: {
        statusFilter(status) {
            const statusMap = {
                published: 'success',
                draft: 'info',
                deleted: 'danger'
            }
            return statusMap[status]
        },
        parseTime(time, cFormat) {
            return parseTime(time, cFormat)
        }
    },
    data() {
        return {
            searchSeen: false,
            tableKey: 0,
            list: null,
            total: 0,
            listLoading: true,
            listQuery: {
                limit: 20,
                page: 1,
                importance: undefined,
                username: undefined,
                categroy_id: undefined,
                status: null
            },
            importanceOptions: [1, 2, 3],
            statusOptions: [{ label: '申请中', key: 1 }, { label: '已支付', key: 2 }],
            // statusOptions: ['published', 'draft', 'deleted'],
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
        this.getshopsorcelist()
        this.groupoption()
    },
    methods: {
        getshopsorcelist() {
            this.listLoading = true
            changemoney(this.listQuery).then(response => {
                this.list = response.data.listdata
                this.total = response.data.totalnum
                setTimeout(() => {
                    this.listLoading = false
                }, 1.5 * 1000)
            })
        },
        handleFilter() {
            this.listQuery.page = 1
            this.getshopsorcelist()
            this.groupoption()
        },
        // handleModifyStatus(row, status) {
        //   this.$message({
        //     message: '操作Success',
        //     type: 'success'
        //   })
        //   row.status = status
        // },
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
        resetTemp() {
            this.temp = {
                id: undefined,
                pid: undefined,
                image: '',
                keywords: '',
                title: '',
                isshow: '',
                description: '',
                content: '',
            }
        },
        handleCreate() {
            this.resetTemp()
            this.dialogStatus = 'create'
            this.dialogFormVisible = true
            this.$nextTick(() => {
                this.$refs['dataForm'].clearValidate()
            })
        },
        createData() {

            this.$refs['dataForm'].validate((valid) => {
                if (valid) {
                    add(this.temp).then((response) => {
                        if (response.code == 200) {
                            // this.list.unshift(this.temp)
                            this.dialogFormVisible = false
                            this.$notify({
                                title: 'Success',
                                message: '创建成功',
                                type: 'success',
                                duration: 2000
                            })
                            this.getshopsorcelist();
                        } else {
                            this.$message.error('数据添加失败！');
                            // this.$message.error('添加数据失败！');
                            this.dialogFormVisible = false
                        }
                    }).catch(error => {
                        console.log(error);
                    })
                }
            })
        },

        handleUpdate(row, index) {
            if (row.status == 2) {
                this.$notify({
                    title: '已执行过此操作',
                    type: 'success',
                    duration: 2000
                })
                return
            }
            this.$confirm('确定要结清吗', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                row.status = 2
                const { Id, status } = row
                upshopmoney({ id: Id, status }).then((response) => {
                    // alert(index);
                    // console.log(response);
                    if (response.code == 200) {
                        this.dialogFormVisible = false;
                        this.$notify({
                            title: 'Success',
                            message: '结清成功！ Successfully',
                            type: 'success',
                            duration: 2000
                        })
                        this.getshopsorcelist()
                        // this.list.splice(index, 1)
                    } else {
                        this.$message.error('结清失败！');
                        // this.reload();
                    }
                })
            })
        },
        updateData() {

        },
        getstatusLable(data) {
            if (data === 0) {
                return '待结算';
            } else if (data === 1) {
                return '申请中';
            } else if (data === 2) {
                return '已支付';
            } else {
                return '待结算'
            }
        },



        handleFetchPv(pv) {
            fetchPv(pv).then(response => {
                this.pvData = response.data.pvData
                this.dialogPvVisible = true
            })
        },

        getSortClass: function (key) {
            const sort = this.listQuery.sort
            return sort === `+${key}` ? 'ascending' : 'descending'
        }
    }
}
</script>
