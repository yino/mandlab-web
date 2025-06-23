<script setup lang="ts">
import { ref } from "vue";
import type { FormInstance, FormRules } from "element-plus";
import { ElMessage } from "element-plus";
import { Upload } from "@element-plus/icons-vue";
import { applyInviteCode, uploadInviteFile } from "../api/api";
const props = defineProps<{
  visible: boolean;
}>();

const emit = defineEmits(["update:visible", "submit"]);

const formRef = ref<FormInstance>();
const uploadRef = ref();
const fileDisplayName = ref("");

const form = ref({
  companyName: "",
  name: "",
  position: "",
  phone: "",
  address: "",
  email: "",
  badge: "",
});

const phoneLabel = ref("联系电话* <small>(邀请码将以短信的形式发送到您的手机)</small>");

const cardLabel = ref("名片<small>(提供名片我们会优先审核哦)</small>");

const rules: FormRules = {
  companyName: [{ required: true, message: "请输入公司名称", trigger: "blur" }],
  name: [{ required: true, message: "请输入姓名", trigger: "blur" }],
  phone: [
    { required: true, message: "请输入联系电话", trigger: "blur" },
    {
      pattern: /^1[3-9]\d{9}$/,
      message: "请输入正确的手机号码",
      trigger: "blur",
    },
  ],
  email: [{ type: "email", message: "请输入正确的邮箱地址", trigger: "blur" }],
};

const handleClose = () => {
  emit("update:visible", false);
};
// 表单提交
const handleSubmit = async () => {
  if (!formRef.value) return;
  const valid = await formRef.value.validate();
  if (!valid) return;
  try {
    let resp = await applyInviteCode({
      address: form.value.address,
      applicant_name: form.value.name,
      company_name: form.value.companyName,
      phone: form.value.phone,
      email: form.value.email,
      position: form.value.position,
      business_card_file_id: form.value.badge,
    });
    console.log("resp", resp);
    ElMessage.success(resp.data.message);
    // 处理成功逻辑
  } catch (err: any) {
    ElMessage.error(err?.response?.data?.errors?.[0] || "申请失败");
    return false;
  }
};

const triggerFileUpload = () => {
  // 触发隐藏的上传组件的点击事件
  const uploadEl = uploadRef.value?.$el.querySelector('input[type="file"]');
  if (uploadEl) {
    uploadEl.click();
  }
};

const handleUploadSuccess = async (response: any, uploadFile: File) => {
  // 这里不直接用 response，而是用自定义上传逻辑
  // response 是后端返回的 { file_id, msg }
  form.value.badge = response.file_id;
  fileDisplayName.value = uploadFile.name;
  ElMessage.success(response.msg || "上传成功");
};

const handleFileChange = async (file: any) => {
  if (file) {
    fileDisplayName.value = file.name;
    try {
      const resp = await uploadInviteFile({
        file: file.raw,
        purpose: "InviteApplication",
      });
      await handleUploadSuccess(resp.data, file.raw);
    } catch (err: any) {
      ElMessage.error(err?.response?.data?.msg || "上传失败");
    }
  }
};
</script>

<template>
  <el-dialog
    title="邀请码申请"
    :model-value="visible"
    @close="handleClose"
    width="500px"
    class="form-dialog"
  >
    <template #title>
      <div class="custom-dialog-title">邀请码申请</div>
    </template>
    <el-form
      ref="formRef"
      :model="form"
      :rules="rules"
      label-width="100px"
      label-position="top"
      class="form-submit"
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

      <el-form-item prop="phone">
        <template #label>
          <span v-html="phoneLabel"></span>
        </template>
        <el-input v-model="form.phone" placeholder="请输入联系电话" />
      </el-form-item>

      <el-form-item label="联系地址" prop="address">
        <el-input v-model="form.address" placeholder="请输入联系地址" />
      </el-form-item>

      <el-form-item label="邮箱" prop="email">
        <el-input v-model="form.email" placeholder="请输入邮箱" />
      </el-form-item>

      <el-form-item>
        <template #label>
          <span v-html="cardLabel"></span>
        </template>
        <div class="upload-input-container">
          <el-input
            v-model="fileDisplayName"
            placeholder="请上传名片"
            readonly
            class="upload-input"
          />
          <el-link type="primary" class="upload-btn" @click="triggerFileUpload">
            点击上传
          </el-link>
          <el-upload
            ref="uploadRef"
            class="hidden-upload"
            :auto-upload="false"
            :show-file-list="false"
            :on-change="handleFileChange"
          >
          </el-upload>
        </div>
        <div class="el-upload__tip">
          客服电话：<el-link disabled type="primary">0571-1234567</el-link>
        </div>
      </el-form-item>
    </el-form>

    <template #footer>
      <el-row :gutter="20">
        <el-col :span="2"></el-col>
        <el-col :span="10">
          <el-button @click="handleClose" style="width: 100%">取消</el-button></el-col
        >
        <el-col :span="10"
          ><el-button type="success" @click="handleSubmit" style="width: 100%"
            >确定</el-button
          ></el-col
        >
      </el-row>
    </template>
  </el-dialog>
</template>

<style scoped>
.dialog-footer {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
}

.el-form-item--label-top .el-form-item__label {
  margin-bottom: 0px !important;
  padding-bottom: 0px !important;
}

/* 修改label的间距 */
:deep(.el-form-item__label) {
  margin-bottom: 0 !important;
  padding-bottom: 0 !important;
  line-height: 1.2 !important;
}

/* 优化small标签样式 */
:deep(.el-form-item__label small) {
  font-size: 0.8em !important;
  color: #7f7f7f !important;
  font-weight: normal !important;
}

/* 确保表单项之间的间距合适 */
:deep(.el-form-item) {
  margin-bottom: 16px !important;
}

/* 最后一个表单项不需要底部间距 */
:deep(.el-form-item:last-child) {
  margin-bottom: 0 !important;
}
/* 上传文件相关组件 */
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

/* 标题 */
.custom-dialog-title {
  color: #3dbc79;
  text-align: center;
  font-weight: bolder;
}
</style>
