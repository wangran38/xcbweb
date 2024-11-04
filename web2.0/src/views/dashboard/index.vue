<template>
  <div class="app-container" v-loading="listLoading" element-loading-text="加载中"
    element-loading-spinner="el-icon-loading">
    <el-row :gutter="20">
      <el-col :span="6">
        <div>
          <el-card shadow="always">菜市场数量：{{ dataInfo.market_num }}家</el-card>
        </div>
      </el-col>
      <el-col :span="6">
        <div>
          <el-card shadow="always">会员人数：{{ dataInfo.user_num }}人</el-card>
        </div>
      </el-col>
      <el-col :span="6">
        <div>
          <el-card shadow="always">固定摊位摊主：{{ dataInfo.shopuser_num }}个</el-card>
        </div>
      </el-col>
      <el-col :span="6">
        <div>
          <el-card shadow="always">浮动摊位摊主：{{ dataInfo.value2 }}个</el-card>
        </div>
      </el-col>
    </el-row>

    <el-row :gutter="20" style="margin-top:40px;">
      <el-col :span="6">
        <div>
          <el-card shadow="always">订单总数：{{ dataInfo.order_num }}笔</el-card>
        </div>
      </el-col>
      <el-col :span="6">
        <div>
          <el-card shadow="always">积分订单：{{ dataInfo.order_paywaynum }}笔</el-card>
        </div>
      </el-col>
      <el-col :span="6">
        <div>
          <el-card shadow="always">现金订单{{ dataInfo.order_paywaynum }}笔</el-card>
        </div>
      </el-col>
      <!-- <el-col :span="6">
        <div>
          <el-card shadow="always">商家结算积分{{ value2 }}</el-card>
        </div>
      </el-col> -->
    </el-row>
    <el-row :gutter="20" style="margin-top:40px;">
      <el-col :span="6">
        <div>
          <el-card shadow="always">开奖总积分: {{ dataInfo.lottery_sum }}元</el-card>
        </div>
      </el-col>
      <el-col :span="6">
        <div>
          <el-card shadow="always">消费积分: {{ dataInfo.lottery_sellsum }}分</el-card>
        </div>
      </el-col>
      <el-col :span="6">
        <div>
          <el-card shadow="always">未消费积分:{{ dataInfo.lottery_sum-dataInfo.lottery_sellsum }}分</el-card>
        </div>
      </el-col>

    </el-row>
    <el-row :gutter="20" style="margin-top:40px;">
      <el-col :span="6">
        <div>
          <el-card shadow="always">商家合计积分:{{ dataInfo.lottery_sum }}分</el-card>
        </div>
      </el-col>
      <el-col :span="6">
        <div>
          <el-card shadow="always">商家结算积分:{{ dataInfo.lottery_sellsum }}分</el-card>
        </div>
      </el-col>
      <el-col :span="6">
        <div>
          <el-card shadow="always">商家未结算积分:{{ dataInfo.lottery_sellsum }}分</el-card>
        </div>
      </el-col>
    </el-row>
    <el-row :gutter="20" style="margin-top:40px;">
      <el-col :span="6">
        <div>
          <el-card shadow="always">今日打卡人数:{{ dataInfo.sign_num }}人次</el-card>
        </div>
      </el-col>
      <el-col :span="6">
        <div>
          <el-card shadow="always">本周打卡人数:{{ dataInfo.sign_week_num }}人次</el-card>
        </div>
      </el-col>
      <el-col :span="6">
        <div>
          <el-card shadow="always">本月打卡人数:{{ dataInfo.sign_month_num }}人次</el-card>
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import { getcount } from '@/api/admin/count'
export default {

  data() {
    return {
      // 首页需要展示的数据
      dataInfo: {
        market_num: 0,
        user_num: 0,
        shopuser_num: 0,
        order_num: 0,
        sorce_num: 0,
      },
      listLoading: false// 遮罩层
    };
  },
  created() {
    this.getList()
  },
  methods: {
    async getList() {
      this.listLoading = true
      let { data } = await getcount(this.listQuery)
      this.dataInfo = data
      this.dataInfo.value2 = 0
      setTimeout(() => {
        this.listLoading = false
      }, 800)

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