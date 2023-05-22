---
title: Vite按需引入自定义组件unplugin-vue-components
date: '2022-12-12'
tags:
  - vite
---

> `unplugin-vue-components`插件可以在Vue文件中自动引入组件（包括项目自身的组件和各种组件库中的组件）；作者是Vite生态圈大名鼎鼎的[Anthony Fu](https://github.com/antfu)

使用此插件后，不需要手动编写`import { Button } from 'ant-design-vue'`这样的代码了，插件会自动识别template中使用的自定义组件并自动注册。

## 安装 unplugin-vue-components
```javascript
pnpm install unplugin-vue-components
```

## 在vite中使用

```javascript
import Components from 'unplugin-vue-components/vite' // 按需加载自定义组件
import { ElementPlusResolver, AntDesignVueResolver} from 'unplugin-vue-components/resolvers'

export default defineConfig {
  // ...
  plugins: [
    // 按需引入
    Components({
      dts: true,
      dirs: ['src/components'], // 按需加载的文件夹
      resolvers: [
          ElementPlusResolver(),
          AntDesignVueResolver({
              // 参数配置可参考：https://github.com/antfu/unplugin-vue-components/blob/main/src/core/resolvers/antdv.ts
              // 自动引入 ant-design/icons-vue中的图标，需要安装@ant-design/icons-vue
              resolveIcons: true,
            })
     ] // ElementPlus按需加载
    })
  ],
  // ...
}
```

## tsconfig.json中配置
配置完成后，运行代码，会在项目根目录自动生成一个components.d.ts文件;
需要在tsconfig.json的includes配置中加入此文件
```json
// tsconifg.json
{
    "include": [
        "src/**/*.ts",
        "src/**/*.d.ts",
        "src/**/*.tsx",
        "src/**/*.vue",
        "./auto-imports.d.ts",
        "./components.d.ts"
      ]
}
```

配置完成后，antd组件和项目中src/components目录(可以通过dirs配置项修改目录)下的组件都可以直接使用，无需写import语句了.


## 打包结果对比

从这里可以看出引入插件后vendor.js文件由原来的959KB变为371KB,css文件也有明显的减小,效果非常明显;