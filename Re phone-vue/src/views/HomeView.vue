<template>
  <!-- 💡 这里的 :style 会根据模式自动切换背景图 -->
  <div class="iphone-screen" :style="{
    backgroundImage: props.mode === 'android'
      ? `url(${props.androidBg})`
      : `url(${props.iosBg})`
  }">


    <!-- 1. 顶部状态栏 -->
    <div class="status-bar" :class="props.mode">
      <template v-if="props.mode === 'android'">
        <div class="sb-left">
          <span class="sb-time">{{ currentTime }}</span>
          <span class="android-only-heart">🩷</span>
        </div>
        <div class="sb-right">
          <div class="sb-signal">
            <div class="bar active" style="height:40%"></div>
            <div class="bar active" style="height:60%"></div>
            <div class="bar active" style="height:80%"></div>
            <div class="bar active" style="height:100%"></div>
          </div>
          <div class="sb-wifi">
            <svg viewBox="0 0 24 24">
              <path fill="currentColor"
                d="M12,4.5c4.5,0,8.6,1.8,11.5,4.7l-2.1,2.5c-2.4-2.4-5.7-3.9-9.4-3.9s-7,1.5-9.4,3.9L0.5,9.2 C3.4,6.3,7.5,4.5,12,4.5z M12,10.5c2.7,0,5.2,1.1,6.9,2.8l-2.1,2.5c-1.2-1.2-2.9-1.9-4.8-1.9s-3.6,0.7-4.8,1.9L5.1,13.3 C6.8,11.6,9.3,10.5,12,10.5z M12,16.5c0.9,0,1.8,0.4,2.4,1l-2.4,2.9l-2.4-2.9C10.2,16.9,11.1,16.5,12,16.5z" />
            </svg>
          </div>
          <div class="sb-battery">
            <div class="sb-bat-level" style="width:80%"></div>
            <div class="battery-heart">❤️</div>
          </div>
        </div>
      </template>
      <template v-else-if="props.mode === 'ios'">
        <div class="sb-left"><span class="sb-time">{{ currentTime }}</span></div>
        <div class="sb-right"><span>iOS Mode</span></div>
      </template>
    </div>

    <!-- 2. 分页传送带 -->
    <div class="pages-container" ref="containerRef" @scroll="handleScroll">

      <!-- 第1页 (保持现状) -->
      <div class="page page-1"></div>

      <!-- 第2页 (主屏幕：在这里增加小组件) -->
      <div class="page page-2">

        <!-- 1. 创建一个大的安卓专用容器，统一控制显示隐藏 -->
        <div v-if="props.mode === 'android'" class="android-full-layout">

          <!-- A. 上方的两个方块小组件 -->
          <div class="android-widgets-container">
            <div class="widget">
              <div class="widget-title">恋爱纪念日</div>
              <div class="days-count">{{ anniversaryDays }}</div>
              <div class="days-label">Days Together</div>
            </div>
            <div class="widget" @click="updateWeather">
              <div class="weather-main">
                <span class="temp">{{ weather.temp }}°</span>
                <span class="desc">{{ weather.desc }}</span>
              </div>
              <div class="city-name">{{ weather.city }}</div>
            </div>
          </div>

          <!-- B. 今日箴言 Banner -->
          <div class="motto-banner">
            <div class="motto-image-box" @click="triggerUpload">
              <img :src="mottoImage" class="motto-img" />
              <input type="file" ref="fileInput" hidden @change="handleImageChange" accept="image/*" />
            </div>
            <div class="motto-text-box">
              <div class="motto-title">今日箴言</div>
              <div class="motto-content">保持热爱，共赴山海。</div>
            </div>
          </div>

          <!-- C. 尺子立牌组件 -->
          <div class="ruler-widget-container">
            <div class="ruler-track" ref="rulerTrackRef">
              <div class="badge-stand" :style="{ left: standLeft + 'px' }" @touchstart="onDragStart"
                @touchmove="onDragMove" @touchend="onDragEnd">

                <div class="stand-bubble" :class="{ show: isBubbleShow }">{{ bubbleText }}</div>

                <!-- 💡 关键修改：给头像框加了点击事件 -->
                <div class="badge-circle" @click.stop="triggerBadgeUpload">

                  <!-- 💡 关键修改：src 变成了 :src，绑定了变量 -->
                  <img :src="badgeImage" />

                  <!-- 💡 关键修改：塞进了一个隐藏的上传按钮 -->
                  <input type="file" ref="badgeFileInput" hidden accept="image/*" @change="handleBadgeChange" />
                </div>

                <div class="badge-base"></div>
              </div>
            </div>
          </div>

        </div> <!-- 👈 安卓大容器结束 -->

        <!-- 2. 这里是 iOS 模式的预留位 -->
        <div v-if="props.mode === 'ios'" class="ios-full-layout">
          <!-- 我们下一步要在这里加灰色毛玻璃小组件 -->
        </div>

      </div>


      <!-- 第3页 (App 库) -->
      <div class="page page-3">
        <div class="apps-grid">
          <!-- 1. 循环 appList 保持不变 -->
          <div v-for="app in appList" :key="app.id" class="app-item">

            <!-- 2. 修改盒子：删掉 :style 里的 backgroundColor，因为数据里已经没 color 了 -->
            <div class="app-icon-box">

              <!-- 3. 核心修改：插入图片标签，并绑定 :src -->
              <!-- 注意：必须写 :src 而不是 src -->
              <img :src="app.icon" class="app-icon-img" />

              <!-- 4. 如果是信息 App，显示红点数字 -->
              <div v-if="app.badge" class="app-badge">{{ app.badge }}</div>
            </div>

            <!-- 5. App 名称保持不变 -->
            <span class="app-label">{{ app.name }}</span>
          </div>
        </div>
      </div>
    </div>

    <!-- 3. Dock 栏 (修改位置在这里) -->
    <div class="dock-container">
      <div class="dock">
        <div class="dock-item" @click="$emit('open-talk')">
          <img src="https://raw.githubusercontent.com/1687216166Pat/xiaoshouj/main/a27d8264fv991e8df1dbeb536e03d280.png"
            class="dock-icon-img">
          <span class="dock-label">Talk</span>
        </div>
        <div class="dock-item" @click="$emit('open-settings')">
          <img src="https://raw.githubusercontent.com/1687216166Pat/xiaoshouj/main/f9d3f4da6rcb3778c460a508f774d0c0.png"
            class="dock-icon-img">
          <span class="dock-label">设置</span>
        </div>
        <div class="dock-item">
          <img src="https://raw.githubusercontent.com/1687216166Pat/xiaoshouj/main/bf7367681vd2aa91567d4c09c2f033ce.png"
            class="dock-icon-img">
          <span class="dock-label">电话</span>
        </div>
      </div>

    </div>

    <!-- 4. 小圆点 -->
    <div class="page-indicators">
      <div v-for="i in 3" :key="i" class="dot" :class="{ active: currentPage === i - 1 }"></div>
    </div>

  </div>
</template>

<script setup>
import { ref, reactive, onMounted, onUnmounted, defineEmits } from 'vue';

// 必须声明我们要向外发送的信号名字
// 接收来自 App.vue 的 mode
const props = defineProps(['mode', 'androidBg', 'iosBg']);
defineEmits(['open-settings', 'open-talk']);

// --- 1. 恋爱纪念日逻辑 ---
const anniversaryDays = ref(0);
const calculateAnniversary = () => {
  const startDate = new Date("2023-01-01"); // 👈 你可以在这里修改日期
  const today = new Date();
  const diffTime = Math.abs(today - startDate);
  anniversaryDays.value = Math.floor(diffTime / (1000 * 60 * 60 * 24));
};

// --- 2. 自动天气逻辑 ---
const weather = reactive({
  temp: '--',
  desc: '加载中',
  city: '定位中'
});

const updateWeather = async () => {
  weather.city = "定位中...";
  try {
    // 先获取 IP 定位
    const ipRes = await fetch('https://ipwho.is/');
    const ipData = await ipRes.json();
    weather.city = ipData.city || "未知城市";

    // 再根据经纬度获取天气
    const wRes = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${ipData.latitude}&longitude=${ipData.longitude}&current_weather=true`);
    const wData = await wRes.json();

    if (wData.current_weather) {
      weather.temp = Math.round(wData.current_weather.temperature);
      const code = wData.current_weather.weathercode;
      weather.desc = code <= 3 ? '晴朗' : '多云';
    }
  } catch {
    weather.city = "失败";
    weather.desc = "重试";
  }
};

// --- 3. 箴言 Banner 图片逻辑 ---
const mottoImage = ref(localStorage.getItem('motto_img') || 'https://cdn.jsdelivr.net/gh/1687216166Pat/photo@main/IMG_3615.jpeg'); // 默认图片
const fileInput = ref(null); // 引用 HTML 中的 input 标签

// 点击正方形图片框时，触发隐藏的上传按钮
const triggerUpload = () => {
  fileInput.value.click();
};

// 处理图片选择
const handleImageChange = (event) => {
  const file = event.target.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = (e) => {
      const base64Image = e.target.result;
      mottoImage.value = base64Image;
      localStorage.setItem('motto_img', base64Image); // 👈 将图片数据存入硬盘
    };
    reader.readAsDataURL(file); // 将图片转为可存储的字符串
  }
};

// --- 4. 尺子立牌逻辑 ---
const rulerTrackRef = ref(null); // 引用轨道容器
const standLeft = ref(10);       // 立牌距离左边的距离 (px)
const isBubbleShow = ref(false); // 是否显示气泡
const bubbleText = ref('');      // 气泡里的文字
let isDragging = false;          // 是否正在拖拽
let sweetSpot = Math.random() * 80 + 10; // 随机生成的“甜蜜点”百分比 (10%-90%)

// 触发气泡显示
const showBubble = () => {
  if (isBubbleShow.value) return;
  const quotes = ["我爱你", "今天过得好吗", "想你了", "抱抱", "一切都会好的", "你是最棒的"];
  bubbleText.value = quotes[Math.floor(Math.random() * quotes.length)];
  isBubbleShow.value = true;
  // 3秒后自动消失
  setTimeout(() => { isBubbleShow.value = false; }, 3000);
  // 刷新下一个甜蜜点
  sweetSpot = Math.random() * 80 + 10;
};

// 触摸开始
const onDragStart = () => { isDragging = true; };

// 触摸结束
const onDragEnd = () => { isDragging = false; };

// 核心：触摸移动计算
const onDragMove = (e) => {
  if (!isDragging) return;

  const touch = e.touches[0];
  const trackRect = rulerTrackRef.value.getBoundingClientRect();

  // 计算手指相对于轨道左边缘的位置，减去 30 (立牌宽度的一半) 让手指居中
  let newLeft = touch.clientX - trackRect.left - 30;

  // 边界控制：不准滑出轨道
  const maxLeft = trackRect.width - 60; // 60 是立牌宽度
  if (newLeft < 0) newLeft = 0;
  if (newLeft > maxLeft) newLeft = maxLeft;

  standLeft.value = newLeft;

  // 检查是否到达甜蜜点 (百分比计算)
  const currentPercent = (newLeft / maxLeft) * 100;
  if (Math.abs(currentPercent - sweetSpot) < 5) {
    showBubble();
  }
};

// --- 5. 尺子立牌头像逻辑 ---
// 优先从本地存储读取，没有则使用默认图
const badgeImage = ref(localStorage.getItem('badge_icon') || 'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&w=100&q=80');
const badgeFileInput = ref(null); // 引用新的上传控件

// 触发上传
const triggerBadgeUpload = () => {
  badgeFileInput.value.click();
};

// 处理头像上传
const handleBadgeChange = (event) => {
  const file = event.target.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = (e) => {
      const base64 = e.target.result;
      badgeImage.value = base64;
      localStorage.setItem('badge_icon', base64); // 存入记忆
    };
    reader.readAsDataURL(file);
  }
};

// --- 3. 启动初始化 ---
// 找到你原有的 onMounted，在里面加上这两行：
onMounted(() => {
  calculateAnniversary(); // 👈 新增
  updateWeather();        // 👈 新增
  // ... 你原有的时间更新逻辑 ...
});


const currentTime = ref('12:00');
const containerRef = ref(null);
const currentPage = ref(1);

const updateTime = () => {
  const now = new Date();
  const hours = String(now.getHours()).padStart(2, '0');
  const minutes = String(now.getMinutes()).padStart(2, '0');
  currentTime.value = hours + ":" + minutes;
};

let timer;
onMounted(() => {
  updateTime();
  timer = setInterval(updateTime, 1000);
  if (containerRef.value) {
    containerRef.value.scrollLeft = containerRef.value.clientWidth;
  }
});

onUnmounted(() => {
  clearInterval(timer);
});

const handleScroll = () => {
  if (containerRef.value) {
    currentPage.value = Math.round(containerRef.value.scrollLeft / containerRef.value.clientWidth);
  }
};

// 第三页保留的 App 
const appList = ref([
  { id: 'forum', name: '论坛', icon: 'https://raw.githubusercontent.com/1687216166Pat/xiaoshouj/main/8661cc78bmad154465534c811c4902ec.png' },
  { id: 'worldbook', name: '世界书', icon: 'https://raw.githubusercontent.com/1687216166Pat/xiaoshouj/main/07355bf0dkfec500cf76ca11ba833f47.png' },
  { id: 'diary', name: '日记', icon: "https://raw.githubusercontent.com/1687216166Pat/xiaoshouj/main/9258014d3n318cd2fbc760346c738a9d.png" },
  { id: 'search', name: '查手机', icon: 'https://raw.githubusercontent.com/1687216166Pat/xiaoshouj/main/6c527e82bqd2840cdce878437c9e3948.png' },
  { id: 'pomodoro', name: '番茄钟', icon: 'https://raw.githubusercontent.com/1687216166Pat/xiaoshouj/main/4782d731dk264d611f2133cff36d09e5.png' },
  { id: 'checkin', name: '打卡', icon: 'https://raw.githubusercontent.com/1687216166Pat/xiaoshouj/main/7d3f66a8bt67b89310eb968d852c95c3.png' },
  { id: 'anniversary', name: '纪念日', icon: 'https://raw.githubusercontent.com/1687216166Pat/xiaoshouj/main/349d11dceh2778a36596296a6cf0b47a.png' },
  { id: 'sms', name: '信息', icon: 'https://raw.githubusercontent.com/1687216166Pat/xiaoshouj/main/0919010c0ufaa60e76b9f8845cb7c6c3.png', badge: 1 },
  { id: '13', name: '日程'}
]);

</script>

<style scoped>
/* 样式内容保持不变，直接沿用你之前的即可 */

.iphone-screen {
  position: relative;
  width: 100%;
  height: 100%;
  flex: 1;
  background-color: transparent;
  /* 👈 必须透明，让背景图透出来 */
  background-size: cover;
  /* 👈 确保图片铺满 */
  background-position: center;
  /* 👈 确保图片居中 */
  background-repeat: no-repeat;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.status-bar {
  width: 100%;
  /* 💡 只有文字和图标需要避开刘海 */
  padding-top: env(safe-area-inset-top, 20px);
  padding-left: 20px;
  padding-right: 20px;
  box-sizing: border-box;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.sb-left,
.sb-right {
  display: flex;
  align-items: center;
  gap: 6px;
}

.sb-signal {
  display: flex;
  align-items: flex-end;
  gap: 2px;
  width: 18px;
  height: 12px;
}

.sb-signal .bar {
  width: 3px;
  background: rgba(0, 0, 0, 0.2);
  border-radius: 1px;
}

.sb-signal .bar.active {
  background: #333;
}

.sb-wifi {
  width: 18px;
  height: 18px;
  display: flex;
  align-items: center;
}

.sb-battery {
  width: 25px;
  height: 12px;
  border: 1.5px solid #333;
  border-radius: 3px;
  position: relative;
  padding: 1px;
  display: flex;
  align-items: center;
}

.sb-battery::after {
  content: '';
  position: absolute;
  right: -3.5px;
  top: 3px;
  width: 2px;
  height: 4px;
  background: #333;
  border-radius: 0 1px 1px 0;
}

.sb-bat-level {
  height: 100%;
  background: #333;
  border-radius: 1px;
}

.battery-heart {
  position: absolute;
  font-size: 8px;
  width: 100%;
  text-align: center;
  left: 0;
  top: 0;
  line-height: 12px;
}

.pages-container {
  flex: 1;
  /* 👈 它是弹簧，负责把 Dock 往下顶 */
  display: flex;
  width: 100%;
  overflow-x: auto;
  scroll-snap-type: x mandatory;
}

.pages-container::-webkit-scrollbar {
  display: none;
}

.page {
  flex: 0 0 100%;
  width: 100%;
  height: 100%;
  scroll-snap-align: center;
  box-sizing: border-box;
  padding-top: 20px;
}

.apps-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 25px 15px;
  padding: 20px;
}

.app-item {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.app-icon-box {
  width: 60px;
  height: 60px;
  border-radius: 14px;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-bottom: 6px;
}

.app-label {
  font-size: 11px;
  color: rgba(0, 0, 0, 0.7);
}

.dock-container {
  width: 100%;
  height: 100px;
  /* 👈 固定高度，确保图标不乱动 */
  display: flex;
  justify-content: center;
  align-items: center;
  flex-shrink: 0;
  /* 💡 关键：这里不再写 padding-bottom，让它直接贴着底边 */
  padding-bottom: 0;
  margin-bottom: 0;
}

.dock {
  width: 92%;
  height: 90px;
  background: rgba(255, 255, 255, 0.3);
  backdrop-filter: blur(25px);
  border-radius: 30px;
  display: flex;
  justify-content: space-around;
  align-items: center;
}

.dock-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  cursor: pointer;
}

.dock-icon {
  width: 55px;
  height: 55px;
  border-radius: 12px;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 28px;
}

.talk-bg {
  background-color: #4cd964;
}

.settings-bg {
  background-color: #8e8e93;
}

.phone-bg {
  background-color: #007aff;
}

/* 💡 [新增] 确保图标盒子是相对定位，作为红点的“底座” */
.app-icon-box {
  width: 60px;
  height: 60px;
  position: relative;
  /* 👈 这一行最关键，不能漏 */
}

/* 💡 [新增] 经典的 iOS 小红点样式 */
.app-badge {
  position: absolute;
  top: -5px;
  /* 向上偏移，压在边框上 */
  right: -5px;
  /* 向右偏移 */

  background-color: #FF3B30;
  /* 苹果官方红 */
  color: white;
  font-size: 12px;
  font-weight: bold;

  min-width: 20px;
  height: 20px;
  border-radius: 50%;
  /* 圆形 */

  display: flex;
  justify-content: center;
  align-items: center;

  border: 2px solid white;
  /* 增加一圈白边，更有质感 */
  box-sizing: border-box;
  z-index: 10;
}

.dock-label {
  font-size: 11px;
  color: rgba(0, 0, 0, 0.6);
  margin-top: 5px;
}

.page-indicators {
  position: absolute;
  bottom: 110px;
  left: 0;
  width: 100%;
  display: flex;
  justify-content: center;
  gap: 8px;
  pointer-events: none;
  z-index: 50;
}

.dot {
  width: 7px;
  height: 7px;
  border-radius: 50%;
  background: rgba(0, 0, 0, 0.1);
  transition: 0.3s;
}

.dot.active {
  background: rgba(0, 0, 0, 0.4);
}

.dock-icon-img {
  width: 55px;
  height: 55px;
  border-radius: 12px;
  object-fit: cover;
}


.android-widgets-container {
  display: flex;
  justify-content: center;
  padding: 20px;
  gap: 33px;
  padding: 20px;
  margin-top: 10px;
  /* 避开状态栏 */
  width: 100%;
  /* 确保容器占满宽度 */
  box-sizing: border-box;
}

.widget {
  width: 155px;
  height: 155px;
  background: rgba(255, 255, 255, 0.3);
  /* 奶油色背景下的半透明白色 */
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border-radius: 28px;
  padding: 18px;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  color: #333;
  border: 1px solid rgba(255, 255, 255, 0.4);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.05);
}

.widget-title {
  font-size: 14px;
  font-weight: 600;
  opacity: 0.7;
}

.days-count {
  font-size: 42px;
  font-weight: bold;
  line-height: 1;
}

.days-label {
  font-size: 11px;
  opacity: 0.5;
}

.temp {
  font-size: 48px;
  font-weight: 300;
  line-height: 1;
}

.desc {
  font-size: 14px;
  font-weight: 600;
  margin-top: 5px;
}

.city-name {
  font-size: 13px;
  opacity: 0.6;
}

.widget:active {
  transform: scale(0.95);
  transition: 0.1s;
}

.motto-banner {
  width: 345px;
  /* 宽度与上方两个小组件加间隙的总和接近 */
  height: 100px;
  background: rgba(255, 255, 255, 0.3);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border-radius: 25px;
  margin: 0 auto;
  /* 水平居中 */
  display: flex;
  align-items: center;
  padding: 12px;
  box-sizing: border-box;
  border: 1px solid rgba(255, 255, 255, 0.4);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.05);
}

/* 左侧正方形图片 */
.motto-image-box {
  width: 65px;
  height: 65px;
  border-radius: 18px;
  overflow: hidden;
  margin-right: 15px;
  cursor: pointer;
  background: #eee;
  flex-shrink: 0;
}

.motto-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

/* 右侧文字排版 */
.motto-text-box {
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.motto-title {
  font-size: 16px;
  font-weight: bold;
  color: #333;
  margin-bottom: 4px;
}

.motto-content {
  font-size: 13px;
  font-weight: normal;
  color: #666;
  opacity: 0.8;
}


.ruler-widget-container {
  width: 100%;
  height: 130px;
  /* 👈 把 flex: 1 改为固定高度，比如 140px */
  display: flex;
  align-items: flex-start;
  /* 让轨道在剩余空间里垂直居中 */
  padding-top: 70px;
  justify-content: center;
  padding: 20px;
  box-sizing: border-box;
  overflow: visible;
  /* 确保气泡弹出来时不会被遮挡 */
  margin-top: 130px;
}

.ruler-track {
  width: 100%;
  height: 40px;
  background: rgba(255, 255, 255, 0.25);
  border-radius: 12px;
  position: relative;
  /* 模拟刻度线 */
  background-image: repeating-linear-gradient(90deg, rgba(0, 0, 0, 0.2) 0px, rgba(0, 0, 0, 0.2) 1px, transparent 1px, transparent 15px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  backdrop-filter: blur(5px);
}

.badge-stand {
  position: absolute;
  bottom: 10px;
  /* 让立牌踩在轨道上 */
  width: 60px;
  height: 110px;
  display: flex;
  flex-direction: column;
  align-items: center;
  cursor: grab;
  touch-action: none;
  /* 必须加这一行，防止拖拽时整个页面跟着动 */
  z-index: 10;
}

.badge-stand:active {
  transform: scale(1.05);
}

.badge-circle {
  width: 60px;
  height: 60px;
  border-radius: 50%;
  background: white;
  border: 3px solid white;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
  overflow: hidden;
  cursor: pointer;
}

.badge-circle img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.badge-base {
  width: 25px;
  height: 45px;
  background: rgba(255, 255, 255, 0.9);
  border-radius: 4px;
  margin-top: -5px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
}

/* 气泡样式 */
.stand-bubble {
  position: absolute;
  top: -50px;
  background: white;
  padding: 8px 12px;
  border-radius: 12px;
  font-size: 12px;
  color: #333;
  white-space: nowrap;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
  opacity: 0;
  transform: scale(0);
  transition: 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
  pointer-events: none;
}

.stand-bubble.show {
  opacity: 1;
  transform: scale(1);
}

/* 气泡小箭头 */
.stand-bubble::after {
  content: '';
  position: absolute;
  bottom: -6px;
  left: 50%;
  margin-left: -6px;
  border-width: 6px 6px 0;
  border-style: solid;
  border-color: white transparent transparent transparent;
}

/* 第二页下方的 App 行 */
.home-apps-row {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 15px;
  padding: 0 25px 40px;
  /* 底部留出空间，防止贴着 Dock 栏 */
  width: 100%;
  box-sizing: border-box;
}

/* 稍微缩小第二页图标的大小，防止页面太拥挤 */
.home-apps-row .app-icon-box {
  width: 55px;
  height: 55px;
  border-radius: 12px;
}

.home-apps-row .app-label {
  color: #333;
  /* 奶油色背景用深色字 */
  font-size: 11px;
}

.android-full-layout {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  /* 确保内部组件从上往下排 */
}

/* 确保第三页图标图片撑满容器 */
.app-icon-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  /* 保证图片不拉伸 */
  border-radius: 14px;
  /* 保持 iOS 的圆角 */
  display: block;
}

/* 确保图标盒子大小固定 */
.app-icon-box {
  width: 60px;
  height: 60px;
  position: relative;
  background-color: transparent;
  /* 去掉背景色，让图片自己显示 */
}

/* App 库文字颜色 */
.app-label {
  font-size: 11px;
  color: #333;
  /* 奶油色背景用深色字，如果你是深色壁纸就改为 #fff */
  margin-top: 6px;
  text-align: center;
}

/* 数字线性图标样式 */
.app-icon-linear {
  width: 56px;
  height: 56px;
  /* 核心：1像素细边框，不要背景色 */
  border: 1px solid #333; 
  background: transparent;
  
  display: flex;
  align-items: center;
  justify-content: center;
  
  font-size: 18px;
  font-weight: 300;
  color: #ffffff;
  /* 极小圆角（2px）或者直角，比大圆角更显高级 */
  border-radius: 2px; 
  transition: all 0.3s ease;
}

/* 悬停或点击时的微光效果 */
.app-icon-linear:active {
  background: rgba(255, 255, 255, 0.1);
  border-color: #666;
}

/* 确保 App 名字也符合极简风格 */
.app-name {
  margin-top: 8px;
  font-size: 11px;
  color: #666;
  letter-spacing: 2px;
  text-align: center;
}

</style>
