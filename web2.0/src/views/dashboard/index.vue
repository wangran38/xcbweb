<template>
 <div class="app-container">
    <el-row :gutter="20">
      <el-col :span="6">
        <div>
          <el-card 
          shadow="always">菜市场数量：{{ market_num }}家</el-card>
        </div>
      </el-col>
      <el-col :span="6">
        <div>
          <el-card 
          shadow="always">会员人数：{{value2}}人</el-card>
        </div>
      </el-col>
      <el-col :span="6">
        <div>
          <el-card 
          shadow="always">固定摊位摊主：{{value2}}个</el-card>
        </div>
      </el-col>
      <el-col :span="6">
        <div>
          <el-card 
          shadow="always">浮动摊位摊主：{{value2}}个</el-card>
        </div>
      </el-col>
    </el-row>

        <el-row :gutter="20" style="margin-top:40px;">
      <el-col :span="6">
        <div>
          <el-card 
          shadow="always">订单总数：{{value2}}笔</el-card>
        </div>
      </el-col>
      <el-col :span="6">
        <div>
          <el-card 
          shadow="always">积分订单：{{value2}}笔</el-card>
        </div>
      </el-col>
      <el-col :span="6">
        <div>
          <el-card 
          shadow="always">现金订单{{value2}}笔</el-card>
        </div>
      </el-col>
      <!--<el-col :span="6">
        <div>
          <el-card 
          shadow="always">商家结算积分{{value2}}</el-card>
        </div>
      </el-col>-->
    </el-row>
         <el-row :gutter="20" style="margin-top:40px;">
      <el-col :span="6">
        <div>
          <el-card 
          shadow="always">开奖总积分{{value2}}</el-card>
        </div>
      </el-col>
      <el-col :span="6">
        <div>
          <el-card 
          shadow="always">商家结算积分{{value2}}</el-card>
        </div>
      </el-col>
      <el-col :span="6">
        <div>
          <el-card 
          shadow="always">未结算积分{{value2}}</el-card>
        </div>
      </el-col>
      <!--<el-col :span="6">
        <div>
          <el-card 
          shadow="always">商家结算积分{{value2}}</el-card>
        </div>
      </el-col>-->
    </el-row>
  </div>
</template>

<script>
  import { getcount } from '@/api/admin/count'
  export default {
   
    data() {
      return {
        market_num:0
      };
    },
  created() {
    this.getList()
  },
     methods: {
    getList() {
      this.listLoading = true
      getcount(this.listQuery).then(response => {
        // this.data = response.data
        this.market_num = response.data.market_num
        // this.total = response.data.totalnum

        // Just to simulate the time of the request
        setTimeout(() => {
          this.listLoading = false
        }, 1.5 * 1000)
      })
    },
        handleFilter() {
      this.getList()
    },
     }
  };
</script>
<style lang="scss">
  .like {
    cursor: pointer;
    font-size: 25px;
    display: inline-block;
  }
</style>