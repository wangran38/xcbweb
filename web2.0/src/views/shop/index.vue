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

    <div class="filter-container" style="margin: 0 0 2% 0;display: flex;" v-if="searchSeen">
      <el-input v-model="listQuery.kname" placeholder="Title" style="width: 200px" class="filter-item"
        @keyup.enter.native="handleFilter" />
      <regionSelectionVue></regionSelectionVue>
      <el-select v-model="listQuery.sort" style="width: 140px" class="filter-item" @change="handleFilter">
        <el-option v-for="item in sortOptions" :key="item.key" :label="item.label" :value="item.key" />
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
    <el-table :key="tableKey" v-loading="listLoading" :data="list" border fit highlight-current-row style="width: 100%;"
      @sort-change="sortChange">
      <el-table-column label="ID" prop="id" sortable="custom" align="center" width="80"
        :class-name="getSortClass('id')">
        <template slot-scope="{row}">
          <span>{{ row.id }}</span>
        </template>
      </el-table-column>
      <el-table-column label="摊位logo" width="110px" align="center">
        <template slot-scope="{row}">
          <el-avatar :src="row.logo"></el-avatar>
        </template>
      </el-table-column>
      <el-table-column label="摊位名称" min-width="100px" align="center">
        <template slot-scope="{row}">
          <span>{{ row.title }}</span>
        </template>
      </el-table-column>
      <el-table-column label="市场名称" width="" align="center">
        <template slot-scope="{row}">
          <span>{{ row.market_name }}</span>
        </template>
      </el-table-column>
      <el-table-column label="所属区域" width="60" align="center">
        <template slot-scope="{row}">
          <span>{{ row.area_name }}</span>
        </template>
      </el-table-column>
      <el-table-column label="联系人" width="" align="center">
        <template slot-scope="{row}">
          <span>{{ row.contactpeople }}</span>
        </template>
      </el-table-column>
      <el-table-column label="联系电话" width="" align="center">
        <template slot-scope="{row}">
          <span>{{ row.contactphone }}</span>
        </template>
      </el-table-column>
      <el-table-column label="创建" width="200px" align="center">
        <template slot-scope="{row}">
          <span>{{ initTime(row.createtime) }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" width="200" class-name="small-padding fixed-width">
        <template slot-scope="{row,$index}">
          <el-button @click="viewDetail(row)" slot="reference" v-if="row.status != 'published'" size="mini"
            type="success">
            订单明细
          </el-button>

        </template>
      </el-table-column>
    </el-table>

    <pagination v-show="total > 0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit"
      @pagination="getshoplist" />

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

    <el-drawer :title="shopName" :visible.sync="table" direction="rtl" size="50%">
      <div class="top">
        <div>总积分:{{ (totalScore * 10).toFixed(2) }}</div>
        <div>结算积分:{{ (settlementPoints).toFixed(2) }}</div>
        <div>未结算积分:{{ (UnsettledPoints * 10).toFixed(2) }}</div>
      </div>
      <el-table :data="rowDetail" height="400" :stripe="true" empty-text="暂无数据" v-loading="loading">
        <el-table-column label="ID" align="center">
          <template slot-scope="{row}">
            <span>{{ row.id }}</span>
          </template>
        </el-table-column>
        <el-table-column width="200" label="订单号" align="center">
          <template slot-scope="{row}">
            <span>{{ row.out_trade_no }}</span>
          </template>
        </el-table-column>
        <el-table-column property="price" label="实际付款" align="center">
          <template slot-scope="{row}">
            <span>{{ row.price }}元</span>
          </template>
        </el-table-column>
        <el-table-column property="price" label="支付积分" align="center">
          <template slot-scope="{row}">
            <span>{{ row.payprice * 10 }}</span>
          </template>
        </el-table-column>
        <el-table-column property="price" label="日期" align="center">
          <template slot-scope="{row}">
            <span>{{ initTime(row.createtime) }}</span>
          </template>
        </el-table-column>
      </el-table>
      <pagination v-show="orderTotal > 0" :total="orderTotal" :page.sync="orderQuery.page"
        :limit.sync="orderQuery.limit" :auto-scroll="false" @pagination="paginationOrderList" />
    </el-drawer>
  </div>
</template>
<style>
.top {
  min-width: 300px;
  padding: 10px;
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
import regionSelectionVue from '@/components/regionSelection'
import { getshoplist } from '@/api/shop/list'
import { getorderlist, orderSum } from '@/api/order/list/list'
import waves from '@/directive/waves' // waves directive 点击水波纹
import { parseTime } from '@/utils'
import Pagination from '@/components/Pagination' // secondary package based on el-pagination
import Tinymce from '@/components/Tinymce'

// arr to obj, such as { CN : "China", US : "USA" }

import request from '@/utils/request'


export default {
  //讲师列表
  name: '',
  components: { Pagination, Tinymce, regionSelectionVue },
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
      // 控制详细弹窗
      table: false,
      loading: false,
      rowDetail: [], // 对应摊位的订单数据
      shopName: '', // 摊位名
      totalScore: 0,  // 总积分
      settlementPoints: 0, // 结算积分
      withdrawalPoints: 0, // 提现积分
      orderTotal: 0,   // 个人订单数
      shop_id: 0,
      orderQuery: {
        limit: 10,
        page: 1,
      },


      searchSeen: false,
      tableKey: 0,
      list: null,
      total: 0,
      listLoading: true,
      listQuery: {
        limit: 10,
        page: 1,
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
    this.getshoplist(),
      this.groupoption()
  },
  computed: {
    // 未结算积分
    UnsettledPoints() {
      return this.totalScore - this.settlementPoints
    }
  },
  methods: {
    initTime: (str) => {
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
    // 翻页触发请求
    async paginationOrderList(query) {
      console.log(query)
      this.loading = true
      query.shop_id = this.shop_id
      let { data } = await getorderlist(query)
      // 订单列表
      this.rowDetail = data.listdata
      setTimeout(() => { this.loading = false }, 1000)
    },
    async viewDetail(row) {
      // 打开抽屉
      this.table = true
      // 保存当前抽屉的摊位名
      this.shopName = row.title
      // 请求摊位的数据
      let { data } = await getorderlist({
        shop_id: row.id,
        page: 1,
        limit: 10
      })
      this.orderTotal = data.totalnum
      this.shop_id = row.id

      // 获取总积分
      let res = await orderSum({
        shop_id: row.id
      })
      // 总积分
      this.totalScore = res.data.totalsum
      // 订单列表
      this.rowDetail = data.listdata

    },
    groupoption() { },
    getshoplist() {
      this.listLoading = true
      getshoplist(this.listQuery).then(response => {
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
      this.getshoplist()
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
              this.getshoplist();
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
            this.getshoplist();
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