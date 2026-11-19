---
title: AppsFlyer 參數與報表
description: 使用媒體來源、廣告系列、廣告組合和事件回傳資料對齊 AppsFlyer 與 RevoSurge 報表。
---

# AppsFlyer 參數與報表

RevoSurge 會自動提供下列點擊參數，廣告主可用這些參數對照兩邊報表。

## 篩選正確流量 {#identify-the-right-traffic}

向客戶經理確認 RevoSurge **PID**，並在 AppsFlyer 按該 PID 篩選。對照同一應用、平台、日期範圍和時區。名稱可能更改，請使用廣告系列和廣告組合 ID 匹配。

## 點擊參數 {#click-parameters}

| AppsFlyer 欄位 | RevoSurge 值 | 報表用途 |
| --- | --- | --- |
| URL 路徑中的 App ID | 追蹤器的平台 App ID | 篩選應用 |
| `pid` | RevoSurge 媒體來源 | 篩選已確認的 PID |
| `af_siteid` | 流量供應來源 ID | 比較供應來源 |
| `c` | 廣告系列名稱 | 顯示名稱 |
| `af_c_id` | 廣告系列 ID | 匹配廣告系列 |
| `af_ad_id` | 當前映射中的廣告系列 ID | 素材分析請用 RevoSurge 報表 |
| `af_adset` | 廣告組合名稱 | 顯示名稱 |
| `af_adset_id` | 廣告組合 ID | 匹配廣告組合 |

`af_ad_id` 和 `af_c_id` 當前使用相同的廣告系列值。依賴素材級歸因的團隊請向客戶經理確認適用規則。

## 數量出現差異的原因 {#why-counts-can-differ}

RevoSurge 在頁面加載前記錄點擊。只有追蹤邏輯執行後，AppsFlyer 才會收到轉發的點擊。加載中斷或追蹤受阻都可能導致數量不同。

- **歸因回溯窗口**決定安裝前哪些點擊或展示可用于歸因。
- **應用內事件回傳窗口**規定安裝後多久仍可回傳事件。窗口結束後，AppsFlyer 可能仍會記錄和歸因事件。參見 [AppsFlyer 回傳窗口說明](https://support.appsflyer.com/hc/en-us/articles/208439256-In-app-event-postback-configuration)。
- **發送範圍**決定哪些事件會轉發。**This partner only** 只轉發歸因給該合作夥伴的事件。比較時使用相同的事件範圍。

## 排查報表差異 {#investigate-a-discrepancy}

1. 對齊應用、平台、已確認的 PID、時間範圍及時區。
2. 匹配廣告系列和廣告組合 ID。
3. 對齊事件定義、歸因回溯窗口、回傳窗口及發送範圍。
4. 上線後用 UTC 時間核對一條真實安裝或事件。
5. 仍有異常時，按[上線後驗證和排查流程](/hk/mmp/appsflyer/setup-appsflyer#_4-verify-after-campaign-launch)檢查。

RevoSurge 在此流程中只轉發點擊，報表應按點擊歸因口徑核對。另見[完整點擊參數和宏](/hk/mmp/appsflyer/macros)。
