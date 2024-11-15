import { createRequire } from "module";
const require = createRequire(import.meta.url);

async function getSignInfo(e) {
  const { apk, version, sig } = Bot[e.self_id];
  const platformInfo = version ? `${version.name}` : `ICQQ`;
  const signApiAddr = sig?.sign_api_addr || "未配置签名地址";

  return { platformInfo, signApiAddr };
}

export default getSignInfo;
