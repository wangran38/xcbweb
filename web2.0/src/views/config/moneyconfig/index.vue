<template>
  <div class="app-container">

    <div style="margin:0 0 2% 0;">
      <el-button v-waves class="filter-item" type="primary" icon="el-icon-search" @click="searchSeen = !searchSeen">
        查找
      </el-button>
      <el-button class="filter-item" style="margin-left: 10px;" type="primary" icon="el-icon-edit"
        @click="handleCreate">
        添加
      </el-button>
    </div>

    <div class="filter-container" style="margin:0 0 2% 0;" v-if="searchSeen">
      <el-input v-model="listQuery.title" placeholder="Title" style="width: 200px;" class="filter-item"
        @keyup.enter.native="handleFilter" />
      <!--<el-select v-model="listQuery.importance" placeholder="Imp" clearable style="width: 90px" class="filter-item">
          <el-option v-for="item in importanceOptions" :key="item" :label="item" :value="item" />
        </el-select>-->
      <!--<el-select v-model="listQuery.type" placeholder="Type" clearable class="filter-item" style="width: 130px">
          <el-option v-for="item in calendarTypeOptions" :key="item.key" :label="item.display_name+'('+item.key+')'" :value="item.key" />
        </el-select>-->
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
      <!-- <el-table-column label="ID" prop="id" sortable="custom" align="center" width="80"
        :class-name="getSortClass('id')">
        <template slot-scope="{row}">
          <span>{{ row.id }}</span>
        </template>
</el-table-column> -->
      <el-table-column label="平台运营维护费" width="120px" align="center">
        <template slot-scope="{row}">
          <span>{{ row.level1 }}</span>
        </template>
      </el-table-column>
      <el-table-column label="投资股东收益" width="120px" align="center">
        <template slot-scope="{row}">
          <span>{{ row.level2 }}</span>
        </template>
      </el-table-column>
      <el-table-column label="预留税金" align="center">
        <template slot-scope="{row}">
          <span>{{ row.level3 }}</span>
        </template>
      </el-table-column>
      <el-table-column label="市县收益" align="center">
        <template slot-scope="{row}">
          <span>{{ row.level4 }}</span>
        </template>
      </el-table-column>
      <el-table-column label="辅导员发展卖家" align="center" width="120px">
        <template slot-scope="{row}">
          <span>{{ row.level5 }}</span>
        </template>
      </el-table-column>
      <el-table-column label="辅导员发展买家" align="center" width="120px">
        <template slot-scope="{row}">
          <span>{{ row.level6 }}</span>
        </template>
      </el-table-column>
      <el-table-column label="会员消费" align="center">
        <template slot-scope="{row}">
          <span>{{ row.level7 }}</span>
        </template>
      </el-table-column>

      <!-- <el-table-column label="合计" width="110px" align="center">
        <template slot-scope="{row}">
          <span>{{ row.level1 + row.level2 + row.level3 }}%</span>
        </template>
      </el-table-column> -->
      <el-table-column prop="showStatus" header-align="center" align="center" label="显示状态" width="110px">
        <template slot-scope="{row}">
          <el-switch v-model="row.isshow" :active-value="row.isshow" active-text="启用" active-color="#13ce66"
            inactive-color="#ff4949">
          </el-switch>

          <!-- {{row.isshow}}
          {{typeof(row.isshow)}} -->
        </template>
      </el-table-column>

      <el-table-column label="创建日期" align="center" width="150px">
        <template slot-scope="{row}">
          <span>{{ initTime(row.createtime) }}</span>
        </template>
      </el-table-column>



      <el-table-column label="操作" align="center" width="230" class-name="small-padding fixed-width">
        <template slot-scope="{row,$index}">
          <el-button type="primary" size="mini" @click="handleUpdate(row)">
            修改
          </el-button>
          <!--<el-button v-if="row.status!='published'" size="mini" type="success" @click="handleModifyStatus(row,'published')">
              详细
            </el-button>-->
          <!--<el-button v-if="row.status!='draft'" size="mini" @click="handleModifyStatus(row,'draft')">
              Draft
            </el-button>-->
          <el-button v-if="row.status != 'deleted'" size="mini" type="danger" @click="handleDelete(row, $index)">
            删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination v-show="total > 0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit"
      @pagination="getList" />

    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible">
      <el-form ref="dataForm" :rules="rules" :model="temp" label-position="left" label-width="200px"
        style="width: 500px; margin-left:50px;">

        <!--<el-form-item label="Date" prop="timestamp">
            <el-date-picker v-model="temp.timestamp" type="datetime" placeholder="Please pick a date" />
          </el-form-item>-->
        <el-form-item label="平台运营维护费" prop="level1">
          <el-input-number v-model="temp.level1" :step="0.001" :min="0" />
        </el-form-item>
        <el-form-item label="投资股东收益" prop="level2">
          <el-input-number v-model="temp.level2" :step="0.001" :min="0" />
        </el-form-item>
        <el-form-item label="预留税金" prop="level3">
          <el-input-number v-model="temp.level3" :step="0.001" :min="0" />
        </el-form-item>
        <el-form-item label="市县收益" prop="level4">
          <el-input-number v-model="temp.level4" :step="0.001" :min="0" />
        </el-form-item>
        <el-form-item label="辅导员发展卖家" prop="level5">
          <el-input-number v-model="temp.level5" :step="0.001" :min="0" />
        </el-form-item>
        <el-form-item label="辅导员发展买家" prop="level6">
          <el-input-number v-model="temp.level6" :step="0.001" :min="0" />
        </el-form-item>
        <el-form-item label="会员消费" prop="level7">
          <el-input-number v-model="temp.level7" :step="0.001" :min="0" />
        </el-form-item>
        <!-- 
        <el-form-item label="详细说明" prop="content">
          <el-input type="textarea" v-model="temp.content" />

        </el-form-item> -->

        <!-- <el-form-item label="是否显示" prop="isshow">
          <el-switch v-model="temp.isshow" :active-value='1' :inactive-value='0'>
          </el-switch>
        </el-form-item> -->


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
<script>
import { getmoneyconfiglist, editmoneyconfig, addmoneyconfig } from '@/api/config/moneyconfig/list'
import waves from '@/directive/waves' // waves directive 点击水波纹
import { parseTime } from '@/utils'
// import MarkdownEditor from '@/components/MarkdownEditor'
import Pagination from '@/components/Pagination' // secondary package based on el-pagination
import { myMixin } from '@/utils/public'

import Decimal from 'decimal.js'

// arr to obj, such as { CN : "China", US : "USA" }

import request from '@/utils/request'


export default {
  //讲师列表
  mixins: [myMixin],
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
        levle1: undefined,
        levle2: undefined,
        levle3: undefined,
        levle4: undefined,
        levle5: undefined,
        levle6: undefined,
        levle7: undefined,
        levle1name: '',
        levle2name: '',
        levle3name: '',
        isshow: '',
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
    getList() {
      this.listLoading = true
      getmoneyconfiglist(this.listQuery).then(response => {
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
        levle1: undefined,
        levle2: undefined,
        levle3: undefined,
        levle1name: '',
        levle2name: '',
        levle3name: '',
        isshow: '',
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
          addmoneyconfig(this.temp).then((response) => {
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

      let tempNum = new Decimal(this.temp.level1).plus(this.temp.level2).plus(this.temp.level3).plus(this.temp.level4).plus(this.temp.level5).plus(this.temp.level6).plus(this.temp.level7)
      console.log(tempNum.toNumber())
      if (tempNum.toNumber() > 1 | tempNum.toNumber() < 1) {
        this.$notify({
          title: '比例不对称',
          // message: '比例不对称',
          type: 'error',
          duration: 2000
        })
        return
      }



      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          const tempData = Object.assign({}, this.temp)
          tempData.timestamp = +new Date(tempData.timestamp) // change Thu Nov 30 2017 16:41:05 GMT+0800 (CST) to 1512031311464
          editmoneyconfig(tempData).then(() => {
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

    handleFetchPv(pv) {
      fetchPv(pv).then(response => {
        this.pvData = response.data.pvData
        this.dialogPvVisible = true
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