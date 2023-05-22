---
date: 2023-5-22
title: JS 中的模块化发展历程
tags:
  - 工程化
---

JS 最初是作为一门脚本语言来设计，它主要用于浏览器里与 DOM 做交互。作者也没想到经过二十几年的发展，JS 已经被用于构建大型应用程序了，而大型项目所要解决的一个重要问题就是 模块化 问题，显然，因为 JS 设计的原因，在模块化这方面一直是一个缺陷，针对这个问题，就涌现出了不同的模块化解决方案。目前以及将来，主流的解决方案应该是 `ES6 module`，但是了解模块化的发展历程有助于我们更好的理解模块化带来的革命性作用。

## 早期阶段

在远古时期，也就是 JS 刚发明出来那几年，通常就是一个 js 文件对应一个模块，全部通过 `<script>` 标签引入使用。
这种模式的缺点：

* 命名冲突
* 模块直接暴露在全局，污染了全局作用域

## 使用命名空间

大概在 2002 年，出现了 `命名空间对象` 的解决方案。通过暴露一个全局对象，然后将模块的属性和方法挂载到这个对象作为属性访问。举个例子：

```javascript

// file app.js
var app = {}

// file hello.js
app.hello = function() {
  console.log('hello')
}

// file greeting.js
app.hello()
```

缺点：

* 因为是使用的全局对象，没有解决模块数据和代码分离的问题

## IIFE 立即执行函数

大概 2003 年，又出了 `立即执行函数` 的方案。具体就是利用 `闭包` 的特性，将模块里的属性和方法都放在一个立即执行函数里，形成私有作用域。举个例子：

```javascript
var greeting = (function() {
  var module = {}
  
  module.hello = function() {
    console.log('lhelo')
  }

  return module
}())
```

优点：

* 解决了污染作用域问题
* 解决了命名冲突问题
* 解决了代码的组织问题

缺点：

* 没有解决模块加载问题

## CommonJS Modules (2009 年)

在 09 年的时候，由于服务端缺乏统一的 API 来与操作系统做交互，Mozilla 的一位职员因此发起了一个项目，成立了一个委员会来讨论和开发适用于服务端的 JavaScript API，取名叫 ServerJS，半年后改名为 CommonJS。后来随着越来越多的成员加入开发做贡献，CommonJS 发展迅速，最终成为 Node.js 的模块化方案。以下是 CommonJS 的例子：

```javascript
// file greeting.js
var sayHello = function() {
  return 'hello world'
}

module.exports = {
  sayHello: sayHello,
}

// file hello.js
var {hello} = require('./greeting')
console.log(hello())
```

通过 `require` 来导入模块，通过 `exports` 对象来导出模块。另外，模块自身也有一个 module 对象，exports 就是 module 的一个属性。也许你会疑惑，平时我们写 node 代码时，可以直接使用 export，module，__dirname，__filename 这些变量，这是因为代码最终会被编译在一个这样子的函数中：

```javascript
(function (exports, require, module, __filename,__dirname) {
    // ...
    // 编写的模块代码
    // ...
});
```

CommonJS 的特点：

* 模块查找过程需要经过路径分析，文件定位，编译执行
* 同步加载模块，加载完成后才能执行后面操作
* 对引入过的模块会进行缓存

## AMD （ Asynchronous Module Definition）2009 年

由 Mozilla 的一位工程师在 2009 年搞出来，是浏览器端异步加载模块的解决方案。

* 代表库：Require.js
* 每个模块通过 define 函数定义，接收两个函数，第一个参数是依赖数组，第二个参数是函数，函数参数与前面的依赖对应。
* 通过函数 return 的方式向外部导出成员，也支持使用 CommonJS 语法来导入导出成员
* 使用 require 导入一个模块，参数与 define 相同
* 同期还出现了 CMD 标准，它与 AMD 的区别是 AMD 推崇依赖前置，而 CMD 推崇依赖就近；AMD 是提前执行依赖模块，而 CMD 是延迟执行依赖模块。CMD 的代表实现是 Sea.js，后来也被 Require.js 兼容了
  
示例代码如下：

```javascript
// file lib/greeting.js
define(function() {
    var helloInLang = {
        en: 'Hello world!',
        es: '¡Hola mundo!',
        ru: 'Привет мир!'
    };

    return {
        sayHello: function (lang) {
            return helloInLang[lang];
        }
    };
});

// file hello.js
define(['./lib/greeting'], function(greeting) {
    var phrase = greeting.sayHello('en');
    document.write(phrase);
});
```

优点：

* 异步
* 依赖辨别清晰
* 避免全局污染
* 可以懒加载

缺点：

* 使用起来比较复杂
* 项目一大的时候，会出现同一个页面对 JS 请求次数过多

## UMD（Universal Module Definition） 2011 年

AMD 模块格式适用于浏览器端，而 CommonJS 模块格式适用于服务端的 Node.js。这两种格式互不兼容，在一些使用了 CJS 模块格式的项目，加载器是无法识别 AMD 模块语法的；反之亦然。因此前端的黑客们就想有没一种标准来统一这两者呢？于是 UMD 出现了，它允许在 AMD 工具和 CommonJS 里环境里使用相同的模块，也就是一种写法，两个环境都适用。示例代码如下：

```javascript
(function(define) {
    define(function () {
        var helloInLang = {
            en: 'Hello world!',
            es: '¡Hola mundo!',
            ru: 'Привет мир!'
        };

        return {
            sayHello: function (lang) {
                return helloInLang[lang];
            }
        };
    });
}(
    typeof module === 'object' && module.exports && typeof define !== 'function' ?
    function (factory) { module.exports = factory(); } :
    define
));
```

优点：跨平台
缺点：AMD 和 CJS 该有的缺点都有
很多流行的库比如 `moment`，`lodash` 都支持打包成 UMD 的格式。

## ES2015 Modules (2015 年)

模块化的终极解决方案，直接从语言层面制定的模块化标准 ESM。它具有如下特性：

* 通过 `export` 关键字导出，`import` 关键字导入
* 模块静态化分析，编译时输出接口
  
与 CommonJS 不同，ES6 模块输出的是值的引用，而 CommonJS 输出的是值的拷贝；ES6 模块中顶层的 this 指向undefined；CommonJS 模块的顶层 this 指向当前模块。
示例代码：

```javascript
// file lib/greeting.js
const helloInLang = {
    en: 'Hello world!',
    es: '¡Hola mundo!',
    ru: 'Привет мир!'
}

export const greeting = {
    sayHello: function (lang) {
        return helloInLang[lang]
    }
}

// file hello.js
import { greeting } from "./lib/greeting"
const phrase = greeting.sayHello("en")
document.write(phrase)
```

## 模块化打包工具

模块化解决了代码的组织问题，但是对大型项目来说，如何管理加载模块，也是一个问题，我们一般会借助模块打包工具来做这件事。打包工具所解决的问题是：

* 环境兼容，可以将代码输出成各种模块格式
* 模块化划分出来的文件过多，这意味着每次要发起大量网络请求，影响效率，打包工具将其打包成一个入口文件
* 除了 JS 代码需要模块化，打包工具还支持将 HTML 和 CSS 这些资源也模块化管理

这其中的典型代表就是 `Webpack`，它是 JavaScript 及其周边的打包工具。
