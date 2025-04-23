<template>
  <div class="app-container">
    <div style="margin: 0 0 2% 0">
      <el-button v-waves class="filter-item" type="primary" icon="el-icon-search" @click="searchSeen = !searchSeen">
        查找
      </el-button>
      <el-button class="filter-item" style="margin-left: 10px" type="primary" icon="el-icon-edit" @click="clearQuery">
        清除搜索条件
      </el-button>
    </div>

    <div class="filter-container" style="margin: 0 0 2% 0" v-if="searchSeen">
      <el-input v-model="listQuery.out_trade_no" placeholder="订单号" style="width: 200px" class="filter-item"
        @keyup.enter.native="handleFilter" />
      <el-select v-model="listQuery.pay_way" placeholder="支付方式">
        <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value">
        </el-option>
      </el-select>
      <el-date-picker v-model="listQuery.dateTime" type="datetimerange" :picker-options="pickerOptions"
        range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期" align="right" value-format="timestamp">
      </el-date-picker>
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
    <el-table :key="tableKey" v-loading="listLoading" element-loading-text="拼命加载中"
      element-loading-spinner="el-icon-loading" :data="list" border fit highlight-current-row style="width: 100%;"
      @sort-change="sortChange">
      <el-table-column label="ID" prop="id" sortable align="center" width="80" :class-name="getSortClass('id')">
        <template slot-scope="{row}">
          <span>{{ row.id }}</span>
        </template>
      </el-table-column>
      <el-table-column label="订单编号" width="" align="center">
        <template slot-scope="{row}">
          <span>{{ row.out_trade_no }}</span>
        </template>
      </el-table-column>
      <el-table-column label="市场名称" min-width="100px" align="center">
        <template slot-scope="{row}">
          <span @click="viewDetail(0, row)">{{ row.market_name }}</span>
        </template>
      </el-table-column>

      <el-table-column label="摊位名称" width="100" align="center">
        <template slot-scope="{row}">
          <span @click="viewDetail(1, row)">{{ row.shop_name }}</span>
        </template>
      </el-table-column>
      <el-table-column label="购买人" width="" align="center">
        <template slot-scope="{row}">
          <span @click="viewDetail(2, row)">{{ row.phone }}</span>
        </template>
      </el-table-column>
      <el-table-column label="订单总价" width="" align="center">
        <template slot-scope="{row}">
          <span>¥{{ row.price }}</span>
        </template>
      </el-table-column>
      <el-table-column label="支付积分" width="" align="center">
        <template slot-scope="{row}">
          <span>{{ row.payprice * 10 }}</span>
        </template>
      </el-table-column>
      <el-table-column label="支付方式" width="" align="center">
        <template slot-scope="{row}">
          <span>{{ getpaywayLable(row.pay_way) }}</span>
        </template>
      </el-table-column>
      <el-table-column label="订单状态" width="" align="center">
        <template slot-scope="{row}">
          <span>{{ getTagLable(row.status) }}</span>
        </template>
      </el-table-column>
      <el-table-column label="消费时间" width="200px" align="center">
        <template slot-scope="{row}">
          <span>{{ initTime(row.createtime) }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" width="200" class-name="small-padding fixed-width">
        <template slot-scope="{row,$index}">
          <!--<el-button type="primary" size="mini" @click="handleUpdate(row)">
              修改
            </el-button>-->
          <el-button v-if="row.status != 'published'" size="mini" type="success"
            @click="handleModifyStatus(row, 'published')">
            详细
          </el-button>
          <!--<el-button v-if="row.status!='draft'" size="mini" @click="handleModifyStatus(row,'draft')">
              Draft
            </el-button>-->
          <!--<el-button v-if="row.status!='deleted'" size="mini" type="danger" @click="handleDelete(row,$index)">
              删除
            </el-button>-->
        </template>
      </el-table-column>
    </el-table>

    <pagination v-show="total > 0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit"
      @pagination="getlist" />


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
import {myMixin} from '@/utils/public'
import { getorderlist } from '@/api/order/list/list'
import waves from '@/directive/waves' // waves directive 点击水波纹
import { parseTime } from '@/utils'
import Pagination from '@/components/Pagination' // secondary package based on el-pagination
import Tinymce from '@/components/Tinymce'



import request from '@/utils/request'
import { getList } from '@/api/table'


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

      searchSeen: false,
      tableKey: 0,
      list: null,
      total: 0,
      listLoading: true,

      options: [
        { value: 0, label: '全部' },
        { value: 1, label: '积分支付' },
        { value: 2, label: '微信支付' },
      ],
      // 请求参数
      listQuery: {
        pay_way: 0, // 支付方式
        limit: 10,
        page: 1,
        // importance: undefined,
        out_trade_no: undefined,
        // market_id: undefined,
        // shop_id: undefined,
        sort: '+id',
        dateTime: [],
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
    this.getlist(),
      this.groupoption()
  },
  methods: {
    groupoption() { },

    viewDetail(status, item) {
      switch (status) {
        case 0:
          this.listQuery.market_id = item.market_id
          break
        case 1:
          this.listQuery.shop_id = item.shop_id
          break
        case 2:
          this.listQuery.uid = item.uid
          break
      }
      this.listQuery.page = 1

      this.getlist()
    },
    clearQuery() {
      this.listQuery = {
        limit: 10,
        page: 1,
        importance: undefined,
        out_trade_no: undefined,
        market_id: undefined,
        shop_id: undefined,
        sort: '+id'
      }
      this.getlist()
    },

    // 请求数据
    getlist() {
      this.listLoading = true
      getorderlist(this.listQuery).then(response => {
        this.list = response.data.listdata
        this.total = response.data.totalnum
        setTimeout(() => {
          this.listLoading = false
        }, 1.5 * 1000)
      })
    },

    // 检索数据
    handleFilter(e) {
      if (this.listQuery.dateTime) {
        let [begintime, endtime] = this.listQuery.dateTime
        this.listQuery.begintime = parseInt(begintime / 1000)
        this.listQuery.endtime = parseInt(endtime / 1000)
      }

      this.listQuery.page = 1
      this.getlist()
      this.groupoption()
    },
    getTagLable(data) {
      if (data === 0) {
        return '支付中';
      } else if (data === 1) {
        return '未支付';
      } else if (data === 2) {
        return '已支付';
      } else if (data === 3) {
        return '未收货';
      } else if (data === 4) {
        return '已收货';
      } else if (data === 5) {
        return '待结算';
      } else if (data === 6) {
        return '已结算';
      } else {
        return ''
      }
    },
    getpaywayLable(data) {
      if (data === 0) {
        return '未知';
      } else if (data === 1) {
        return '积分支付';
      } else if (data === 2) {
        return '微信支付';
      } else if (data === 3) {
        return '支付宝支付';
      } else {
        return ''
      }
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

    // 排序
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
      //
      this.clearQuery()
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
              this.getlist();
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
          tempData.timestamp = +new Date(tempData.timestamp)
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
            this.getmarketlist();
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
