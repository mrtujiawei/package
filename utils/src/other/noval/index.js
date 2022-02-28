/**
 * 下载小说
 * node index.js 'url' 'dir'
 * @filename: index.js
 * @author: Mr Prince
 * @date: 2021-06-14 16:28:12
 */
const axios = require('axios');
const cheerio = require('cheerio');
const fs = require('fs');
const { Logger } = require('@mrtujiawei/utils');

const logger = Logger.getLogger();

logger.setLevel(Logger.LOG_LEVEL.ALL);

logger.subscribe((message) => {
  console.log(message);
});

function getContext(url) {
  return axios.get(url);
}

function getContextInfo(context, section) {
  let $ = cheerio.load(context);
  let title = $('title')[0].children[0].data;
  let article = $('#content').html();
  let nextHref = $('.bottem > a:nth-of-type(4)').attr('href');
  let html = `<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width">
  <title>${title}</title>
  <style>
    h1 {
      font-size: 30px;
    }
    body,
    p {
      font-size: 22px;
    }
    a {
      margin-top: 10px;
      display: block;
      padding: 20px 40px;
      text-align: center;
      color: #085308;
      text-decoration: none;
      background-color: #0883;
    }
  </style>
</head>
<body>
  <h1>${title}</h1>
  ${article}
  <a href="./${section + 1}.html">下一章</a>
</body>
</html>
  `;
  return {
    html,
    nextHref,
  };
}

async function writeFile(section, content) {
  return new Promise((resolve, reject) => {
    fs.writeFile(`./${dir}/${section}.html`, content, (err) => {
      if (err) {
        logger.error(section, '下载失败');
        return reject(err);
      }
      logger.trace(section, '保存成功');
      resolve();
    });
  });
}

async function download(url, section) {
  try {
    let data = await getContext(url);
    logger.trace(section, '下载成功');
    let contextInfo = getContextInfo(data.data, section);
    if (contextInfo.nextHref) {
      timer = setTimeout(async () => {
        await download(contextInfo.nextHref, section + 1);
      }, 1000);
    } else {
      logger.fatal('next href is not valid', contextInfo.nextHref);
    }
    await writeFile(section, contextInfo.html);
  } catch (e) {
    logger.error(section, '操作失败, 重试中');
    logger.error(e);
    setTimeout(() => {
      download(url, section);
    }, 1000);
  }
}

let startUrl = process.argv[2];
let dir = process.argv[3] || 'noval';

if (void 0 == startUrl) {
  logger.fatal('路径未填写');
  return;
}

try {
  let stat = fs.statSync(`./${dir}`, { throwIfNoEntry: false });
  if (!stat.isDirectory()) {
    fs.mkdirSync(`./${dir}`, {
      recursive: true,
    });
  }
} catch (e) {
  fs.mkdirSync(`./${dir}`, {
    recursive: true,
  });
}

download(startUrl, 1);
