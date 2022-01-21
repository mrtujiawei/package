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

addEventListener('install', (event) => {
  sendMessage('install', { data: 0 }, event);
});

addEventListener('activate', (event) => {
  sendMessage('activate', { data: 1 }, event);
});

addEventListener('message', (event) => {
  sendMessage('message', { data: 2 }, event);
});

addEventListener('fetch', (event) => {
  sendMessage('fetch', { data: 3 }, event);
});
