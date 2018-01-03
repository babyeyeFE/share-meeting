# PWA

## 什么是PWA

PWA 全称 **Progressive Web Apps**  渐进增强式WEB应用

- **渐进增强** - 能够让每一位用户使用，无论用户使用什么浏览器，因为它是始终以渐进增强为原则。
- **响应式用户界面** - 适应任何环境：桌面电脑，智能手机，笔记本电脑，或者其他设备。
- **不依赖网络连接** - 通过 service workers 可以在离线或者网速极差的环境下工作。
- **类原生应用** - 有像原生应用般的交互和导航给用户原生应用般的体验，因为它是建立在 app shell model 上的。
- **持续更新** - 受益于 service worker 的更新进程，应用能够始终保持更新。
- **安全** - 通过 HTTPS 来提供服务来防止网络窥探，保证内容不被篡改。
- **可发现** - 得益于 W3C manifests 元数据和 service worker 的登记，让搜索引擎能够找到 web 应用。
- **再次访问** - 通过消息推送等特性让用户再次访问变得容易。
- **可安装** - 允许用户保留对他们有用的应用在主屏幕上，不需要通过应用商店。
- **可连接性** - 通过 URL 可以轻松分享应用，不用复杂的安装即可运行。

## 重要

应用外壳 App Shell   加载核心组件

Service  worker  实现离线缓存及消息推送

- 在页面中注册并安装成功后，运行于浏览器后台，不受页面刷新的影响，可以监听和截拦作用域范围内所有页面的 HTTP 请求。
- 网站必须使用 HTTPS。除了使用本地开发环境调试时 (如域名使用 localhost)
- 运行于浏览器后台，可以控制打开的作用域范围下所有的页面请求
- 单独的作用域范围，单独的运行环境和执行线程
- 不能操作页面 DOM。但可以通过事件机制来处理
- 事件驱动型服务线程

## 实现方式

1. Manifest实现添加至主屏幕

   index.html

   ```
   <head>

   <title>Minimal PWA</title>

   <meta  />

   <link rel="manifest" href="manifest.json" />

   <link rel="stylesheet" type="text/css" href="main.css">

   <link rel="icon" href="/e.png" type="image/png" />

   </head>
   ```

   Manifest.json

   ```
   {

   "name": "Minimal PWA", // 必填 显示的插件名称

   "short_name": "PWA Demo", // 可选  在APP launcher和新的tab页显示，如果没有设置，则使用name

   "description": "The app that helps you understand PWA", //用于描述应用

   "display": "standalone", // 定义开发人员对Web应用程序的首选显示模式。standalone模式会有单独的

   "start_url": "/", // 应用启动时的url

   "theme_color": "#313131", // 桌面图标的背景色

   "background_color": "#313131", // 为web应用程序预定义的背景颜色。在启动web应用程序和加载应用程序的内容之间创建了一个平滑的过渡。

   "icons": [ // 桌面图标，是一个数组

   {

   "src": "icon/lowres.webp",

   "sizes": "48x48",  // 以空格分隔的图片尺寸

   "type": "image/webp"  // 帮助userAgent快速排除不支持的类型

   },

   {

   "src": "icon/lowres",

   "sizes": "48x48"

   },

   {

   "src": "icon/hd_hi.ico",

   "sizes": "72x72 96x96 128x128 256x256"

   },

   {

   "src": "icon/hd_hi.svg",

   "sizes": "72x72"

   }

   ]

   }
   ```

   [Manifest文档]: https://developer.mozilla.org/zh-CN/docs/Web/Manifest

   ​

2. Service worker实现离线缓存

原理

![v2-236d17f6badc3875237f4468c17dc501_hd](/Users/anne/Desktop/v2-236d17f6badc3875237f4468c17dc501_hd.jpg)

生命周期

![粘贴图片1](/Users/anne/Desktop/粘贴图片1.png)

![粘贴图片](/Users/anne/Desktop/粘贴图片.png)

index.html

```
// 注册 service worker

if ('serviceWorker' in navigator) {

navigator.serviceWorker.register('/service-worker.js', {scope: '/'}).then(function (registration) {

// 注册成功

console.log('ServiceWorker registration successful with scope: ', registration.scope);

}).catch(function (err) {

// 注册失败 :(

console.log('ServiceWorker registration failed: ', err);

});

}
```

Sw.js

```
var cacheName = 'helloWorld';     // 缓存的名称

// install 事件，它发生在浏览器安装并注册 Service Worker 时

self.addEventListener('install', event => {

/* event.waitUtil 用于在安装成功之前执行一些预装逻辑

但是建议只做一些轻量级和非常重要资源的缓存，减少安装失败的概率

安装成功后 ServiceWorker 状态会从 installing 变为 installed */

event.waitUntil(

caches.open(cacheName)

.then(cache => cache.addAll([    // 如果所有的文件都成功缓存了，便会安装完成。如果任何文件下载失败了，那么安装过程也会随之失败。

'/js/script.js',

'/images/hello.png'

]))

);

});


/**

为 fetch 事件添加一个事件监听器。接下来，使用 caches.match() 函数来检查传入的请求 URL 是否匹配当前缓存中存在的任何内容。如果存在的话，返回缓存的资源。

如果资源并不存在于缓存当中，通过网络来获取资源，并将获取到的资源添加到缓存中。

*/

self.addEventListener('fetch', function (event) {

event.respondWith(

caches.match(event.request)

.then(function (response) {

if (response) {

return response;

}

var requestToCache = event.request.clone();  //

return fetch(requestToCache).then(

function (response) {

if (!response || response.status !== 200) {

return response;

}

var responseToCache = response.clone();

caches.open(cacheName)

.then(function (cache) {

cache.put(requestToCache, responseToCache);

});

return response;

})

);

});
```



3. service worker 实现消息推送

- 步骤一、提示用户并获得他们的订阅详细信息

- 步骤二、将这些详细信息保存在服务器上

- 步骤三、在需要时发送任何消息

  ```
  self.addEventListener('push', function (event) {

  // 检查服务端是否发来了任何有效载荷数据

  var payload = event.data ? JSON.parse(event.data.text()) : 'no payload';

  var title = 'Progressive Times';

  event.waitUntil(

  // 使用提供的信息来显示 Web 推送通知

  self.registration.showNotification(title, {

  body: payload.msg,

  url: payload.url,

  icon: payload.icon

  })

  );

  });
  ```

  ### PWA 的优势

  - 可以将 app 的快捷方式放置到桌面上，全屏运行，与原生 app 无异
  - 能够在各种网络环境下使用，包括网络差和断网条件下，不会显示 undefind
  - 推送消息的能力
  - 其本质是一个网页，没有原生 app 的各种启动条件，快速响应用户指令

  ### PWA 存在的问题

  - 支持率不高: 现在 ios 手机端不支持 pwa，IE 也暂时不支持
  - Chrome 在中国桌面版占有率还是不错的，安卓移动端上的占有率却很低
  - 各大厂商还未明确支持 pwa
  - 依赖的 GCM  Google Cloud Messaging 服务在国内无法使用
  - 微信小程序的竞争

  尽管有上述的一些缺点，PWA 技术仍然有很多可以使用的点。

  - service worker 技术实现离线缓存，可以将一些不经常更改的静态文件放到缓存中，提升用户体验。
  - service worker 实现消息推送，使用浏览器推送功能，吸引用户
  - 渐进式开发，尽管一些浏览器暂时不支持，可以利用上述技术给使用支持浏览器的用户带来更好的体验。

## 文章列表

[知乎问题“如何看待Progressive Web Apps”]: https://www.zhihu.com/question/46690207
[关于PWA黄玄的理解]: https://huangxuan.me/pwa-in-my-pov/#/
[黄玄的理解]: https://zhuanlan.zhihu.com/p/25167289
[谷歌的官方网站]: https://developers.google.com/web/
[官方demo]: https://codelabs.developers.google.com/codelabs/your-first-pwapp/#0

