// public/sw.js
self.addEventListener('install', () => {
  self.skipWaiting(); // 强制跳过等待，立即激活
});

// 监听来自网页的指令
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SCHEDULE_NOTIFICATION') {
    const { title, body } = event.data;
    
    // 立即显示通知，或者你也可以在这里加个 setTimeout
    self.registration.showNotification(title, {
      body: body,
      icon: 'https://raw.githubusercontent.com/1687216166Pat/photo/main/heart.png',
      badge: 'https://raw.githubusercontent.com/1687216166Pat/photo/main/heart.png',
      vibrate: [200, 100, 200],
      tag: 'active-msg', // 防止重复弹出
      renotify: true
    });
  }
});
