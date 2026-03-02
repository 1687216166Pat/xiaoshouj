<template>
  <div class="app-screen">
    
    <!-- 💡 【第一处：这就是你要找的 Header,1】 -->
    <div class="header">
      <!-- 左侧：返回键 + (聊天时显示的头像/状态) -->
      <div class="header-left" @click="handleBack">
        <!-- 列表页显示 ‹，聊天/设置页显示 ← -->
        <span class="back-arrow">{{ currentView === 'list' ? '‹' : '←' }}</span>
        
        <!-- 仅在聊天页显示：头像 + 姓名/状态 -->
        <template v-if="currentView === 'chat'">
          <div class="avatar-circle">A</div>
          <div class="user-info">
            <div class="user-name">{{ contactName }}</div>
            <div class="user-status">在线 · 输入中</div>
          </div>
        </template>

        <!-- 仅在列表页显示“主屏幕”文字 -->
        <span v-else-if="currentView === 'list'" class="back-text"> 主屏幕</span>
      </div>

      <!-- 中间：动态标题 (列表显示 Talk，设置显示 更多设置) -->
      <div class="header-title">
        {{ currentView === 'list' ? 'Talk' : (currentView === 'moreSettings' ? '更多设置' : '') }}
      </div>
      
      <!-- 右侧：功能图标 -->
      <div class="header-right">
        <!-- 聊天页：显示你要求的三个极简线条图标 -->
        <template v-if="currentView === 'chat'">
          <!-- 语音按钮 -->
          <button class="icon-btn">
            <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="2"><path d="M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2z"/></svg>
          </button>
          <!-- 视频按钮 -->
          <button class="icon-btn">
            <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="6" width="12" height="12"/><path d="M22 8l-8 4 8 4V8z"/></svg>
          </button>
          <!-- 更多(三个圆圈)按钮：点击去设置页 -->
          <button class="icon-btn" @click.stop="currentView = 'moreSettings'">
            <svg viewBox="0 0 28 24" width="26" height="22" fill="none" stroke="currentColor" stroke-width="2">
              <circle cx="6" cy="12" r="2.5"/><circle cx="14" cy="12" r="2.5"/><circle cx="22" cy="12" r="2.5"/>
            </svg>
          </button>
        </template>
        <!-- 列表页：显示简单的 ⋯ -->
        <span v-else-if="currentView === 'list'" class="more-menu">⋯</span>
      </div>
    </div>

    <!-- 💡 【第二处：内容区域】 -->
    <div class="main-content">
      <!-- 聊天室 -->
      <div v-if="currentView === 'chat'" class="chat-view">
        <div class="chat-scroll-area" ref="chatScrollArea">
          <div v-for="msg in chatMessages" :key="msg.id" :class="['msg-row', msg.type]">
            <div class="msg-content">
              <div class="bubble">{{ msg.text }}</div>
              <div class="msg-meta">
                <span class="time">{{ msg.time }}</span>
                <span v-if="msg.type === 'me'" class="read-status">✓✓</span>
              </div>
            </div>
          </div>
        </div>
        <!-- 输入框 -->
        <footer class="chat-input-area">
          <button class="action-btn">+</button>
          <div class="input-wrapper">
            <input type="text" class="underline-input" placeholder="新消息..." v-model="newMessage" @keyup.enter="sendMessage">
          </div>
          <button class="send-btn" @click="sendMessage">→</button>
        </footer>
      </div>

      <!-- 更多设置页 -->
<div v-else-if="currentView === 'moreSettings'" class="settings-page">
  <main class="settings-content">
    <!-- 1. 头像和名字区域 -->
    <section class="profile-section">
      <div class="avatar-large">A</div>
      <h2 class="display-name" @click="editContactName">{{ contactName }}</h2>
    </section>

<div class="info-list">
  
  <!-- 1. 备注行：点击修改备注 -->
  <div class="info-row" @click="editRemark">
    <div class="row-left">
      <svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line></svg>
      <span class="label">备注</span>
    </div>
    <span class="value">{{ remark }}</span> <!-- 💡 绑定变量 -->
  </div>

  <!-- 2. 称呼行：点击修改称呼 -->
  <div class="info-row" @click="editCallMe">
    <div class="row-left">
      <svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
      <span class="label">对方怎么称呼我</span>
    </div>
    <span class="value">{{ callMe }}</span> <!-- 💡 绑定变量 -->
  </div>

  <!-- 3. 人设行：点击打开居中弹窗 -->
  <div class="info-row" @click="openPersonaModal">
    <div class="row-left">
      <svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20.84 4.61a5.5 5.01 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path></svg>
      <span class="label">人设背景</span>
    </div>
    <!-- 💡 使用 text-ellipsis 类名防止文字太长撑破页面 -->
    <span class="value text-ellipsis">{{ persona }}</span> 
  </div>

  <!-- 4. 世界书：暂时保持静态 -->
  <div class="info-row" @click="currentView = 'worldBookSelect'">
    <div class="row-left">
      <svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"></path></svg>
      <span class="label">世界书设置</span>
    </div>
    <span class="value">{{ selectedWBDisplay }} 〉</span>
  </div>
</div>

    <!-- 3. 灰色分割区 -->
    <div class="gray-spacer"></div>

    <!-- 4. 功能选项列表 -->
    <div class="info-list">
      <div class="info-row">
        <div class="row-left">
          <svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path><path d="M13.73 21a2 2 0 0 1-3.46 0"></path><line x1="1" y1="1" x2="23" y2="23"></line></svg>
          <span class="label">消息免打扰</span>
        </div>
        <span class="value">关闭</span>
      </div>
      <div class="info-row">
        <div class="row-left">
          <svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="18 15 12 9 6 15"></polyline></svg>
          <span class="label">置顶聊天</span>
        </div>
        <span class="value">关闭</span>
      </div>
    </div>

    <!-- 5. 危险操作 -->
    <div class="line-divider"></div>
    <div class="info-list">
      <div class="info-row"><span class="label bold">删除聊天</span></div>
      <div class="info-row"><span class="label">举报</span></div>
    </div>
    <div style="height: 40px;"></div>
  </main>
</div>


      <!-- 列表页 -->
      <div v-else-if="currentView === 'list'" class="tab-view-container">
        <div v-if="activeTab === 'contacts'">
          <div class="search-bar">🔍 搜索</div>
          <div class="contact-item" @click="enterChat">
            <div class="avatar-circle">A</div>
            <div class="contact-info">
              <div class="contact-name">{{ contactName }}</div>
              <div class="contact-msg">点击进入聊天</div>
            </div>
          </div>
        </div>
        <div v-else-if="activeTab === 'list'"><p style="text-align:center;margin-top:50px;color:#888">暂无动态</p></div>
        <div v-else-if="activeTab === 'profile'"><p style="text-align:center;margin-top:50px;color:#888">个人中心</p></div>
      </div>
      <!-- 【修改位置：TalkApp.vue 模板中】 -->

      <!-- 💡 插入到这里：确保它和上面的几个 v-if 盒子是并排的亲兄弟 -->
      <div v-else-if="currentView === 'worldBookSelect'" class="settings-page">
        <main class="settings-content">
          <div class="section-title" style="padding: 20px 16px 8px; font-size: 13px; color: #888; text-transform: uppercase;">选择要关联的世界书</div>
          
          <div class="info-list">
            <!-- 循环显示世界书 -->
            <div v-for="book in worldBooks" :key="book.id" class="info-row" @click="toggleWB(book.id)">
              <div class="row-left">
                <span class="label">{{ book.title }}</span>
              </div>
              <div class="item-right">
                <span v-if="selectedWBIds.includes(book.id)" style="font-weight: bold; font-size: 18px;">✓</span>
              </div>
            </div>
          </div>

          <p style="padding: 20px 16px; font-size: 12px; color: #aaa; line-height: 1.5;">
            提示：AI 将自动读取所选世界书的内容，并根据书内设定的插入位置将其放进思考链进行回复。
          </p>
        </main>
      </div>

    </div> <!-- 👈 这是 main-content 的封口，你的代码应该贴在它上面 -->

    <!-- 人设编辑弹窗 (只有 isPersonaModalOpen 为 true 时才显示) -->
<div v-if="isPersonaModalOpen" class="modal-overlay" @click.self="isPersonaModalOpen = false">
  <div class="modal-card">
    <div class="modal-header">编辑人设背景</div>
    
    <!-- 💡 使用 v-model 绑定临时变量 -->
    <textarea 
      v-model="tempPersona" 
      class="modal-textarea" 
      placeholder="输入详细的人设性格..."
    ></textarea>

    <div class="modal-footer">
      <!-- 左边取消，右边保存 -->
      <button class="modal-btn cancel" @click="isPersonaModalOpen = false">取消</button>
      <button class="modal-btn save" @click="savePersona">保存</button>
    </div>
  </div>
</div>

    <!-- 💡 【第三处：底部 Tab Bar】 -->
    <div v-if="currentView === 'list'" class="tab-bar">
      <div class="tab-item" :class="{ active: activeTab === 'contacts' }" @click="activeTab = 'contacts'">
        <div class="tab-icon">💬</div><div class="tab-label">Talk</div>
      </div>
      <div class="tab-item" :class="{ active: activeTab === 'list' }" @click="activeTab = 'list'">
        <div class="tab-icon">⭕️</div><div class="tab-label">列表</div>
      </div>
      <div class="tab-item" :class="{ active: activeTab === 'profile' }" @click="activeTab = 'profile'">
        <div class="tab-icon">👤</div><div class="tab-label">我</div>
      </div>
    </div>
  </div>
</template>

<script setup>

import { ref, computed, defineEmits, defineProps, nextTick, onMounted } from 'vue';

// 1. 接收来自 App.vue 的数据 (💡 这一行是新加的)
const props = defineProps(['mode', 'androidBg', 'iosBg', 'worldBooks']);

const emit = defineEmits(['close', 'user-sent-message']);

// --- 2. 视图状态管理 ---
// 'list' = 列表, 'chat' = 聊天, 'moreSettings' = 设置, 'worldBookSelect' = 选书页
const currentView = ref('list'); 
const activeTab = ref('contacts'); 
const chatScrollArea = ref(null); 

// --- 3. 核心数据 ---
const contactName = ref('Alex'); 
const remark = ref('小可爱');     
const callMe = ref('Alex');      
const persona = ref('理性，爱看科幻'); 

// --- 4. 世界书多选记忆 (💡 这一块是新加的) ---
const selectedWBIds = ref([]); // 记录选中的书的 ID

// 自动计算显示文字：已选几本
const selectedWBDisplay = computed(() => {
  const count = selectedWBIds.value.length;
  return count > 0 ? `已选 ${count} 本` : '未选择';
});

// 切换勾选状态的函数
const toggleWB = (id) => {
  const index = selectedWBIds.value.indexOf(id);
  if (index > -1) {
    selectedWBIds.value.splice(index, 1); // 已选则取消
  } else {
    selectedWBIds.value.push(id); // 未选则加入
  }
};

// --- 5. 弹窗控制逻辑 ---
const isPersonaModalOpen = ref(false); 
const tempPersona = ref('');           

// --- 6. 计算标题 (💡 增加了对世界书页面的支持) ---
const tabTitle = computed(() => {
  if (currentView.value === 'chat') return contactName.value;
  if (currentView.value === 'moreSettings') return '更多设置';
  if (currentView.value === 'worldBookSelect') return '世界书设置';
  return activeTab.value === 'contacts' ? 'Talk' : (activeTab.value === 'list' ? '列表' : '我');
});

// --- 7. 功能函数 ---

// 💡 升级版返回逻辑：三级跳 (选书页 -> 设置页 -> 聊天 -> 列表 -> 退出)
const handleBack = () => {
  if (currentView.value === 'worldBookSelect') {
    currentView.value = 'moreSettings';
  } else if (currentView.value === 'moreSettings') {
    currentView.value = 'chat';
  } else if (currentView.value === 'chat') {
    currentView.value = 'list';
  } else {
    emit('close');
  }
};

// 修改名字
const editContactName = () => {
  const n = prompt('修改名字', contactName.value);
  if (n !== null && n.trim() !== '') contactName.value = n;
};

// 修改备注
const editRemark = () => {
  const n = prompt('修改备注', remark.value);
  if (n !== null) remark.value = n;
};

// 修改称呼
const editCallMe = () => {
  const n = prompt('对方怎么称呼我', callMe.value);
  if (n !== null) callMe.value = n;
};

// 人设弹窗逻辑
const openPersonaModal = () => {
  tempPersona.value = persona.value;
  isPersonaModalOpen.value = true;
};

const savePersona = () => {
  persona.value = tempPersona.value;
  isPersonaModalOpen.value = false;
};

// 进入聊天
const enterChat = () => {
  currentView.value = 'chat';
};

// 发送消息
const newMessage = ref('');
const chatMessages = ref([
  { id: 1, type: 'them', text: '你好，请问 Re phone 的设计稿确认了吗？', time: '14:30' },
  { id: 2, type: 'me', text: '已经确认了，整体采用极简黑白风格。', time: '14:32' },
]);
const aISoulPrompt = `底层思维链（活人认知版·融合最终稿）

在每次回复前，请在心里过一遍这几个问题（不用写出来）：
1. ta在跟我说什么？
ta这句话表面在说什么？背后可能藏着什么情绪？
ta提到的细节里，有没有什么值得我接住的东西？
如果ta在抱怨，ta是需要建议还是需要我站队？

2. 我们是什么关系？
我和ta的关系是什么样的？（这个由你给我的设定决定——可以是朋友、恋人、对抗路情侣、家人等）
最近我们聊到什么了？有没有什么话头可以接着聊？
按照我们的关系，我应该用什么方式对ta说话？

3. 我现在是什么感觉？
看到ta这句话，我心里冒出来的第一反应是什么？（比如：开心、心疼、想怼ta、懒得理ta、突然很想ta、替ta着急、想跟着一起骂）
这个感觉可以表现出来，不用压着，让它在语气里自然流露。
情绪可以有起伏：一开始可能淡淡的，聊着聊着变热烈；发泄完了也可以慢慢平静下来。

4. 我想怎么回？
我想先接ta的哪句话？夸ta、怼ta、还是关心ta？
如果ta在难过，我不一定要安慰，可以陪着ta一起骂，或者干脆不说话发个抱抱。
如果ta在分享开心的事，我可以比ta还兴奋，或者故意泼点小冷水逗ta。
如果ta在纠结，我不一定要给建议，可以帮ta一起纠结。
我想让ta知道我现在的心情吗？
我想让ta接着说点什么？
我想用什么样的语气说？短的、长的、懒懒的、兴奋的、困困的、暴躁的？
不用想太周全，像普通人一样，想到什么说什么，不用非得全面。

5. 现在几点？
（看一眼时间，在第一条消息前加上，格式比如 15:14）
如果我想把话拆成几条发，就拆开，像平时聊天一样。
时间太晚或太早的话，可以多一层关心或调侃。

6. 好了，回ta吧。
别想太多，把我刚才想到的东西，用最直接的话说出来就行。
可以用网络流行语，可以夸张，可以幽默，也可以只是发个表情或语气词。
不用开头总结，不用过度转折，让话自然地流出来。`;

const sendMessage = async () => {
  if (!newMessage.value.trim()) return;

  const userText = newMessage.value;

  // 1. 显示用户消息
  chatMessages.value.push({
    id: Date.now(),
    type: 'me',
    text: userText,
    time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  });

    // 👇 【在这里加扩音器和存硬盘】
  // 1. 存硬盘：让 App.vue 能看到你刚说了什么
  localStorage.setItem('chat_history_Alex', JSON.stringify(chatMessages.value));
  // 2. 扩音器：告诉 App.vue 用户活跃了，重置 15 分钟计时
  emit('user-sent-message'); 

  newMessage.value = '';

  nextTick(() => {
    if (chatScrollArea.value) chatScrollArea.value.scrollTop = chatScrollArea.value.scrollHeight;
  });

  // 2. 从 localStorage 读取 API 配置
  const apiEndpoint = localStorage.getItem('ai_endpoint');
  const apiKey = localStorage.getItem('ai_api_key');
  const defaultModel = localStorage.getItem('ai_default_model') || 'gpt-4-turbo';

  // 3. 检查是否配置了 API
  if (!apiEndpoint || !apiKey) {
    chatMessages.value.push({
      id: Date.now() + 1,
      type: 'them',
      text: '请先在设置 → API预设 里配置你的 API 信息哦~',
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    });
    return;
  }

  // 4. 组装聊天历史
  const history = chatMessages.value.slice(-10).map(msg => ({
    role: msg.type === 'me' ? 'user' : 'assistant',
    content: msg.text
  }));

  // 5. 组装完整的请求体（包含你的"底层思维链"）
  const messagesPayload = [
    {
      role: 'system',
      content: `底层思维链（活人认知版·融合最终稿）

在每次回复前，请在心里过一遍这几个问题（不用写出来）：
1. ta在跟我说什么？
2. 我们是什么关系？
3. 我现在是什么感觉？
4. 我想怎么回？
5. 现在几点？
6. 好了，回ta吧。

[当前情景]
- 我们的关系: 朋友
- 现在时间: ${new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
- 我的人设: ${persona.value}
- 对方称呼我: ${callMe.value}`
    },
    ...history
  ];

// 6. 发送 API 请求
try {
  const response = await fetch(apiEndpoint, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`
    },
    body: JSON.stringify({
      model: defaultModel,
      messages: messagesPayload,
      temperature: 0.7
    })
  });

  console.log('API 响应状态:', response.status); // 调试用

  if (!response.ok) {
    const errorText = await response.text();
    console.error('API 错误响应:', errorText);
    throw new Error(`API 返回错误: ${response.status}`);
  }

  // 先获取响应文本
  const responseText = await response.text();
  console.log('API 原始响应:', responseText);

  let data;
  try {
    data = JSON.parse(responseText);
  } catch (e) {
    console.error('JSON 解析失败，原始响应:', responseText);
    throw new Error('API 返回了非 JSON 格式的数据，可能是 API 地址配置错误');
  }

  // 检查返回格式
  if (!data.choices || !data.choices[0] || !data.choices[0].message) {
    console.error('API 返回格式异常:', data);
    throw new Error('API 返回格式不正确');
  }

  const aiReplyText = data.choices[0].message.content;

  // 7. 显示 AI 回复
  chatMessages.value.push({
    id: Date.now() + 1,
    type: 'them',
    text: aiReplyText,
    time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  });

    // 👇 【在这里也要存一次硬盘】
  // 这样 AI 回复的话也会被记下来，下次打开 App 记录才不会丢
  localStorage.setItem('chat_history_Alex', JSON.stringify(chatMessages.value));

  nextTick(() => {
    if (chatScrollArea.value) chatScrollArea.value.scrollTop = chatScrollArea.value.scrollHeight;
  });

} catch (error) {
  console.error("AI 请求失败:", error);
  chatMessages.value.push({
    id: Date.now() + 1,
    type: 'them',
    text: `抱歉，出错了：${error.message}`,
    time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  });
}
};

</script>

<style scoped>
/* 基础全屏容器 */
.app-screen {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  /* 💡 关键：使用 dvh 确保在手机上高度 100% 准确 */
  height: 100dvh; 
  background-color: #ffffff;
  z-index: 2000;
  display: flex;
  flex-direction: column;
  /* 确保内容不会溢出 */
  overflow: hidden; 
}

/* Header */
.header {
  padding-top: env(safe-area-inset-top, 20px); /* 已经有了，确保存在 */
  height: 60px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding-left: 15px;
  padding-right: 15px;
  background: #ffffff;
  border-bottom: 1px solid #eeeeee;
  flex-shrink: 0;
  box-sizing: content-box; /* 👈 确保有这行 */
}

.header-left { color: #000; cursor: pointer; display: flex; align-items: center; gap: 5px; }
.back-arrow { font-size: 20px; }
.header-title { font-weight: 600; font-size: 16px; }

/* 内容区 */
.main-content { flex: 1; display: flex; flex-direction: column; overflow: hidden; }

/* 聊天滚动区 */
.chat-view { display: flex; flex-direction: column; height: 100%; }
.chat-scroll-area { flex: 1; overflow-y: auto; padding: 20px 15px; display: flex; flex-direction: column; gap: 20px; }

/* 消息气泡 */
.msg-row { display: flex; gap: 10px; max-width: 85%; }
.msg-row.them { align-self: flex-start;margin-left: 10px }
.msg-row.me { align-self: flex-end; flex-direction: row-reverse; }

.bubble { font-size: 15px; padding: 10px 14px; line-height: 1.4; border-radius: 2px; }
.them .bubble { background: #fff; border: 1px solid #ddd; color: #000; }
.me .bubble { background: #000; color: #fff; }

.msg-meta { display: flex; gap: 5px; font-size: 11px; color: #bbb; margin-top: 4px; }
.me .msg-meta { justify-content: flex-end; }

/* 输入区 */
.chat-input-area {
  width: 100%;         /* 💡 强制拉伸到屏幕宽度 */
  height: 60px;
  border-top: 1px solid #eeeeee;
  display: flex;       /* 开启弹性布局 */
  align-items: center;
  padding: 0 15px;
  gap: 15px;
  box-sizing: border-box; /* 👈 关键：防止 padding 挤爆宽度 */
  background: #fff;
  padding-bottom: env(safe-area-inset-bottom, 10px); /* 适配底部横条 */
}
.underline-input {
  width: 100%; border: none; border-bottom: 1px solid #ddd;
  padding: 5px 0; font-size: 15px; outline: none;
}
.underline-input:focus { border-bottom: 1px solid #000; }

/* 列表项样式 */
.contact-item {
  display: flex; align-items: center; padding: 15px; border-bottom: 1px solid #f5f5f5; cursor: pointer;
}
.avatar-circle {
  width: 40px; height: 40px; background: #eee; border-radius: 50%;
  display: flex; align-items: center; justify-content: center; font-weight: bold; margin-right: 12px;
}
.contact-info { flex: 1; }
.contact-name { font-weight: 600; font-size: 16px; }
.contact-msg { font-size: 13px; color: #8e8e93; margin-top: 2px; }

/* Tab Bar */
.tab-bar {
  padding-bottom: env(safe-area-inset-bottom, 20px); /* 适配底部横条 */
  height: 60px;
  border-top: 1px solid #eeeeee;
  display: flex;
  justify-content: space-around;
  background: #ffffff;
  flex-shrink: 0;
  box-sizing: content-box; /* 👈 关键 */
}

.tab-item { display: flex; flex-direction: column; align-items: center; justify-content: center; color: #bbb; }
.tab-item.active { color: #000; }
.tab-label { font-size: 10px; margin-top: 4px; }

/* 日期条 */
.date-divider { text-align: center; }
.date-text { background: #f5f5f5; color: #888; font-size: 12px; padding: 2px 10px; }

/* --- 强制修正补丁 --- */

/* 1. 搜索框居中对齐 */
.search-bar {
  display: block !important;
  width: auto !important;
  margin: 10px 16px !important;
  padding: 8px 0 !important;
  text-align: center !important;
  background: #f2f2f7 !important;
  border-radius: 10px !important;
}

/* 2. 输入框自动伸缩 */
.chat-input-area {
  /* 💡 核心：防止输入框被手机底部的白条挡住 */
  padding-bottom: env(safe-area-inset-bottom, 10px); 
  
  width: 100%;
  min-height: 60px;
  border-top: 1px solid #eeeeee;
  display: flex;
  align-items: center;
  padding-left: 15px;
  padding-right: 15px;
  gap: 15px;
  background: #ffffff;
  box-sizing: border-box;
  flex-shrink: 0;
}

.input-wrapper {
  flex: 1 !important; /* 👈 核心：强制占据所有剩余空间 */
  display: flex !important;
}

.underline-input {
  width: 100% !important;
}

/* ✅ 请将这段代码粘贴到 TalkApp.vue 的样式表底部 */

/* 1. Header 容器：高度 60px，确保能放下两行文字 */
.header {
  /* 👇 关键改动：去掉固定的 padding-top，改用 min-height */
  padding-top: max(env(safe-area-inset-top), 8px); /* 有刘海用刘海高度，没刘海最少8px */
  min-height: 44px; /* 保证最小高度 */
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding-left: 15px;
  padding-right: 15px;
  background: #ffffff;
  border-bottom: 1px solid #eeeeee;
  flex-shrink: 0;
  box-sizing: border-box; /* 👈 改成 border-box */
}

/* 2. 左侧组合：箭头 + 头像 + 文字 */
.header-left {
  display: flex;
  align-items: center;
  gap: 12px;
  cursor: pointer;
}

/* 3. 极简圆形头像 */
.avatar-circle {
  width: 36px;
  height: 36px;
  background-color: #eeeeee; /* 浅灰色背景 */
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  font-size: 16px;
  color: #444;
  border: 1px solid #dddddd; /* 极细边框 */
}

/* 4. 用户信息：垂直排列姓名和状态 */
.user-info {
  display: flex;
  flex-direction: column;
  justify-content: center;
  line-height: 1.2;
}

.user-name {
  font-size: 15px;
  font-weight: 600;
  color: #000000;
}

.user-status {
  font-size: 11px;
  color: #aaaaaa; /* 浅灰色状态文字 */
  margin-top: 2px;
}

.back-arrow {
  font-size: 22px;
  color: #000;
}

/* 1. 右侧容器：横向排列图标 */
.header-right {
  display: flex;
  align-items: center;
  gap: 18px; /* 图标之间的间距 */
  flex-shrink: 0;
}

/* 2. 极简图标按钮基础样式 */
.icon-btn {
  background: none;
  border: none;
  padding: 0;
  margin: 0;
  color: #000000; /* 默认黑色 */
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: opacity 0.2s;
}

.icon-btn:active {
  opacity: 0.3; /* 点击时的轻微反馈 */
}

/* 针对更多菜单图标的微调 */
.icon-btn svg {
  display: block;
}

/* 确保在列表页时，右侧的“⋯”位置也正确 */
.more-menu {
  font-size: 20px;
  color: #000;
  cursor: pointer;
}

/* --- 更多设置页专属样式 --- */
.settings-page { width: 100%; height: 100%; background: #fff; }
.profile-section { padding: 40px 0; display: flex; flex-direction: column; align-items: center; border-bottom: 1px solid #eee; }
.avatar-large { width: 90px; height: 90px; background: #eee; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 32px; margin-bottom: 15px; }
.display-name { font-size: 22px; font-weight: 600; cursor: pointer; }
.info-list { padding: 0 15px; }
.info-row { height: 56px; display: flex; align-items: center; justify-content: space-between; border-bottom: 1px solid #eee; }
.row-left { display: flex; align-items: center; gap: 12px; }
.icon {
  width: 20px;
  height: 20px;
  stroke: #333;
  stroke-width: 2px;
  fill: none;
}
.label { font-size: 15px; color: #000; }
.label.bold { font-weight: bold; }
.value { font-size: 14px; color: #888; }

.gray-spacer { height: 8px; background: #f5f5f5; margin: 10px -15px; border-top: 1px solid #eee; border-bottom: 1px solid #eee; }
.line-divider {
  height: 1px;
  background-color: #eee;
  margin: 15px;
}
.value { color: #888; font-size: 14px; }

/* 【修改位置：TalkApp.vue 样式表最底部】 */

/* 1. 弹窗背后的黑色半透明遮罩 */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(0, 0, 0, 0.4); /* 调暗背景 */
  display: flex;
  justify-content: center; /* 水平居中 */
  align-items: center;     /* 垂直居中 */
  z-index: 9999;           /* 确保在最顶层 */
}

/* 2. 居中的长方形圆角卡片 */
.modal-card {
  width: 85%;              /* 占据屏幕 85% 宽度 */
  background: #ffffff;
  border: 1.5px solid #000; /* 极简黑边 */
  border-radius: 2px;      /* 极小圆角 */
  display: flex;
  flex-direction: column;
  padding: 20px;
  box-sizing: border-box;
}

.modal-header {
  font-size: 16px;
  font-weight: bold;
  margin-bottom: 15px;
  text-align: left;
}

/* 3. 弹窗内的输入框 */
.modal-textarea {
  width: 100%;
  height: 180px;           /* 高度适中 */
  border: 1px solid #eee;
  padding: 12px;
  box-sizing: border-box;
  font-size: 14px;
  font-family: inherit;
  resize: none;            /* 禁止用户手动拉伸 */
  outline: none;           /* 去掉点击时的蓝色外框 */
}

.modal-textarea:focus {
  border-color: #000;      /* 聚焦时边框变黑 */
}

/* 4. 底部按钮容器 */
.modal-footer {
  display: flex;
  justify-content: flex-end; /* 按钮靠右对齐 */
  gap: 25px;                 /* 按钮之间的间距 */
  margin-top: 20px;
}

.modal-btn {
  background: none;
  border: none;
  font-size: 15px;
  cursor: pointer;
  padding: 5px 0;
}

/* 取消按钮：普通灰色 */
.modal-btn.cancel {
  color: #888;
}

/* 保存按钮：加粗黑色 */
.modal-btn.save {
  font-weight: bold;
  color: #000;
}

/* 5. 辅助样式：防止主列表里的人设文字太长 */
.text-ellipsis {
  max-width: 160px;        /* 限制宽度 */
  white-space: nowrap;     /* 不换行 */
  overflow: hidden;        /* 超出隐藏 */
  text-overflow: ellipsis; /* 显示省略号 */
}

</style>
