<template>
  <div class="app-container">
    <div style="margin: 0 0 2% 0">
      <el-button v-waves class="filter-item" type="primary" icon="el-icon-search" @click="searchSeen = !searchSeen">
        查找
      </el-button>
      <el-button class="filter-item" style="margin-left: 10px" type="primary" icon="el-icon-edit" @click="handleCreate">
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
    </div>
    <el-table :key="tableKey" v-loading="listLoading" :data="list" border fit highlight-current-row style="width: 100%;"
      @sort-change="sortChange">
      <el-table-column label="市场名称" align="center">
        <template slot-scope="{row}">
          <span>{{ row.market_name }}</span>
        </template>
      </el-table-column>
      <el-table-column label="地区名称" align="center">
        <template slot-scope="{row}">
          <span>{{ row.area_name }}</span>
        </template>
      </el-table-column>
      <el-table-column label="详细地址" align="center">
        <template slot-scope="{row}">
          <span>{{ row.area_name }}</span>
        </template>
      </el-table-column>
      <el-table-column label="联系电话" align="center">
        <template slot-scope="{row}">
          <span>{{ row.phone }}</span>
        </template>
      </el-table-column>
      <el-table-column label="农户名称" align="center">
        <template slot-scope="{row}">
          <span>{{ row.farmersname }}</span>
        </template>
      </el-table-column>
      <el-table-column label="创建时间" align="center">
        <template slot-scope="{row}">
          <span>{{ initTime(row.createtime) }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center">
        <template slot-scope="{row}">
          <el-button type="primary" size="small">编辑</el-button>
          <el-button type="danger" size="small">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination v-show="total > 0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit"
      @pagination="getfarmerslist" />

    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible" :width="'60%'">


      <Toolbar style="border-bottom: 1px solid #ccc;" :editor="null" mode="default" />
      <Editor style="height: 500px; overflow-y: hidden;" v-model="formData.content" mode="default"
        @onCreated="onCreated" />
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
import { Editor, Toolbar } from '@wangeditor/editor-for-vue'
import { farmerslist } from '@/api/farmers'
import waves from '@/directive/waves' // waves directive 点击水波纹
import { parseTime } from '@/utils'
import Pagination from '@/components/Pagination'
import Tinymce from '@/components/Tinymce'
import { myMixin } from '@/utils/public'


export default {
  name: '',
  mixins: [myMixin],
  components: { Pagination, Editor, Toolbar },
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
      formData: {
        category_name: '',
        title: '',
        keywords: '',
        description: '',
        content: '',
      },
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
    this.getfarmerslist()
    // this.groupoption()
  },
  methods: {
    onCreated(editor) {
      this.editor = Object.seal(editor) // 一定要用 Object.seal() ，否则会报错
    },
    getfarmerslist() {
      this.listLoading = true
      farmerslist(this.listQuery).then(response => {
        this.list = response.data.listdata
        this.total = response.data.totalnum
        setTimeout(() => {
          this.listLoading = false
        }, 1.5 * 1000)
      })
    },
    handleFilter() {
      this.listQuery.page = 1
      this.getfarmerslist()
      this.groupoption()
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
      this.$confirm('确定要结清吗', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        row.status = 2
        upshopmoney(row).then((response) => {
          // alert(index);
          // console.log(response);
          if (response.code == 200) {
            this.dialogFormVisible = false;
            this.$notify({
              title: 'Success',
              message: '数据删除成功！ Successfully',
              type: 'success',
              duration: 2000
            })
            this.getshopsorcelist()
            // this.list.splice(index, 1)
          } else {
            this.$message.error('删除数据失败！');
            // this.reload();
          }
        })
      })
    },



  }
}
</script>
