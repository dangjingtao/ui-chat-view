declare const __APP_BASE_DOMAIN__: string;
export const BASE_DOMAIN = __APP_BASE_DOMAIN__;
console.error("BASE_DOMAIN", BASE_DOMAIN);

export const BASE_URL = `${BASE_DOMAIN}/api/`;
export const PROXY_WEBSITE_URL = `${BASE_DOMAIN}/proxy/website`;
