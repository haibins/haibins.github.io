---
date: 2021-6-12
title: Flux与Redux
tags:
  - react
  - redux
describe: Flux与Redux
---

## Flux

Flux是Facebook用于构建客户端Web应用程序的基本架构，我们可以将Flux看做一种应用程序中的数据流的设计模式，而Redux正是基于Flux的核心思想实现的一套解决方案

首先，在Flux中会有以下几个角色的出现：

* Dispacher：调度器，接收到Action，并将它们发送给Store。
* Action：动作消息，包含动作类型与动作描述。
* Store：数据中心，持有应用程序的数据，并会响应Action消息。
* View：应用视图，可展示Store数据，并实时响应Store的更新。

从通讯的角度还可将其视为Action请求层 -> Dispatcher传输层 -> Store处理层 -> View视图层。

### 单向数据流

Flux应用中的数据以单一方向流动：

* 视图产生动作消息，将动作传递给调度器。
* 调度器将动作消息发送给每一个数据中心。
* 数据中心再将数据传递给视图。


![RUNOOB 图标](https://user-gold-cdn.xitu.io/2019/3/24/169ad99e277502d0?imageView2/0/w/1280/h/960/format/webp/ignore-error/1)


单一方向数据流还具有以下特点：

* 集中化管理数据。常规应用可能会在视图层的任何地方或回调进行数据状态的修改与存储，而在Flux架构中，所有数据都只放在Store中进行储存与管理。
* 可预测性。在双向绑定或响应式编程中，当一个对象改变时，可能会导致另一个对象发生改变，这样会触发多次级联更新。对于Flux架构来讲，一次Action触发，只能引起一次数据流循环，这使得数据更加可预测。
* 方便追踪变化。所有引起数据变化的原因都可由Action进行描述，而Action只是一个纯对象，因此十分易于序列化或查看。

## Redux

Redux是JavaScript应用可预测的状态管理容器，它具有以下特性：

* 可预测性，使用Redux能帮助你编写在不同的环境中编写行为一致、便于测试的程序。
* 集中性，集中化应用程序的状态管理可以很方便的实现撤销、恢复、状态持久化等。
* 可调式，Redux Devtools提供了强大的状态追踪功能，能很方便的做一个时间旅行者。
* 灵活，Redux适用于任何UI层，并有一个庞大的生态系统。

它还有三大原则：

* 单一数据源。整个应用的State储存在单个Store的对象树中。
* State状态是只读的。您不应该直接修改State，而是通过触发Action来修改它。Action是一个普通对象，因此它可以被打印、序列化与储存。
* 使用纯函数进行修改状态。为了指定State如何通过Action操作进行转换，需要编写reducers纯函数来进行处理。reducers通过当前的状态树与动作进行计算，每次都会返回一个新的状态对象。

### 与Flux的不同之处

Redux受到了Flux架构的启发，但在实现上有一些不同

* Redux并没有 dispatcher。它依赖纯函数来替代事件处理器，也不需要额外的实体来管理它们。Flux尝尝被表述为：(state, action) => state，而纯函数也是实现了这一思想。
* Redux为不可变数据集。在每次Action请求触发以后，Redux都会生成一个新的对象来更新State，而不是在当前状态上进行更改。
* Redux有且只有一个Store对象。它的Store储存了整个应用程序的State。

### Action

在Redux中，Action 是一个纯粹的 JavaScript 对象，用于描述Store 的数据变更信息，它们也是 Store 的信息来源，简单来说，所有数据变化都来源于 Actions 。


在 Action 对象中，必须有一个字段type用于描述操作类型，他们的值为字符串类型，通常我会将所有 Action 的 type 类型存放于同一个文件中，便于维护（小项目可以不必这样做）：

```javascript
// store/mutation-types.js
export const ADD_TODO = 'ADD_TODO'
export const REMOVE_TODO = 'REMOVE_TODO'

// store/actions.js
import * as types from './mutation-types.js'

export function addItem(item) {
  return {
    type: types.ADD_TODO,
    // .. pass item
  }
}
```

Action对象除了type以外，理论上其他的数据结构都可由自己自定义，在这里推荐flux-standard-action这个Flux Action标准，简单来说它规范了基本的Action对象结构信息
```javascript
{
  type: 'ADD_TODO',
  payload: {
    text: 'Do something.'
  }
}

```

### Action Creator
我们将Action Creator与Action进行区分，避免混为一谈。在Redux中，Action Creator是用于创建动作的函数，它会返回一个Action对象:

```javascript
function addTodo(text) {
  return {
    type: 'ADD_TODO',
    payload: {
      text,
    }
  }
}
```

与Flux所不同的是，在Flux 中Action Creator 同时会负责触发 dispatch 操作，而Redux只负责创建Action，实际的派发操作由store.dispatch方法执行：store.dispatch(addTodo('something'))，这使得Action Creator的行为更简单也便于测试


### connect

通常我们不会直接使用store.dispatch方法派发 Action，而是使用connect方法获取dispatch派发器

```javascript
import React, { Component } from 'react'
import { connect } from 'react-redux'
import { querAsyncName } from './actionhome'
@connect(
    (state) => {
        return { homeReducer: state }
    },
    (dispatch) => {
        return { onQuerAsyncName: (params) => dispatch(querAsyncName(params)) }
    }
)
```

### Reducers

对于Action来讲，它们只是描述了发生了什么事情，而应用程序状态的变化，全由Reducers进行操作更改。

在实现Reducer函数之前，首先需要定义应用程序中State的数据结构，它被储存为一个单独的对象中，因此在设计它的时候，尽量从全局思维去考虑，并将其从逻辑上划分为不同的模块，采用最小化、避免嵌套，并将数据与UI状态分别存储。

Reducer是一个纯函数，它会结合先前的state状态与Action对象来生成的新的应用程序状态树：

```javascript
(previousState, action) => newState
```

内部一般通过switch...case语句来处理不同的Action

保持Reducer的纯函数特性非常重要，Reducer需要做到以下几点：


* 不应该直接改变原有的State，而是在原有的State基础上生成一个新的State。
* 调用时不应该产生任何副作用，如API调用、路由跳转等。
* 当传递相同的参数时，每次调用的返回结果应该是一致的，所以也要避免使用Date.now()或Math.random()这样的非纯函数。

### combineReducers
Redux应用程序最常见的State形状是一个普通的Javascript对象，其中包含每个顶级键的特定于域的数据的“切片”，每个“切片”都具有一个相同结构的reducer函数处理该域的数据更新，多个reducer也可同时响应同一个action，在需要的情况独立更新他们的state。

正是因为这种模式很常见，Redux就提供了一个工具方法去实现这样的行为：combineReducers。它只是用于简化编写Redux reducers最常见的示例，并规避一些常见的问题。它还有一个特性，当一个Action产生时，它会执行每一个切片的reducer，为切片提供更新状态的机会。而传统的单一Reducer无法做到这一点，因此在根Reducer下只可能执行一次该函数。

Reducer函数会作为createStore的第一个参数，并且在第一次调用reducer时，state参数为undefined，因此我们也需要有初始化State的方法。举一个示例：

```javascript
const initialState = { count: 0 }

functino reducer(state = initialState, action) {
  switch (action.type) {
    case: 'INCREMENT':
      return { count: state.count + 1 }
    case: 'DECREMENT':
      return { count: state.count - 1 }
    default:
      return state;
  }
}
```

对于常规应用来讲，State中会储存各种各样的状态，从而会造成单一Reducer函数很快变得难以维护：

```javascript
  ...
  case: 'LOADING':
    ...
  case: 'UI_DISPLAY':
    ...
  ...

```

因此我们的核心目标是将函数拆分得尽可能短并满足单一职责原则，这样不仅易于维护，还方便进行扩展，接下来我们来看一个简单的TODO示例：

```javascript
const initialState = {
  visibilityFilter: 'SHOW_ALL',
  todos: []
}

function appReducer(state = initialState, action) {
  switch (action.type) {
    case 'SET_VISIBILITY_FILTER': {
      return Object.assign({}, state, {
        visibilityFilter: action.filter
      })
    }
    case 'ADD_TODO': {
      return Object.assign({}, state, {
        todos: state.todos.concat({
          id: action.id,
          text: action.text,
          completed: false
        })
      })
    }
    default:
      return state
  }
}


```

这个函数内包含了两个独立的逻辑：过滤字段的设置与TODO对象操作逻辑，如果继续扩展下去会使得Reducer函数越来越庞大，因此我们需要将这两个逻辑拆分开进行单独维护：

```javascript
function appReducer(state = initialState, action) {
  return {
    todos: todosReducer(state.todos, action),
    visibilityFilter: visibilityReducer(state.visibilityFilter, action)
  }
}

function todosReducer(todosState = [], action) {
  switch (action.type) {
    case 'ADD_TODO': {
      return Object.assign({}, state, {
        todos: state.todos.concat({
          id: action.id,
          text: action.text,
          completed: false
        })
      })
    }
    default:
      return todosState
  }
}

function visibilityReducer(visibilityState = 'SHOW_ALL', action) {
  switch (action.type) {
    case 'SET_VISIBILITY_FILTER':
      return setVisibilityFilter(visibilityState, action)
    default:
      return visibilityState
  }
}
```


我们将整个Reducer对象拆为两部分，并且他们独自维护自己部分的状态，这样的设计模式使得整个Reducer分散为独立的切片。Redux内置了一个combineReducers工具函数，鼓励我们这样去切分顶层Reducer，它会将所有切片组织成为一个新的Reducer函数：


```javascript
const rootReducer = combineReducers({
  todos: todosReducer,
  visibilityFilter: visibilityReducer
})
```

在 combineReducers 返回的state对象中，每个键名都代表着传入时子Reducer的键名，他们作为子Reducer中 State 的命名空间。

### Store
在Redux应用中只有一个单一的store，通过createStore进行创建。Store对象用于将Actions与Reducers结合在一起，它具有有以下职责：


* 储存应用的State，并允许通过getState()方法访问State。
* 提供dispatch(action)方法将Action派发到Reducer函数，以此来更新State。
* 通过subscribe(listener)监听状态更改。

对于subscribe来讲，每次调用dispatch方法后都会被触发，此时状态树的某一部分可能发生了改变，我们可以在订阅方法的回调函数里使用getState或dispatch方法，但需要谨慎使用。subscribe在调用后还会返回一个函数unsubscribe函数用于取消订阅。


## Redux Middleware

对于中间件的概念相信大家通过其他应用有一定的概念了解，对于Redux来讲，当我们在谈论中间件时，往往指的是从一个Action发起直到它到达Reducer之前的这一段时间里所做的事情，Redux通过Middleware机制提供给三方程序扩展的能力。

为了更好的说明中间件，我先用Redux初始化一个最简实例：


```javascript
const { createStore } = require('redux');

const INCREMENT = 'INCREMENT';
const DECREMENT = 'DECREMENT';

function reducer(state = 0, action) {
  switch (action.type) {
    case INCREMENT:
      return state + 1;
    case DECREMENT:
      throw new Error('decrement error'); 
    default:
      return state;
  }
}

void function main() {
  const store = createStore(reducer);
  store.dispatch({ type: INCREMENT });
  console.log(store.getState()); // 打印 1
}()

```

### Step 1. 手动添加打印日志的中间件

为了深刻的理解Redux中间件，我们一步步去实现具有中间件功能的函数。为了追踪程序的状态变化，可能我们需要实现一个日志打印中间件机制，用于打印Action与执行后的State变化。我们首先通过store对象创建一个logger对象，在dispatch的前后进行日志打印：

```javascript
void (function main() {
  const store = createStore(reducer);
  const logger = loggerMiddleware(store);
  logger({ type: INCREMENT });

  function loggerMiddleware(store) {
    return action => {
      console.log('dispatching', action);
      let result = store.dispatch(action);
      console.log('next state', store.getState());
      return result;
    };
  }
})();

// 程序运行结果
dispatching { type: 'INCREMENT' }
next state 1

```

### Step 2. 再添加一个错误打印的中间件

为了监控应用程序的状态，我们还需要实现一个中间件，当在应用程序dispatch过程中发生错误时，中间件能及时捕获错误并上报（通常可上报至Sentry，但在这里就简单打印错误了）：

```javascript
void (function main() {
  const store = createStore(reducer);
  const crasher = crashMiddleware(store);
  crasher({ type: DECREMENT });

  function crashMiddleware(store) {
    return action => {
      try {
        return dispatch(action);
      } catch (err) {
        console.error('Caught an exception!', err);
      }
    };
  }
})();


```

执行程序后，可在命令行内看到函数正确的捕获DECREMENT中的错误：

```javascript
Caught an exception! ReferenceError: dispatch is not defined
```

### Step 3. 将2个中间件串联在一起

在应用程序中一般都会有多个中间件，而将不同的中间件串联在一起是十分关键的一步操作，若你读过Koa2的源码，你大概了解一种被称之为compose的函数，它将负责处理中间件的级联工作。

在这里，为了理解其原理，我们还是一步一步进行分析。前面两个中间件的核心目标在于将Dispatch方法进行了一层包装，这样来说，我们只需要将dispatch一层层进行包裹，并传入最深层的中间件进行调用，即可满足我们程序的要求：


```javascript
dispatch = store.dispatch

↓↓↓

// 没有中间件的情况
dispatch(action)

↓↓↓

// 当添加上LoggerMiddleware
LoggerDispatch = action => {
  // LoggerMiddleware TODO
  dispatch(action)
  // LoggerMiddleware TODO
}
dispatch(action)

↓↓↓

// 当添加上CrashMiddleware
CrashDispatch = action => {
  // CrashMiddleware TODO
  LoggerDispatch(action)
  // CrashMiddleware TODO
}

```
如果你熟悉使用高阶函数，相信上述思路并不难以理解，那让我们通过修改源代码，尝试一下通过这样的方式，是否能使两个中间件正常工作：

```javascript
void function main() {
  const store = createStore(reducer);
  let dispatch = store.dispatch
  dispatch = loggerMiddleware(store)(dispatch)
  dispatch = crashMiddleware(store)(dispatch)
  dispatch({ type: INCREMENT });
  dispatch({ type: DECREMENT });

  function loggerMiddleware(store) {
    return dispatch => {
      return action => {
        console.log('dispatching', action);
        let result = dispatch(action);
        console.log('next state', store.getState());
        return result;
      };
    };
  }

  function crashMiddleware(store) {
    return dispatch => {
      return action => {
        try {
          return dispatch(action);
        } catch (err) {
          console.error('Caught an exception!', err);
        }
      };
    };
  }
}();

```
此时打印结果为（符合预期）：

```javascript
dispatching { type: 'INCREMENT' }
next state 1
dispatching { type: 'DECREMENT' }
Caught an exception! Error: decrement error
```

当然，我们希望以更优雅的方式生成与调用dispatch，我会期望在创建时，通过传递一个中间件数组，以此来生成Store对象：

```javascript
// 简单实现
function createStoreWithMiddleware(reducer, middlewares) {
  const store = createStore(reducer);
  let dispatch = store.dispatch;
  middlewares.forEach(middleware => {
    dispatch = middleware(store)(dispatch);
  });
  return Object.assign({}, store, { dispatch });
}


void function main() {
  const middlewares = [loggerMiddleware, crashMiddleware];
  const store = createStoreWithMiddleware(reducer, middlewares);
  store.dispatch({ type: INCREMENT });
  store.dispatch({ type: DECREMENT });
  // ...
}()
```

### Step 4. back to Redux
通过Step 1 ~ 3 的探索，我们大概是照瓢画葫实现了Redux的中间件机制，现在让我们来看看Redux本身提供的中间件接口。

在createStore方法中，支持一个enhancer参数，意味着三方扩展，目前支持的扩展仅为通过applyMiddleware方法创建的中间件。

applyMiddleware支持传入多个符合Redux middleware API的Middleware，每个Middleware的形式为：({ dispatch, getState }) => next => action。让我们稍作修改，通过applyMiddleware与createStore接口实现（只需要修改创建store的步骤）：

```javascript
  // ...
  const middlewares = [loggerMiddleware, crashMiddleware];
  const store = createStore(reducer, applyMiddleware(...middlewares));
  // ...

```

通过applyMiddleware方法，将多个 middleware 组合到一起使用，形成 middleware 链。其中，每个 middleware 都不需要关心链中它前后的 middleware 的任何信息。 Middleware最常见的场景是实现异步actions方法，如redux-thunk与redux-saga。


## 异步Action

对于一个标准的Redux应用程序来说，我们只能简单的通过派发Action执行同步更新，为了达到异步派发的能力，官方的标准做法是使用 redux-thunk 中间件。

为了明白什么是 redux-thunk ，先回想一下上文介绍的Middleware API：({ dispatch, getState }) => next => action，借由灵活的中间件机制，它提供给 redux-thunk 延迟派发Action的能力，允许了人们在编写Action Creator时，可以不用马上返回一个Action对象，而是返回一个函数进行异步调度，于是称之为Async Action Creator：

```javascript
// synchronous, Action Creator
function increment() {
	return {
    type: 'INCREMENT'
	}
}

// asynchronous, Async Action Creator
function incrementAsync() {
  return dispatch => {
    setTimeout(() => dispatch({ type: 'INCREMENT' }), 1000)
  }
}

```
而 redux-thunk 源码也不过10行左右：

```javascript
  
function createThunkMiddleware(extraArgument) {
  return ({ dispatch, getState }) => next => action => {
    if (typeof action === 'function') {
      return action(dispatch, getState, extraArgument);
    }

    return next(action);
  };
}

const thunk = createThunkMiddleware();
thunk.withExtraArgument = createThunkMiddleware;

export default thunk;


```

通过dispatch(ActionCreator())进行调用时，函数会判断参数的类型：
* 若为对象，走正常的触发流程，直接派发Action。
* 若为函数，则将其视为Async Action Creator，将dispatch方法与getState方法作为参数注入，如果全局注册了withExtraArgument的话也会作为第三个参数进行传入。




