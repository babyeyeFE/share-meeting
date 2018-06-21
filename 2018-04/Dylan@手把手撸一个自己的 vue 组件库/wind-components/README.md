# wind-components

> vue component

## 引入组件

main.js中

- 全局引入

```
import Vue from 'vue'
// 引入
import WindComponents from 'wind-components'
import App from './App.vue'

// 注册全局组件
Vue.use(WindComponents)

new Vue({
  el: '#app',
  render: h => h(App)
})
```

- 局部引用

```
import Vue from 'vue'
import { Header, Footer } from 'wind-components'
import App from './App.vue'

Vue.component(Header.name, Header)
Vue.component(Footer.name, Footer)
/* 或写为
 * Vue.use(Header)
 * Vue.use(Footer)
 */

new Vue({
  el: '#app',
  render: h => h(App)
})
```

