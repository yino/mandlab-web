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
              <el-form-item>
                <label class="input-label">邀请码</label>
                <el-input v-model="inviteCode" placeholder="请输入邀请码" />
              </el-form-item>
              <div>
                <!-- <span class="invite-tip">
                没有邀请码？<a class="invite-link" href="#">联系我们</a>
              </span> -->
              </div>
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
                  <el-col :span="19">
                    <el-input v-model="captcha" placeholder="请输入验证码" />
                  </el-col>
                  <el-col :span="2">
                    <el-button class="captcha-btn" type="primary" plain
                      >发送验证码</el-button
                    >
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
                      <a class="agreement-link" href="#">使用协议</a>
                      和
                      <a class="agreement-link" href="#">隐私政策</a>
                    </span>
                  </el-checkbox>
                </el-col>
              </el-form-item>
              <el-form-item>
                <el-button class="login-btn" type="success" round block
                  >登录</el-button
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
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
const inviteCode = ref("");
const phone = ref("");
const captcha = ref("");
const agreed = ref(false);
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
  font-weight: 900;
  text-align: center;
  letter-spacing: 0.12em;
  margin-bottom: 0.7rem;
}
.input-label {
  font-size: 0.8rem;
  color: #222;
  margin-bottom: 0.2rem;
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
  margin-top: 2rem;
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
  height: 2rem;
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
/* 验证码模块 */
.captcha-row-form .captcha-row-form-item  {
  width: 100%;
}

/* 响应式 */
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
