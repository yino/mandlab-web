<template>
  <div> 
    <div style="margin-left: -0.5rem;margin-top: -0.5rem;">
      <NavBar />
    </div>

    <div class="login-container">
      <div>
        <img src="/public/logo.png" class="logo" />
        <h1 class="login-title">Mandlab</h1>
        <el-form style="padding: 1.6rem;" >
          <el-form-item class="inviteCode-form" v-if="registerOk">
            <label class="input-label">邀请码</label>
            <el-input v-model="inviteCode" placeholder="请输入邀请码" />
            <div class="inviteCode-prompt">
              没有邀请码？
              <el-link type="primary" @click="openDialog" :underline="false">马上获取</el-link>
            </div>
          </el-form-item>
          <div></div>
          
          <el-form-item style="margin-left: 0.5rem;">
            <label class="input-label">手机号码</label>
            <div id="phoneErrorTip" class="phone-error-tip">手机号格式有误</div>
            <el-input v-model="phone" placeholder="请输入手机号码" @blur="validatePhone" @input="validatePhoneInput" />
            <div :class="['captcha-btn-container', { disabled: !isValidPhone }]" style="margin-top: 1rem;">
            </div>
          </el-form-item>

          <el-form-item class="captcha-row-form" style="margin-left: 0.5rem;">
            <p class="input-label">验证码</p>
            <div id="captchaErrorTip" class="phone-error-tip" style="margin-left: -8rem;"></div>
            <el-row :gutter="28" class="captcha-row-form-item">
              <el-col :span="18">
                <el-input v-model="captcha" placeholder="请输入验证码" />
              </el-col>
              <el-col :span="2">
                <el-button
                  class="captcha-btn"
                  type="primary"
                  plain
                  :disabled="isCountingDown || !isValidPhone"
                  @click="sendCaptcha"
                >
                  {{
                    isCountingDown
                      ? `重新发送(${countdownSeconds}s)`
                      : "发送验证码"
                  }}
                </el-button>
              </el-col>
            </el-row>
          </el-form-item>

          <el-form-item class="agreement-group">
            <el-col :span="3"></el-col>
            <el-col :span="18">
              <el-checkbox v-model="agreed">
                <span class="agreement-text">
                  已阅读并同意Mandlab
                  <el-link
                    type="primary"
                    @click="showAgreement"
                    :underline="false"
                    style="margin-top: -0.2rem;"
                  >使用协议</el-link>
                  和
                  <el-link
                    type="primary"
                    @click="showPrivacy"
                    :underline="false"
                    style="margin-top: -0.2rem;"
                  >隐私政策</el-link>
                </span>
              </el-checkbox>
            </el-col>
          </el-form-item>

          <el-button class="login-btn" type="success" size="medium" @click="loginEvent">
            {{loginBtnTxt}}
          </el-button>
        </el-form>
      </div>
    </div>

    <div class="deco deco-br">
      <div class="deco-rect deco-rect-solid"></div>
    </div>

    <FormDialog v-model:visible="dialogVisible" @submit="handleSubmit" />
    <AgreementDialog v-model:visible="agreementVisible" :type="agreementType" />
  </div>
</template>

<script setup lang="ts">
import { ref, onUnmounted, onMounted } from "vue";
import { login, sendCode, CodeInputBody } from "../api/api";
import { ElMessage } from "element-plus";

// 页面组件相关
import FormDialog from "../components/MFormDialog.vue";
import NavBar from"../components/NavBar.vue"
import AgreementDialog from "../components/Magreement.vue";

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

// 是否手机号有效
const isValidPhone = ref(false);

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
  validatePhone(); // 初始化验证手机号
});

// 验证手机号输入（实时）
const validatePhoneInput = () => {
  if (phone.value.length === 0) {
    document.getElementById('phoneErrorTip').style.display = 'none';
  }
};

// 验证手机号
const validatePhone = () => {
  if (phone.value.length === 0) {
    return;
  }

  const phonePattern = new RegExp(/^1[3-9]\d{9}$/);
  if (!phonePattern.test(phone.value)) {
    document.getElementById('phoneErrorTip').style.display = 'block';
    isValidPhone.value = false;
  } else {
    document.getElementById('phoneErrorTip').style.display = 'none';
    isValidPhone.value = true;
  }
};

// 发送验证码
const sendCaptcha = async () => {
  if (isCountingDown.value) {
    return;
  }
  if (agreed.value === false) {
    ElMessage.warning("请先阅读并同意使用协议和隐私政策");
    return false;
  }
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

  if (!isValidPhone.value) {
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
.phone-error-tip {
  display: none;
  color: red;
  font-size: 0.8rem;
  margin-top: 1.4rem;
  position: absolute;
  right: 0;
  top: 0;
}

.captcha-btn-container {
  margin-top: 1rem;
}

.captcha-btn-container.disabled .captcha-btn {
  cursor: not-allowed;
  background-color: #cccccc;
  color: #ffffff;
}

.login-container {
  display: flex;
}

.logo {
  width: 7rem;
  margin-left: 8.0rem;
}

.login-title {
  color: #3dbc79;
  font-size: 30rpx;
  font-style: italic;
  font-weight: bolder;
  text-align: center;
  margin-left: 0.5rem;
  letter-spacing: 0.22em;
  margin-top: -0.5rem;
  margin-bottom: 0.7rem;
}

.input-label {
  margin-top: 1rem;
  font-size: 1rem;
  color: #222;
  margin-bottom: 0.5rem;
  display: block;
}

.el-input {
  font-size: 1.1rem;
  height: 2.3rem;
}

.el-input__wrapper {
  min-height: 2rem !important;
  font-size: 0.9rem !important;
}

.captcha-btn {
  border-radius: 0.4rem;
  width: 6rem;
  margin-left: -1rem;
  border: 0.1rem solid #1890ff;
  color: #1890ff;
  background: #fff;
  font-weight: 500;
  height: 2.2rem;
  font-size: 0.9rem;
}

.captcha-btn:hover {
  background: #e6f7ff;
  color: #0d7dd9;
  border-color: #0d7dd9;
}

.agreement-group {
  margin-top: 4.1rem;
  margin-left: -1.9rem;
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

.inviteCode-form {
  position: relative;
  margin-left: 0.5rem;
  margin-bottom: 1rem;
}

.inviteCode-prompt {
  position: absolute;
  right: 0;
  bottom: -2rem;
}

.captcha-row-form .captcha-row-form-item {
  width: 100%;
}

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
    font-size: 2.1rem;
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