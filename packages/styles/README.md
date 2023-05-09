# styles

less 工具函数

## 高度从 0 到 auto 过渡

```html
<style>
  body {
    margin: 0;
  }
  .grid {
    color: #fff;
    background: #123456;
    padding: 20px;
    display: grid;
    grid-template-rows: 0fr;
    transition: grid-template-rows 0.3s ease-out;
  }

  .grid .content {
    overflow: hidden;
  }

  .grid:hover {
    grid-template-rows: 1fr;
  }
</style>

<div class="grid">
  <p class="content">
    Adipisicing dolores illum omnis doloremque nisi. Soluta qui corrupti amet
    minus fuga Repellat asperiores voluptate aspernatur mollitia earum quas,
    sint quos! Modi explicabo labore saepe ad iste. Rem ut inventore quasi
    officia tempora! Sed est aliquid similique exercitationem aut. Nam optio
    expedita atque repudiandae labore Excepturi cum doloribus a voluptatem
    consequatur Eaque saepe maiores corporis eaque minus assumenda illum In
    ducimus omnis dolorum maxime aut? Hic quos nihil corporis debitis saepe.
    Eveniet dicta expedita eius libero dolorem in vel, aperiam Deleniti dolor
    placeat autem distinctio facilis Officiis reprehenderit quidem beatae id
    dolorem. Consequuntur iure porro ipsam facilis omnis? Dolore sint
  </p>
</div>
```
