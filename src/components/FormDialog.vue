<script setup lang="ts">
import { ref } from "vue";
import type { FormInstance, FormRules } from "element-plus";
import { ElMessage } from "element-plus";
import { applyInviteCode, uploadInviteFile } from "../api/api";

const props = defineProps<{
  visible: boolean;
}>();

const emit = defineEmits(["update:visible", "submit"]);

const formRef = ref<FormInstance>();
const uploadRef = ref();
const fileDisplayName = ref("");

const form = ref({
  name: "",
  phone: "",
  badge: "",
});

const phoneLabel = ref("联系电话 <small>(邀请码将以短信的形式发送到您的手机)</small>");
const cardLabel = ref("名片<small>(提供名片我们会优先审核哦)</small>");

const rules: FormRules = {
  name: [{ required: false, message: "请输入姓名", trigger: "blur" }],
  phone: [
    { required: true, message: "请输入联系电话", trigger: "blur" },
    {
      pattern: /^1[3-9]\d{9}$/,
      message: "请输入正确的手机号码",
      trigger: "blur",
    },
  ],
};

const handleClose = () => {
  emit("update:visible", false);
};

const handleSubmit = async () => {
  if (!formRef.value) return;
  const valid = await formRef.value.validate();
  if (!valid) return;
  try {
    let resp = await applyInviteCode({
      applicant_name: form.value.name||'null',
      phone: form.value.phone,
      business_card_file_id: form.value.badge,
      company_name: "null",
      position: "null",
      address: "null",
      email: "12345678@123.com",
    });
    ElMessage.success(resp.data.msg);
	 emit("update:visible", false);
  } catch (err: any) {
    ElMessage.error(err?.response?.data?.msg || "申请失败");
	 emit("update:visible", false);
    return false;
  }
};

const triggerFileUpload = () => {
  const uploadEl = uploadRef.value?.$el.querySelector('input[type="file"]');
  if (uploadEl) {
    uploadEl.click();
  }
};

const handleUploadSuccess = async (response: any, uploadFile: File) => {
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
    :model-value="visible"
    @close="handleClose"
    width="500px"
    class="form-dialog"
  >
    <template #title>
      <div class="custom-dialog-title">邀请码申请</div>
    </template>

    <div class="form-body">
      <el-form
        ref="formRef"
        :model="form"
        :rules="rules"
        label-width="100px"
        label-position="top"
        class="form-submit"
      >
        <el-form-item label="称呼" prop="name">
          <el-input v-model="form.name" placeholder="请输入姓名" />
        </el-form-item>

        <el-form-item prop="phone">
          <template #label>
            <span v-html="phoneLabel"></span>
          </template>
          <el-input v-model="form.phone" placeholder="请输入联系电话" />
        </el-form-item>

        <el-form-item>
          <template #label>
            <div class="upload-label">
              <span v-html="cardLabel"></span>
              <el-link type="primary" @click="triggerFileUpload">点击上传</el-link>
            </div>
          </template>
          <div class="upload-area" @click="triggerFileUpload">
            <div class="upload-placeholder">
              {{ fileDisplayName || "请上传名片" }}
            </div>
            <el-upload
              ref="uploadRef"
              class="hidden-upload"
              :auto-upload="false"
              :show-file-list="false"
              :on-change="handleFileChange"
            />
          </div>
          <div class="support-line">
            客服电话：<el-link disabled type="primary">0571-1234567</el-link>
          </div>
        </el-form-item>
      </el-form>
    </div>

    <template #footer>
      <div class="footer-btns">
        <el-button @click="handleClose" plain>取消</el-button>
        <el-button type="success" @click="handleSubmit">确定</el-button>
      </div>
    </template>
  </el-dialog>
</template>

<style scoped>
.custom-dialog-title {
	width: 100%;
	margin-left: 18px;
  color: #3dbc79;
  text-align: center;
  font-weight: bolder;
  font-size: 20px;
}

.form-body {
  padding: 20px;
}

.el-form-item {
  margin-bottom: 20px;
}

.el-input {
  border-radius: 12px;
}

.upload-label {
  display: flex;
  justify-content: space-between;
  font-size: 14px;
  color: #333;
}

.upload-area {
  width: 100%;
  border: 1px solid #dcdfe6;
  border-radius: 12px;
  min-height: 40px;
  padding: 10px 15px;
  display: flex;
  align-items: center;
  font-size: 14px;
  background-color: #fafafa;
  transition: border-color 0.2s;
}

.upload-area:hover {
  border-color: #3dbc79;
  cursor: pointer;
}

.upload-placeholder {
  color: #999;
  flex: 1;
}

.hidden-upload {
  display: none;
}

.support-line {
  width: 100%;
  text-align: center;
  font-size: 13px;
  color: #666;
  margin-top: 8px;
}


.footer-btns {
  display: flex;
  justify-content: space-around;
  padding: 10px 20px;
}

.el-button {
  width: 120px;
  border-radius: 8px;
}
</style>
