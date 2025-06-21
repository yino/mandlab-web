<script setup lang="ts">
import { ref } from 'vue'
import FormDialog from '../components/FormDialog.vue'

const dialogVisible = ref(false)

const handleSubmit = (formData: any) => {
  console.log('Form submitted:', formData)
  // 这里可以添加表单提交的逻辑
}

const openDialog = () => {
  dialogVisible.value = true
}
</script>

<template>
  <div class="form-page">
    <el-button type="primary" @click="openDialog">打开表单</el-button>
    
    <FormDialog
      v-model:visible="dialogVisible"
      @submit="handleSubmit"
    />
  </div>
</template>

<style scoped>
.form-page {
  padding: 20px;
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
}
</style>