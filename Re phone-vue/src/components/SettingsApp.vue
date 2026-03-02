<template>
  <div class="app-screen">
    <!-- 1. 顶部导航栏 -->
<div class="nav-bar">
  <!-- 1. 将 @click 改为 handleBack -->
  <!-- 2. 将文字部分改为动态判断 -->
  <div class="back-btn" @click="handleBack">
    ‹ {{ currentView === 'main' ? '主屏幕' : '设置' }}
  </div>
  
  <!-- 💡 顺便建议你也把标题改为动态，这样更像真手机 -->
  <div class="header-title" style="font-weight: 600; font-size: 17px; position: absolute; left: 50%; transform: translateX(-50%);">
    {{ currentView === 'main' ? '设置' : '显示与亮度' }}
  </div>
</div>

    <div class="scroll-wrapper">
      <div v-if="currentView === 'main'">
      <!-- 2. 大标题 -->
      <h1 class="main-title">设置</h1>

      <!-- 3. 搜索栏 -->
      <div class="search-container">
        <div class="search-bar">
          <span class="search-icon">🔍</span>
          <span class="search-placeholder">搜索</span>
        </div>
      </div>

      <!-- 4. 个人信息卡片 -->
      <div class="profile-card">
        <div class="info-top">
          <div class="avatar">
            <img src="https://i.pravatar.cc/150?u=me" alt="avatar">
          </div>
          <div class="user-text">
            <div class="user-name">User</div>
            <div class="user-sub">Apple ID、iCloud、媒体与购买</div>
          </div>
          <div class="arrow">〉</div>
        </div>
        <div class="info-bottom">
          <div class="bottom-item">
            <span class="bottom-label">User账户建议</span>
            <span class="arrow">〉</span>
          </div>
        </div>
      </div>

      <!-- 5. 软件更新组 (新增) -->
      <div class="ios-list-group spacing">
        <div class="ios-list-item">
          <div class="item-left">
            <span class="item-label">有软件更新可用</span>
          </div>
          <div class="item-right">
            <div class="badge-dot">1</div>
            <span class="arrow">〉</span>
          </div>
        </div>
      </div>

      <!-- 6. 网络设置组 (新增 - 多行) -->
      <div class="ios-list-group spacing">
        <!-- 飞行模式 -->
        <div class="ios-list-item has-divider">
          <div class="item-left">
            <span class="item-icon bg-orange">✈️</span>
            <span class="item-label">飞行模式</span>
          </div>
          <div class="item-right">
            <!-- 以后可以加个开关组件 -->
            <div class="ios-switch-placeholder"></div>
          </div>
        </div>
        <!-- 无线局域网 -->
        <div class="ios-list-item has-divider">
          <div class="item-left">
            <span class="item-icon bg-blue">📶</span>
            <span class="item-label">无线局域网</span>
          </div>
          <div class="item-right">
            <span class="item-value">未连接</span>
            <span class="arrow">〉</span>
          </div>
        </div>
        <!-- 蓝牙 -->
        <div class="ios-list-item has-divider">
          <div class="item-left">
            <span class="item-icon bg-blue-dark">🦷</span>
            <span class="item-label">蓝牙</span>
          </div>
          <div class="item-right">
            <span class="item-value">开启</span>
            <span class="arrow">〉</span>
          </div>
        </div>
        <!-- 蜂窝网络 -->
        <div class="ios-list-item has-divider">
          <div class="item-left">
            <span class="item-icon bg-green">📶</span>
            <span class="item-label">蜂窝网络</span>
          </div>
          <div class="item-right">
            <span class="arrow">〉</span>
          </div>
        </div>
        <!-- 个人热点 -->
        <div class="ios-list-item has-divider">
          <div class="item-left">
            <span class="item-icon bg-green">🔗</span>
            <span class="item-label">个人热点</span>
          </div>
          <div class="item-right">
            <span class="arrow">〉</span>
          </div>
        </div>

        <!-- api预设 -->
          <div class="ios-list-item" @click="currentView = 'apiSettings'">
    <div class="item-left">
      <span class="item-icon bg-purple">🤖</span>
      <span class="item-label">API预设</span>
    </div>
    <div class="item-right">
      <span class="arrow">〉</span>
    </div>
  </div>

      </div>
            
      <!-- 8. 系统核心设置组 (新增) -->
      <div class="ios-list-group spacing">
        <div class="ios-list-item has-divider">
          <div class="item-left"><span class="item-icon bg-grey">⚙️</span><span class="item-label">通用</span></div>
          <div class="item-right"><span class="arrow">〉</span></div>
        </div>
        <div class="ios-list-item has-divider">
          <div class="item-left"><span class="item-icon bg-blue">♿</span><span class="item-label">辅助功能</span></div>
          <div class="item-right"><span class="arrow">〉</span></div>
        </div>
        <div class="ios-list-item has-divider">
          <div class="item-left"><span class="item-icon bg-red">⏰</span><span class="item-label">待机显示</span></div>
          <div class="item-right"><span class="arrow">〉</span></div>
        </div>
        <div class="ios-list-item has-divider">
          <div class="item-left"><span class="item-icon bg-grey">🎛️</span><span class="item-label">控制中心</span></div>
          <div class="item-right"><span class="arrow">〉</span></div>
        </div>
        <div class="ios-list-item has-divider" @click="currentView = 'wallpaper'"> <!-- 👈 必须有这个 @click -->
  <div class="item-left">
    <span class="item-icon bg-cyan">🖼️</span>
    <span class="item-label">壁纸</span>
  </div>
  <div class="item-right">
    <span class="arrow">〉</span>
  </div>
</div>
        <div class="ios-list-item has-divider">
          <div class="item-left"><span class="item-icon bg-grey">🔍</span><span class="item-label">搜索</span></div>
          <div class="item-right"><span class="arrow">〉</span></div>
        </div>
        <div class="ios-list-item has-divider" @click="currentView = 'display'">
          <div class="item-left"><span class="item-icon bg-blue-light">☀️</span><span class="item-label">显示与亮度</span></div>
          <div class="item-right"><span class="arrow">〉</span></div>
        </div>
        <div class="ios-list-item has-divider">
          <div class="item-left"><span class="item-icon bg-grey">📷</span><span class="item-label">相机</span></div>
          <div class="item-right"><span class="arrow">〉</span></div>
        </div>
        <div class="ios-list-item has-divider">
          <div class="item-left"><span class="item-icon bg-blue-dark">📱</span><span class="item-label">主屏幕与app资源库</span></div>
          <div class="item-right"><span class="arrow">〉</span></div>
        </div>
        <div class="ios-list-item">
          <div class="item-left"><span class="item-icon bg-pink">👤</span><span class="item-label">Even</span></div>
          <div class="item-right"><span class="arrow">〉</span></div>
        </div>
      </div>

            <!-- 9. 交互设置组 (新增) -->
      <div class="ios-list-group spacing" @click="currentView = 'notification'">
        <div class="ios-list-item has-divider">
          <div class="item-left"><span class="item-icon bg-red">🔔</span><span class="item-label">通知</span></div>
          <div class="item-right"><span class="arrow">〉</span></div>
        </div>
        <div class="ios-list-item has-divider">
          <div class="item-left"><span class="item-icon bg-pink">🔊</span><span class="item-label">声效与触感反馈</span></div>
          <div class="item-right"><span class="arrow">〉</span></div>
        </div>
        <div class="ios-list-item has-divider">
          <div class="item-left"><span class="item-icon bg-purple-dark">🌙</span><span class="item-label">专注模式</span></div>
          <div class="item-right"><span class="arrow">〉</span></div>
        </div>
        <div class="ios-list-item">
          <div class="item-left"><span class="item-icon bg-purple">⌛</span><span class="item-label">屏幕使用时间</span></div>
          <div class="item-right"><span class="arrow">〉</span></div>
        </div>
      </div>

      <!-- 10. 安全与隐私组 (新增) -->
      <div class="ios-list-group spacing">
        <div class="ios-list-item has-divider">
          <div class="item-left"><span class="item-icon bg-green">👤</span><span class="item-label">面容ID与密码</span></div>
          <div class="item-right"><span class="arrow">〉</span></div>
        </div>
        <div class="ios-list-item has-divider">
          <div class="item-left"><span class="item-icon bg-red">🆘</span><span class="item-label">SOS紧急联络</span></div>
          <div class="item-right"><span class="arrow">〉</span></div>
        </div>
        <div class="ios-list-item">
          <div class="item-left"><span class="item-icon bg-blue">✋</span><span class="item-label">隐私与安全性</span></div>
          <div class="item-right"><span class="arrow">〉</span></div>
        </div>
      </div>

      <!-- 11. 账户与资产组 (新增) -->
      <div class="ios-list-group spacing">
        <div class="ios-list-item has-divider">
          <div class="item-left"><span class="item-icon bg-black">👛</span><span class="item-label">钱包与Apple Pay</span></div>
          <div class="item-right"><span class="arrow">〉</span></div>
        </div>
        <div class="ios-list-item has-divider">
          <div class="item-left"><span class="item-icon bg-white-border">🎯</span><span class="item-label">Game Center</span></div>
          <div class="item-right"><span class="arrow">〉</span></div>
        </div>
        <div class="ios-list-item">
          <div class="item-left"><span class="item-icon bg-blue-light">☁️</span><span class="item-label">iCloud</span></div>
          <div class="item-right"><span class="arrow">〉</span></div>
        </div>
      </div>

      <!-- 12. 应用管理组 (新增) -->
      <div class="ios-list-group spacing">
        <div class="ios-list-item">
          <div class="item-left"><span class="item-icon bg-grey-light">📱</span><span class="item-label">App</span></div>
          <div class="item-right"><span class="arrow">〉</span></div>
        </div>
      </div>
    </div>
    <div v-else-if="currentView === 'display'">
   <!-- 原有的外观模式 (小机器人/小苹果) 标题改一下，防止重复 -->
  <div class="section-title" style="padding: 20px 16px 8px; font-size: 13px; color: #8E8E93; text-transform: uppercase;">外观模式</div>
  <div class="ios-list-group spacing">
    <div class="ios-list-item has-divider" @click="changeMode('android')">
      <div class="item-left"><span class="item-icon bg-green">🤖</span><span class="item-label">小机器人 - 安卓</span></div>
      <div class="item-right"><span v-if="mode === 'android'" style="color:#007AFF; font-weight:bold;">✓</span></div>
    </div>
    <div class="ios-list-item" @click="changeMode('ios')">
      <div class="item-left"><span class="item-icon bg-grey">🍎</span><span class="item-label">小苹果 - 苹果</span></div>
      <div class="item-right"><span v-if="mode === 'ios'" style="color:#007AFF; font-weight:bold;">✓</span></div>
    </div>
  </div>
</div>

<!-- API 设置子页面 -->
<div v-else-if="currentView === 'apiSettings'" class="api-minimal-page">
  
  <!-- 导航栏 -->
  <div class="minimal-nav">
    <div class="nav-back" @click="currentView = 'main'">←</div>
    <div class="nav-title">API 预设</div>
    <div class="nav-spacer"></div>
  </div>

  <!-- 可滚动内容区 -->
  <div class="minimal-scroll">
    
    <!-- 1. 基本设置分组 -->
    <div class="minimal-group">
      <!-- API 地址 -->
      <div class="minimal-item">
        <svg class="item-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"></path>
          <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"></path>
        </svg>
        <div class="item-content">
          <div class="item-label">API 地址</div>
          <input 
            type="text" 
            v-model="apiEndpoint"
            class="underline-input"
            placeholder="https://api.openai.com/v1"
          >
        </div>
      </div>

      <!-- API 密钥 -->
      <div class="minimal-item">
        <svg class="item-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M21 2l-2 2m-7.61 7.61a5.5 5.5 0 1 1-7.778 7.778 5.5 5.5 0 0 1 7.777-7.777zm0 0L15.5 7.5m0 0l3 3L22 7l-3-3m-3.5 3.5L19 4"></path>
        </svg>
        <div class="item-content">
          <div class="item-label">API 密钥</div>
          <input 
            type="password" 
            v-model="apiKey"
            class="underline-input"
            placeholder="sk-xxxxxxxxxxxxxxxx"
          >
        </div>
      </div>
    </div>

    <!-- 2. 模型参数分组 -->
    <div class="minimal-group">
<!-- 模型 -->
<div class="minimal-item clickable" @click="openModelSelector">
  <svg class="item-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
    <rect x="3" y="3" width="7" height="7"></rect>
    <rect x="14" y="3" width="7" height="7"></rect>
    <rect x="14" y="14" width="7" height="7"></rect>
    <rect x="3" y="14" width="7" height="7"></rect>
  </svg>
  <div class="item-content">
    <div class="item-label">模型</div>
  </div>
  <div class="item-value">{{ defaultModel || 'gpt-4-turbo' }}</div>
  <div class="item-arrow">〉</div>
</div>

      <!-- 温度 -->
      <div class="minimal-item">
        <svg class="item-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <circle cx="12" cy="12" r="5"></circle>
          <line x1="12" y1="1" x2="12" y2="3"></line>
          <line x1="12" y1="21" x2="12" y2="23"></line>
          <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line>
          <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line>
          <line x1="1" y1="12" x2="3" y2="12"></line>
          <line x1="21" y1="12" x2="23" y2="12"></line>
          <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line>
          <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>
        </svg>
        <div class="item-content">
          <div class="item-label">温度</div>
        </div>
        <div class="temp-pill">0.7</div>
      </div>

      <!-- 令牌管理 -->
      <div class="minimal-item clickable">
        <svg class="item-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <line x1="4" y1="9" x2="20" y2="9"></line>
          <line x1="4" y1="15" x2="20" y2="15"></line>
          <line x1="10" y1="3" x2="8" y2="21"></line>
          <line x1="16" y1="3" x2="14" y2="21"></line>
        </svg>
        <div class="item-content">
          <div class="item-label">令牌管理</div>
        </div>
        <div class="item-arrow">〉</div>
      </div>

      <!-- 模型测试 -->
      <div class="minimal-item">
        <svg class="item-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <polygon points="5 3 19 12 5 21 5 3"></polygon>
        </svg>
        <div class="item-content">
          <div class="item-label">模型测试</div>
        </div>
        <div class="item-value">运行</div>
      </div>

      <!-- 保存预设 -->
      <div class="minimal-item clickable" @click="saveApiSettings">
        <svg class="item-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M3 15v4c0 1.1.9 2 2 2h14a2 2 0 0 0 2-2v-4M17 9l-5 5-5-5M12 12.8V2.5"></path>
        </svg>
        <div class="item-content">
          <div class="item-label">保存预设</div>
        </div>
      </div>
    </div>

    <!-- 3. 高级选项分组 -->
    <div class="minimal-group">
      <!-- 流式输出 -->
      <div class="minimal-item">
        <svg class="item-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path>
        </svg>
        <div class="item-content">
          <div class="item-label">流式输出</div>
        </div>
        <div class="toggle-switch off">
          <div class="toggle-slider"></div>
        </div>
      </div>

      <!-- 增强时间感知 -->
      <div class="minimal-item">
        <svg class="item-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <circle cx="12" cy="12" r="10"></circle>
          <polyline points="12 6 12 12 16 14"></polyline>
        </svg>
        <div class="item-content">
          <div class="item-label">增强时间感知</div>
        </div>
        <div class="toggle-switch on">
          <div class="toggle-slider"></div>
        </div>
      </div>
    </div>

  </div>
    <!-- 模型选择弹窗 -->
  <div v-if="isModelSelectorOpen" class="model-selector-overlay" @click.self="isModelSelectorOpen = false">
    <div class="model-selector-card">
      <!-- 标题栏 -->
      <div class="model-selector-header">
        <div class="model-header-title">选择模型</div>
        <button class="model-close-btn" @click="isModelSelectorOpen = false">✕</button>
      </div>

      <!-- 加载状态 -->
      <div v-if="isLoadingModels" class="model-loading">
        <div class="loading-spinner"></div>
        <div>正在获取模型列表...</div>
      </div>

      <!-- 错误提示 -->
      <div v-else-if="modelLoadError" class="model-error">
        <div>{{ modelLoadError }}</div>
        <button class="retry-btn" @click="fetchModels">重试</button>
      </div>

      <!-- 模型列表 -->
      <div v-else class="model-list">
        <div 
          v-for="model in availableModels" 
          :key="model.id"
          class="model-item"
          :class="{ selected: defaultModel === model.id }"
          @click="selectModel(model.id)"
        >
          <div class="model-name">{{ model.id }}</div>
          <div v-if="defaultModel === model.id" class="model-check">✓</div>
        </div>
      </div>
    </div>
  </div>
</div>
<!-- 通知设置子页面 -->
<div v-else-if="currentView === 'notification'" class="notification-page">
  
  <!-- 导航栏 -->
  <div class="notification-nav">
    <div class="nav-back" @click="currentView = 'main'">←</div>
    <div class="nav-title">通知</div>
    <div class="nav-spacer"></div>
  </div>

  <!-- 可滚动内容区 -->
  <div class="notification-scroll">
    
    <!-- 消息通知分组 -->
    <div class="notification-group">
      
      <!-- 1. 后台收到通知 -->
      <div class="notification-item">
        <svg class="item-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path>
          <path d="M13.73 21a2 2 0 0 1-3.46 0"></path>
        </svg>
        <div class="item-content">
          <div class="item-label">后台收到通知</div>
        </div>
        <div class="notification-switch" :class="{ on: backgroundNotificationEnabled }" @click="toggleBackgroundNotification">
          <div class="switch-slider"></div>
        </div>
      </div>

      <!-- 2. 角色主动发消息 -->
      <div class="notification-item">
        <svg class="item-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
        </svg>
        <div class="item-content">
          <div class="item-label">角色主动发消息</div>
        </div>
        <div class="notification-switch" :class="{ on: activeMessageEnabled }" @click="toggleActiveMessage">
          <div class="switch-slider"></div>
        </div>
      </div>
      <!-- 👇 新增：消息发送时间设置行 -->
<div class="notification-item time-setting-row">
  <!-- 左侧占位（保持对齐） -->
  <div class="icon-placeholder"></div>
  
  <!-- 内容区：数字输入 + 单位选择 -->
  <div class="time-setting-content">
    <!-- 左侧：数字输入框 -->
    <div class="time-input-wrapper">
      <input 
        type="number" 
        v-model="messageInterval"
        class="time-input"
        placeholder="15"
        min="1"
      >
    </div>
    
    <!-- 右侧：单位滚轮选择器 -->
    <div class="time-unit-picker" ref="unitPicker" @scroll="handleUnitScroll">
      <div class="unit-option" :class="{ selected: selectedUnit === 'second' }" @click="selectUnit('second')">秒</div>
      <div class="unit-option" :class="{ selected: selectedUnit === 'minute' }" @click="selectUnit('minute')">分</div>
      <div class="unit-option" :class="{ selected: selectedUnit === 'hour' }" @click="selectUnit('hour')">时</div>
      <div class="unit-option" :class="{ selected: selectedUnit === 'day' }" @click="selectUnit('day')">天</div>
    </div>
  </div>
</div>

      <!-- 3. 角色定时问候 -->
      <div class="notification-item clickable" @click="currentView = 'greetingSchedule'">
        <svg class="item-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <circle cx="12" cy="12" r="10"></circle>
          <polyline points="12 6 12 12 16 14"></polyline>
        </svg>
        <div class="item-content">
          <div class="item-label">角色定时问候</div>
        </div>
        <div class="item-arrow">〉</div>
      </div>

      <!-- 4. 测试消息 -->
      <div class="notification-item clickable" @click="testNotification">
        <svg class="item-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <polygon points="5 3 19 12 5 21 5 3"></polygon>
        </svg>
        <div class="item-content">
          <div class="item-label">测试消息</div>
        </div>
      </div>

    </div>

  </div>
</div>




<div v-else-if="currentView === 'wallpaper'">
  <div class="section-title">当前壁纸预览</div>
  
  <div class="ios-list-group spacing" style="padding: 20px; display: flex; flex-direction: column; align-items: center;">
    <!-- 1. 显示当前模式下的壁纸预览 -->
    <img 
      :src="mode === 'android' ? androidBg : iosBg" 
      style="width: 140px; height: 240px; border-radius: 12px; object-fit: cover; border: 1px solid #ddd; margin-bottom: 20px;"
    >

    <!-- 2. URL 输入框 -->
    <div style="width: 100%; margin-bottom: 15px;">
      <div style="font-size: 13px; color: #8E8E93; margin-bottom: 5px;">图片 URL</div>
      <input 
        type="text" 
        placeholder="粘贴图片链接" 
        style="width: 100%; padding: 10px; border-radius: 8px; border: 1px solid #ddd; box-sizing: border-box;"
        @change="(e) => $emit('update-wallpaper', mode, e.target.value)"
      >
    </div>

    <!-- 3. 上传按钮 -->
    <button 
      @click="triggerFile" 
      style="width: 100%; padding: 12px; background: #007AFF; color: white; border: none; border-radius: 10px; font-weight: 600;"
    >
      从相册选择图片
    </button>
    
    <!-- 隐藏的上传控件 -->
    <input type="file" ref="fileBtn" hidden accept="image/*" @change="handleFileUpload">
  </div>

  <div class="section-title">APP 图标</div>
  <div class="ios-list-group" style="padding: 20px; text-align: center; color: #8E8E93;">
    图标自定义功能正在开发中...
  </div>
</div>

    </div>
  </div>
</template>

<script setup>
import { ref, defineEmits, defineProps, watch } from 'vue';

// 💡 【第一步：全家桶声明】 
// 把所有要接收的数据和要发出的信号一次性写完，不要分两次写
const props = defineProps(['mode', 'androidBg', 'iosBg']);
const emit = defineEmits(['close', 'update-mode', 'update-wallpaper']);

// 💡 【第二步：核心变量】
const currentView = ref('main'); // 控制页面切换
const fileBtn = ref(null);       // 引用上传按钮

// 💡 【第三步：功能函数】

// 1. 返回逻辑：判断回主页还是关 App
const handleBack = () => {
  if (currentView.value === 'main') {
    emit('close'); 
  } else {
    currentView.value = 'main'; 
  }
};

// 2. 切换系统风格 (安卓/苹果)
const changeMode = (newMode) => {
  emit('update-mode', newMode); 
};

// 3. 触发文件选择框
const triggerFile = () => {
  if (fileBtn.value) fileBtn.value.click();
};

// 4. 处理图片上传逻辑
const handleFileUpload = (e) => {
  const file = e.target.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = (event) => {
      // 发送 update-wallpaper 信号，并传回图片数据
      emit('update-wallpaper', props.mode, event.target.result);
    };
    reader.readAsDataURL(file);
  }
};
// 👇 新增：API Key 管理
const apiKey = ref(localStorage.getItem('ai_api_key') || '');
const apiEndpoint = ref(localStorage.getItem('ai_endpoint') || 'https://api.openai.com/v1/chat/completions');

const updateApiKey = (newKey) => {
  apiKey.value = newKey;
  localStorage.setItem('ai_api_key', newKey);
};

const updateApiEndpoint = (newEndpoint) => {
  apiEndpoint.value = newEndpoint;
  localStorage.setItem('ai_endpoint', newEndpoint);
};
// 在 SettingsApp.vue 的 <script setup> 里

// 👇 新增：API 预设相关变量
const presetName = ref(localStorage.getItem('ai_preset_name') || '开发环境');
const defaultModel = ref(localStorage.getItem('ai_default_model') || 'gpt-4-turbo');

// 保存设置
const saveApiSettings = () => {
  // 保存所有配置
  localStorage.setItem('ai_preset_name', presetName.value);
  localStorage.setItem('ai_endpoint', apiEndpoint.value);
  localStorage.setItem('ai_api_key', apiKey.value);
  localStorage.setItem('ai_default_model', defaultModel.value);
  
  // 可以加个提示
  alert('保存成功！');
  
  currentView.value = 'main';
};


// 拉取模型列表（暂时模拟）
const pullModels = () => {
  alert('拉取模型列表功能开发中...');
};

// 👇 新增：模型选择器相关变量
const isModelSelectorOpen = ref(false);
const availableModels = ref([]);
const isLoadingModels = ref(false);
const modelLoadError = ref('');

// 打开模型选择器
const openModelSelector = async () => {
  isModelSelectorOpen.value = true;
  await fetchModels();
};

// 从 API 获取模型列表
const fetchModels = async () => {
  isLoadingModels.value = true;
  modelLoadError.value = '';

  // 👇 改动在这里：直接用 ref 变量，不要从 localStorage 读
  const endpoint = apiEndpoint.value;
  const key = apiKey.value;

  if (!endpoint || !key) {
    modelLoadError.value = '请先配置 API 地址和密钥';
    isLoadingModels.value = false;
    return;
  }

  try {
    // 👇 这里也改了：用 endpoint 变量
// 智能构造模型列表 URL
let modelsUrl;
if (endpoint.includes('/chat/completions')) {
  // 如果地址包含 /chat/completions，就替换成 /models
  modelsUrl = endpoint.replace('/chat/completions', '/models');
} else if (endpoint.endsWith('/v1')) {
  // 如果地址以 /v1 结尾，就加上 /models
  modelsUrl = endpoint + '/models';
} else if (endpoint.endsWith('/')) {
  // 如果地址以 / 结尾，就加上 v1/models
  modelsUrl = endpoint + 'v1/models';
} else {
  // 否则就加上 /v1/models
  modelsUrl = endpoint + '/v1/models';
}

console.log('尝试访问模型列表:', modelsUrl); // 调试用，可以看到最终的 URL
 
    const response = await fetch(modelsUrl, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${key}` // 👈 这里也改了：用 key 变量
      }
    });

    if (!response.ok) {
      throw new Error(`获取失败: ${response.status}`);
    }

    const data = await response.json();
    
    // OpenAI 格式返回的是 { data: [{id: "gpt-4", ...}, ...] }
    availableModels.value = data.data || [];

    if (availableModels.value.length === 0) {
      modelLoadError.value = '未找到可用模型';
    }

  } catch (error) {
    console.error('获取模型列表失败:', error);
    modelLoadError.value = '获取模型列表失败，请检查 API 配置';
  } finally {
    isLoadingModels.value = false;
  }
};


// 选择模型
const selectModel = (modelId) => {
  defaultModel.value = modelId;
  localStorage.setItem('ai_default_model', modelId);
  isModelSelectorOpen.value = false;
};

// ==================== 通知设置相关 ====================

// 通知开关状态
const backgroundNotificationEnabled = ref(localStorage.getItem('background_notification') !== 'false');
const activeMessageEnabled = ref(localStorage.getItem('active_message') !== 'false');

// 👇 新增：消息发送时间设置
const messageInterval = ref(localStorage.getItem('message_interval') || '15');
const selectedUnit = ref(localStorage.getItem('message_unit') || 'minute');
const unitPicker = ref(null);

// 切换后台通知
const toggleBackgroundNotification = () => {
  backgroundNotificationEnabled.value = !backgroundNotificationEnabled.value;
  const newValue = backgroundNotificationEnabled.value ? 'true' : 'false';
  localStorage.setItem('background_notification', newValue);
  console.log('后台通知已切换为:', newValue);
};

// 切换主动发消息
const toggleActiveMessage = () => {
  activeMessageEnabled.value = !activeMessageEnabled.value;
  const newValue = activeMessageEnabled.value ? 'true' : 'false';
  localStorage.setItem('active_message', newValue);
  console.log('主动发消息已切换为:', newValue);
};


// 👇 新增：选择时间单位
const selectUnit = (unit) => {
  selectedUnit.value = unit;
  localStorage.setItem('message_unit', unit);
};

// 👇 新增：处理滚轮滚动（可选，用于更精细的交互）
const handleUnitScroll = () => {
  // 可以在这里添加滚动到中心自动选中的逻辑
};

// 👇 新增：监听输入框变化，保存到 localStorage
watch(messageInterval, (newVal) => {
  localStorage.setItem('message_interval', newVal);
});

// 测试消息
const testNotification = () => {
  if ('Notification' in window) {
    if (Notification.permission === 'granted') {
      new Notification('测试通知', {
        body: '这是一条测试消息，如果你看到了，说明通知功能正常！',
        icon: '/logo.png'
      });
    } else if (Notification.permission === 'default') {
      Notification.requestPermission().then(permission => {
        if (permission === 'granted') {
          new Notification('测试通知', {
            body: '这是一条测试消息，如果你看到了，说明通知功能正常！',
            icon: '/logo.png'
          });
        }
      });
    } else {
      alert('通知权限已被拒绝，请在浏览器设置中允许通知');
    }
  } else {
    alert('你的浏览器不支持通知功能');
  }
};

</script>

<style scoped>
/* --- 基础样式保持不变 --- */
.app-screen { position: fixed; top: 0; left: 0; width: 100vw; height: 100vh; background-color: #F2F2F7; z-index: 2000; display: flex; flex-direction: column; }
.scroll-wrapper { flex: 1;min-height: 0; overflow-y: auto;-webkit-overflow-scrolling: touch; padding: 0 16px 40px; }
.nav-bar {
  padding-top: env(safe-area-inset-top, 0); /* 没刘海就是 0 */
  height: 44px;
  display: flex;
  align-items: center;
  padding-left: 10px;
  background-color: #F2F2F7;
  flex-shrink: 0;
  position: relative;
  box-sizing: content-box;
}

.back-btn { color: #007AFF; font-size: 17px; cursor: pointer; }
.main-title { font-size: 34px; font-weight: 700; margin: 10px 0 15px; color: #000; }
.search-container { margin-bottom: 20px; }
.search-bar { background-color: #E3E3E8; height: 36px; border-radius: 10px; display: flex; align-items: center; padding: 0 10px; color: #8E8E93; }
.search-icon { margin-right: 6px; font-size: 14px; }
.search-placeholder { font-size: 17px; }

/* --- 卡片与列表通用样式 --- */
.ios-list-group { background: #FFF; border-radius: 12px; overflow: hidden; }
.spacing { margin-bottom: 30px; } /* 👈 控制你要求的“空格” */

.ios-list-item {
  padding: 12px 16px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  min-height: 44px;
}

/* 分割线逻辑 */
.has-divider {
  position: relative;
}
.has-divider::after {
  content: '';
  position: absolute;
  bottom: 0;
  right: 0;
  width: calc(100% - 56px); /* 避开左侧图标的宽度 */
  height: 0.5px;
  background-color: #C6C6C8;
}

/* 图标背景色 */
.item-icon {
  width: 28px; height: 28px;
  border-radius: 6px;
  display: flex; align-items: center; justify-content: center;
  font-size: 18px; color: #fff;
}
.bg-orange { background-color: #FF9500; }
.bg-blue { background-color: #007AFF; }
.bg-blue-dark { background-color: #5856D6; }
.bg-green { background-color: #34C759; }
.bg-purple { background-color: #AF52DE; }
.bg-grey { background-color: #8E8E93; }
.bg-red { background-color: #FF3B30; }
.bg-cyan { background-color: #55BEF9; }
.bg-blue-light { background-color: #32ADE6; }
.bg-pink { background-color: #FF2D55; }
.bg-purple-dark { background-color: #5856D6; }
.bg-black { background-color: #000000; }
.bg-white-border { background-color: #FFFFFF; border: 0.5px solid #C6C6C8; }
.bg-grey-light { background-color: #A2A2A7; }

/* 其他细节 */
.profile-card { background: #FFFFFF; border-radius: 12px; display: flex; flex-direction: column; overflow: hidden; margin-bottom: 30px; }
.info-top { flex: 2; padding: 16px; display: flex; align-items: center; border-bottom: 0.5px solid #C6C6C8; }
.avatar { width: 60px; height: 60px; border-radius: 50%; overflow: hidden; margin-right: 15px; background: #eee; }
.avatar img { width: 100%; height: 100%; object-fit: cover; }
.user-text { flex: 1; }
.user-name { font-size: 20px; font-weight: 400; color: #000; }
.user-sub { font-size: 13px; color: #8E8E93; margin-top: 2px; }
.info-bottom { flex: 1; padding: 12px 16px; background: #FFF; }
.bottom-item, .item-left, .item-right { display: flex; align-items: center; }
.item-left { gap: 12px; }
.item-label { font-size: 17px; color: #000; }
.item-value { font-size: 17px; color: #8E8E93; margin-right: 8px; }
.arrow { color: #C4C4C6; font-size: 14px; }

/* 软件更新的红点数字 */
.badge-dot {
  background-color: #FF3B30;
  color: #fff;
  font-size: 13px;
  width: 20px; height: 20px;
  border-radius: 50%;
  display: flex; align-items: center; justify-content: center;
  margin-right: 8px;
}
/* API 极简页面 */
.api-minimal-page {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  height: 100dvh; /* 移动端适配 */
  background: #fff;
  z-index: 2000;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

/* 导航栏 */
.minimal-nav {
  padding-top: env(safe-area-inset-top, 0); /* 没刘海就是 0 */
  height: 44px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding-left: 16px;
  padding-right: 16px;
  border-bottom: 1px solid #eee;
  flex-shrink: 0;
  box-sizing: content-box;
}

.nav-back {
  font-size: 20px;
  color: #333;
  cursor: pointer;
  width: 40px;
}

.nav-title {
  font-size: 17px;
  font-weight: 600;
  color: #000;
}

.nav-spacer {
  width: 40px;
}

/* 可滚动区域 */
.minimal-scroll {
  flex: 1;
  overflow-y: auto;
  padding: 20px 16px;
}

/* 分组卡片 */
.minimal-group {
  background: #fff;
  border: 1px solid #eee;
  border-radius: 2px;
  margin-bottom: 20px;
  overflow: hidden;
}

/* 列表项 */
.minimal-item {
  display: flex;
  align-items: center;
  padding: 12px 16px;
  border-bottom: 1px solid #eee;
  min-height: 48px;
}

.minimal-item:last-child {
  border-bottom: none;
}

.minimal-item.clickable {
  cursor: pointer;
}

.minimal-item.clickable:active {
  background: #f9f9f9;
}

/* 图标 */
.item-icon {
  width: 24px;
  height: 24px;
  color: #333;
  flex-shrink: 0;
  margin-right: 12px;
}

/* 内容区 */
.item-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.item-label {
  font-size: 15px;
  color: #000;
}

/* 下划线输入框 */
.underline-input {
  width: 100%;
  border: none;
  border-bottom: 1px solid #ddd;
  padding: 4px 0;
  font-size: 14px;
  color: #333;
  outline: none;
  background: transparent;
}

.underline-input::placeholder {
  color: #999;
}

.underline-input:focus {
  border-bottom-color: #333;
}

/* 右侧元素 */
.item-value {
  font-size: 15px;
  color: #999;
  margin-right: 8px;
}

.item-arrow {
  font-size: 16px;
  color: #ccc;
}

/* 温度胶囊 */
.temp-pill {
  padding: 4px 12px;
  background: #f5f5f5;
  border-radius: 12px;
  font-size: 14px;
  color: #666;
}

/* 滑动开关 */
.toggle-switch {
  width: 51px;
  height: 31px;
  background: #e5e5e5;
  border-radius: 16px;
  position: relative;
  transition: background 0.3s;
  flex-shrink: 0;
}

.toggle-switch.on {
  background: #000;
}

.toggle-slider {
  width: 27px;
  height: 27px;
  background: #fff;
  border-radius: 50%;
  position: absolute;
  top: 2px;
  left: 2px;
  transition: transform 0.3s;
  box-shadow: 0 1px 3px rgba(0,0,0,0.2);
}

.toggle-switch.on .toggle-slider {
  transform: translateX(20px);
}

/* 模型选择器遮罩 */
.model-selector-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 3000;
}

/* 模型选择卡片 */
.model-selector-card {
  width: 320px;
  max-height: 500px;
  background: #fff;
  border: 2px solid #000;
  border-radius: 0;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

/* 标题栏 */
.model-selector-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px;
  border-bottom: 1px solid #eee;
}

.model-header-title {
  font-size: 16px;
  font-weight: 600;
  color: #000;
}

.model-close-btn {
  background: none;
  border: none;
  font-size: 20px;
  color: #666;
  cursor: pointer;
  padding: 0;
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.model-close-btn:hover {
  color: #000;
}

/* 加载状态 */
.model-loading {
  padding: 40px 20px;
  text-align: center;
  color: #666;
  font-size: 14px;
}

.loading-spinner {
  width: 24px;
  height: 24px;
  border: 3px solid #eee;
  border-top-color: #000;
  border-radius: 50%;
  margin: 0 auto 12px;
  animation: spin 0.8s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

/* 错误提示 */
.model-error {
  padding: 40px 20px;
  text-align: center;
  color: #999;
  font-size: 14px;
}

.retry-btn {
  margin-top: 12px;
  padding: 8px 16px;
  background: #000;
  color: #fff;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
}

.retry-btn:active {
  opacity: 0.7;
}

/* 模型列表 */
.model-list {
  flex: 1;
  overflow-y: auto;
  padding: 8px 0;
}

.model-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 16px;
  cursor: pointer;
  border-bottom: 1px solid #f5f5f5;
}

.model-item:hover {
  background: #f9f9f9;
}

.model-item.selected {
  background: #f5f5f5;
}

.model-name {
  font-size: 14px;
  color: #000;
}

.model-check {
  font-size: 16px;
  color: #000;
  font-weight: bold;
}

/* 通知设置页面 */
.notification-page {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  height: 100dvh;
  background: #fff;
  z-index: 2000;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

/* 导航栏 */
.notification-nav {
  padding-top: env(safe-area-inset-top, 0);
  height: 44px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding-left: 16px;
  padding-right: 16px;
  border-bottom: 1px solid #eee;
  flex-shrink: 0;
  box-sizing: content-box;
}

/* 可滚动区域 */
.notification-scroll {
  flex: 1;
  overflow-y: auto;
  padding: 20px 16px;
}

/* 分组卡片 */
.notification-group {
  background: #fff;
  border: 1px solid #eee;
  border-radius: 2px;
  overflow: hidden;
}

/* 列表项 */
.notification-item {
  display: flex;
  align-items: center;
  padding: 12px 16px;
  border-bottom: 1px solid #eee;
  min-height: 48px;
}

.notification-item:last-child {
  border-bottom: none;
}

.notification-item.clickable {
  cursor: pointer;
}

.notification-item.clickable:active {
  background: #f9f9f9;
}

/* 箭头 */
.item-arrow {
  font-size: 16px;
  color: #ccc;
  margin-left: 8px;
}

/* 滑动开关 */
.notification-switch {
  width: 48px;
  height: 26px;
  background: #e0e0e0;
  border-radius: 26px;
  position: relative;
  transition: background 0.3s;
  flex-shrink: 0;
  cursor: pointer;
  margin-left: 8px;
}

.notification-switch.on {
  background: #111;
}

.switch-slider {
  width: 22px;
  height: 22px;
  background: #fff;
  border: 1px solid #ddd;
  border-radius: 50%;
  position: absolute;
  top: 2px;
  left: 2px;
  transition: transform 0.3s;
}

.notification-switch.on .switch-slider {
  transform: translateX(22px);
}

/* 时间设置行 */
.time-setting-row {
  padding: 12px 16px;
  border-bottom: 1px solid #f0f0f0;
}

/* 图标占位 */
.icon-placeholder {
  width: 28px;
  height: 24px;
  flex-shrink: 0;
  margin-right: 12px;
}

/* 时间设置内容区 */
.time-setting-content {
  flex: 1;
  display: flex;
  gap: 12px;
  align-items: center;
}

/* 数字输入框容器 */
.time-input-wrapper {
  flex: 2;
}

/* 数字输入框 */
.time-input {
  width: 100%;
  border: none;
  border-bottom: 1px solid #ddd;
  background: transparent;
  padding: 4px 0;
  font-size: 15px;
  color: #111;
  outline: none;
  box-sizing: border-box;
}

.time-input:focus {
  border-bottom-color: #111;
}

.time-input::placeholder {
  color: #ccc;
}

/* 移除数字输入框的上下箭头 */
.time-input::-webkit-inner-spin-button,
.time-input::-webkit-outer-spin-button {
  -webkit-appearance: none;
  margin: 0;
}

.time-input[type="number"] {
  appearance: textfield; /* 标准写法 */
  -moz-appearance: textfield; /* Firefox 兼容 */
}

/* 单位滚轮选择器容器 */
.time-unit-picker {
  flex: 1;
  height: 90px;
  overflow-y: auto;
  position: relative;
  
  /* 隐藏滚动条 */
  scrollbar-width: none;
  -ms-overflow-style: none;
  
  /* iOS 风格渐变遮罩 */
  -webkit-mask-image: linear-gradient(
    to bottom,
    transparent 0%,
    black 15%,
    black 85%,
    transparent 100%
  );
  mask-image: linear-gradient(
    to bottom,
    transparent 0%,
    black 15%,
    black 85%,
    transparent 100%
  );
}

.time-unit-picker::-webkit-scrollbar {
  display: none;
}

/* 单位选项 */
.unit-option {
  height: 30px;
  line-height: 30px;
  text-align: center;
  font-size: 15px;
  color: #999;
  cursor: pointer;
  transition: color 0.2s, font-weight 0.2s;
}

.unit-option.selected {
  color: #111;
  font-weight: 500;
}

.unit-option:active {
  opacity: 0.6;
}

</style>