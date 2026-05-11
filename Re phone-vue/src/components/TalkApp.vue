<template>
  <div class="app-container">
    <!-- 1. 左侧窄边栏 -->
    <aside class="sidebar">
      <div class="action-buttons">
        <button class="circle-btn" @click="handleBack">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M19 12H5M12 19l-7-7 7-7" />
          </svg>
        </button>
        <button class="circle-btn">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <circle cx="11" cy="11" r="8" />
            <path d="m21 21-4.3-4.3" />
          </svg>
        </button>
        <button class="circle-btn">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <polygon
              points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
          </svg>
        </button>
      </div>

      <div class="divider"></div>

      <div class="contact-list">
        <!-- 示例联系人 Alex -->
        <div class="avatar-wrapper" :class="{ active: contactName === 'Alex' }" @click="contactName = 'Alex'">
          <div class="circle-avatar">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
              <circle cx="12" cy="7" r="4" />
            </svg>
          </div>
        </div>
        <!-- 示例联系人 Jordan -->
        <div class="avatar-wrapper" :class="{ active: contactName === 'Jordan' }" @click="contactName = 'Jordan'">
          <div class="circle-avatar" style="background-color: #d1d1d1;">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
              <circle cx="12" cy="7" r="4" />
            </svg>
          </div>
        </div>
      </div>
    </aside>

    <!-- 2. 右侧聊天主区域 -->
    <main class="chat-main">
      <!-- 聊天头部 -->
      <header class="chat-header">
        <div class="header-left">
          <div class="square-avatar">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
              <circle cx="12" cy="7" r="4" />
            </svg>
          </div>
          <div class="header-info">
            <div class="contact-title">{{ contactName }}</div>
            <div class="status">在线</div>
          </div>
        </div>
        <div class="header-actions">
          <button class="icon-btn"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8">
              <path
                d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
            </svg></button>
          <button class="icon-btn"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8">
              <rect x="2" y="3" width="20" height="14" rx="2" ry="2" />
              <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
            </svg></button>
          <button class="icon-btn"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8">
              <circle cx="12" cy="12" r="1" />
              <circle cx="12" cy="5" r="1" />
              <circle cx="12" cy="19" r="1" />
            </svg></button>
        </div>
      </header>

      <!-- 消息列表 -->
      <section class="message-list" ref="chatScrollArea">
        <div v-for="msg in chatMessages" :key="msg.id"
          :class="['message-row', msg.type === 'me' ? 'row-me' : 'row-them']">
          <div class="bubble">
            {{ msg.text }}
          </div>
          <div class="message-meta">
            <span class="time">{{ msg.time }}</span>
            <span v-if="msg.type === 'me'" class="read-status">
              <svg viewBox="0 0 24 24" fill="none" stroke="#4caf50" stroke-width="3" width="12">
                <path d="M20 6 9 17l-5-5" />
              </svg>
              <svg viewBox="0 0 24 24" fill="none" stroke="#4caf50" stroke-width="3" width="12"
                style="margin-left:-8px">
                <path d="M20 6 9 17l-5-5" />
              </svg>
            </span>
          </div>
        </div>
      </section>

      <!-- 底部输入区 -->
      <footer class="input-area">
        <input type="text" v-model="newMessage" placeholder="新消息..." @keyup.enter="sendMessage" />
        <button class="send-btn" @click="sendMessage">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <line x1="22" y1="2" x2="11" y2="13" />
            <polygon points="22 2 15 22 11 13 2 9 22 2" />
          </svg>
        </button>
      </footer>
    </main>
  </div>

<template>
  <!-- 绑定鼠标和手指两套事件 -->
  <div 
    class="app-container" 
    :class="{ 'sidebar-is-hidden': isSidebarHidden }"
    @touchstart="onDragStart"
    @touchend="onDragEnd"
    @mousedown="onDragStart"
    @mouseup="onDragEnd"
  >
    <!-- 左侧边栏 -->
    <aside class="sidebar">
      <div class="action-buttons">
        <!-- 💡 返回按钮：确保它在这里 -->
        <button class="circle-btn" @click.stop="handleBack">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M19 12H5M12 19l-7-7 7-7"/></svg>
        </button>
        <!-- ...其他按钮... -->
      </div>
      <!-- ... -->
    </aside>

    <!-- 右侧聊天主区域 -->
    <main class="chat-main">
      <!-- ...内容... -->
    </main>
  </div>
</template>

</template>

<script setup>
import { ref, nextTick, onMounted } from 'vue';

// --- 接收父组件数据 ---

const emit = defineEmits(['close', 'user-sent-message']);

// --- 状态变量 ---
const contactName = ref('Alex');
const persona = ref('理性，爱看科幻');
const callMe = ref('主人');
const newMessage = ref('');
const chatScrollArea = ref(null);

// --- 聊天记录 (初始化) ---
const savedHistory = localStorage.getItem('chat_history_Alex');
const chatMessages = ref(savedHistory ? JSON.parse(savedHistory) : [
  { id: 1, type: 'them', text: '你好，设计稿确认了吗？', time: '14:30' },
]);

// --- 功能函数 ---
const handleBack = () => emit('close');

const sendMessage = async () => {
  if (!newMessage.value.trim()) return;

  const userText = newMessage.value;
  const now = new Date();
  const timeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  // 1. 添加用户消息
  chatMessages.value.push({
    id: Date.now(),
    type: 'me',
    text: userText,
    time: timeStr
  });

  newMessage.value = '';
  scrollToBottom();

  // 2. AI 请求逻辑
  const apiEndpoint = localStorage.getItem('ai_endpoint');
  const apiKey = localStorage.getItem('ai_api_key');
  const defaultModel = localStorage.getItem('ai_default_model') || 'gpt-4-turbo';

  if (!apiEndpoint || !apiKey) {
    chatMessages.value.push({ id: Date.now() + 1, type: 'them', text: '请先配置 API 信息。', time: timeStr });
    return;
  }

  // 构建时间感知信息
  const weekDays = ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六'];
  const detailedTime = `${now.getFullYear()}年${now.getMonth() + 1}月${now.getDate()}日 ${weekDays[now.getDay()]} ${timeStr}`;

  const history = chatMessages.value.slice(-10).map(msg => ({
    role: msg.type === 'me' ? 'user' : 'assistant',
    content: msg.text
  }));

  try {
    const response = await fetch(apiEndpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${apiKey}` },
      body: JSON.stringify({
        model: defaultModel,
        messages: [
          { role: 'system', content: `[当前情景] 关系:朋友; 时间:${detailedTime}; 人设:${persona.value}; 称呼:${callMe.value}` },
          ...history
        ],
        temperature: 0.7
      })
    });

    const data = await response.json();
    const aiReply = data.choices[0].message.content;

    chatMessages.value.push({
      id: Date.now() + 1,
      type: 'them',
      text: aiReply,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    });

    localStorage.setItem('chat_history_Alex', JSON.stringify(chatMessages.value));
    scrollToBottom();
  } catch (error) {
    console.error(error);
  }
};

const scrollToBottom = () => {
  nextTick(() => {
    if (chatScrollArea.value) {
      chatScrollArea.value.scrollTop = chatScrollArea.value.scrollHeight;
    }
  });
};

onMounted(scrollToBottom);
// --- 1. 变量定义 ---
const isSidebarHidden = ref(false);
let startX = 0;
let isDragging = false; // 增加一个抓取状态

// --- 2. 统一处理函数 (支持鼠标和手指) ---
const onDragStart = (e) => {
  // 获取起始坐标（兼容鼠标和手指）
  startX = e.type.includes('mouse') ? e.clientX : e.touches[0].clientX;
  isDragging = true;
};

const onDragEnd = (e) => {
  if (!isDragging) return;
  
  // 获取结束坐标
  const endX = e.type.includes('mouse') ? e.clientX : e.changedTouches[0].clientX;
  const diffX = endX - startX;

  // 这里的 50 是滑动灵敏度，数字越小越灵敏
  if (diffX < -50) {
    isSidebarHidden.value = true; // 左滑隐藏
    console.log("侧边栏已隐藏");
  } else if (diffX > 50) {
    isSidebarHidden.value = false; // 右滑显示
    console.log("侧边栏已唤出");
  }
  isDragging = false;
};

</script>

<style scoped>
/* 1. 基础布局 */
.app-container {
  display: flex;
  width: 100%;
  height: 100vh;
  background-color: #eef2f5;
  /* 整体浅灰背景 */
  padding: 20px;
  box-sizing: border-box;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  transition: padding 0.4s ease; /* 增加内边距动画 */
}

/* 2. 左侧边栏 (这是它“展开”时的正常状态) */
.sidebar {
  flex: 0 0 50px;    /* 👈 这里填你正常的宽度，不要填 3px */
  margin-right: 10px; /* 👈 这里填你想要的空气感间距 */
  
  /* 下面这些是保证动画丝滑的关键 */
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  opacity: 1;
  overflow: hidden; 
  display: flex;
  flex-direction: column;
  align-items: center;

  /* 💡 必须加这两行，确保侧边栏在最上层 */
  position: relative;
  z-index: 100; 
}

/* 3. 必须要加上这一段：这是它“隐藏”时的状态 */
.sidebar-is-hidden .sidebar {
  flex: 0 0 0px;       /* 👈 隐藏时宽度归零 */
  margin-right: 0px;   /* 👈 隐藏时左右间距归零 */
  opacity: 0;          /* 👈 隐藏时透明 */
  pointer-events: none; /* 👈 隐藏时鼠标点不到它 */
}

.action-buttons {
  display: flex;
  flex-direction: column;
  gap: 16px;
  margin-bottom: 24px;
}

.circle-btn {
  width: 35px;
  height: 35px;
  border-radius: 50%;
  border: 1.5px solid #1c1c1e;
  background: rgba(255, 255, 255, 0.7);
  backdrop-filter: blur(8px);
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  position: relative;
  z-index: 110;
  color: #1c1c1e;
}

.circle-btn svg {
  width: 22px;
  height: 22px;
}

.divider {
  width: 60%;
  height: 1px;
  background-color: rgba(0, 0, 0, 0.1);
  margin-bottom: 24px;
}

.contact-list {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.avatar-wrapper {
  padding: 4px;
  border-radius: 50%;
  border: 2px solid transparent;
  cursor: pointer;
  transition: all 0.2s;
}

.avatar-wrapper.active {
  border-color: #1c1c1e;
}

.circle-avatar {
  width: 35px;
  height: 35px;
  border-radius: 50%;
  background-color: rgba(0, 0, 0, 0.06);
  display: flex;
  align-items: center;
  justify-content: center;
  color: #666;
}

.circle-avatar svg {
  width: 28px;
  height: 28px;
}

/* 4. 右侧主区域 (确保层级低于侧边栏) */
.chat-main {
  flex: 1;
  background: white;
  border-radius: 24px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.05);
  display: flex;
  flex-direction: column;
  overflow: hidden;
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  
  /* 💡 关键：层级设为 10，比侧边栏的 100 低 */
  position: relative;
  z-index: 10; 
}

/* 💡 可选：如果你希望隐藏侧边栏时，聊天框撑得更满（去掉圆角） */
.sidebar-is-hidden .chat-main {
  border-radius: 12px; /* 沉浸模式下圆角变小 */
}

/* 5. 沉浸式微调：当隐藏时，让主区域稍微撑满一点 */
.sidebar-is-hidden .app-container {
  padding: 10px; /* 侧边栏隐藏时，缩小外边距，更沉浸 */
}

.sidebar-is-hidden .chat-main {
  border-radius: 16px; /* 隐藏时圆角稍微变小一点点 */
}

/* 6. 唤回按钮样式 */
.expand-btn {
  background: none;
  border: none;
  cursor: pointer;
  margin-right: 12px;
  display: flex;
  align-items: center;
  color: #1c1c1e;
}

.chat-header {
  padding: 20px 24px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid #f0f0f0;
}

.header-left {
  display: flex;
  align-items: center;
  gap: 12px;
}

.square-avatar {
  width: 44px;
  height: 44px;
  background: #f0f0f0;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #999;
}

.square-avatar svg {
  width: 24px;
  height: 24px;
}

.contact-title {
  font-size: 18px;
  font-weight: 600;
  color: #1c1c1e;
}

.status {
  font-size: 12px;
  color: #999;
}

.header-actions {
  display: flex;
  gap: 8px;
}

.icon-btn {
  background: none;
  border: none;
  padding: 8px;
  cursor: pointer;
  color: #1c1c1e;
}

.icon-btn svg {
  width: 22px;
  height: 22px;
}

/* 4. 消息列表 */
.message-list {
  flex: 1;
  padding: 24px;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.message-row {
  display: flex;
  flex-direction: column;
  max-width: 70%;
}

.row-me {
  align-self: flex-end;
  align-items: flex-end;
}

.row-them {
  align-self: flex-start;
  align-items: flex-start;
}

.bubble {
  padding: 12px 16px;
  border-radius: 16px;
  font-size: 15px;
  line-height: 1.5;
}

.row-me .bubble {
  background-color: #f0f0f0;
  color: #1c1c1e;
  border-bottom-right-radius: 4px;
}

.row-them .bubble {
  background-color: #f7f7f7;
  color: #1c1c1e;
  border-bottom-left-radius: 4px;
}

.message-meta {
  margin-top: 4px;
  font-size: 11px;
  color: #999;
  display: flex;
  align-items: center;
  gap: 4px;
}

/* 5. 输入区 */
.input-area {
  padding: 20px 24px;
  display: flex;
  align-items: center;
  gap: 12px;
}

.input-area input {
  flex: 1;
  border: none;
  border-bottom: 1px solid #e0e0e0;
  padding: 8px 0;
  font-size: 16px;
  outline: none;
  transition: border-color 0.3s;
}

.input-area input:focus {
  border-color: #1c1c1e;
}

.send-btn {
  background: none;
  border: none;
  cursor: pointer;
  color: #1c1c1e;
}

.send-btn svg {
  width: 24px;
  height: 24px;
}
</style>
