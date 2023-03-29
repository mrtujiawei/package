export const CA_CERT = `-----BEGIN CERTIFICATE-----
MIICDjCCAXcCFBq2Md6NYqkhz41rzBaSEUdOdYPbMA0GCSqGSIb3DQEBCwUAMEUx
CzAJBgNVBAYTAkFVMRMwEQYDVQQIDApTb21lLVN0YXRlMSEwHwYDVQQKDBhJbnRl
cm5ldCBXaWRnaXRzIFB0eSBMdGQwIBcNMjIwNzI3MDcyOTI0WhgPMjEyMjA3MDMw
NzI5MjRaMEUxCzAJBgNVBAYTAkFVMRMwEQYDVQQIDApTb21lLVN0YXRlMSEwHwYD
VQQKDBhJbnRlcm5ldCBXaWRnaXRzIFB0eSBMdGQwgZ8wDQYJKoZIhvcNAQEBBQAD
gY0AMIGJAoGBAMqE8Gb4whrXMyENbd5ejLPmkw+W9MgFXJWPD3AzXMQZ7BNWZU/H
10mSpXnmRPDUqHzuwR8S1LlgsPuttMP0LpmqZWd/cj6ZPboiT0JM8ZEy/k5dcFTz
e5YKdtxiMlk6pIjIl8A6GJg0h0wYLmBH9Ig5Ow/CE4htW0/WZG5mPS3BAgMBAAEw
DQYJKoZIhvcNAQELBQADgYEAQEYDJLj0TG1xRAOWaXm4th5r5LY0jtHw3onT9fBF
XJ0ufniXWK/cXxKm1z1Z7fTCieiVWDNdtpjje+iHBkXWlDl/L59Rr+R9e7h6DVYD
im8FkD/FWx64KDsxqNWIa2OA/D4JSNEHiK12EW16i5WO1ueDiDsu/a/NcLwsJIEt
yuc=
-----END CERTIFICATE-----
`;

export const PRIVATE_KEY = `-----BEGIN CERTIFICATE-----
MIICDjCCAXcCFBq2Md6NYqkhz41rzBaSEUdOdYPbMA0GCSqGSIb3DQEBCwUAMEUx
CzAJBgNVBAYTAkFVMRMwEQYDVQQIDApTb21lLVN0YXRlMSEwHwYDVQQKDBhJbnRl
cm5ldCBXaWRnaXRzIFB0eSBMdGQwIBcNMjIwNzI3MDcyOTI0WhgPMjEyMjA3MDMw
NzI5MjRaMEUxCzAJBgNVBAYTAkFVMRMwEQYDVQQIDApTb21lLVN0YXRlMSEwHwYD
VQQKDBhJbnRlcm5ldCBXaWRnaXRzIFB0eSBMdGQwgZ8wDQYJKoZIhvcNAQEBBQAD
gY0AMIGJAoGBAMqE8Gb4whrXMyENbd5ejLPmkw+W9MgFXJWPD3AzXMQZ7BNWZU/H
10mSpXnmRPDUqHzuwR8S1LlgsPuttMP0LpmqZWd/cj6ZPboiT0JM8ZEy/k5dcFTz
e5YKdtxiMlk6pIjIl8A6GJg0h0wYLmBH9Ig5Ow/CE4htW0/WZG5mPS3BAgMBAAEw
DQYJKoZIhvcNAQELBQADgYEAQEYDJLj0TG1xRAOWaXm4th5r5LY0jtHw3onT9fBF
XJ0ufniXWK/cXxKm1z1Z7fTCieiVWDNdtpjje+iHBkXWlDl/L59Rr+R9e7h6DVYD
im8FkD/FWx64KDsxqNWIa2OA/D4JSNEHiK12EW16i5WO1ueDiDsu/a/NcLwsJIEt
yuc=
-----END CERTIFICATE-----
`;

export const socketTemplate = `
<!DOCTYPE html>
<html>
  <head>
    <meta charset="UTF-8" />
    <meta
      name="viewport"
      content="width=device-width,minimum-scale=1,maximum-scale=1,user-scalable=no"
    />
    <title>SOCKET</title>
    <style>
      * {
        margin: 0;
        padding: 0;
        list-style: none;
      }

      #app {
        display: flex;
        flex-direction: column;
        height: 100vh;
        overflow: hidden;
      }

      .messages {
        height: 100%;
        overflow: auto;
      }

      .message {
        padding: 10px;
      }

      .message-system {
        background: #ddd;
      }

      .message-user {
        background: #fff;
      }

      .toolbar {
        display: flex;
        flex-shrink: 0;
        height: 40px;
        background: #008c8c;
      }
      .input {
        display: block;
        flex-grow: 1;
        width: 100%;
        font-size: 20px;
      }
      .send-btn {
        flex-shrink: 0;
        width: 80px;
      }
    </style>
  </head>
  <body>
    <div id="app">
      <ul class="messages"></ul>
      <div class="toolbar">
        <input type="text" class="input" />
        <button class="send-btn">发送</button>
      </div>
    </div>
    <script>
      const messages = document.querySelector('.messages');
      const socket = new WebSocket('ws://' + window.location.host);
      const input = document.querySelector('.input');

      const sendMessage = () => {
        if (!input.value) {
          return;
        }
        socket.send(input.value);
        input.value = '';
      };

      document
        .querySelector('.send-btn')
        .addEventListener('click', sendMessage);

      input.addEventListener('keyup', (event) => {
        if (event.key == 'Enter') {
          sendMessage();
        }
      });

      class Message {
        type;
        content;
        constructor(type, content) {
          this.type = type;
          this.content = content;
        }

        toElement() {
          const li = document.createElement('li');
          li.innerHTML = this.content;
          if (0 == this.type) {
            li.className = 'message message-system';
          } else {
            li.className = 'message message-user';
          }
          return li;
        }
      }

      const onMessage = (message) => {
        const element = message.toElement();
        messages.appendChild(element);
        const rect = element.getBoundingClientRect();
        const delta = 30;
        if (rect.top < messages.clientHeight + delta) {
          messages.scrollBy({
            top: element.clientHeight,
            behavior: 'smooth',
          });
        }
      };

      socket.addEventListener('open', () => {
        onMessage(new Message(0, '连接成功'));
      });

      socket.addEventListener('error', (event) => {
        onMessage(new Message(0, '连接错误'));
      });

      socket.addEventListener('message', (event) => {
        onMessage(new Message(1, event.data));
      });

      socket.addEventListener('close', () => {
        onMessage(new Message(0, '连接已关闭'));
      });
    </script>
  </body>
</html>
`;
