<template>
  <div class="app-container">

    <div style="margin:0 0 2% 0;">
      <el-button v-waves class="filter-item" type="primary" icon="el-icon-search" @click="resetData">
        清空
      </el-button>
      <el-button v-waves class="filter-item" type="primary"
        :icon="searchSeen ? 'el-icon-arrow-up' : 'el-icon-arrow-down'" @click="searchSeen = !searchSeen">
        查找
      </el-button>
    </div>
    <div class="filter-container" style="margin:0 0 2% 0;" v-if="searchSeen">
      <el-input v-model="listQuery.phone" placeholder="输入名称" style="width: 200px;" class="filter-item"
        @keyup.enter.native="handleFilter" />
      <el-select v-model="listQuery.sort" style="width: 140px" class="filter-item" @change="handleFilter">
        <el-option v-for="item in sortOptions" :key="item.key" :label="item.label" :value="item.key" />
      </el-select>
      <el-button v-waves class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">
        提交
      </el-button>

      <!--<el-checkbox v-model="showReviewer" class="filter-item" style="margin-left:15px;" @change="tableKey=tableKey+1">
          展开列表
        </el-checkbox>-->

    </div>

    <el-table :key="tableKey" v-loading="listLoading" :data="list" border fit highlight-current-row style="width: 100%;"
      @sort-change="sortChange">
      <el-table-column label="用户ID" prop="id" sortable="custom" align="center" width="100"
        :class-name="getSortClass('id')">
        <template slot-scope="{row}">
          <span>{{ row.Id }}</span>
        </template>
      </el-table-column>
      <el-table-column label="用户头像" width="120px" align="center">
        <template slot-scope="{row}">
          <el-avatar :src="row.headimgurl"></el-avatar>
        </template>
      </el-table-column>
      <el-table-column label="用户昵称" width="100px" align="center">
        <template slot-scope="{row}">
          <span>{{ row.nickname }}</span>
        </template>
      </el-table-column>

      <el-table-column label="手机号码" width="160px" align="center">
        <template slot-scope="{row}">
          <span>{{ row.phone }}</span>
        </template>
      </el-table-column>
      <el-table-column label="个人积分" width="100px" align="center">
        <template slot-scope="{row}">
          <span>{{ row.score }}</span>
        </template>
      </el-table-column>
      <el-table-column label="注册时间" align="center" width="180px">
        <template slot-scope="{row}">
          <span>{{ initTime(row.created) }}</span>
        </template>
      </el-table-column>

      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="{row,$index}">

          <el-button v-if="row.status != 'published'" size="mini" type="success" @click="viewDetails(row)">
            订单明细
          </el-button>
        </template>
      </el-table-column>
    </el-table>


    <el-drawer :title="'订单明细'" :visible.sync="table" direction="rtl" size="50%">
      <div style="display: flex; margin: 5px 5px; align-items: center;">
        <div style="font-size: 18px;">支付方式</div>
        <el-select v-model="orderListQuery.pay_way" placeholder="Select" style="width: 240px;margin: 0 0 0 10px;">
          <el-option v-for="item in playOptions" :key="item.value" :label="item.label" :value="item.value"
            :disabled="item.disabled" />
        </el-select>
      </div>
      <el-table :key="tableKey" v-loading="orderListLoading" element-loading-text="拼命加载中"
        element-loading-spinner="el-icon-loading" :data="orderList" border style="width: 100%;"
        @sort-change="sortChange" :stripe="true" empty-text="暂无数据" height="400">
        <el-table-column label="订单编号" width="" align="center">
          <template slot-scope="{row}">
            <span>{{ row.id }}</span>
          </template>
        </el-table-column>
        <el-table-column label="市场名称" min-width="100px" align="center">
          <template slot-scope="{row}">
            <span>{{ row.market_name }}</span>
          </template>
        </el-table-column>

        <el-table-column label="摊位名称" width="100" align="center">
          <template slot-scope="{row}">
            <span>{{ row.shop_name }}</span>
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
        <el-table-column label="消费时间" width="100px" align="center">
          <template slot-scope="{row}">
            <span>{{ initTime(row.createtime) }}</span>
          </template>
        </el-table-column>
      </el-table>

      <pagination v-show="orderTotal > 0" :total="orderTotal" :page.sync="orderListQuery.page"
        :limit.sync="orderListQuery.limit" @pagination="paginationOrderList" />
    </el-drawer>


    <pagination v-show="total > 0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit"
      @pagination="getList" />

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

.item {
  margin-top: 10px;
  margin-right: 20px;
}
</style>
<script>
import { getuserinfolist } from '@/api/user/list'
import { getorderlist } from '@/api/order/list/list'
import waves from '@/directive/waves' // waves directive 点击水波纹
import { parseTime } from '@/utils'
import Pagination from '@/components/Pagination'

import { myMixin } from "@/utils/public";




export default {
  //列表

  name: '',
  mixins: [myMixin],
  components: { Pagination },
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
      table: false,
      orderList: null,
      selectUser: null,
      orderTotal: null,
      searchSeen: false,
      selectPlay: 0,
      tableKey: 0,
      list: null,
      orderListQuery: {
        pay_way: 0,
        uid: null,
        limit: 20,
        page: 1,
        sort: '+id'
      },
      orderListLoading: false,
      playOptions: [
        {
          value: 0,
          label: '全部',
        },
        {
          value: 2,
          label: '微信支付',
        },
        {
          value: 1,
          label: '积分支付',
        },
      ],



      total: 0,
      listLoading: true,
      listQuery: {
        limit: 20,
        page: 1,
        importance: undefined,
        username: undefined,
        type: undefined,
        sort: '+id',
        phone: null,
      },
      importanceOptions: [1, 2, 3],
      sortOptions: [{ label: 'ID 升序', key: '+id' }, { label: 'ID 倒序', key: '-id' }],
      statusOptions: ['published', 'draft', 'deleted'],
      showReviewer: false,
      temp: {
        id: undefined,
        out_trade_no: undefined,
        name: '',
        simid: undefined,
        msisdn: '',
        imsi: '',
        isopen: '',
        image: '',
        remark: '',
      },
      temp1: {
        id: undefined,
        openid: undefined,
        companyname: '',
        name: '',
        sex: '',
        job: '',
        phone: '',
        email: '',
        idcard: ''
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
        // type: [{ required: true, message: 'type is required', trigger: 'change' }],
        // timestamp: [{ type: 'date', required: true, message: 'timestamp is required', trigger: 'change' }],
        // title: [{ required: true, message: '分类标题不能为空', trigger: 'blur' }]
      },
      downloadLoading: false,
      optionsdata: [],
    }

  },
  created() {
    this.getList()
  },
  watch: {
    'orderListQuery.pay_way'(newValue, oldValue) {
      this.getOrderlist()
    }
  },
  methods: {
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
    viewDetails(item) {
      this.table = true
      this.orderListQuery.uid = item.Id
      this.getOrderlist()
    },
    async paginationOrderList(query) {
      console.log(query, this.orderListQuery)
      this.orderListLoading = true
      let { data } = await getorderlist(this.orderListQuery)
      // 订单列表
      this.orderList = data.listdata
      setTimeout(() => { this.orderListLoading = false }, 1000)
    },
    // 请求数据
    getOrderlist() {
      this.orderListLoading = true
      getorderlist(this.orderListQuery).then(response => {
        this.orderList = response.data.listdata
        this.orderTotal = response.data.totalnum
        setTimeout(() => {
          this.orderListLoading = false
        }, 1.5 * 1000)
      })
    },
    getList() {
      this.listLoading = true
      getuserinfolist(this.listQuery).then(response => {
        this.list = response.data.listdata
        this.total = response.data.totalnum

        // Just to simulate the time of the request
        setTimeout(() => {
          this.listLoading = false
        }, 1.5 * 1000)
      })
    },
    handleFilter() {
      this.listQuery.page = 1
      this.getList()
      // this.groupoption()
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
    resetData() {
      //清空表单数据
      this.listQuery = {
        limit: 10,
        page: 1,
        importance: undefined,
        title: undefined,
        type: undefined,
        sort: '+id'
      };
      //空条件查询、
      this.getList()
    },
    resetTemp() {
      this.temp = {
        id: undefined,
        out_trade_no: undefined,
        name: '',
        simid: undefined,
        msisdn: '',
        imsi: '',
        isopen: '',
        image: '',
        remark: '',
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
      //         if (typeof(this.temp.categroyid)=="undefined"  || this.temp.categroyid==0) {
      //   this.temp.categroyid= 0;
      //   // console.log(this.temp.pid)
      //         } else {
      //             let newpid=this.temp.categroyid.pop();
      //             this.temp.categroyid=newpid;
      //         }
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


    handleInfo(row) {
      this.temp = Object.assign({}, row) // copy obj
      console.log(row);
      getinfo(this.temp).then(response => {
        this.temp1 = response.data

        // Just to simulate the time of the request
        setTimeout(() => {
          this.listLoading = false
        }, 1.5 * 1000)
      })
      this.temp1.timestamp = new Date(this.temp1.timestamp)
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
          //           if (typeof(this.temp.categroyid)=="undefined") { //判断是否为空
          //   this.temp.categroyid= 0;
          //   // console.log(this.temp.pid)
          //         } else {
          //           if (Array.isArray(this.temp.categroyid)==true) {//判断是否更新的为数组，为数组就取最后一个作为他的父级ID
          //             let newpid=this.temp.categroyid.pop();
          //             this.temp.categroyid=newpid;
          //           }

          //         }
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
      this.$confirm('确定要删除【' + row.name + '】吗？', '提示', {
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
