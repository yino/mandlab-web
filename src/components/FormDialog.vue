<script setup lang="ts">
import { ref } from 'vue'
import type { FormInstance, FormRules, UploadFile } from 'element-plus'
import { Upload } from '@element-plus/icons-vue'

const props = defineProps<{
  visible: boolean
}>()

const emit = defineEmits(['update:visible', 'submit'])

const formRef = ref<FormInstance>()
const uploadRef = ref()
const fileDisplayName = ref('')

const form = ref({
  companyName: '',
  name: '',
  position: '',
  phone: '',
  address: '',
  email: '',
  badge: ''
})

const badgeFileName = ref('')

const rules: FormRules = {
  companyName: [
    { required: true, message: '请输入公司名称', trigger: 'blur' }
  ],
  name: [
    { required: true, message: '请输入姓名', trigger: 'blur' }
  ],
  phone: [
    { required: true, message: '请输入联系电话', trigger: 'blur' },
    { pattern: /^1[3-9]\d{9}$/, message: '请输入正确的手机号码', trigger: 'blur' }
  ],
  email: [
    { type: 'email', message: '请输入正确的邮箱地址', trigger: 'blur' }
  ]
}

const handleClose = () => {
  emit('update:visible', false)
}

const handleSubmit = async () => {
  if (!formRef.value) return
  
  await formRef.value.validate((valid) => {
    if (valid) {
      emit('submit', form.value)
      handleClose()
      formRef.value?.resetFields()
      badgeFileName.value = ''
    }
  })
}

const triggerFileUpload = () => {
  // 触发隐藏的上传组件的点击事件
  const uploadEl = uploadRef.value?.$el.querySelector('input[type="file"]')
  if (uploadEl) {
    uploadEl.click()
  }
}

const handleUploadSuccess = (response: any, uploadFile: UploadFile) => {
  form.value.badge = response.url
  badgeFileName.value = uploadFile.name
}

const handleFileChange = (file: any) => {
  if (file) {
    fileDisplayName.value = file.name
    // 自动上传文件
    const formData = new FormData()
    formData.append('file', file.raw)
    
    // 这里可以添加实际的上传逻辑，或者使用Element Plus的自动上传
    // 如果使用自动上传，可以删除这段代码
  }
}
</script>

<template>
  <el-dialog
    title="信息登记"
    :model-value="visible"
    @close="handleClose"
    width="500px"
  >
    <el-form
      ref="formRef"
      :model="form"
      :rules="rules"
      label-width="100px"
      label-position="top"
    >
      <el-form-item label="公司名称" prop="companyName">
        <el-input v-model="form.companyName" placeholder="请输入公司名称" />
      </el-form-item>
      
      <el-form-item label="姓名" prop="name">
        <el-input v-model="form.name" placeholder="请输入姓名" />
      </el-form-item>
      
      <el-form-item label="岗位" prop="position">
        <el-input v-model="form.position" placeholder="请输入岗位" />
      </el-form-item>
      
      <el-form-item label="联系电话" prop="phone">
        <el-input v-model="form.phone" placeholder="请输入联系电话" />
      </el-form-item>
      
      <el-form-item label="联系地址" prop="address">
        <el-input v-model="form.address" placeholder="请输入联系地址" />
      </el-form-item>
      
      <el-form-item label="邮箱" prop="email">
        <el-input v-model="form.email" placeholder="请输入邮箱" />
      </el-form-item>
      
      <el-form-item label="名片" prop="badge">
        <div class="upload-input-container">
          <el-input 
            v-model="fileDisplayName" 
            placeholder="请上传名片" 
            readonly
            class="upload-input"
          />
          <el-link 
            type="primary" 
            class="upload-btn"
            @click="triggerFileUpload"
          >
            点击上传
          </el-link>
          <el-upload
            ref="uploadRef"
            class="hidden-upload"
            action="/api/upload"
            :on-success="handleUploadSuccess"
            :on-change="handleFileChange"
            :show-file-list="false"
            :auto-upload="true"
          >
          </el-upload>
        </div>
        <div class="el-upload__tip">
          客服电话：<el-link disabled type="primary">0571-1234567</el-link>
        </div>
      </el-form-item>
    </el-form>
    
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="handleClose">取消</el-button>
        <el-button type="success" @click="handleSubmit">确定</el-button>
      </span>
    </template>
  </el-dialog>
</template>

<style scoped>
.dialog-footer {
  display: flex;
  justify-content: center;
  gap: 10%;
}

.dialog-footer .el-button {
  width: 30%;
}

.custom-form {
  max-width: 100%;
}

.custom-form :deep(.el-form-item) {
  margin-bottom: 2px !important;
}

.custom-form :deep(.el-form-item__label) {
  padding-bottom: 0px !important;
  font-weight: 500;
  margin-bottom: 0px !important;
}

.custom-form :deep(.el-input__wrapper) {
  width: 100%;
}

.custom-form :deep(.el-upload) {
  width: 100%;
}

.custom-form :deep(.el-button) {
  width: 100%;
}

.custom-form :deep(.el-upload__tip) {
  margin-top: 8px;
}

.upload-input-container {
  position: relative;
  width: 100%;
}

.upload-input {
  width: 100%;
}

.upload-btn {
  position: absolute;
  right: 5px;
  top: 50%;
  transform: translateY(-50%);
  z-index: 10;
  height: 32px;
  padding: 0 12px;
  font-size: 12px;
}

.hidden-upload {
  display: none;
}
</style>