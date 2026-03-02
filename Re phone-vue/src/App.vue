<script setup>
import { ref, onMounted, nextTick } from 'vue';
import HomeView from './views/HomeView.vue';
import SettingsApp from './components/SettingsApp.vue';
import TalkApp from './components/TalkApp.vue';

// Define currentView to avoid "not defined" error
const currentView = ref('chat');

// Add chatScrollArea ref for scrolling
const chatScrollArea = ref(null);

// 💡 新增：联系人姓名
const contactName = ref('对方昵称'); // 请根据实际需要修改默认值

// 💡 新增：联系人“人设”信息
const persona = ref('你的默认人设描述'); // 请根据实际需要修改默认值

// 💡 聊天消息列表
const chatMessages = ref([]);

// 1. 基础系统状态 (你原有的代码)
const isSettingsOpen = ref(false);
const isTalkOpen = ref(false); // 控制 Talk App 的开关
const globalMode = ref(localStorage.getItem('phone_mode') || 'android');
const isBooting = ref(true);
const ballActive = ref(false);

// 💡 [新增] 2. 壁纸状态管理
// 优先从本地存储读取，如果没有就使用默认的图片链接
const androidBg = ref(localStorage.getItem('android_bg') || 'https://raw.githubusercontent.com/1687216166Pat/xiaoshouj/main/IMG_4016.jpeg');
const iosBg = ref(localStorage.getItem('ios_bg') || 'https://raw.githubusercontent.com/1687216166Pat/xiaoshouj/main/IMG_4017.jpeg');

// 💡 [新增] 3. 更新壁纸的函数
// 这是一个“搬运工”，负责把新图片存入变量并写进硬盘
const updateWallpaper = (mode, newUrl) => {
  if (mode === 'android') {
    androidBg.value = newUrl;
    localStorage.setItem('android_bg', newUrl); // 存入硬盘，下次打开还在
  } else {
    iosBg.value = newUrl;
    localStorage.setItem('ios_bg', newUrl); // 存入硬盘
  }
};

// 2. 覆盖层开关
const isLocked = ref(false);          // 锁屏
const isControlCenter = ref(false);   // 控制中心

// 3. 手势逻辑中枢
let startX = 0;
let startY = 0;

const handleTouchStart = (e) => {
  startX = e.touches[0].clientX;
  startY = e.touches[0].clientY;
};

const handleTouchEnd = (e) => {
  const endY = e.changedTouches[0].clientY;
  const diffY = endY - startY;
  const screenWidth = window.innerWidth;
  const screenHeight = window.innerHeight;

  // --- A. 下拉逻辑 (顶部 60px 区域开始) ---
  if (startY < 60 && diffY > 50) {
    if (startX < screenWidth / 2) {
      isLocked.value = true;        // 左侧下拉 -> 锁屏
    } else {
      isControlCenter.value = true; // 右侧下拉 -> 控制中心
    }
  }

  // --- B. 上滑逻辑 (起始点在屏幕下 1/3，向上滑动距离超过 50 像素) ---
  if (startY > (screenHeight * 2 / 3) && diffY < -100) {
    isLocked.value = false;
    isControlCenter.value = false;
    isSettingsOpen.value = false;
  }
};

// 4. 自动时间逻辑
const lockTime = ref('12:00');
const updateTime = () => {
  const now = new Date();
  lockTime.value = now.getHours().toString().padStart(2, '0') + ":" +
    now.getMinutes().toString().padStart(2, '0');
};

onMounted(async () => {
  // --- 1. 你原来的逻辑：时钟和开机动画 ---
  updateTime();
  setInterval(updateTime, 1000);
  setTimeout(() => ballActive.value = true, 50);
  setTimeout(() => isBooting.value = false, 3000);

  // --- 2. 新增逻辑：请求通知权限 ---
  await requestNotificationPermission();

  // --- 3. 新增逻辑：注册后台特工 (Service Worker) ---
  if ('serviceWorker' in navigator) {
    try {
      const registration = await navigator.serviceWorker.register('/sw.js');
      console.log('后台特工已就位:', registration.scope);
    } catch (err) {
      console.error('特工注册失败:', err);
    }
  }

  // --- 4. 关键逻辑：监听“杀掉后台/离开网页”动作 ---
  document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'hidden') {

      // 1. 【关键检查】：看看用户是不是在设置里关闭了主动消息
      const activeMessageEnabled = localStorage.getItem('active_message') !== 'false';

      // 如果关闭了，直接返回，什么都不做
      if (!activeMessageEnabled) {
        console.log('主动消息已关闭，不发送后台通知');
        return;
      }

      // --- 以下是原本的发送逻辑，只有在开启时才会执行 ---

      // 2. 发送系统通知
      if (navigator.serviceWorker && navigator.serviceWorker.controller) {
        navigator.serviceWorker.controller.postMessage({
          type: 'SCHEDULE_NOTIFICATION',
          title: 'Alex',
          body: '我刚才想到了个新点子，你还在吗？',
          delay: 8000
        });
      }

      // 3. 同步到聊天记录
      const offlineMsg = {
        id: Date.now(),
        type: 'them',
        text: '我刚才想到了个新点子，你还在吗？',
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      chatMessages.value.push(offlineMsg);
      localStorage.setItem('chat_history_Alex', JSON.stringify(chatMessages.value));
    }
  });

  // --- 5. 启动你原本的随机消息逻辑 ---
  scheduleRandomMessage();
});


// 保存：修改模式的函数里加入保存逻辑
const handleModeUpdate = (newMode) => {
  globalMode.value = newMode;
  localStorage.setItem('phone_mode', newMode); // 👈 将新模式存入硬盘
};

// 💡 模拟“世界书 App”里已经存好的数据
const allWorldBooks = ref([
  {
    id: 1,
    title: '三体 · 黑暗森林',
    content: '宇宙是一座黑暗森林，每个文明都是带枪的猎人。',
    position: '插入顶部'
  },
  {
    id: 2,
    title: '赛博朋克设置',
    content: '高科技，低生活。霓虹灯下的贫民窟。',
    position: '插入底部'
  },
  {
    id: 3,
    title: '魔法学院',
    content: '咒语需要配合魔杖，情绪是魔力的源泉。',
    position: '插入人设后'
  }
]);
// ==================== AI 主动发消息功能（智能决策版）====================

// 追踪消息状态
const lastActiveMessageTime = ref(Date.now()); // 用户最后活跃时间
const lastAIMessageTime = ref(0); // AI 最后发消息时间
const lastAIMessageReplied = ref(true); // AI 上次发的消息是否得到回复
const consecutiveNoReply = ref(0); // 连续未回复次数

// AI 主动发送消息的核心函数
const sendActiveMessage = async () => {
  // 检查是否开启了主动发消息功能
  const activeMessageEnabled = localStorage.getItem('active_message') !== 'false';
  if (!activeMessageEnabled) {
    console.log('主动发消息功能已关闭');
    return;
  }

  const apiEndpoint = localStorage.getItem('ai_endpoint');
  const apiKey = localStorage.getItem('ai_api_key');
  const defaultModel = localStorage.getItem('ai_default_model') || 'gpt-4-turbo';

  if (!apiEndpoint || !apiKey) {
    console.log('API 未配置，跳过主动发消息');
    return;
  }

  // 计算用户沉默时长（小时）
  const silentHours = (Date.now() - lastActiveMessageTime.value) / (1000 * 60 * 60);

  // 获取最近的聊天记录
  const recentMessages = chatMessages.value.slice(-8).map(msg => ({
    role: msg.type === 'me' ? 'user' : 'assistant',
    content: msg.text
  }));

  // 智能决策：选择哪种模式
  let mode;
  let systemPrompt;

  if (silentHours > 6) {
    // 模式 3：用户很久没联系，表达想念/担心
    mode = 'missing';

    // 30% 概率穿插模式 1 或 2
    const shouldMixMode = Math.random() < 0.3;

    if (shouldMixMode && Math.random() > 0.5) {
      mode = 'continue'; // 穿插继续话题
    } else if (shouldMixMode) {
      mode = 'share'; // 穿插分享新鲜事
    }

  } else if (lastAIMessageReplied.value && recentMessages.length > 0) {
    // 模式 1：上次得到回复，继续话题
    mode = 'continue';

  } else {
    // 模式 2：上次没得到回复，或随机触发，分享新鲜事
    mode = 'share';
  }

  // 根据模式构造 prompt
  const currentTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  const baseInfo = `你是 ${contactName.value}，人设：${persona.value}
现在是 ${currentTime}。`;

  if (mode === 'continue') {
    systemPrompt = `${baseInfo}

你们刚才聊了一些话题，你想主动继续这个话题。可以：
- 追问对方的想法或感受
- 补充相关的内容
- 分享你对这个话题的新想法

要求：
1. 只发一条消息（1-2 句话）
2. 语气自然，像朋友聊天
3. 基于之前的对话内容，不要突兀
4. 直接发送消息，不要加前缀`;

  } else if (mode === 'share') {
    systemPrompt = `${baseInfo}

你刚刚在日常生活中遇到了一些事情，想主动分享给对方。可以是：
- 看到的有趣事物（可爱的动物、好看的风景、有趣的店铺）
- 突然想到的事（一首歌、一部电影、一个回忆、一个想法）
- 遇到的小事（差点迟到、买到好吃的、天气变化、心情波动）
- 或者单纯想找对方聊天

要求：
1. 只发一条消息（1-2 句话）
2. 符合你的人设和性格
3. 有画面感和真实感，像刚发生的
4. 可以带情绪（开心、惊讶、无聊、兴奋）
5. 直接发送消息，不要加前缀

举例（不要照抄）：
- "刚才路过公园，看到一只超可爱的金毛，想起你说过喜欢狗"
- "突然下雨了诶，没带伞有点狼狈哈哈"
- "在听一首很治愈的歌，分享给你"
- "无聊死了，你在干嘛呀"`;

  } else { // mode === 'missing'
    const isMixedWithOther = consecutiveNoReply.value > 0 && Math.random() < 0.3;

    if (isMixedWithOther) {
      // 穿插其他模式的内容，但带点"想念"的情绪
      systemPrompt = `${baseInfo}

你已经有一段时间（${Math.floor(silentHours)} 小时）没收到对方的回复了。你有点想念对方，但又不想显得太黏人。

你决定：
- 分享一些日常的事情，但字里行间透露出"想起了对方"
- 或者提起之前聊过的话题，顺便问问对方最近怎么样

要求：
1. 只发一条消息（1-2 句话）
2. 语气要自然，不要太刻意
3. 可以稍微表达想念，但不要过度
4. 直接发送消息，不要加前缀

举例（不要照抄）：
- "今天看到一家新开的咖啡店，想起你说过想去试试新店"
- "刚才突然想起你了，最近还好吗？"
- "好久没聊天了，有点想你..."`;

    } else {
      // 纯粹的想念/担心模式
      systemPrompt = `${baseInfo}

你已经有一段时间（${Math.floor(silentHours)} 小时）没收到对方的回复了。你的情绪可以是：
- 想念对方，想知道 ta 在干嘛
- 有点担心，是不是出了什么事
- 有点小情绪，觉得被冷落了
- 或者假装不在意，但其实很在意

根据你的人设选择合适的情绪表达方式。

要求：
1. 只发一条消息（1-2 句话）
2. 符合你的性格（理性的人可能委婉，直接的人可能直说）
3. 可以带点情绪，但不要过度
4. 直接发送消息，不要加前缀

举例（不要照抄）：
- "喂，还活着吗？"
- "好久没见你消息了，有点想你..."
- "是不是把我忘了？"
- "最近很忙吗？好久没聊天了"`;
    }
  }

  try {
    const response = await fetch(apiEndpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: defaultModel,
        messages: [
          { role: 'system', content: systemPrompt },
          ...recentMessages
        ],
        temperature: 0.9,
        max_tokens: 100
      })
    });

    if (!response.ok) {
      console.error('AI 主动发消息失败:', response.status);
      return;
    }

    const responseText = await response.text();
    let data;
    try {
      data = JSON.parse(responseText);
    } catch {
      console.error('解析 AI 响应失败');
      return;
    }

    if (!data.choices || !data.choices[0] || !data.choices[0].message) {
      console.error('AI 返回格式异常');
      return;
    }

    const aiMessage = data.choices[0].message.content.trim();

    // 发送消息
    chatMessages.value.push({
      id: Date.now(),
      type: 'them',
      text: aiMessage,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    });

    // 更新状态
    lastAIMessageTime.value = Date.now();
    lastAIMessageReplied.value = false; // 等待用户回复
    consecutiveNoReply.value += 1;
    lastActiveMessageTime.value = Date.now();

    nextTick(() => {
      if (chatScrollArea.value) {
        chatScrollArea.value.scrollTop = chatScrollArea.value.scrollHeight;
      }
    });

    // 触发浏览器通知
    if (document.hidden) {
      showNotification(contactName.value, aiMessage);
    }

    console.log(`AI 主动发消息（模式: ${mode}，沉默: ${silentHours.toFixed(1)}h，未回复次数: ${consecutiveNoReply.value}）:`, aiMessage);

  } catch (error) {
    console.error('AI 主动发消息出错:', error);
  }
};

// 随机发送消息
const scheduleRandomMessage = () => {
  // 1. 获取时间间隔（保持你原来的逻辑）
  const messageInterval = parseInt(localStorage.getItem('message_interval') || '15');
  const messageUnit = localStorage.getItem('message_unit') || 'minute';

  let baseInterval;
  switch (messageUnit) {
    case 'second': baseInterval = messageInterval * 1000; break;
    case 'minute': baseInterval = messageInterval * 60 * 1000; break;
    case 'hour': baseInterval = messageInterval * 60 * 60 * 1000; break;
    case 'day': baseInterval = messageInterval * 24 * 60 * 60 * 1000; break;
    default: baseInterval = 15 * 60 * 1000;
  }

  const minInterval = baseInterval * 0.7;
  const maxInterval = baseInterval * 1.3;
  const randomInterval = Math.floor(Math.random() * (maxInterval - minInterval)) + minInterval;

  // 2. 核心定时器
  setTimeout(() => {
    const activeMessageEnabled = localStorage.getItem('active_message') !== 'false';
    if (!activeMessageEnabled) {
      scheduleRandomMessage();
      return;
    }

    // --- 核心修改：判断当前 App 状态 ---
    if (document.visibilityState === 'visible') {
      // 场景 A：用户正在看手机，直接在聊天窗口里显示消息
      const timeSinceLastActive = Date.now() - lastActiveMessageTime.value;
      if (currentView.value === 'chat' && timeSinceLastActive > 5 * 60 * 1000) {
        sendActiveMessage();
      }
    } else {
      // 场景 B：用户杀掉了后台、锁屏了、或者在看别的 App
      // 我们通过“后台特工”弹出真正的系统通知
      if ('serviceWorker' in navigator && navigator.serviceWorker.controller) {
        navigator.serviceWorker.controller.postMessage({
          type: 'SCHEDULE_NOTIFICATION',
          title: 'Alex',
          body: '我刚才想到了一个新的设计点，你现在方便看下吗？'
        });
      }
    }

    // 继续循环下一次随机消息
    scheduleRandomMessage();
  }, randomInterval);
};

// 浏览器通知
const showNotification = (title, body) => {
  const backgroundNotificationEnabled = localStorage.getItem('background_notification') !== 'false';
  if (!backgroundNotificationEnabled) {
    console.log('后台通知功能已关闭');
    return;
  }
  if ('Notification' in window && Notification.permission === 'granted') {
    new Notification(title, {
      body: body,
      icon: '/logo.png',
      badge: '/logo.png',
      tag: 'ai-message',
      requireInteraction: false
    });
  }
};

// 请求通知权限
const requestNotificationPermission = async () => {
  if (!('Notification' in window)) {
    console.error("此浏览器不支持桌面通知");
    return;
  }

  if (Notification.permission === 'default') {
    // 弹出询问框
    const permission = await Notification.requestPermission();
    console.log('用户授权结果:', permission); // 'granted' (允许) 或 'denied' (拒绝)
  }
};

// 组件挂载时启动
onMounted(async () => {
  // 1. 第一步：请求通知权限（只有用户允许了，后台通知才能弹出来）
  await requestNotificationPermission();

  // 2. 第二步：注册后台特工 (Service Worker)
  // 这段代码的作用是：在浏览器后台安插一个“潜伏者”，即使网页关了，它也能发通知
  if ('serviceWorker' in navigator) {
    try {
      // 这里的 /sw.js 对应你项目 public 文件夹下的 sw.js 文件
      const registration = await navigator.serviceWorker.register('/sw.js');
      console.log('Service Worker 注册成功，作用域为:', registration.scope);
    } catch (error) {
      console.log('Service Worker 注册失败，请检查 public 文件夹下是否有 sw.js 文件:', error);
    }
  }

  // 3. 第三步：启动你原本的消息逻辑
  scheduleRandomMessage();
});

</script>

<template>
  <div id="app" @touchstart="handleTouchStart" @touchend="handleTouchEnd">

    <!-- 1. 开屏动画 -->
    <Transition name="fade">
      <div v-if="isBooting" id="startup-screen">
        <div class="startup-content">
          <h1 class="re-phone-logo">Re phone</h1>
          <div class="progress-wrapper">
            <div class="progress-line"></div>
            <div class="progress-ball" :style="{ left: ballActive ? '100%' : '0%' }"></div>
          </div>
        </div>
      </div>
    </Transition>

    <!-- 2. 锁屏页面 -->
    <Transition name="ios-slide">
      <div v-show="isLocked" class="full-layer lock-screen">
        <div class="lock-content">
          <div class="lock-time">{{ lockTime }}</div>
          <div class="lock-date">10月24日 星期四</div>
        </div>
        <div class="swipe-hint">向上轻扫以解锁</div>
      </div>
    </Transition>

    <!-- 3. 控制中心 (右上角下拉) -->
    <Transition name="ios-slide">
      <div v-show="isControlCenter" class="full-layer control-center">
        <div class="cc-panel">

          <!-- A. 顶部符号栏 -->
          <div class="cc-top-bar">
            <div class="cc-btn-top">+</div>
            <div class="cc-btn-top">
              <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M18.36 6.64a9 9 0 1 1-12.73 0"></path>
                <line x1="12" y1="2" x2="12" y2="12"></line>
              </svg>
            </div>
          </div>

          <!-- B. 音乐播放器文本区 (大段空行) -->
          <div class="cc-music-section">
            <div class="music-progress">━━━━━━●──────⇆0：30</div>
            <div class="music-controls">◁ ㅤㅤ❚❚ ㅤㅤ ▷ ㅤㅤ ↻</div>
          </div>

          <!-- C. 详细状态信息栏 -->
          <div class="cc-status-line">
            <div class="cc-status-left">
              <span>📶 中国移动</span>
              <span>📶</span>
            </div>
            <div class="cc-status-right">
              <span>🌙</span>
              <span>100% 🔋</span>
            </div>
          </div>

          <!-- D. 现有的组件 (已下移) -->
          <div class="cc-grid-placeholder">
            <div class="cc-card">🌙</div>
            <div class="cc-card">📶</div>
            <div class="cc-card">✈️</div>
            <div class="cc-card">🔋</div>
          </div>

        </div>
      </div>
    </Transition>


    <!-- 4. 底部手势白条 -->
    <div class="home-bar"></div>

    <!-- 5. 主屏幕层 -->
    <!-- Add ref to the chat scroll area if you have a chat container -->
    <HomeView :mode="globalMode" :android-bg="androidBg" :ios-bg="iosBg" @open-settings="isSettingsOpen = true"
      @open-talk="isTalkOpen = true" />

    <!-- 6. 设置 App (iOS 缩放动效版) -->
    <Transition name="app-zoom">
      <SettingsApp v-if="isSettingsOpen" :mode="globalMode" :android-bg="androidBg" :ios-bg="iosBg"
        @close="isSettingsOpen = false" @update-mode="handleModeUpdate" @update-wallpaper="updateWallpaper" />
    </Transition>

    <!-- 7. Talk App (同样使用缩放动效) -->
    <Transition name="app-zoom">
      <TalkApp v-if="isTalkOpen" :mode="globalMode" :android-bg="androidBg" :ios-bg="iosBg" :world-books="allWorldBooks"
        @close="isTalkOpen = false" @update-mode="handleModeUpdate" @update-wallpaper="updateWallpaper" />
    </Transition>


  </div> <!-- 👈 对应 id="app" 的闭合 -->
</template> <!-- 👈 对应 template 的闭合 -->

<style>
/* --- 全局适配 --- */
html,
body {
  margin: 0;
  padding: 0;
  width: 100%;
  height: 100vh;
  /* 强行 100% 物理高度 */
  overflow: hidden;
  /* 💡 核心：背景图直接写在 body 上，确保它能穿透所有层直达底边 */
  background: url('https://raw.githubusercontent.com/1687216166Pat/xiaoshouj/main/IMG_4016.jpeg') center/cover no-repeat;
}

#app {
  width: 100%;
  height: 100%;
  padding: 0;
  margin: 0;
  /* 💡 确保根容器是透明的，露出 body 的背景图 */
  background: transparent;
  display: flex;
  flex-direction: column;
}

/* --- 覆盖层通用 --- */
.full-layer {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  z-index: 50000;
  display: flex;
  flex-direction: column;
}

/* 锁屏 & 控制中心样式 */
.lock-screen {
  background: rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(20px);
  color: white;
  justify-content: flex-start;
  align-items: center;
}

.lock-content {
  margin-top: 120px;
  text-align: center;
}

.lock-time {
  font-size: 80px;
  font-weight: 200;
}

.lock-date {
  font-size: 20px;
  opacity: 0.8;
}

.swipe-hint {
  position: absolute;
  bottom: 100px;
  opacity: 0.5;
  font-size: 14px;
  color: white;
  width: 100%;
  text-align: center;
}

/* --- 控制中心重制版样式 --- */
.control-center {
  background: rgba(30, 30, 30, 0.2);
  /* 稍微深一点的磨砂 */
  backdrop-filter: blur(40px);
  -webkit-backdrop-filter: blur(40px);
}

.cc-panel {
  padding: 20px 25px;
  color: white;
  display: flex;
  flex-direction: column;
}

/* 顶部按钮 */
.cc-top-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 10px;
  height: 40px;
}

.cc-btn-top {
  width: 35px;
  height: 35px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24px;
  font-weight: 300;
  cursor: pointer;
}

/* 音乐区域：大段空行设计 */
.cc-music-section {
  margin: 60px 0 40px;
  /* 上边距 60px 产生大段空行 */
  text-align: center;
}

.music-progress {
  font-family: monospace;
  /* 等宽字体确保进度条不乱 */
  font-size: 14px;
  letter-spacing: 1px;
  opacity: 0.9;
  margin-bottom: 20px;
}

.music-controls {
  font-size: 18px;
  word-spacing: 5px;
}

/* 详细状态栏 */
.cc-status-line {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 12px;
  font-weight: 600;
  margin-bottom: 20px;
  padding: 0 5px;
  opacity: 0.8;
}

.cc-status-left,
.cc-status-right {
  display: flex;
  gap: 10px;
  align-items: center;
}

/* 组件网格 (下移后的状态) */
.cc-grid-placeholder {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 15px;
}

.cc-card {
  background: rgba(255, 255, 255, 0.12);
  height: 100px;
  border-radius: 25px;
  /* iOS 18 风格大圆角 */
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 30px;
  border: 0.5px solid rgba(255, 255, 255, 0.1);
}

/* 底部 Home Bar */
/* 💡 你的模拟白条：直接定位在最底 0 像素 */
.home-bar {
  position: fixed;
  bottom: 0;
  /* 👈 撞击最底边 */
  left: 50%;
  transform: translateX(-50%);
  width: 120px;
  height: 5px;
  background: rgba(255, 255, 255, 0.8);
  border-radius: 10px;
  z-index: 99999;
}

/* --- 动画系统 --- */

/* 1. 下拉动画 */
.ios-slide-enter-active,
.ios-slide-leave-active {
  transition: all 0.4s cubic-bezier(0.32, 0.72, 0, 1);
}

.ios-slide-enter-from,
.ios-slide-leave-to {
  transform: translateY(-100%);
  opacity: 0;
}

/* 2. App 缩放返回动画 (仿 iOS) */
.app-zoom-enter-active,
.app-zoom-leave-active {
  transition: transform 0.5s cubic-bezier(0.32, 0.72, 0, 1), opacity 0.4s ease;
}

.app-zoom-enter-from,
.app-zoom-leave-to {
  opacity: 0;
  transform: scale(0.85);
  /* 缩放效果 */
}

/* 3. 开屏淡出 */
.fade-leave-active {
  transition: opacity 0.8s;
}

.fade-leave-to {
  opacity: 0;
}

/* ============================================================
   【开屏动画样式 - 最终修正版】
   ============================================================ */

/* 1. 启动页背景 */
#startup-screen {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background-color: #FAFAFA;
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 100000;
}

/* 2. 整个内容篮子：负责整体高度位置 */
.startup-content {
  text-align: center;
  width: 220px;
  /* 💡 核心修改：从 -20px 改为 -100px，让它飞上去 */
  transform: translateY(-100px);
  transition: transform 0.3s ease;
}

/* 3. Logo文字：负责找回消失的文字并添加动画 */
.re-phone-logo {
  font-family: 'Dancing Script', cursive;
  font-size: 48px;
  color: #444;
  margin-bottom: 25px;
  /* 👈 缩短文字和小球的距离，更紧凑 */

  /* 💡 必须加上这两行，文字才会显示并有浮现效果 */
  opacity: 0;
  animation: logoFadeIn 1s forwards 0.3s;
}

/* 4. 💡 必须加上这个动画定义，否则文字是死活出不来的 */
@keyframes logoFadeIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }

  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* 5. 进度条和弹性小球 */
.progress-wrapper {
  position: relative;
  width: 200px;
  height: 14px;
  display: flex;
  align-items: center;
  margin: 0 auto;
}

.progress-line {
  width: 100%;
  height: 1px;
  background-color: #E0E0E0;
}

.progress-ball {
  position: absolute;
  top: 50%;
  width: 14px;
  height: 14px;
  background-color: #FAFAFA;
  border: 2px solid #FFB6C1;
  border-radius: 50%;
  transform: translate(-50%, -50%);
  transition: left 2.2s cubic-bezier(0.68, -0.55, 0.27, 1.55);
}
</style>
