## dat.gui

#### 注意事项

1. Num 精确度

   ```js
   //num = this.folder0.add(guiData,'distance',0,100).name('测试距离').listen().step(0.5)

   if (common.isUndefined(this.__step){
     if (this.initialValue === 0) {
       this.__impliedStep = 1; // What are we, psychics?
     } else {
       this.__impliedStep = Math.pow(10, Math.floor(Math.log(Math.abs(this.initialValue)) / Math.LN10)) / 10;
     }
   } else {
     this.__impliedStep = this.__step;
   }

   this.__precision = numDecimals(this.__impliedStep);
   ```

   ```js
   // 获取小数点之后的位数
   function numDecimals(x) {
     const _x = x.toString();
     if (_x.indexOf('.') > -1) {
       console.log(_x.indexOf('.'),_x.length);
       return _x.length - _x.indexOf('.') - 1;
     }

     return 0;
   }
   ```

2. 改变gui 的元素

   1. gui 获取的元素的顶级元素是 `gui.domElement`,可以使用 方法 `gui.getRoot()`获取,但是在最外层还包含着一个元素

      ```js
      // document.getElementsByClassName('dg ac')[0].style.zIndex = 100
      this.datGui.domElement.style = 'position:absolute;top:0px;left:0px;z-index = 100';
      let parent = this.datGui.getRoot()
      console.log(this.datGui.domElement,'hhh');
      console.log(document.getElementsByClassName('dg ac')[0]);
      console.log(parent,'hhh');
      ```

   2. gui 删除元素本身,可以使用 `destroy`函数,但是会留下最后的元素框

         ```js
         this.datGui.destroy()
         // let element = document.getElementsByClassName('dg main a')[0]
         // element.parentNode.removeChild(element)​
         ```

3. 常用函数

   1. `listen`: 监听函数,将需要监听的函数push 在 `requestAnimationFrame`函数中,使该函数重复监听

   2. `onFinishChange`:事件完成

   3. 多选框失去焦点

      ```js
      // num 指的是gui 有多少个多选框
      function selectsBlur(num) {
          for (let i = 0;i < num;i++) {
            const oSel = document.getElementsByTagName('select')[i]
          //   elementBlur(oSel)
          oSel.blur()
          }
          document.getElementById('game').focus()

        }
      ```

      ​

资料:

1. GitHub 主页：<https://github.com/dataarts/dat.gui>
2. http://www.hangge.com/blog/cache/detail_1785.html