import { shallowRef } from "vue";

export default function useDynamicComponent(props) {
  const onError = props?.onError;
  const componentCache = new WeakMap(); // 使用 WeakMap 缓存组件
  const currentComponent = shallowRef(null); // 使用 shallowRef 存储当前组件
  const keyMap = {}; // 全局对象作为键的基础

  // 动态加载组件
  const loadComponent = async (name) => {
    if (!keyMap[name]) {
      keyMap[name] = {}; // 确保每个组件名称对应唯一的键
    }
    const key = keyMap[name];

    if (componentCache.has(key)) {
      // 如果组件已加载过，直接从缓存中获取
      currentComponent.value = componentCache.get(key);
      return;
    }

    try {
      // 动态导入组件
      const component = await import(`./../${name}.vue`);
      componentCache.set(key, component.default); // 缓存组件
      currentComponent.value = component.default;
    } catch (err) {
      console.error(`加载组件 ${name} 失败:`, err);
      onError && onError({ error: err, name });
      // 可以添加用户反馈或重试机制
    }
  };

  return {
    currentComponent,
    loadComponent,
  };
}
