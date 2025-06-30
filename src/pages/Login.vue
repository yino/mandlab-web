<template>
  <div class="login-bg">
    <div class="login-container">
      <div class="login-content">
        <!-- 左上装饰 -->
        <div class="deco deco-tl">
          <div class="deco-rect deco-rect-solid"></div>
          <div class="deco-rect deco-rect-outline"></div>
        </div>
        <div class="login-box">
          <div>
            <h1 class="login-title">Mandlab</h1>
            <el-form>
              <el-form-item class="inviteCode-form" v-if="registerOk">
                <label class="input-label">邀请码</label>
                <el-input v-model="inviteCode" placeholder="请输入邀请码" />
                <div class="inviteCode-prompt">
                  没有邀请码？
                  <el-link type="primary" @click="openDialog" :underline="false"
                    >马上获取</el-link
                  >
                </div>
              </el-form-item>
              <div></div>
              <el-form-item>
                <label class="input-label">手机号码</label>
                <el-input v-model="phone" placeholder="请输入手机号码" />
              </el-form-item>
              <!-- 验证码相关组 -->
              <div>
                <p class="input-label">验证码</p>
              </div>
              <el-form-item class="captcha-row-form">
                <el-row :gutter="28" class="captcha-row-form-item">
                  <el-col :span="18">
                    <el-input v-model="captcha" placeholder="请输入验证码" />
                  </el-col>
                  <el-col :span="2">
                    <el-button
                      class="captcha-btn"
                      type="primary"
                      plain
                      :disabled="isCountingDown"
                      @click="sendCaptcha"
                    >
                      {{
                        isCountingDown ? `重新发送(${countdownSeconds}s)` : "发送验证码"
                      }}
                    </el-button>
                  </el-col>
                </el-row>
              </el-form-item>
              <!-- 协议相关 -->
              <el-form-item class="agreement-group">
                <el-col :span="3"></el-col>
                <el-col :span="18">
                  <el-checkbox v-model="agreed">
                    <span class="agreement-text">
                      已阅读并同意Mandlab
                      <el-link type="primary" @click="showAgreement" :underline="false"
                        >使用协议</el-link
                      >
                      和
                      <el-link type="primary" @click="showPrivacy" :underline="false"
                        >隐私政策</el-link
                      >
                    </span>
                  </el-checkbox>
                </el-col>
              </el-form-item>
              <el-form-item>
                <el-button
                  class="login-btn"
                  type="success"
                  size="medium"
                  @click="loginEvent"
                  >{{ loginBtnTxt }}</el-button
                >
              </el-form-item>
            </el-form>
          </div>
        </div>
        <!-- 右下装饰放到 login-box 内部 -->
        <div class="deco deco-br">
          <div class="deco-rect deco-rect-solid"></div>
        </div>
      </div>
    </div>

    <!-- 信息表单弹窗 -->
    <FormDialog v-model:visible="dialogVisible" @submit="handleSubmit" />

    <!-- 协议弹窗 -->
    <AgreementDialog v-model:visible="agreementVisible" :type="agreementType" />
  </div>
</template>

<script setup lang="ts">
import { ref, onUnmounted, onMounted, watch } from "vue";
import { login, sendCode, CodeInputBody } from "../api/api";
import type { FormRules } from "element-plus";
import { ElMessage } from "element-plus";

// 页面组件相关
import FormDialog from "../components/FormDialog.vue";
import AgreementDialog from "../components/agreement.vue";

const inviteCode = ref("");
const registerOk = ref(true);
const phone = ref("");
const captcha = ref("");
const agreed = ref(false);
const dialogVisible = ref(false);
const loginBtnTxt = ref("登录");
// 协议弹窗相关
const agreementVisible = ref(false);
const agreementType = ref<"agreement" | "privacy">("agreement");

const isCountingDown = ref(false);
const countdownSeconds = ref(60);
let timer: number | undefined;

// 获取URL参数并初始化inviteCode
const initInviteCode = () => {
  const urlParams = new URLSearchParams(window.location.search);
  const inviteCodeParam = urlParams.get("inviteCode");
  const formType = urlParams.get("formType");

  // 根据formType参数设置registerOk
  if (formType === "register") {
    registerOk.value = true;
    loginBtnTxt.value = "注册";
  } else {
    registerOk.value = false;
  }

  // 如果有邀请码参数，则显示邀请码行并赋值
  if (inviteCodeParam) {
    inviteCode.value = inviteCodeParam;
  }
};

// 页面初始化时获取URL参数
onMounted(() => {
  initInviteCode();
});

// 发送验证码
const sendCaptcha = async () => {
  if (isCountingDown.value) {
    return;
  }
  if (agreed.value === false) {
    ElMessage.warning("请先阅读并同意使用协议和隐私政策");
    return false;
  }
  // 获取手机号

  if (phone.value.length <= 0) {
    ElMessage.warning("请输入手机号");
    return;
  }

  let data: CodeInputBody = {
    phone: phone.value,
    purpose: "login",
  };
  try {
    const resp = await sendCode(data);
    // 这里 resp.data 就是 { message: string }
    ElMessage.success(resp.data?.msg);
  } catch (err) {
    ElMessage.error("发送验证码失败");
  }
  isCountingDown.value = true;
  countdownSeconds.value = 60;

  timer = setInterval(() => {
    countdownSeconds.value -= 1;
    if (countdownSeconds.value <= 0) {
      clearInterval(timer as number);
      isCountingDown.value = false;
    }
  }, 1000);
};

const openDialog = () => {
  dialogVisible.value = true;
};

// 显示使用协议
const showAgreement = () => {
  agreementType.value = "agreement";
  agreementVisible.value = true;
};

// 显示隐私政策
const showPrivacy = () => {
  agreementType.value = "privacy";
  agreementVisible.value = true;
};

// 登录事件
const loginEvent = async () => {
  if (!loginValidate()) {
    return;
  }
  try {
	  //跳转测试
	  // window.location.href="http://localhost:3000/?token=123456"
    const resp = await login({
      phone: phone.value,
      verification_code: captcha.value,
      invite_code: inviteCode.value || undefined,
    });
    ElMessage.success("登录成功");
    console.log("resp", resp);
    // TODO：处理登录成功后的跳转等
const chatUrl = import.meta.env.VITE_VUE_APP_CHAT_URL;
window.location.href = `${chatUrl}?token=${resp.data.access_token}`;

  } catch (err: any) {
    loginErrorRespValidate(err?.response?.data?.code, err?.response?.data?.msg);
  }
};
const loginValidate = () => {
  if (agreed.value === false) {
    ElMessage.warning("请先阅读并同意使用协议和隐私政策");
    return false;
  }
  if (phone.value.length === 0) {
    ElMessage.warning("请输入手机号码");
    return false;
  }

  let phonePattern = new RegExp(/^1[3-9]\d{9}$/);
  if (!phonePattern.test(phone.value)) {
    ElMessage.warning("手机号格式有误");
    return false;
  }

  if (captcha.value.length === 0) {
    ElMessage.warning("请输入验证码");
    return false;
  }
  // 注册时需要邀请码
  if (registerOk.value && inviteCode.value.length === 0) {
    ElMessage.warning("请输入邀请码");
    return false;
  }
  return true;
};
const loginErrorRespValidate = (code: number, message: string) => {
  if (code === 1001) {
    ElMessage.warning("邀请码无效");
  } else if (code === 1002) {
    ElMessage.warning("登录失败");
  } else if (code === 1003) {
    ElMessage.warning("令牌生成失败");
  } else if (code === 1004) {
    ElMessage.warning("用户创建失败");
  } else if (code === 1005) {
    ElMessage.warning("用户不存在");
    registerOk.value = true;
  } else if (code === 1006) {
    ElMessage.warning("验证码已过期");
  } else if (code === 1007) {
    ElMessage.warning("验证码无效");
  } else {
    ElMessage.warning(message);
  }
};

onUnmounted(() => {
  if (timer) {
    clearInterval(timer);
  }
});
</script>

<style scoped>
.login-bg {
  width: 100%;
  height: 100%;
  /* min-height: 100vh; */
  background: linear-gradient(180deg, #e3f5e9 0%, #fff 60%);
  position: relative;
  overflow: hidden;
  font-size: 1rem;
}
.login-container {
  min-height: 60vh;
  display: flex;
  align-items: flex-start;
  justify-content: center;
  z-index: 1;
  position: relative;
  padding-top: 18vh;
  padding-bottom: 2vh;
}
/* 为了配合装饰物 */
.login-content {
  position: relative;
}
.login-box {
  background: #fff;
  border-radius: 1.25rem;
  border: 1px solid #dcdedd;
  box-shadow: 0.4vw 0 0 0 #e0e5e3, 0 0.4vw 0 0 #e0e5e3;
  padding: 2.2vw 5vw 2vw 5vw;
  min-width: 28vw;
  max-width: 36vw;
  margin: 0 auto;
  position: relative;
  overflow: visible;
  margin-left: 2vw;
  margin-right: 2vw;
  z-index: 1;
  opacity: 0.8;
}
.deco {
  position: absolute;
  z-index: 2;
  pointer-events: none;
}
.deco-tl {
  top: -4vw;
  left: -2vw;
  width: 6vw;
  height: 5vw;
}
/* 右下 */
.deco-br {
  position: absolute;
  right: 3vw;
  bottom: 1vw;
  width: 3rem;
  height: 3rem;
  z-index: -1;
}
.deco-br .deco-rect-solid {
  border: 1px solid #969696;
}
.deco-rect {
  position: absolute;
  border-radius: 0.6rem;
}
.deco-rect-solid {
  width: 6vw;
  height: 6vw;
  background: #6fd3a2;
  opacity: 0.85;
  left: 1vw;
  top: 0.7vw;
  z-index: 2;
}
.deco-rect-outline {
  width: 2.8vw;
  height: 2.8vw;
  border: 0.18vw solid #797979;
  left: 0.1vw;
  bottom: 2vw;
  background: #fff;
  z-index: 1;
}
/* login form */
.login-title {
  color: #3dbc79;
  font-size: 2.1rem;
  font-style: italic;
  font-weight: bolder;
  text-align: center;
  letter-spacing: 0.12em;
  margin-bottom: 0.7rem;
}
.input-label {
  font-size: 0.8rem;
  color: #222;
  margin-bottom: 0;
  display: block;
}
.el-input {
  font-size: 0.9rem;
  height: 2rem;
}
.el-input__wrapper {
  min-height: 2rem !important;
  font-size: 0.9rem !important;
}
.captcha-btn {
  flex: 1;
  border-radius: 0.4rem;
  border: 0.1rem solid #1890ff;
  color: #1890ff;
  background: #fff;
  font-weight: 500;
  height: 2rem;
  font-size: 0.9rem;
}
.captcha-btn:hover {
  background: #e6f7ff;
  color: #0d7dd9;
  border-color: #0d7dd9;
}
/*  协议弹窗相关 */
.agreement-group {
  margin-top: 1rem;
}
.agreement-text {
  font-size: 0.8rem;
  color: #222;
  margin-left: 0.3rem;
}
.agreement-link {
  color: #1890ff;
  text-decoration: underline;
  margin: 0 0.1rem;
  transition: color 0.2s;
  font-size: 0.8rem;
}
.agreement-link:hover {
  color: #0d7dd9;
}
.login-btn {
  width: 100%;
  height: 3rem;
  font-size: 1rem;
  font-weight: bold;
  border-radius: 0.4rem;
  background: #30c76d;
  border: none;
  margin-top: 0.1rem;
}
.login-btn:hover {
  background: #27a85c;
}
.el-checkbox {
  --el-checkbox-font-size: 0.9rem;
}
.el-form-item {
  margin-bottom: 0.5rem;
}

/* 邀请码 */
.inviteCode-form {
  position: relative;
  margin-bottom: 1rem;
}
.inviteCode-prompt {
  position: absolute;
  right: 0;
  bottom: -2rem;
}

/* 验证码模块 */
.captcha-row-form .captcha-row-form-item {
  width: 100%;
}

/* 响应式相关 */
@media (max-width: 900px) {
  .login-box {
    min-width: 60vw;
    max-width: 98vw;
    margin-left: 1vw;
    margin-right: 1vw;
    padding: 1.2rem 2vw 1rem 2vw;
  }
  .login-container {
    padding-top: 4vh;
    padding-bottom: 2vh;
  }
  .deco-tl {
    width: 3vw;
    height: 2vw;
    top: -1vw;
    left: -1vw;
    right: -1vw;
    bottom: -1vw;
  }
  .deco-rect-solid,
  .deco-rect-outline {
    width: 2vw !important;
    height: 2vw !important;
    left: 0.3vw !important;
    top: 0.2vw !important;
  }
}
@media (max-width: 600px) {
  .login-box {
    min-width: 90vw;
    max-width: 98vw;
    padding: 0.8rem 1vw 0.6rem 1vw;
  }
  .login-title {
    font-size: 1.2rem;
  }
  .deco-tl,
  .deco-br {
    width: 2vw;
    height: 1vw;
    top: -0.5vw;
    left: -0.5vw;
    right: -0.5vw;
    bottom: -0.5vw;
  }
  .deco-rect-solid,
  .deco-rect-outline {
    width: 1vw !important;
    height: 1vw !important;
    left: 0.1vw !important;
    top: 0.1vw !important;
  }
}
</style>
