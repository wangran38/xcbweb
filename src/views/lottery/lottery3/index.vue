<template>
  <div class="app-container">
    <div class="filter-container" style="margin:0 0 2% 0;">
      <el-button v-waves class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">
        一键摇三等奖
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
      <el-table-column label="中奖ID" prop="id" sortable="custom" align="center" width="80"
        :class-name="getSortClass('id')">
        <template slot-scope="{row}">
          <span>{{ row.usersign_id }}</span>
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

      <el-table-column label="市场名称" min-width="160px" align="center">
        <template slot-scope="{row}">
          <span>{{ row.marketname }}</span>
        </template>
      </el-table-column>
      <el-table-column label="中奖名次" width="" align="center">
        <template slot-scope="{row}">
          <span>{{ row.type }}等奖</span>
        </template>
      </el-table-column>
      <el-table-column label="打卡记录" width="200px" align="center">
        <template slot-scope="{row}">
          <span>{{ initTime(row.Createtime) }}</span>
        </template>
      </el-table-column>
      <el-table-column label="赠送积分" width="200px" align="center">
        <template slot-scope="{row}">
          <span>{{ row.score }}</span>
        </template>
      </el-table-column>
      <el-table-column label="开奖时间" width="160px" align="center">
        <template slot-scope="{row}">
          <span>{{ row.Created | parseTime(row.Created, '{y}-{m}-{d} {h}:{i}') }}</span>
        </template>
      </el-table-column>



      <el-table-column label="操作" align="center" width="200" class-name="small-padding fixed-width">
        <template slot-scope="{row,$index}">
          <el-button v-if="row.status != 'deleted'" size="mini" type="danger" :disabled="true"
            @click="handleDelete(row, $index)">
            删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination v-show="total > 0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit"
      @pagination="getsignlistgroup" />

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
          <el-upload class="avatar-uploader" action="http://img.szhfair.com/group1/upload" :show-file-list="false"
            :on-success="handleAvatarSuccess" :before-upload="beforeAvatarUpload">
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
import { getlottery3list } from '@/api/lottery/lottery3'
import { getlotteryrecordlist } from '@/api/lottery/lotterylist'
import waves from '@/directive/waves' // waves directive 点击水波纹
import { parseTime } from '@/utils'
import Pagination from '@/components/Pagination' // secondary package based on el-pagination
import Tinymce from '@/components/Tinymce'


// arr to obj, such as { CN : "China", US : "USA" }

import request from '@/utils/request'


export default {
  //讲师列表

  name: '',
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
      tableKey: 0,
      list: null,
      total: 0,
      listLoading: true,
      listQuery: {
        limit: 10,
        page: 1,
        type: 3,
        importance: undefined,
        username: undefined,
        categroy_id: undefined,
        sort: '+id'
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
    this.getlotteryrecordlist()
  },
  methods: {
    initTime(str) {
      let timestamp = new Date(str).getTime()
      var time = String(timestamp).length === 10 ? new Date(parseInt(timestamp) * 1000) : new Date(parseInt(
        timestamp))
      var y = time.getFullYear() // 年
      var m = time.getMonth() + 1 // 月
      if (m < 10) {
        m = '0' + m
      }
      var d = time.getDate() // 日
      if (d < 10) {
        d = '0' + d
      }
      var h = time.getHours() // 时
      if (h < 10) {
        h = '0' + h
      }
      var mm = time.getMinutes() // 分
      if (mm < 10) {
        mm = '0' + mm
      }
      var s = time.getSeconds() // 秒
      if (s < 10) {
        s = '0' + s
      }
      var timeStr = y + '-' + m + '-' + d + ' ' + h + ':' + mm + ':' + s
      return timeStr
    },
    getlotteryrecordlist() {
      this.listLoading = true
      getlotteryrecordlist(this.listQuery).then(response => {
        this.list = response.data.listdata
        this.total = response.data.totalnum

        // Just to simulate the time of the request
        setTimeout(() => {
          this.listLoading = false
        }, 1.5 * 1000)
      })
    },
    getlottery3list() {
      this.listLoading = true
      getlottery3list(this.listQuery).then(response => {
        this.getlotteryrecordlist()
        //   this.list = response.data.listdata
        //   this.total = response.data.totalnum

        // Just to simulate the time of the request
        setTimeout(() => {
          this.listLoading = false
        }, 1.5 * 1000)
      })
    },
    handleFilter() {
      this.listQuery.page = 1
      this.getlotteryrecordlist(),
        this.getlottery3list()
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
              this.getsignlistgroup();
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
            this.getsignlistgroup();
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