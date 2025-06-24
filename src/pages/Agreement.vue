<template>
  <button @click="ff">1</button>
  1
</template>

<script setup>
import axios from 'axios';

const options = {
  method: 'POST',
  url: 'https://easygf-matcher-api-dev.nodebox.info/api/v1/auth/code',
  headers: {'Content-Type': 'application/json'},
  data: {phone: '13312345678', purpose: 'login'}
};

// 定义一个异步函数发送请求
async function fetchData() {
  try {
    const { data } = await axios.request(options);
    console.log(data);
  } catch (error) {
    console.error(error);
  }
}

// 点击按钮时触发 fetchData 函数
function ff() {
  fetchData();
}
</script>