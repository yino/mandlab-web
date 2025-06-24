<template>
  <div class="page-container">
    <!-- 渐变顶部 -->
    <div class="header-gradient">
      <div class="title">绿易融线上服务平台</div>

      <!-- logo 和品牌标语 -->
      <div class="top-section">
        <div class="logo-box"></div>
        <div class="brand-info">
          <div class="brand-name">绿 易 融</div>
          <div class="brand-domain">Easygf.cn</div>
        </div>
        <div class="slogan-box">
          <div>从识绿到扩绿</div>
          <div>让绿色金融更普及</div>
        </div>
      </div>
      <!-- 搜索：框 -->
      <el-input
        v-model="keyword"
        placeholder="输入企业名称查询企业信息"
        class="search"
        :prefix-icon="Search"
      />
    </div>

    <div class="content-section">
      <!-- 图标功能区 -->
      <div class="grid">
        <div class="grid-item" v-for="(item, index) in gridItems" :key="index">
          <div class="icon-placeholder" @click="navigateToMLogin(item)"></div>
          <div class="label">{{ item }}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { Search } from '@element-plus/icons-vue';

const router = useRouter();

const keyword = ref('');

const gridItems = [
  '流贷识别', '项目贷识别', '找政策', '先锋榜',
  '数据拓客', '企业搜索记录', '产业分析', 'Mandlab',
];

const navigateToMLogin = (item) => {
  if (item === 'Mandlab') {
    router.push('/mlogin');
  }
}
</script>

<style scoped>
.page-container {
  margin: 0;
  padding: 0;
}

/* 顶部渐变区域 */
.header-gradient {
  width: 23rem;
  margin-top: -0.5rem;
  margin-left: -0.6rem;
  background: linear-gradient(to bottom, #59dfab, #59dfab);
  padding: 50px 12px 20px 12px;
}

/* 顶部标题 */
.title {
  font-size: 20px;
  font-weight: bold;
  color: white;
  text-align: center;
  margin-bottom: 20px;
}

/* LOGO 与品牌信息 */
.top-section {
  display: flex;
  align-items: center;
}

.logo-box {
  margin-left: 1rem;
  width: 60px;
  height: 60px;
  background: #ccc;
  border-radius: 4px;
}

.brand-info {
  margin-left: 1rem;
  flex: 1;
}

.brand-name {
  font-size: 22px;
  font-weight: bold;
  color: white;
}

.brand-domain {
  font-size: 14px;
  color: white;
    letter-spacing: 0.22em;
}

.slogan-box {
  background: #ff4d4f;
  margin-right: 1.2rem;
  color: white;
  font-size: 12px;
  padding: 6px 10px;
  border-radius: 4px;
  line-height: 1.4;
  text-align: center;
}

.content-section {
  background: #fff;

  padding: 0;
  margin: 0;
}

/* 搜索框样式 */
.search {
  width: 22rem;
  margin: 20px 12px;
  height: 3rem;
  border-radius: 12px;
  background: white;
  box-shadow: 0 0 4px rgba(0,0,0,0.05);
}

/* 九宫格图标区 */
.grid {
  margin-top: 1rem;
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 18px 10px;
  padding: 0 12px 20px 12px;
}

.grid-item {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.icon-placeholder {
  width: 48px;
  height: 48px;
  background: #ccc;
  border-radius: 4px;
  margin-bottom: 6px;
  cursor: pointer;
}

.label {
  font-size: 13px;
  color: #333;
  text-align: center;
  word-break: keep-all;
}
</style>