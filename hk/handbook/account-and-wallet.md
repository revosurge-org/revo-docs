---
title: 設定帳戶與錢包
description: 建立你的 RevoSurge 帳戶，並在上線前透過客戶經理為錢包充值。
---

# 設定帳戶與錢包

**對象：** 剛加入的自助廣告主，以及負責管理預算的人。

上線前，你需要一個帳戶和一個已充值的**錢包**，廣告系列的花費都從錢包扣除。

<nav class="article-toc" aria-label="本文內容">
<p class="article-toc-title">本文內容</p>

- [1. 建立帳戶](#_1-create-your-account)
- [2. 為錢包充值](#_2-fund-your-wallet)
- [3. 保持餘額充足](#_3-keep-your-balance-topped-up)

</nav>

## 1. 建立帳戶 {#_1-create-your-account}

前往 [adwave.revosurge.com](https://adwave.revosurge.com)，點擊 **Sign up**。註冊共分四步：

![AdWave 註冊：Email、Code、Password、Detail](/img/handbook/signup-steps.jpg)

1. **Email：** 輸入你的工作電郵，剔選 **Read and agreed RevoSurge T&C & Privacy Policy**，然後點擊 **Next**。
2. **Code：** 輸入系統發到你電郵的一次性驗證碼（OTP）。
3. **Password：** 設定密碼。
4. **Detail：** 填寫你的資料。<!-- TODO: list the Detail fields (capture after a test sign-up) -->

完成後會進入 AdWave 首頁，頁面頂部就是引導清單。

::: info 一個電郵，一個帳戶
每個帳戶只有**一個登入電郵**。雖然帳戶選單中有 **Manage Members**，但暫時未能新增團隊成員，所以註冊前請先決定由誰持有登入資料。如果會有多人投放，請用共用的工作電郵（例如 `marketing@yourbrand.com`），不要用個人電郵。
:::

**完成標誌：** 你能登入並看到引導清單。

## 2. 為錢包充值 {#_2-fund-your-wallet}

充值由你的**客戶經理**處理，平台暫時未支援自助付款。

1. 計算測試預算：**日預算 × 測試天數**。日預算怎樣定，參見[上線準備表](./#_2-4-ad-format-bid-and-budget)。
2. 聯絡客戶經理，提供你的帳戶電郵和想充值的金額。
3. 按客戶經理發來的付款指示操作。
4. 款項到帳後查看餘額。餘額顯示在 **Campaign** 頁面右上角：

![Campaign 頁面右上角的 Balance 與 Frozen Budget](/img/handbook/wallet-balance.png)

想查看詳細資料，可點擊左下角的**帳戶圖示**，再點擊 **Billing**。選單中亦會顯示你的 **Remaining Balance**（剩餘餘額）。

![帳戶選單：Account Setting、Billing（連同 Remaining Balance）、Manage Products、Manage Members、Language、Logout](/img/handbook/account-menu.png)

![Account Setting — Billing：Current Balance、Campaign Budget (Frozen)、Total Funds 和 Transaction History](/img/handbook/billing.png)

| 欄位 | 意思 |
| --- | --- |
| **Current Balance** | 可供使用的資金 |
| **Campaign Budget (Frozen)** | 為已排期和投放中的廣告系列凍結的資金。廣告系列結束或預算釋放後會解凍 |
| **Total Funds** | Current Balance + Campaign Budget (Frozen) |
| **Transaction History** | 列出每一筆充值（**Deposit**，例如客戶經理操作的 *Manual Credit*）和每一筆扣款（**Deduct**，*AdWave campaign spend*）。點擊下載圖示即可匯出 |

<!-- TODO (Product): the 2026-09-28 screenshots disagree. The Campaign page shows $1,280.00 balance / $400 frozen, but Billing shows Frozen "--" and Total Funds $1,280.00. Confirm the Total Funds formula and when frozen funds appear on Billing. -->

餘額低於 5,000 時，AdWave 會顯示提示。<!-- TODO (Product): the alert says 'Click on "+" to top up', but deposits go through the Account Manager only. Confirm what "+" does, and the currency of the 5,000 threshold. -->

::: warning 充值不設退款
只需充值第一個測試週期打算花費的金額。錢包由 AdWave 和 DataPulse 共用。<!-- TODO: confirm refund policy is still current -->
:::

**完成標誌：** 餘額顯示款項已到帳。

## 3. 保持餘額充足 {#_3-keep-your-balance-topped-up}

餘額一旦用完，廣告系列就會停止投放。如果廣告系列在測試中途停止，重新開始後就要重新學習。

- ✅ 查看廣告系列時，順便看一眼餘額
- ✅ 餘額只夠約 **3 天**花費時，就請客戶經理充值 <!-- TODO (Ops): confirm settlement time and recommended buffer -->

**下一步：** [接入追蹤](/hk/tracking/overview)
