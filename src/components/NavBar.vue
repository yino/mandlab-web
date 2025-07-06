<template>
  <div class="nav-bar">
    <div class="close-btn" @click="handleClose">×</div>
    <div class="title">MandLab研以致用</div>
    <div class="menu-btn" @click="handleMenuToggle">⋯</div>
  </div>
</template>

<script setup lang="ts">
	import { useRouter } from 'vue-router'; // 导入路由
	const router = useRouter();
// 处理关闭按钮的点击事件
const handleClose = () => {
   router.push('/index'); // 返回到index页面
  // 这里可以添加关闭应用或隐藏窗口的逻辑
};

// 处理菜单按钮的点击事件
const handleMenuToggle = () => {
  console.log("菜单按钮被点击");
  // 这里可以添加显示或隐藏菜单的逻辑
};
</script>

<style scoped>
/* 导航栏样式 */
.nav-bar {
  display: flex;
width: 95%;
  justify-content: space-between;
  align-items: center;
  padding: 15px;
  background-color: #3dbc79;
  color: white;
}

.close-btn, .menu-btn {
  font-size: 20px;
  cursor: pointer;
}

.title {
  font-size: 16px;
  font-weight: bold;
}
</style>