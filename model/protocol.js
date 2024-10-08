import { createRequire } from 'module';
const require = createRequire(import.meta.url);

export function getPlatformInfo(e) {
  const { apk, version } = Bot[e.self_id];
  return version ? `${version.name}` : `ICQQ`;
}

export function getSignApiAddr() {
  return Bot.sig?.sign_api_addr || "未配置签名地址";
}
