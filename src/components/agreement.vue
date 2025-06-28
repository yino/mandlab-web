<script setup lang="ts">
import { computed } from "vue";

const props = defineProps<{
  visible: boolean;
  type: "agreement" | "privacy"; // 新增类型区分
}>();

const emit = defineEmits(["update:visible"]);

const handleClose = () => {
  emit("update:visible", false);
};

// 计算属性：根据类型返回对应的标题
const dialogTitle = computed(() => {
  return props.type === "agreement" ? "使用协议" : "隐私政策";
});

// 计算属性：根据类型返回对应的内容
const dialogContent = computed(() => {
  const content = props.type === "agreement" ? agreementContent : privacyContent;
  return content.replace(/\n/g, "<br>");
});

// 使用协议内容
const agreementContent = `
# 使用协议

## 1. 服务条款
欢迎使用Mandlab平台。在使用我们的服务之前，请您仔细阅读以下条款。

## 2. 用户责任
- 用户应提供真实、准确的个人信息
- 用户不得利用平台进行违法活动
- 用户应妥善保管自己的账户信息

## 3. 平台责任
- 平台将保护用户隐私信息
- 平台将提供稳定的服务
- 平台将及时处理用户反馈

## 4. 知识产权
平台的所有内容均受知识产权保护，未经许可不得使用。

## 5. 免责声明
在法律允许的范围内，平台不承担因不可抗力造成的损失。

## 6. 协议修改
平台有权在必要时修改本协议，修改后的协议将在平台公布。

## 7. 联系方式
如有疑问，请联系客服：0571-1234567
`;

// 隐私政策内容
const privacyContent = `
# 隐私政策

## 1. 信息收集
我们收集的信息包括：
- 基本信息：姓名、公司名称、岗位
- 联系方式：手机号码、邮箱地址、联系地址
- 业务信息：名片等文件

## 2. 信息使用
我们使用收集的信息用于：
- 提供平台服务
- 身份验证
- 客户服务
- 业务改进

## 3. 信息保护
我们采取以下措施保护您的信息：
- 数据加密存储
- 访问权限控制
- 定期安全审计

## 4. 信息共享
除以下情况外，我们不会与第三方共享您的信息：
- 获得您的明确同意
- 法律法规要求
- 保护平台和用户权益

## 5. 您的权利
您有权：
- 查看、修改个人信息
- 删除账户
- 撤回同意授权

## 6. 数据保留
我们将在必要期间内保留您的信息，超出期限后将安全删除。

## 7. 政策更新
我们可能会更新本政策，更新后的政策将在平台公布。

## 8. 联系我们
如有隐私相关问题，请联系：0571-1234567
`;
</script>

<template>
  <el-dialog
    :model-value="visible"
    @close="handleClose"
    width="600px"
    class="policy-dialog"
  >
    <template #title>
      <div class="custom-dialog-title">Mandle {{ dialogTitle }}</div>
    </template>

    <div class="policy-content" v-html="dialogContent"></div>

    <template #footer>
      <span class="dialog-footer">
        <el-button @click="handleClose">关闭</el-button>
      </span>
    </template>
  </el-dialog>
</template>

<style scoped>
.policy-dialog :deep(.el-dialog__body) {
  max-height: 60vh;
  overflow-y: auto;
  padding: 20px;
}

.policy-content {
  line-height: 1.6;
  color: #333;
}

.policy-content h1 {
  color: #1890ff;
  font-size: 1.5rem;
  margin-bottom: 1rem;
  border-bottom: 2px solid #1890ff;
  padding-bottom: 0.5rem;
}

.policy-content h2 {
  color: #333;
  font-size: 1.2rem;
  margin: 1.5rem 0 0.5rem 0;
  font-weight: 600;
}

.policy-content p {
  margin: 0.5rem 0;
}

.policy-content ul {
  margin: 0.5rem 0;
  padding-left: 1.5rem;
}

.policy-content li {
  margin: 0.3rem 0;
}

.dialog-footer {
  text-align: center;
}

/* 标题 */
.custom-dialog-title {
  text-align: center;
  font-weight: bolder;
  font-size: 1.2rem;
  color: #333333;
}
</style>
