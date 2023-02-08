`width:100%`是一个很常用的属性，当对子元素这样设置的时候，子元素的宽度就等于父元素的宽度。  
但是，这句话还不够准确。子元素的宽度指什么？子元素内容区域的宽度还是包括`padding/border`的总宽度？父元素的宽度指什么？父元素内容区域的宽度还是包括`padding/border`的总宽度？  
这就是这篇博客的主要分析的问题。我们直接来看例子：

### content-box

```html
// html
<body>
  <div class='parent'>
    parent
     <div class='child'>
        child
     </div>
  </div>
</body>
```

```html
// css
<style>
  .parent {
    margin: 100px auto;
    width: 600px;
    border: 100px solid #ddd;
    padding: 100px;
  }
  .child {
    width: 100%;
    border: 50px solid pink;
    padding: 50px;
  }
</style>
```
![image](https://cdn.staticaly.com/gh/haibins/image-host@master/20230208/image.285ss75upww0.webp)
可以看出，子元素的宽度是取的父元素的content区域的宽度，而子元素因为存在padding和border，所以超出了父容器。这里我们把子元素设置为border-box

```css
// css
<style>
  .parent {
    margin: 100px auto;
    width: 600px;
    border: 100px solid #ddd;
    padding: 100px;
  }
  .child {
    width: 100%;
    border: 50px solid pink;
    padding: 50px;
    box-sizing: border-box;
  }
</style>
```
![image](https://cdn.staticaly.com/gh/haibins/image-host@master/20230208/image.13delyy1cq4g.webp)
可以看到子元素宽度就不会超出内容区域了,此时子元素设置宽度的百分比是指子元素整个盒子区域相对于父元素内容区域

### border-box
那父元素也设置border-box会怎么样

```css
// css
<style>
  .parent {
    margin: 100px auto;
    width: 600px;
    border: 100px solid #ddd;
    padding: 100px;
    box-sizing: border-box;
  }
  .child {
    width: 100%;
    border: 50px solid pink;
    padding: 50px;
    box-sizing: border-box;
  }
</style>
```

结果:
![image](https://cdn.staticaly.com/gh/haibins/image-host@master/20230208/image.2ahzi6xs48sg.webp)
这时仅仅会影响父元素的宽度，而子元素的宽度依然获取的是父元素的content区域



### 总结
> 1、当设置"box-sizing:content-box"时，子元素设置宽度的百分比是指子元素内容区域相对于父元素内容区域；  
> 2、当设置"box-sizing:border-box"时，子元素设置宽度的百分比是指子元素整个盒子区域相对于父元素内容区域；  
> 3、如果想要正确使用"width:100%"这一属性，一定要设置"box-sizing:border-box",否则会造成子元素溢出。


