# 选择接入方式

根据网站是否已有 Google Ad Manager（GAM），以及由谁发起竞价、渲染广告，选择对应的接入指南。

## 接入方式总览

- [网站直接安装 AdFlow JS Tag](./adflow-sdk) · 可直接修改网页时，在页面安装 AdFlow 提供的代码。
- [自有 GAM + Prebid.js](./gam-prebid) · 网站已用 Prebid.js 竞价时，将竞价结果交给 GAM。
- [自有 GAM + AdFlow JS Tag（无 Prebid.js）](./gam-adflow-sdk) · 通过 GAM 创意调用 AdFlow JS Tag。
- [网站通过 Prebid.js 接入 AdFlow S2S](./s2s-integration) · 在现有 Prebid.js 初始化流程中配置 AdFlow 服务端竞价。
- [3. 验证接入与上线](./verify-and-launch) · 完成配置后，在实际页面核对请求、展示和报表。
- [全部接入方式（含 Telegram 小程序与 App SDK）](./integration-guide) · 查找 Telegram 小程序和原生 App 的 SDK 指南。
