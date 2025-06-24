<template>
  <div class="form-container">
    <p class="note">
      请输入正确信息，我们将对您填写的信息进行审核，审核通过后邀请码将以短信的形式发送到您的手机，如有疑问，请联系客服：
      <span class="phone">0571-1234567</span>
    </p>

    <el-form :model="form" label-position="top" class="custom-form">
      <el-form-item label="公司名称" required>
        <el-input v-model="form.company"></el-input>
      </el-form-item>

      <el-form-item label="姓名">
        <el-input v-model="form.name"></el-input>
      </el-form-item>

      <el-form-item label="岗位">
        <el-input v-model="form.position"></el-input>
      </el-form-item>

      <el-form-item label="联系电话" required>
        <template #label>
          <span>
            联系电话<span class="required"></span>
            <span class="note-text">（邀请码将以短信的形式发送到您的手机）</span>
          </span>
        </template>
        <el-input v-model="form.phone"></el-input>
      </el-form-item>

      <el-form-item label="联系地址">
        <el-input v-model="form.address"></el-input>
      </el-form-item>

      <el-form-item label="邮箱">
        <el-input v-model="form.email"></el-input>
      </el-form-item>

      <el-form-item label="名片">
        <template #label>
          <span>
            名片 <span class="gray-text">（提供名片我们会优先审核哦）</span>
          </span>
        </template>
        <el-upload
          class="upload-demo"
          action="#"
          :auto-upload="false"
          :show-file-list="true"
        >
          <el-button text type="primary">点击上传</el-button>
        </el-upload>
      </el-form-item>

      <el-form-item>
        <el-button type="success" class="submit-btn">完成</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script setup>
import { reactive } from 'vue'

const form = reactive({
  company: '',
  name: '',
  position: '',
  phone: '',
  address: '',
  email: '',
})
</script>

<style scoped>
.form-container {
  max-width: 600px;
  margin: 0 auto;
  padding: 20px;
}
.note {
  font-size: 14px;
  margin-bottom: 20px;
  line-height: 1.6;
}
.phone {
  color: #007aff;
  font-weight: bold;
}
.custom-form ::v-deep .el-form-item {
  margin-bottom: 20px;
}
.required {
  color: red;
}
.note-text {
  font-size: 13px;
  color: #666;
  margin-left: 4px;
}
.gray-text {
  color: #999;
  font-size: 13px;
}
.upload-demo {
  display: inline-block;
  margin-right: 10px;
}
.file-name {
  display: inline-block;
  vertical-align: middle;
  color: #666;
}
.submit-btn {
  width: 100%;
  font-size: 16px;
}
</style>
