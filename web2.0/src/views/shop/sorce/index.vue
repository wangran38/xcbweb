<template>
  <div class="app-container">
    <div style="margin: 0 0 2% 0;display: flex; justify-content: space-between; align-items: center;">
      <div>
        <el-button v-waves class="filter-item" type="primary" icon="el-icon-search" @click="searchSeen = !searchSeen">
          查找
        </el-button>
      </div>
      <div>已付合计金额:{{ sumall / 10 }}元</div>
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
      <el-table-column label="ID" prop="id" sortable="custom" align="center" width="60"
        :class-name="getSortClass('id')">
        <template slot-scope="{row}">
          <span>{{ row.Id }}</span>
        </template>
      </el-table-column>
      <el-table-column label="申请人" align="center">
        <template slot-scope="{row}">
          <span>{{ row.username }}</span>
        </template>
      </el-table-column>
      <el-table-column label="联系电话" width="" align="center">
        <template slot-scope="{row}">
          <span>{{ row.phone }}</span>
        </template>
      </el-table-column>
      <el-table-column label="商户总积分" width="100" align="center">
        <template slot-scope="{row}">
          <span>{{ row.before }}</span>
        </template>
      </el-table-column>
      <el-table-column label="申请积分" width="80" align="center">
        <template slot-scope="{row}">
          <span>{{ row.shopscore }}</span>
        </template>
      </el-table-column>
      <el-table-column label="余额" width="60" align="center">
        <template slot-scope="{row}">
          <span>{{ row.after }}</span>
        </template>
      </el-table-column>
      <el-table-column label="申请备注" width="" align="center">
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
          <el-button v-if="row.status != 'published'" size="mini" type="success" @click="handleCreate(row)">
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

    <el-dialog :title="'详细'" :visible.sync="dialogFormVisible" :width="'60%'">
      <div style="display: flex; padding: 5px;">
        <div style="width: 90px; line-height: 40px; font-size:17px;">姓名:</div><el-input :disabled="true"
          v-model="infoData.bankusername"></el-input>
      </div>

      <div style="display: flex; padding: 5px; text-align: left;">
        <div style="width: 90px; line-height: 40px; font-size:17px; text-align: left;">卡号:</div><el-input
          :disabled="true" v-model="infoData.banknumber" style="text-align: right;"></el-input>
      </div>
      <div style="display: flex; padding: 5px;">
        <div style="width: 90px; line-height: 40px; font-size:17px;">手机号:</div><el-input :disabled="true"
          v-model="infoData.phone"></el-input>
      </div>
      <div style="display: flex; padding: 5px; text-align: left;">
        <div style="width: 90px; line-height: 40px; font-size:17px; text-align: left;">开户行:</div><el-input
          :disabled="true" v-model="infoData.bankaddress" style="text-align: right;"></el-input>
      </div>
      <div style="display: flex; padding: 5px; text-align: left;">
        <div style="width: 90px; line-height: 40px; font-size:17px; text-align: left;">银行名称:</div><el-input
          :disabled="true" v-model="infoData.bankname" style="text-align: right;"></el-input>
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
.el-input.is-disabled .el-input__inner {
  color: black;
  font-size: 17px;
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
import { getshopsorcelist, upshopsorce, changesorce } from '@/api/shop/sorce'
import waves from '@/directive/waves' // waves directive 点击水波纹
import { parseTime } from '@/utils'
import Pagination from '@/components/Pagination' // secondary package based on el-pagination
import Tinymce from '@/components/Tinymce'

import {myMixin} from '@/utils/public'

// arr to obj, such as { CN : "China", US : "USA" }

import request from '@/utils/request'


export default {
  //讲师列表
  mixins:[myMixin],
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
      infoData: {}, // 查看详细信息
      sumall: null, // 已经结算的积分总金额
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
    // this.groupoption()
    this.getChangesorceData()

  },
  methods: {
    getChangesorceData() {
      changesorce({}).then(data => {
        this.sumall = data.data.sumall
      })
    },
    getshopsorcelist() {
      this.listLoading = true
      getshopsorcelist(this.listQuery).then(response => {
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
      // this.groupoption()
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
    handleCreate(row) {
      console.log(row)
      this.infoData = row
      this.resetTemp()
      this.dialogStatus = 'create'
      this.dialogFormVisible = true
      // this.$nextTick(() => {
      //   this.$refs['dataForm'].clearValidate()
      // })
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
      this.$confirm('确定要结清吗,结清后摊主积分自动扣减？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        row.status = 2
        upshopsorce(row).then((response) => {
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
