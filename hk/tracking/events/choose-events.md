---
title: 選擇事件
description: 選擇通過 S2S v3 或 Partner Postback v2 衡量的業務事件。
---

# 選擇事件

先確定要衡量哪些業務動作，再根據來源系統和可用資料選擇傳輸方式。S2S v3 和 Partner Postback v2 使用同一個產品事件目錄。

## 1. 確定廣告系列目標 {#_1-start-with-your-campaign-goal}

| 目標 | 事件 | 來源所需資料 |
| --- | --- | --- |
| 新帳戶 | `register` | 註冊成功及穩定的玩家身份 |
| 充值及首充 | `deposit` | 每筆成功充值的交易 ID、金額和幣別 |
| 已結算的投注 | `bet` | 已結算金額、結果及必填的遊戲欄位 |
| 獎金入賬 | `bonus_claimed` | 實際入賬的獎金實例、金額和適用條款 |
| 拒絕提款 | `withdraw_rejected` | 已正式拒絕的申請 ID、金額和原因 |
| 加密貨幣交易 | `trade` | 成交訂單，以及分別定義的交易金額和手續費 |

每筆成功充值（含重復充值）均發送 `deposit`，首充由 RevoSurge 判定。另在 **Campaign conversion events** 中確認所選出價策略支持的轉化。目錄接受事件只表示請求滿足接收條件。

## 2. 確認產品類別和事件定義 {#_2-check-the-product-category-and-contract}

先檢查[事件可用性](/hk/tracking/events/catalog-validation)，再檢視對應的[標準](/hk/tracking/events/events-standard)、[iGaming](/hk/tracking/events/events-igaming)或 [Crypto](/hk/tracking/events/events-crypto) 定義。不同類別的同名事件（如 `deposit`）可能有不同要求，以當前產品的有效定義為準。

## 3. 確認欄位來源 {#_3-confirm-who-supplies-every-field}

為每個必填欄位確認業務來源和負責人。核對穩定的玩家身份、原始 RevoSurge 點擊 ID、發生時間、交易 ID 和適用的金額與幣別。平台宏缺少資料時，先補齊業務來源。

## 4. 設定並測試 {#_4-configure-the-method-and-test}

自有後端請按 [S2S 設定指南](/hk/tracking/s2s/setup-s2s)設定，聯盟平台回調請按 [Partner Postback 設定指南](/hk/tracking/postback/setup-postback)設定。依次驗證請求、檢查已保存的測試事件，再完成約定的真實業務流程。分別核對事件接收、歸因和廣告系列轉化驗證。

Web 追蹤器與 AppsFlyer 各有自己的 SDK 方法或映射規則，接入時請按各自指南使用相應欄位。
