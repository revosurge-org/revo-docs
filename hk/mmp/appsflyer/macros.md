---
title: 點擊參數與宏
sidebar_label: 宏參數
description: RevoSurge 發送的 AppsFlyer 點擊參考 — 每個參數、其背後的 RevoSurge 宏，以及它落在 AppsFlyer 的哪個報表維度上。
---

# 點擊參數與宏

**對象：** 追蹤／BI 工程師、需要把 AppsFlyer 與 RevoSurge 對帳的 UA 經理

這是一頁參考文件，不是操作路徑。AppsFlyer 點擊由 RevoSurge 替你建構 — 開啟它只需兩個設定，見[點擊轉發](/hk/mmp/appsflyer/click-forwarding)。當你需要知道**我們發送了什麼**、以便讀懂 AppsFlyer 報表並與 RevoSurge 看板對帳時，來看本頁。

> [!NOTE]
> 本頁沒有任何需要你設定的內容。下面每一個值都由 RevoSurge 在點擊發生時填入。

## 點擊 URL

```
https://app.appsflyer.com/{app_id}
  ?pid={pid}
  &af_siteid={site_id}
  &c={campaign}
  &af_c_id={cid}
  &af_ad_id={cid}
  &af_adset={group}
  &af_adset_id={gid}
```

這就是全部 — RevoSurge 在點擊上不會發送其他參數。

`{app_id}` 是**你的** AppsFlyer App ID，取自你到達頁 web tracker 上填寫的 `androidAppsFlyerId` 或 `iOSAppsFlyerId`。Android 與 iOS 的點擊除該值外完全相同，因此 App ID 填錯會把真實點擊送到錯誤的應用 — 或者哪個應用都到不了。

## 各參數說明

| AppsFlyer 參數 | RevoSurge 宏 | 承載內容 | 在 AppsFlyer 中顯示為 |
|---|---|---|---|
| `{app_id}`（在路徑中） | — | 你的 AppsFlyer App ID，來自 web tracker 設定 | 該點擊歸因到的應用 |
| `pid` | —（固定值） | RevoSurge，作為媒體渠道 | **Media Source** |
| `af_siteid` | `{site_id}` | 該點擊來自的 RevoSurge 流量源 | **Site ID** |
| `c` | `{campaign}` | 你的 RevoSurge 廣告系列**名稱** | **Campaign** |
| `af_c_id` | `{cid}` | 你的 RevoSurge 廣告系列 **ID** | **Campaign ID** |
| `af_ad_id` | `{cid}` | 你的 RevoSurge 廣告系列 **ID** — 見下方說明 | **Ad ID** |
| `af_adset` | `{group}` | 你的 RevoSurge 廣告組**名稱** | **Adset** |
| `af_adset_id` | `{gid}` | 你的 RevoSurge 廣告組 **ID** | **Adset ID** |

`pid` 的值對所有 RevoSurge 廣告主都是固定的，不需要你設定。請向你的 RevoSurge 對接人索取準確的字串 — 你需要用它把 AppsFlyer 報表篩選到 RevoSurge 流量。

> [!IMPORTANT]
> **`af_ad_id` 承載的是廣告系列 ID，不是廣告或素材 ID** — 與 `af_c_id` 的值相同。因此對 RevoSurge 流量而言，AppsFlyer 的 **Ad ID** 維度與 **Campaign ID** 重複，AppsFlyer 側無法按廣告或素材層級拆分。素材層級的成效請使用 RevoSurge 報表。

## 範例

一條名為 `IN_Register_Display_20260126` 的廣告系列（ID `48213`），廣告組名為 `IN_Android_Tier1`（組 ID `9074`），點擊來自流量源 `pub_44120`：

```
https://app.appsflyer.com/{app_id}?pid={pid}&af_siteid=pub_44120&c=IN_Register_Display_20260126&af_c_id=48213&af_ad_id=48213&af_adset=IN_Android_Tier1&af_adset_id=9074
```

請把對應平台的 App ID、以及客戶經理給你的 `pid` 替換進去。注意 `af_c_id` 與 `af_ad_id` 都是 `48213`。

## 只有點擊

RevoSurge 不向 AppsFlyer 發送展示。不存在展示 URL，不會向 `impression.appsflyer.com` 發送任何內容，AppsFlyer 中 RevoSurge 的歸因是基於點擊的。

如果你在核對整合，歸因給 RevoSurge 的瀏覽歸因安裝應當為**零**。這是預期結果 — 見[瀏覽歸因相關設定的說明](/hk/mmp/appsflyer/overview#必要設定一覽)。

## AppsFlyer 與 RevoSurge 對帳

從 AppsFlyer 報表中把 RevoSurge 流量取出來：

1. 把 **Media Source** 篩選為 RevoSurge 的 `pid`。
2. 按 **Campaign ID** 拆分以對應 RevoSurge 廣告系列，按 **Adset ID** 對應廣告組。
3. **用 ID 關聯，不要用名稱。**

> [!TIP]
> 名稱是按點擊發生那一刻它在 RevoSurge 中的樣子傳出去的。改了廣告系列或廣告組的名字，AppsFlyer 在後續點擊上收到新名字，歷史數據列裡仍是舊名字 — 於是用 `Campaign` 或 `Adset` 關聯會靜默地把一條廣告系列拆成兩條。`af_c_id` 與 `af_adset_id` 在改名後保持不變，請用它們。

有兩個數無論設定多乾淨都不會完全對上：

- **點擊數。** RevoSurge 在點擊發生時計數。AppsFlyer 只有在你的到達頁載入、web tracker 觸發之後才知道這次點擊，因此中間損失的部分 — 載入前跳出、腳本被攔截、頁面載入中止 — 會出現在 RevoSurge 而不出現在 AppsFlyer。
- **安裝數。** RevoSurge 只能看到 AppsFlyer postback 發來的部分，且遵循 AppsFlyer 的歸因規則與回溯窗口。歸因以 AppsFlyer 為準；投放以 RevoSurge 為準。

## 下一步

- 還沒開啟點擊轉發？見[點擊轉發](/hk/mmp/appsflyer/click-forwarding)。
- Postback 還沒設定？見[設定 postback](/hk/mmp/appsflyer/postbacks)。
