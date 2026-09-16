---
title: API 金鑰
description: API 金鑰認證。安全最佳實踐、金鑰輪換、管理。
---

# API 金鑰

**對象：** 開發者、管理員

API 金鑰用於對 RevoSurge API 的請求進行認證。

## 本文內容
- 甚麼是 API 金鑰
- 如何保護
- 金鑰輪換基礎

## 甚麼是 API 金鑰
API 金鑰識別您的帳戶並授權 API 操作(如發送 S2S 事件)。

## 如何取得 API 金鑰
你在 **DataPulse** 中自行產生金鑰——毋須向 RevoSurge 代表申請：

1. 開啟 **DataPulse**([datapulse.revosurge.com](https://datapulse.revosurge.com),或從 AdWave 點擊 **Open DataPulse**)並選擇你的**產品**。
2. 在 **Setup Wizard** 中,前往 **Step 3 · S2S Postback**。
3. 點擊 **Generate API Key** 並把金鑰複製到安全的地方——你會用它來認證 S2S 事件請求。

**S2S Status** 在收到首個伺服器事件之前會顯示 **Pending**;這屬正常,並會在事件開始流入後自動清除。

![DataPulse → Setup Wizard → Step 3 · S2S Postback → Generate API Key](/img/onboarding/datapulse-generate-api-key.png)

## 保護金鑰
- 不要將金鑰提交到原始碼管理
- 將金鑰儲存在環境變數或金鑰管理器中
- 僅向所需工程師/服務開放存取

## 輪換(建議)
- 定期輪換金鑰(如每季)
- 如懷疑洩露，立即輪換
