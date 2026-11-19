---
title: 事件可用性與驗證
description: 檢視產品市場類別、共享事件目錄和驗證規則。
---

<a id="事件目錄與驗證"></a>
<a id="event-catalog-validation"></a>

# 事件可用性與驗證

S2S v3 與 Partner Postback v2 使用產品當前生效的事件目錄，包括事件名、欄位路徑、類型、必填級別和允許值。請求中使用相應的傳輸版本，事件目錄版本由服務端選擇。

<a id="為什麼要型別化"></a>
<a id="為何要型別化"></a>

## 為什麼定義欄位類型？ {#why-typed}

註冊事件名和欄位類型讓兩種接入方式表達相同的業務動作。服務先解析請求格式，再按產品契約驗證。回應和資料發佈規則見各 API 參考。

<a id="標準與行業預設"></a>
<a id="standard-與行業預設集"></a>
<a id="standard-and-industry-presets"></a>

## 標準與行業事件 {#standard-and-industry-events}

| 事件集合 | 可用條件 | 參考 |
| --- | --- | --- |
| 標準 | 對所有產品啓用 | [標準事件](/hk/tracking/events/events-standard) |
| iGaming | 由產品的 iGaming 市場類別啓用 | [iGaming 事件](/hk/tracking/events/events-igaming) |
| Crypto | 由產品的 Crypto 市場類別啓用。界面範例為 Crypto & Trading | [Crypto 事件](/hk/tracking/events/events-crypto) |
| 自定義 | 向客戶經理確認特定產品的可用事件和欄位 | 見下文 |

核對產品市場類別及有效事件目錄，並單獨確認報表和出價策略支持哪些事件。

<a id="欄位要求級別"></a>
<a id="欄位要求等級"></a>

## 欄位要求級別 {#field-requirement-levels}

| 級別 | 要求 |
| --- | --- |
| 必填 | 必須提供，並滿足類型和值域限制 |
| 建議 | 建議提供以改善資料質量或歸因。提供時須滿足約束 |
| 選填 | 可以省略。提供時須滿足適用約束 |

條件必填欄位在各事件定義中說明。按業務實際值發送。

<a id="驗證哪些內容"></a>
<a id="哪些內容會被驗證"></a>

## 驗證內容 {#what-gets-validated}

核對事件名、身份、發生時間、必填欄位、類型和枚舉。見[通用欄位](/hk/tracking/events/common-fields)。以下參考分別說明各方式的編碼、模式和回應。

- [S2S API](/hk/tracking/s2s/v3/server-events-api)說明 JSON、批量、回應及測試模式的請求頭。
- [Postback v2 API](/hk/tracking/postback/v2-api#v2-api)說明點分路徑、URL 編碼、驗證結果及查詢參數。
- 參加正式轉化驗證時，按對應接入指南檢查真實業務流程。Dry run 成功只證明請求通過驗證。

<a id="目錄更新"></a>

## 目錄更新 {#catalog-updates}

事件定義和可用性隨產品有效目錄更新。驗收時核對當前定義。目錄衝突或持續不可用時，按對應接口的規則重試，並聯繫 RevoSurge 排查。

<a id="自定義事件"></a>
<a id="自訂事件"></a>

## 自定義事件 {#custom-events}

與客戶經理確認業務動作、觸發時機、來源欄位、類型和要求級別。確認產品支持該事件及其精確欄位路徑後再發送。Postback v2 只接收目錄允許的查詢參數路徑。

**下一步**　[選擇事件](/hk/tracking/events/choose-events)，然後檢視 [S2S 設定](/hk/tracking/s2s/setup-s2s)或 [Postback 設定](/hk/tracking/postback/setup-postback)。
