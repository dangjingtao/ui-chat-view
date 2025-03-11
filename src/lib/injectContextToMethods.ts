// 注入页面状态到方法中
const injectContextToMethods = (
  service: { [key: string]: () => void },
  pageStateContext: any,
  excludesMethodNames: string[] = [],
) => {
  const ret: { [key: string]: () => void | Promise<void> } = {};
  Object.entries(service).forEach(([methodName, method]) => {
    if (excludesMethodNames.includes(methodName)) {
      ret[methodName] = method;
      return;
    } else {
      ret[methodName] = (...args) =>
        (method as Function)(pageStateContext, ...args);
    }
  });
  return ret;
};

export default injectContextToMethods;
