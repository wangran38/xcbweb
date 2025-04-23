<template>
  <div class="app-container">
    <div class="filter-container" style="margin:0 0 2% 0;">
      <el-button v-waves class="filter-item" type="primary" icon="el-icon-search"
        @click="finlterIsShow = !finlterIsShow">
        查找
      </el-button>
      <el-button class="filter-item" style="margin-left: 10px;" type="primary" icon="el-icon-edit"
        @click="handleCreate">
        添加
      </el-button>
    </div>

    <div class="filter" v-show="finlterIsShow">
      <el-input v-model="listQuery.phone" placeholder="请输入手机号" style="width: 200px;" class="filter-item"
        @keyup.enter.native="handleFilter" />
      <el-select v-model="listQuery.sort" style="width: 140px" class="filter-item" @change="handleFilter">
        <el-option v-for="item in sortOptions" :key="item.key" :label="item.label" :value="item.key" />
      </el-select>
      <el-date-picker v-model="listQuery.dateTime" type="datetimerange" :picker-options="pickerOptions"
        range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期" align="right" value-format="timestamp">
      </el-date-picker>

      <el-button class="filter-item" style="margin-left: 10px;" type="success" icon="el-icon-edit" @click="search">
        搜索
      </el-button>
    </div>
    <el-table :key="tableKey" v-loading="listLoading" :data="list" border fit highlight-current-row style="width: 100%;"
      @sort-change="sortChange">
      <el-table-column label="ID" prop="id" sortable="custom" align="center" width="80"
        :class-name="getSortClass('id')">
        <template slot-scope="{row}">
          <span>{{ row.Id }}</span>
        </template>
      </el-table-column>
      <el-table-column label="用户id" width="110px" align="center">
        <template slot-scope="{row}">
          <span>{{ row.user_id }}</span>
        </template>
      </el-table-column>


      <el-table-column label="用户手机" width="" align="center">
        <template slot-scope="{row}">
          <span>{{ row.phone }}</span>
        </template>
      </el-table-column>
      <el-table-column label="签到日期" width="200px" align="center">
        <template slot-scope="{row}">
          <span>{{ initTime(row.Created) }}</span>
        </template>
      </el-table-column>

      <el-table-column label="市场id" min-width="60px" align="center">
        <template slot-scope="{row}">
          <span>{{ row.market_id }}</span>
        </template>
      </el-table-column>
      <el-table-column label="市场名称" min-width="100px" align="center">
        <template slot-scope="{row}">
          <span>{{ row.marketname }}</span>
        </template>
      </el-table-column>




      <el-table-column label="操作" align="center" width="200" class-name="small-padding fixed-width">
        <template slot-scope="{row,$index}">
          <el-button type="primary" size="mini" @click="handleUpdate(row)">
            修改
          </el-button>
          <el-button v-if="row.status != 'deleted'" size="mini" type="danger" @click="handleDelete(row, $index)">
            删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination v-show="total > 0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit"
      @pagination="getList" />
  </div>
</template>
<style>
.filter {
  margin: 15px;
  width: 800px;
  display: flex;
  justify-content: space-between;
}

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
import { getsignlist } from '@/api/usersign/list'
import waves from '@/directive/waves' // waves directive 点击水波纹
import { parseTime } from '@/utils'
import Pagination from '@/components/Pagination' // secondary package based on el-pagination
import Tinymce from '@/components/Tinymce'


import {myMixin} from '@/utils/public'


export default {
  //讲师列表

  name: '',
  mixins:[myMixin],
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
      pickerOptions: {
        shortcuts: [{
          text: '最近一周',
          onClick(picker) {
            const end = new Date();
            const start = new Date();
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
            picker.$emit('pick', [start, end]);
          }
        }, {
          text: '最近一个月',
          onClick(picker) {
            const end = new Date();
            const start = new Date();
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
            picker.$emit('pick', [start, end]);
          }
        }, {
          text: '最近三个月',
          onClick(picker) {
            const end = new Date();
            const start = new Date();
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
            picker.$emit('pick', [start, end]);
          }
        }]
      },
      finlterIsShow: false,

      tableKey: 0,
      list: null,
      total: 0,
      listLoading: true,
      listQuery: {
        dateTime: [],
        limit: 20,
        page: 1,
        market_id: undefined, // 市场id
        sort: '+id',
        phone: undefined
      },
      importanceOptions: [1, 2, 3],
      sortOptions: [{ label: 'ID 升序', key: '+id' }, { label: 'ID 倒序', key: '-id' }],
      statusOptions: ['published', 'draft', 'deleted'],
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
    this.getList()
  },
  methods: {


    search() {
      // 如果有选时间就处理时间
      if (this.listQuery.dateTime) {
        let time = this.listQuery.dateTime
        this.listQuery.begintime = parseInt(time[0] / 1000)
        this.listQuery.endtime = parseInt(time[1] / 1000)
      }
      this.listQuery.page = 1
      this.getList()
    },
    getList() {
      this.listLoading = true
      getsignlist(this.listQuery).then(response => {
        this.list = response.data.listdata
        this.total = response.data.totalnum
        setTimeout(() => {
          this.listLoading = false
        }, 1.5 * 1000)
      })
    },
    handleFilter() {
      this.listQuery.page = 1
      this.getList()
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
      if (prop === 'id') {
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
              this.getList();
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

    handleUpdate(row) {
      this.temp = Object.assign({}, row) // copy obj
      this.temp.timestamp = new Date(this.temp.timestamp)
      this.dialogStatus = 'update'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    updateData() {

      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          //处理父级ID

          const tempData = Object.assign({}, this.temp)
          tempData.timestamp = +new Date(tempData.timestamp) // change Thu Nov 30 2017 16:41:05 GMT+0800 (CST) to 1512031311464
          edit(tempData).then(() => {
            const index = this.list.findIndex(v => v.id === this.temp.id)
            this.list.splice(index, 1, this.temp)
            this.dialogFormVisible = false
            this.$notify({
              title: 'Success',
              message: '更新 Successfully',
              type: 'success',
              duration: 2000
            })
            this.getList();
          })
        }
      })
    },
    /* 删除按钮*/
    handleDelete(row, index) {
      this.$confirm('确定要删除【' + row.title + '】吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        del(row).then((response) => {
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
            this.list.splice(index, 1)
          } else {
            this.$message.error('删除数据失败！');
            // this.reload();
          }
        })
      })

    },
    //头像上传
    handleAvatarSuccess(res, file) {
      this.imgurl = URL.createObjectURL(file.raw);
      this.temp.image = res;
      // console.log(this.temp.image)
    },
    beforeAvatarUpload(file) {
      const isJPG = file.type === 'image/jpg';
      const isPng = file.type === "image/png";
      const isJpeg = file.type === "image/jpeg";
      const isLt2M = file.size / 1024 / 1024 < 2;

      if (!isJPG & !isPng & !isJpeg) {
        this.$message.error('上传头像图片只能是图片格式!');
        return false
      }
      if (!isLt2M) {
        this.$message.error('上传头像图片大小不能超过 2MB!');
        return false
      }
      return true;
    },
    handleFetchPv(pv) {
      fetchPv(pv).then(response => {
        this.pvData = response.data.pvData
        this.dialogPvVisible = true
      })
    },
    handleDownload() {
      this.downloadLoading = true
      import('@/vendor/Export2Excel').then(excel => {
        const tHeader = ['timestamp', 'title', 'type', 'importance', 'status']
        const filterVal = ['timestamp', 'title', 'type', 'importance', 'status']
        const data = this.formatJson(filterVal)
        excel.export_json_to_excel({
          header: tHeader,
          data,
          filename: 'table-list'
        })
        this.downloadLoading = false
      })
    },
    formatJson(filterVal) {
      return this.list.map(v => filterVal.map(j => {
        if (j === 'timestamp') {
          return parseTime(v[j])
        } else {
          return v[j]
        }
      }))
    },
    getSortClass: function (key) {
      const sort = this.listQuery.sort
      return sort === `+${key}` ? 'ascending' : 'descending'
    }
  }
}
</script>
