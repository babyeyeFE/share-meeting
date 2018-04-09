# 写在前面

## 为什么写这篇文章？

1. 前些日子在网上的公开课上听到一位老师讲到：为什么 vue-router 和 vuex 可以用 `Vue.use(vueRouter)` 和 `Vue.use(vuex)` 而 axios 却不可以用 `Vue.use(axios)`。原因就是 axios 没有定义 install 方法，那么我们就要问了，什么是 install 方法（install 方法下文会提到）。

2. WiX 在群里分享过一个「极客公园」用 vue 开发的富文本的例子，我点进去看了一眼，发现了 install。

   [![94wK74.png](https://s1.ax1x.com/2018/03/15/94wK74.png)](https://imgchr.com/i/94wK74)

3. 在 node_moudles/element-ui 里也发现了类似的代码。

   [![94wygP.png](https://s1.ax1x.com/2018/03/15/94wygP.png)](https://imgchr.com/i/94wygP)

以上三点机缘巧合地凑到了一起，让我对 install 产生了兴趣，下面我们就来一起看看什么是 install。

# Vue 插件

## 引入及使用形式

```js
ES6
import windComponents from 'wind-components'

CommonJS
const windComponents = require('wind-components')

通过 use 挂载
Vue.use(windComponents)

直接 script 引入
<script src="./dist/wind-components.js"></script>
```

在组件里使用

```vue
<template>
  <div id="app">
    <wd-footer :content="content"></wd-footer>
  </div>
</template>

<script>
export default {
  data () {
    return {
      content: 'Welcome to Your Vue.js App'
    }
  }
}
</script>
```

## vue 插件标准

> Vue.js 的插件应当有一个公开方法 `install` 。这个方法的第一个参数是 `Vue` 构造器，第二个参数是一个可选的选项对象：
>
> ```js
> MyPlugin.install = function (Vue, options) {
>   // 1. 添加全局方法或属性
>   Vue.myGlobalMethod = function () {
>     // 逻辑...
>   }
>
>   // 2. 添加全局资源
>   Vue.directive('my-directive', {
>     bind (el, binding, vnode, oldVnode) {
>       // 逻辑...
>     }
>     ...
>   })
>
>   // 3. 注入组件
>   Vue.mixin({
>     created: function () {
>       // 逻辑...
>     }
>     ...
>   })
>
>   // 4. 添加实例方法
>   Vue.prototype.$myMethod = function (methodOptions) {
>     // 逻辑...
>   }
> }
> ```

## 开发

我们用官方脚手架搭建一个简单的架子来快速开发（当然也可以自己配置 webpack ）

```shell
vue init webpack-simple
```

```powershell
melody0z@Botao-MacBook-Air:~/Desktop/demo$ vue init webpack-simple

? Generate project in current directory? Yes
? Project name demo
? Project description A Vue.js project
? Author Dylan <botao@babyeye.com>
? License MIT
? Use sass? Yes

   vue-cli · Generated "demo".

   To get started:

     npm install
     npm run dev

```

```
npm i
npm run dev
```

1. 将 src 文件夹重命名为 examples，并修改 webpack.config.js 中的 src 为 examples

   ```js
   // webpack.config.js
   ...
   module.exports = {
   - entry: './src/main.js',
   + entry: './examples/main.js',  // 将这里的 src 修改为 examples
     output: {
       path: path.resolve(__dirname, './dist'),
       publicPath: '/dist/',
       filename: 'build.js'
     },
   ...
   ```

2. 新增 packages 文件夹，用于放置组件

3. 新增 build 文件夹，用于放置 webpack 配置文件，新建三个文件，分别是 

   webpack.base.conf.js

   webpack.dev.conf.js

   webpack.prod.conf.js

```js
.
├── build                          // webpack 配置文件
│   ├── webpack.base.conf.js       // 公共基础配置
│   ├── webpack.dev.conf.js        // 开发环境配置
│   ├── webpack.prod.conf.js       // 生产环境配置
├── examples                       // 用于本地测试
│   │   ├── assets                 // 资源文件
│   │   ├── App.vue                // 页面入口文件
│   │   ├── main.js                // 程序入口文件，加载各种公共组件
├── packages                       // 组件仓库
│   ├── footer                     // footer 组件文件夹
│   │   ├── src                    // 组件源码文件夹
│   │   │   ├── main.vue           // 组件
│   │   ├── index.js               // 组件入口
│   ├── index.js                   // 组件仓库入口
├── index.html                     // 入口html文件
.

```

4. 根据 webpack.config.js 重写 webpack.base.conf.js、webpack.dev.conf.js、webpack.prod.conf.js，然后删除 webpack.config.js

   ```js
   // webpack.base.conf.js
   const path = require('path')
   const webpack = require('webpack')
   const resolve = dir => path.join(__dirname, '..', dir)

   module.exports = {
     module: {
       rules: [
         {
           test: /\.css$/,
           use: [
             'vue-style-loader',
             'css-loader'
           ],
         },
         {
           test: /\.scss$/,
           use: [
             'vue-style-loader',
             'css-loader',
             'sass-loader'
           ],
         },
         {
           test: /\.sass$/,
           use: [
             'vue-style-loader',
             'css-loader',
             'sass-loader?indentedSyntax'
           ],
         },
         {
           test: /\.vue$/,
           loader: 'vue-loader',
           options: {
             loaders: {
               // Since sass-loader (weirdly) has SCSS as its default parse mode, we map
               // the "scss" and "sass" values for the lang attribute to the right configs here.
               // other preprocessors should work out of the box, no loader config like this necessary.
               'scss': [
                 'vue-style-loader',
                 'css-loader',
                 'sass-loader'
               ],
               'sass': [
                 'vue-style-loader',
                 'css-loader',
                 'sass-loader?indentedSyntax'
               ]
             }
             // other vue-loader options go here
           }
         },
         {
           test: /\.js$/,
           loader: 'babel-loader',
           exclude: /node_modules/
         },
         {
           test: /\.(png|jpg|gif|svg)$/,
           loader: 'file-loader',
           options: {
             name: '[name].[ext]?[hash]'
           }
         }
       ]
     },
     resolve: {
       alias: {
         'vue$': 'vue/dist/vue.esm.js'
       },
       extensions: ['*', '.js', '.vue', '.json']
     }
   }
   ```

   ```js
   // webpack.dev.conf.js
   const path = require('path')
   const webpack = require('webpack')
   const baseConfig = require('./webpack.base.conf')
   const resolve = dir => path.join(__dirname, '..', dir)

   module.exports = {
     ...baseConfig,
     ...{
       entry: './examples/main.js',
       output: {
         path: resolve('dist'),
         publicPath: '/dist/',
         filename: 'build.js'
       },
       devServer: {
         historyApiFallback: true,
         noInfo: true,
         overlay: true,
         open: true
       }
     }
   }
   ```

   ```js
   // webpack.prod.conf.js
   const path = require('path')
   const webpack = require('webpack')
   const baseConfig = require('./webpack.base.conf')
   const resolve = dir => path.join(__dirname, '..', dir)

   module.exports = {
     ...baseConfig,
     ...{
       entry: {
         'wind-components': './packages/index.js',
       },
       output: {
         path: resolve('dist'),
         filename: '[name].js',
         library: 'wind-components',  // library指定的就是你使用require时的模块名，这里便是require("wind-components")
         libraryTarget: 'umd',  // libraryTarget会生成不同umd的代码,可以只是commonjs标准的，也可以是指amd标准的，也可以只是通过script标签引入的
         umdNamedDefine: true  // 会对 UMD 的构建过程中的 AMD 模块进行命名。否则就使用匿名的 define。
       },
       devtool: '#source-map',
       plugins: [
         new webpack.DefinePlugin({
           'process.env': {
             NODE_ENV: '"production"'
           }
         }),
         new webpack.optimize.UglifyJsPlugin({
           sourceMap: true,
           compress: {
             warnings: false
           }
         }),
         new webpack.LoaderOptionsPlugin({
           minimize: true
         })
       ]
     }
   }
   ```

5. 修改 package.json 的 script

   ```js
   "scripts": {
       "dev": "cross-env NODE_ENV=development webpack-dev-server --open --hot --config build/webpack.dev.conf.js",
       "build": "cross-env NODE_ENV=production webpack --progress --hide-modules --config build/webpack.prod.conf.js"
     },
   ```

6. 然后重新 npm run dev

7. 然后我们开始在 packages 文件夹下写我们的组件

   ```vue
   // footer/src/main.vue
   <template>
     <div class="footer">
       <div class="footer-centent">
         <div class="footer-centent-text">
           {{ content }}
         </div>
       </div>
     </div>
   </template>
   <script>
   export default {
     name: 'wd-footer',     // 组件名称
     data() {
       return {
       }
     },
     props: {               // 给组件添加自定义属性
       content: {
         type: String,
         default: 'Copyright 2005-2018 京ICP备16017877号-1 视琦科技旗下产品 贝云医疗云平台提供计算支持'
       }
     }
   }
   </script>
   // css 略
   ```

8. 然后写组件的入口文件

   ```js
   // footer/index.js
   import Footer from './src/main.vue'          // 引入组件

   Footer.install = Vue => {                    // 给组件添加 install 方法
     Vue.component(Footer.name, Footer)         // 注册组件
   }
    
   export default Footer                        // 导出组件
   ```

9. 组件仓库入口文件

   ```js
   // packages/index.js
   import Footer from './footer'

   const components = [
     Footer
   ]

   const install = (Vue, opts = {}) => {
     components.forEach(component => Vue.component(component.name, component))
   }

   if (typeof window !== 'undefined' && window.Vue) {
     install(window.vue)
   }

   export default {
     install,
     Footer
   }
   ```

10. 在本地引入

    ```js
    // examples/main.js
    import windComponents from '../packages'     // 因为还没有发布到 npm 所以暂时这么引入
    Vue.use(windComponents)                      // 使用插件
    ```

11. 使用组件

    ```vue
    // examples/App.vue
    <template>
      <div>
        <wd-footer></wd-footer>
      </div>
    </template>
    ```

12. 至此，我们的简单的 footer 组件已经开发完毕。

## 发布到 npm

1. 修改 package.json 中的 privete 字段为 false，否则发布不上去。

2. 添加 main 字段，告诉项目的入口文件。

   2.1 `"main": "./packages/index.js"`    未打包的入口

   2.2 `"main": "./dist/wind-components.js" `   打包后的入口

3. 添加 files 用于发布忽略 当我们的包够复杂的时候 我们总不能把所有本地开发或者测试的组件全部都发布上去 这个时候我们开启这个选项。

   ```
   "files": [
   	"dist",
   	"packages"
   ]
   // 我们只发布这两个上去，其余的配置文件不发布
   ```

4. 注册 npm

5. `npm login`

6. `npm publish`   注意：如果你使用了**淘宝的镜像源，也会导致发布失败**，需要切换到 npm 镜像 推荐使用 nrm

7. 发布成功。

