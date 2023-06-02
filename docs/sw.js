async function sendMessage(type, data, event) {
  console.log(`[${type}]: ${JSON.stringify(data)}`);

  if (!event.clientId) {
    return;
  }

  const client = await clients.get(event.clientId);
  if (!client) {
    return;
  }

  client.postMessage({
    code: 0,
    type,
    data,
  });
}

/**
 * 触发条件
 *
 * 1. 没有安装过
 *
 * sw.js 文件内容发生变化
 * 2. register 时, 没有正在使用旧版的页面
 *
 * 如果之前有 active 的 serviceWorker
 * 先 active，进入 waiting 状态
 */
addEventListener('install', (event) => {
  console.log('sw.js install call');
  sendMessage('install', { data: 0 }, event);
});

addEventListener('activate', (event) => {
  console.log('sw.js activate call');
  sendMessage('activate', { data: 1 }, event);
});

addEventListener('message', (event) => {
  console.log('sw.js message ca');
  sendMessage('message', { data: 2 }, event);
});

addEventListener('fetch', (event) => {
  console.log('sw.js fetch call');
  sendMessage('fetch', { data: 3 }, event);
});

addEventListener('sync', (event) => {
  console.log('sw.js sync call');
  console.log({ event });
});

addEventListener('push', (event) => {
  console.log('sw.js push call');
  console.log({ event });
});
