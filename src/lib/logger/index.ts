import log from "loglevel";
import prefix from "loglevel-plugin-prefix";
import localforage from "localforage";

// 配置loglevel插件
prefix.reg(log);
log.enableAll();
prefix.apply(log, {
  format(level, name, timestamp) {
    return `${timestamp} [${level}] ${name}:`;
  },
});

// 配置localForage
localforage.config({
  name: "logDB",
  storeName: "logs",
});

// 自定义日志方法，将日志存储到localForage
async function logToLocalForage(level: string, message: string) {
  const logEntry = { level, message, timestamp: new Date().toISOString() };
  await localforage.setItem(`log_${Date.now()}`, logEntry);
}

// 重写loglevel的日志方法
const originalFactory = log.methodFactory;
log.methodFactory = function (methodName, logLevel, loggerName) {
  const rawMethod = originalFactory(methodName, logLevel, loggerName);
  return function (...args) {
    rawMethod(...args);
    logToLocalForage(methodName, args.join(" "));
  };
};
log.setLevel(log.getLevel()); // 重新应用方法工厂

export default log;
