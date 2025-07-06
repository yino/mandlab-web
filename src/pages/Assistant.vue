<template>
  <div class="assistant-container">
    <!-- 顶部导航栏 -->
    <div class="header">
      <div class="more-icon">⋯</div>
      <div class="title">MandLab研以致用</div>
      <div class="add-icon">+</div>
    </div>

    <!-- 中间主要内容区域 -->
    <div class="content">
      <div class="greeting">
        <h1>我是您可持续领域工作的智能助手</h1>
        <h1>很高兴见到你！</h1>
      </div>
      <div class="description">
        <p>我可以解答您在绿色金融、ESG相关的任何问题，并支持您更好开展学习与工作。</p>
      </div>
    </div>

    <!-- 底部问题提示区域 -->
    <div class="suggestions">
      <div class="suggestion-title">您可以问我这些问题：</div>
      <div class="suggestion-list">
        <div class="suggestion-item">最近有什么ESG相关政策</div>
        <div class="suggestion-item">最近有什么绿色金融相关政策</div>
        <div class="suggestion-item">关于最近出台的《绿色金融****》政策你怎么看</div>
      </div>
    </div>

    <!-- 底部聊天输入区域 -->
    <div class="chat-box">
      <div class="input-container">
        <input type="text" placeholder="Talk to Bot">
        <button>
          <span>→</span>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
// 空的 setup 块，移除不必要的逻辑
</script>

<style scoped>
.assistant-container {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
  height: 100vh;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  background-color: #f5f5f5;
}

/* 顶部导航栏样式 */
.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 1rem;
  height: 3rem;
  background-color: #e8f5e9;
  border-bottom: 1px solid #e0e0e0;
}

.more-icon, .add-icon {
  width: 2rem;
  height: 2rem;
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
  color: #4caf50;
  font-size: 1.2rem;
}

.title {
  font-size: 1.2rem;
  color: #4caf50;
  font-weight: 500;
}

/* 中间内容区域样式 */
.content {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 0 1rem;
}

.greeting h1 {
  font-size: 1.5rem;
  color: #4caf50;
  font-weight: 500;
  text-align: center;
  margin: 0.5rem 0;
}

.description {
  margin-top: 2rem;
  text-align: center;
  font-size: 1rem;
  color: #666;
  line-height: 1.6;
}

/* 底部问题提示区域样式 */
.suggestions {
  padding: 0 1rem;
}

.suggestion-title {
  font-size: 1.2rem;
  color: #666;
  margin-bottom: 1rem;
}

.suggestion-list {
  display: flex;
  flex-direction: column;
  gap: 0.8rem;
}

.suggestion-item {
  background-color: #fff;
  padding: 0.8rem 1rem;
  border-radius: 0.8rem;
  font-size: 0.9rem;
  color: #333;
}

/* 底部聊天输入区域样式 */
.chat-box {
  padding: 0.5rem 1rem 1rem;
  background-color: #fff;
  border-top: 1px solid #e0e0e0;
}

.input-container {
  display: flex;
  align-items: center;
  background-color: #f5f5f5;
  border-radius: 1.5rem;
  overflow: hidden;
}

input {
  flex: 1;
  border: none;
  outline: none;
  padding: 0.8rem 1rem;
  font-size: 1rem;
  background-color: transparent;
}

button {
  width: 2.5rem;
  height: 2.5rem;
  border-radius: 50%;
  border: none;
  background-color: #4caf50;
  color: white;
  font-size: 1rem;
  cursor: pointer;
}
</style>