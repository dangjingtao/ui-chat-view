import message from "@/lib/message";

const defaultHandleError = (error) => {
  if (error instanceof Error) {
    message.error(error.message);
  } else {
    message.error(String(error));
  }
};

// 尝试捕获方法中的错误
const wrapWithTryCatch = (service: any): any => {
  const wrappedService: any = {};

  for (const key in service) {
    if (typeof service[key] === "function" && key !== "handleError") {
      wrappedService[key] = async function (...args: any[]) {
        try {
          return await service[key](...args);
        } catch (error) {
          console.error(`Error in ${key}:`, error);
          if (service.handleError) {
            service.handleError(error);
          } else {
            defaultHandleError(error);
          }
        }
      };
    } else {
      wrappedService[key] = service[key];
    }
  }

  return wrappedService;
};

export default wrapWithTryCatch;
