<template>
  <div> 
    <div style="margin-left: -0.5rem;margin-top: -0.5rem;">
      <NavBar />
    </div>

    <div class="login-container">
      <div>
        <img src="/public/logo.png" class="logo" />
        <h1 class="login-title">Mandlab</h1>
        <el-form style="padding: 1.6rem;">
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
            <div id="phoneErrorTip" class="phone-error-tip"></div>
            <el-input v-model="phone" placeholder="请输入手机号码" @blur="validatePhone" @input="validatePhoneInput" />
            <div :class="['captcha-btn-container', { disabled: !isValidPhone }]" style="margin-top: 1rem;">
          
            </div>
          </el-form-item>

          <el-form-item class="captcha-row-form" style="margin-left: 0.5rem;">
            <p class="input-label">验证码</p>
            <div id="captchaErrorTip" class="phone-error-tip" style="margin-left: -8rem;"></div>
            <el-row :gutter="28" class="captcha-row-form-item">
              <el-col :span="18">
                <el-input v-model="captcha" placeholder="请输入验证码" @blur="validateCaptcha" />
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
                    style="margin-top: -0.3rem;"
                  >使用协议</el-link>
                  和
                  <el-link
                    type="primary"
                    @click="showPrivacy"
                    :underline="false"
                    style="margin-top: -0.3rem;"
                  >隐私政策</el-link>
                </span>
              </el-checkbox>
            </el-col>
          </el-form-item>

          <el-button class="login-btn" type="success" size="medium" @click="handleLogin">
            {{ loginBtnTxt }}
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

// 在你的 Vue 组件中
<script setup lang="ts">
import { ref, h, onUnmounted, onMounted } from 'vue';
import { useRouter } from 'vue-router'; // 导入路由
import { ElMessage } from 'element-plus';
import NavBar from '../components/NavBar.vue';
import FormDialog from '../components/FormDialog.vue';
import AgreementDialog from '../components/agreement.vue';

// 获取路由实例
const router = useRouter();

// 基础变量
const inviteCode = ref("");
const registerOk = ref(true);
const phone = ref("");
const captcha = ref("");
const agreed = ref(false);
const dialogVisible = ref(false);
const loginBtnTxt = ref("登录");
const isValidPhone = ref(false);
const isValidCaptcha = ref(false);

// 协议弹窗相关
const agreementVisible = ref(false);
const agreementType = ref<"agreement" | "privacy">("agreement");

// 验证码相关
const isCountingDown = ref(false);
const countdownSeconds = ref(60);
let timer: number | undefined;

// 获取URL参数并初始化inviteCode
const initInviteCode = () => {
  const urlParams = new URLSearchParams(window.location.search);
  const inviteCodeParam = urlParams.get("inviteCode");
  const formType = urlParams.get("formType");

  if (formType === "register") {
    registerOk.value = true;
    loginBtnTxt.value = "注册";
  } else {
    registerOk.value = false;
  }

  if (inviteCodeParam) {
    inviteCode.value = inviteCodeParam;
  }
};

onMounted(() => {
  initInviteCode();
});

// 禁用发送验证码按钮的判断逻辑
const validatePhoneInput = () => {
  const phoneRegex = /^1[3-9]\d{9}$/;
  isValidPhone.value = phoneRegex.test(phone.value);
};

// 验证手机号是否合法
const validatePhone = () => {
  if (!phone.value) return;

  const phoneRegex = /^1[3-9]\d{9}$/;
  if (!phoneRegex.test(phone.value)) {
    showPhoneErrorTip();
  } else {
    hidePhoneErrorTip();
  }
};

// 显示手机号错误提示
const showPhoneErrorTip = () => {
  const tipElement = document.getElementById('phoneErrorTip');
  if (tipElement) {
    tipElement.style.display = 'block';
    tipElement.textContent = '手机号格式不正确';
  }
};

// 隐藏手机号错误提示
const hidePhoneErrorTip = () => {
  const tipElement = document.getElementById('phoneErrorTip');
  if (tipElement) {
    tipElement.style.display = 'none';
  }
};

// 验证验证码是否合法
const validateCaptcha = () => {
  if (!captcha.value) return;

  const captchaRegex = /^\d{6}$/; // 假设验证码是6位数字
  if (!captchaRegex.test(captcha.value)) {
    showCaptchaErrorTip();
  } else {
    hideCaptchaErrorTip();
    isValidCaptcha.value = true;
  }
};

// 显示验证码错误提示
const showCaptchaErrorTip = () => {
  const tipElement = document.getElementById('captchaErrorTip');
  if (tipElement) {
    tipElement.style.display = 'block';
    tipElement.textContent = '验证码格式不正确';
  }
};

// 隐藏验证码错误提示
const hideCaptchaErrorTip = () => {
  const tipElement = document.getElementById('captchaErrorTip');
  if (tipElement) {
    tipElement.style.display = 'none';
  }
};

// 发送验证码
const sendCaptcha = () => {
  if (isCountingDown.value) {
    return;
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

// 点击登录按钮的处理函数
const handleLogin = () => {
  if (!agreed.value) {
    ElMessage({
      message: h("p", { style: "line-height: 1; font-size: 14px" }, [
        h("span", null, "请先阅读并同意使用协议和隐私政策"),
      ]),
      type: "warning",
    });
    return;
  }

  if (!isValidPhone.value) {
    ElMessage({
      message: h("p", { style: "line-height: 1; font-size: 14px" }, [
        h("span", null, "请输入正确的手机号"),
      ]),
      type: "warning",
    });
    validatePhone();
    return;
  }

  if (!isValidCaptcha.value) {
    validateCaptcha();
    return;
  }

  // 验证验证码是否为12345
  if (captcha.value === "12345") {
    ElMessage({
      message: "登录成功",
      type: "success",
    });
    // 跳转到/Assistant页面
    router.push('/Assistant');
  } else {
    ElMessage({
      message: "验证码错误",
      type: "error",
    });
  }
};

// 打开信息登记表单弹窗
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

// 信息登记表单提交
const handleSubmit = (formData: any) => {
  console.log("Form submitted:", formData);
  // 这里可以添加表单提交的逻辑
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
  margin-top: 8.1rem;
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