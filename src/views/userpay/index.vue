<template>
    <div class="app-container">

      <div style="margin:0 0 2% 0;">
        <el-button v-waves class="filter-item" type="primary" icon="el-icon-search" @click="resetData">
          清空
        </el-button>
        <!--<el-button class="filter-item" style="margin-left: 10px;" type="primary" icon="el-icon-edit" @click="handleCreate">
         添加
        </el-button>-->
        <el-button v-waves :loading="downloadLoading" class="filter-item" type="primary" icon="el-icon-download" @click="handleDownload">
        下载
        </el-button>
        <!--<el-button v-waves class="filter-item" type="primary" icon="el-icon-search" @click="resetData">
        爬取
        </el-button>-->
        <el-button v-waves class="filter-item" type="primary" :icon="searchSeen ? 'el-icon-arrow-up':'el-icon-arrow-down'" @click="searchSeen = !searchSeen">
          查找
        </el-button>
      </div>
      <div class="filter-container" style="margin:0 0 2% 0;" v-if="searchSeen">
        <el-input v-model="listQuery.title" placeholder="输入名称" style="width: 200px;" class="filter-item" @keyup.enter.native="handleFilter" />
        <!--<el-select v-model="listQuery.importance" placeholder="Imp" clearable style="width: 90px" class="filter-item">
          <el-option v-for="item in importanceOptions" :key="item" :label="item" :value="item" />
        </el-select>-->
        <!--<el-select v-model="listQuery.type" placeholder="Type" clearable class="filter-item" style="width: 130px">
          <el-option v-for="item in calendarTypeOptions" :key="item.key" :label="item.display_name+'('+item.key+')'" :value="item.key" />
        </el-select>-->
        <el-select v-model="listQuery.sort" style="width: 140px" class="filter-item" @change="handleFilter">
          <el-option v-for="item in sortOptions" :key="item.key" :label="item.label" :value="item.key" />
        </el-select>
        <el-select v-model="listQuery.sort" style="width: 140px" class="filter-item" @change="handleFilter">
          <el-option v-for="item in sortOptions" :key="item.key" :label="item.label" :value="item.key" />
        </el-select>
        <el-select v-model="listQuery.sort" style="width: 140px" class="filter-item" @change="handleFilter">
          <el-option v-for="item in sortOptions" :key="item.key" :label="item.label" :value="item.key" />
        </el-select>
        <el-select v-model="listQuery.sort" style="width: 140px" class="filter-item" @change="handleFilter">
          <el-option v-for="item in sortOptions" :key="item.key" :label="item.label" :value="item.key" />
        </el-select>
        <el-select v-model="listQuery.sort" style="width: 140px" class="filter-item" @change="handleFilter">
          <el-option v-for="item in sortOptions" :key="item.key" :label="item.label" :value="item.key" />
        </el-select>
        <el-select v-model="listQuery.sort" style="width: 140px" class="filter-item" @change="handleFilter">
          <el-option v-for="item in sortOptions" :key="item.key" :label="item.label" :value="item.key" />
        </el-select>
        <el-select v-model="listQuery.sort" style="width: 140px" class="filter-item" @change="handleFilter">
          <el-option v-for="item in sortOptions" :key="item.key" :label="item.label" :value="item.key" />
        </el-select>
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
  
      <el-table
        :key="tableKey"
        v-loading="listLoading"
        :data="list"
        border
        fit
        highlight-current-row
        style="width: 100%;"
        @sort-change="sortChange"
      >
        <el-table-column label="ID" prop="id" sortable="custom" align="center" width="80" :class-name="getSortClass('id')">
          <template slot-scope="{row}">
            <span>{{ row.Id }}</span>
          </template>
        </el-table-column>

       <el-table-column label="用户id" width="60px" align="center">
          <template slot-scope="{row}">
            <span>{{ row.uid }}</span>
          </template>
        </el-table-column>

        <el-table-column label="展会id" width="60px" align="center">
          <template slot-scope="{row}">
            <span>{{ row.exid }}</span>
          </template>
        </el-table-column>
         <el-table-column label="付费金额" width="90px"  align="center">
          <template slot-scope="{row}">
            <span>{{ row.price }}元</span>
          </template>
        </el-table-column>
         <el-table-column label="订单号" width="100px" align="center">
          <template slot-scope="{row}">
            <span>{{ row.out_trade_no }}</span>
          </template>
        </el-table-column>
         <el-table-column label="订单创建时间" width="160px" align="center">
          <template slot-scope="{row}">
            <span>{{ row.Created | parseTime(row.Created,'{y}-{m}-{d} {h}:{i}') }}</span>
          </template>
        </el-table-column>
         <el-table-column label="支付状态" width="100px" align="center">
          <template slot-scope="{row}">
            <span>{{ row.is_pay }}</span>
          </template>
        </el-table-column>
         <el-table-column label="支付成功时间" width="160px" align="center">
          <template slot-scope="{row}">
            <span>{{ row.success_time | parseTime(row.success_time,'{y}-{m}-{d} {h}:{i}') }}</span>
          </template>
        </el-table-column>



        <!--<el-table-column label="交易"  align="center">
          <template slot-scope="{row}">
            <span>
           <el-badge :value="0" class="item">
            <el-button v-if="row.status!='draft'" size="mini" @click="handleModifyStatus(row,'draft')">
            展会门票
            </el-button>
            </el-badge>
            <el-badge :value="0" class="item">
            <el-button v-if="row.status!='draft'" size="mini" @click="handleModifyStatus(row,'draft')">
            参展企业
            </el-button>
            </el-badge>
            </span>
          </template>
        </el-table-column>-->

  
  
        <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
          <template slot-scope="{row,$index}">

            <el-button v-if="row.status!='published'" size="mini" type="success" @click="handleInfo(row,'published')">
              详细
            </el-button>

            <el-button v-if="row.status!='deleted'" size="mini" type="danger" @click="handleDelete(row,$index)">
              删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>
  
      <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @pagination="getList" />
  
      <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible">
        <el-form ref="dataForm" :rules="rules" :model="temp1" label-position="left" label-width="100px" style="width: 80%; margin-left:50px;">
  

          <!--<el-form-item label="Date" prop="timestamp">
            <el-date-picker v-model="temp.timestamp" type="datetime" placeholder="Please pick a date" />
          </el-form-item>-->
          <el-form-item label="展会名称" prop="">
            <a href="" target="_blank">{{temp1.Extitle}}</a>
            <!--<el-input v-model.number="temp1.Extitle" />-->
          </el-form-item>
          <el-form-item label="公司名称" prop="">
            <el-input v-model.number="temp1.Companyname" />
          </el-form-item>

          <el-form-item label="联系人姓名" prop="">
            <el-input v-model.number="temp1.Name" />
          </el-form-item>
          <el-form-item label="性别" prop="">
            <el-input v-model="temp1.Sex" />
          </el-form-item>
          <el-form-item label="订单号" prop="">
            <el-input v-model="temp1.Out_trade_no" />
          </el-form-item>
          <el-form-item label="联系电话" prop="">
            <el-input v-model="temp1.Phone" />
          </el-form-item>
          <el-form-item label="联系邮箱" prop="">
            <el-input v-model="temp1.Email" />
          </el-form-item>
          <el-form-item label="身份证号码" prop="name">
            <el-input v-model="temp1.Idcard" />
          </el-form-item>

          <!--<el-form-item label="展会图片" prop="image">

  <el-input v-model="temp.image" type="hidden" />
          </el-form-item>-->

        </el-form>

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
    .item {
  margin-top: 10px;
  margin-right: 20px;
}
  </style>
  <script>
  import { getlist, getoptions, add,edit,del,getinfo } from '@/api/userpay/userpay'
  import waves from '@/directive/waves' // waves directive 点击水波纹
  import { parseTime } from '@/utils'
  // import MarkdownEditor from '@/components/MarkdownEditor'
  import Pagination from '@/components/Pagination' // secondary package based on el-pagination
 
  
  
  // arr to obj, such as { CN : "China", US : "USA" }
  
  import request from '@/utils/request'
  
  
  export default {
        //列表
  
    name: '',
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
          type: undefined,
          sort: '+id'
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
          remark:'',
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
          idcard:''
        },
        imgurl:'',
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
    methods: {
      getList() {
        this.listLoading = true
        getlist(this.listQuery).then(response => {
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
          remark:'',
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
            }).catch(error=>{
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
        handleDelete(row,index) {
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
      getSortClass: function(key) {
        const sort = this.listQuery.sort
        return sort === `+${key}` ? 'ascending' : 'descending'
      }
    }
  }
  </script>
  