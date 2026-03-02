// public/sw.js
self.addEventListener('install', (event) => {
  self.skipWaiting() // 立即激活
})

self.addEventListener('activate', (event) => {
  event.waitUntil(self.clients.claim()) // 立即接管页面
})

// 监听来自网页的指令
self.addEventListener('message', (event) => {
  console.log('收到网页指令:', event.data)
  if (event.data && event.data.type === 'SCHEDULE_NOTIFICATION') {
    const { title, body, delay } = event.data

    // 在特工内部开启定时器，即使网页关了，这个定时器在短时间内依然有效
    setTimeout(() => {
      self.registration.showNotification(title, {
        body: body,
        icon: 'https://raw.githubusercontent.com/1687216166Pat/photo/main/heart.png',
        badge: 'https://raw.githubusercontent.com/1687216166Pat/photo/main/heart.png',
        vibrate: [200, 100, 200],
        tag: 'rephone-msg',
      })
    }, delay || 1000) // 如果没传延迟，默认1秒后发
  }
})
