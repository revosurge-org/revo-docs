<script setup lang="ts">
import { computed } from 'vue'

type Lang = 'en' | 'cn' | 'hk'

const props = withDefaults(defineProps<{ lang?: Lang }>(), { lang: 'en' })

type Dict = Record<string, string>

const UI: Record<Lang, Dict> = {
  en: {
    animated: 'Animated preview',
    animatedGif: 'Animated GIF preview',
    nativeStatic: 'Native · Static',

    // Pop
    popTitle: 'Pop',
    popSub: 'Popunder / Popup · Landing page',
    popChipFormat: 'Format: Landing page URL',
    popChipUrl: 'Per offer 1 URL',
    popChipMulti: 'Multi-language adaptive (EN / ZH / MY)',
    popChipAnim: 'Recommend animated visual',
    popNote:
      'Pop renders as a landing page — just provide the URL. Prepare 2 key visuals per offer (live dealer / model, game screen) and test them separately.',

    // Push
    pushTitle: 'Push',
    pushSub: 'Push Notification',
    pushChipLogo: 'Brand logo: 192×192 · JPG/PNG · ≤200KB',
    pushChipImg: 'Image: 360×240 · JPG/PNG · ≤720KB',
    pushChipTitle: 'Title ≤30 chars',
    pushChipDesc: 'Description ≤40 chars',
    pushLegend: 'Title & description within limits · Emojis don’t count',

    // Display
    displayTitle: 'Display',
    displaySub: 'Display Banner',
    dispChipFormat: 'Format: GIF / JPG / PNG',
    dispChipSize: 'Size: ≤500KB',
    dispChipDims: 'Dimensions: 300×250 · 300×100 · 320×50',
    dispChipAnim: 'Recommend animated GIF',
    displayNote:
      'Each offer ships in all three sizes — 300×250, 300×100, 320×50; animated GIF recommended. Re-lay-out small sizes rather than scaling down.',

    // Native
    nativeTitle: 'Native',
    nativeSub: 'Native · Static',
    natChipFormat: 'Format: JPG / PNG (static)',
    natChipSize: 'Size: ≤500KB',
    natChipDims: 'Dimensions: 300×250',
    natChipStyle: 'Style: Blends into content (image + title + description)',

    // Shared offer / visual copy
    offerA: 'Offer A · FTD 100% Bonus',
    offerB: 'Offer B · Exclusive Slots 2% Rebate',
    kvDealer: 'Live dealer / model',
    kvGame: 'Game screen',
    ftdBonus: 'FTD 100% Bonus',
    ftdSub: 'FTD 100% Offer · New members only',
    exclSlots: 'Exclusive Slots · 2% Rebate',
    registerClaim: 'Register & Claim',
    registerPlay: 'Register & Play',
    disc: '18+ | Play responsibly | T&Cs apply',

    // Pop offer tags
    popTag1: '1 · Pop · Offer A · FTD 100% Bonus',
    popTag2: '2 · Pop · Offer A · FTD 100% Bonus',
    popTag3: '3 · Pop · Offer B · Exclusive Slots 2% Rebate',
    popTag4: '4 · Pop · Offer B · Exclusive Slots 2% Rebate',
    kv1: 'Key visual 1: Live dealer / model',
    kv2: 'Key visual 2: Game screen',

    // Push angles
    pushAngle1: 'Angle 1 · Urgency (limited-time) · FTD bonus countdown',
    pushAngle2: 'Angle 2 · Big win (social proof) · Exclusive slots jackpot',
    pushT1: '⏰ FTD 100% Bonus — only 2 hours left!',
    pushD1: 'Log in to claim — gone after tonight!',
    pushT2: '🔥 Exclusive slot just hit RM 8,888!',
    pushD2: '30-min countdown — try your luck now!',
    pushBalance: 'Balance',
    pushWon: 'You won',
    pushWonAmt: '100% FTD Bonus',
    pushClaim: 'CLAIM',
    pushBigWin: 'BIG WIN',
    pushRebate: 'Rebate',
    pushExclLabel: 'LUCKY88 · Exclusive slot',

    // Display copy
    dispOfferA: 'Offer A · FTD 100% Bonus (same visual, 3 sizes)',
    dispOfferB: 'Offer B · Exclusive Slots 2% Rebate (same visual, 3 sizes)',
    dispFtdSub: 'FTD Bonus',
    dispClaim: 'Claim Now',
    dispClaimShort: 'Claim',
    dispPlay: 'Play Now',
    dispPlayShort: 'Play',
    dispDouble: 'Double bonus ×2 · New members only',
    dispDaily: 'Daily rebate, more play more rewards',
    rebate2: '2% Rebate',
    footTcs: '18+ | T&Cs apply',
    ribbonValue: 'VALUE',
    ribbonExcl: 'EXCL.',

    // Native copy
    natOfferA: 'Offer A · FTD 100% Bonus',
    natOfferB: 'Offer B · Exclusive Slots 2% Rebate',
    natBadgeLimited: 'LIMITED',
    natBadgeExcl: 'EXCL.',
    natDeposit2x: 'Deposit ×2',
    natSponsored: 'Sponsored',
    natTitleA: '2026’s most popular welcome offer: double your deposit',
    natTitleB: 'The exclusive slot regulars love — daily rebate',
    natCtaA: 'Claim Now →',
    natCtaB: 'Play Now →',
    natRebateLabel: 'Exclusive slot rebate',
  },
  cn: {
    animated: '动态示意',
    animatedGif: '动态 GIF 示意',
    nativeStatic: 'Native · 静态',

    popTitle: 'Pop 弹出式',
    popSub: 'Popunder / Popup · 落地页',
    popChipFormat: '格式：落地页网址（URL）',
    popChipUrl: '每个 offer 1 个 URL',
    popChipMulti: '多语自适应（EN／ZH／MY）',
    popChipAnim: '建议动态视觉',
    popNote:
      'Pop 呈现为落地页，只需提供 URL。每个促销准备 2 个主视觉（真人荷官／美女、游戏画面）分开测试。',

    pushTitle: 'Push 推播',
    pushSub: 'Push Notification',
    pushChipLogo: '品牌 Logo：192×192 · JPG/PNG · ≤200KB',
    pushChipImg: '图片：360×240 · JPG/PNG · ≤720KB',
    pushChipTitle: '标题 ≤30 字',
    pushChipDesc: '描述 ≤40 字',
    pushLegend: '标题与描述均在上限内 · 表情符号不计入',

    displayTitle: 'Display 横幅',
    displaySub: 'Display Banner',
    dispChipFormat: '格式：GIF / JPG / PNG',
    dispChipSize: '大小：≤500KB',
    dispChipDims: '尺寸：300×250 · 300×100 · 320×50',
    dispChipAnim: '建议动态 GIF',
    displayNote:
      '每个促销出 300×250、300×100、320×50 三个尺寸；建议动态 GIF。小尺寸重新排版、非等比缩放。',

    nativeTitle: 'Native 原生',
    nativeSub: 'Native · 静态',
    natChipFormat: '格式：JPG / PNG（静态）',
    natChipSize: '大小：≤500KB',
    natChipDims: '尺寸：300×250',
    natChipStyle: '风格：融入内容（图 + 标题 + 描述）',

    offerA: '促销A · 首存 100% 红利',
    offerB: '促销B · 独家老虎机 2% 返水',
    kvDealer: '真人荷官／美女',
    kvGame: '游戏画面',
    ftdBonus: '首存 100% 红利',
    ftdSub: 'FTD 100% Offer · 新会员专享',
    exclSlots: '独家老虎机 · 返水 2%',
    registerClaim: '立即注册领取',
    registerPlay: '立即注册试玩',
    disc: '18+ | 娱乐无度 | 须遵守条款',

    popTag1: '1 · Pop · 促销A · 首存 100% 红利',
    popTag2: '2 · Pop · 促销A · 首存 100% 红利',
    popTag3: '3 · Pop · 促销B · 独家老虎机 2% 返水',
    popTag4: '4 · Pop · 促销B · 独家老虎机 2% 返水',
    kv1: '主视觉一：真人荷官／美女',
    kv2: '主视觉二：游戏画面',

    pushAngle1: '角度一 · 紧迫感（限时） · 首存红利倒计时',
    pushAngle2: '角度二 · 中奖爆奖（社群证明） · 独家机台大奖',
    pushT1: '⏰ 首存 100% 红利，仅剩 2 小时！',
    pushD1: '登录即可领取，错过今晚不再有！',
    pushT2: '🔥 独家机台开出 RM 8,888 大奖！',
    pushD2: '倒计时 30 分钟，速来试试你的手气！',
    pushBalance: '余额',
    pushWon: '恭喜获得',
    pushWonAmt: '首存红利 100%',
    pushClaim: '领取 CLAIM',
    pushBigWin: 'BIG WIN 大奖',
    pushRebate: '返水',
    pushExclLabel: 'LUCKY88 · 独家机台',

    dispOfferA: '促销A · 首存 100% 红利（同一视觉，出 3 个尺寸）',
    dispOfferB: '促销B · 独家老虎机 2% 返水（同一视觉，出 3 个尺寸）',
    dispFtdSub: '首存红利',
    dispClaim: '立即领取',
    dispClaimShort: '领取',
    dispPlay: '立即试玩',
    dispPlayShort: '试玩',
    dispDouble: '红利翻倍 ×2 · 新会员专享',
    dispDaily: '天天返水、越玩越赚',
    rebate2: '返水 2%',
    footTcs: '18+ | 须遵守条款',
    ribbonValue: '超值',
    ribbonExcl: '独家',

    natOfferA: 'Offer A · 首存 100% 红利',
    natOfferB: 'Offer B · 独家老虎机 2% 返水',
    natBadgeLimited: '限时',
    natBadgeExcl: '独家',
    natDeposit2x: '首存翻倍 ×2',
    natSponsored: '赞助',
    natTitleA: '2026 最受欢迎的迎新礼：首存翻倍',
    natTitleB: '老玩家都在玩的独家机台，天天返水',
    natCtaA: '立即领取 →',
    natCtaB: '立即试玩 →',
    natRebateLabel: '独家机台返水',
  },
  hk: {
    animated: '動態示意',
    animatedGif: '動態 GIF 示意',
    nativeStatic: 'Native · 靜態',

    popTitle: 'Pop 彈出式',
    popSub: 'Popunder / Popup · 落地頁',
    popChipFormat: '格式：落地頁網址（URL）',
    popChipUrl: '每個 offer 1 個 URL',
    popChipMulti: '多語自適應（EN／ZH／MY）',
    popChipAnim: '建議動態視覺',
    popNote:
      'Pop 呈現為落地頁，只需提供 URL。每個促銷準備 2 個主視覺（真人荷官／美女、遊戲畫面）分開測試。',

    pushTitle: 'Push 推播',
    pushSub: 'Push Notification',
    pushChipLogo: '品牌 Logo：192×192 · JPG/PNG · ≤200KB',
    pushChipImg: '圖片：360×240 · JPG/PNG · ≤720KB',
    pushChipTitle: '標題 ≤30 字',
    pushChipDesc: '描述 ≤40 字',
    pushLegend: '標題與描述均在上限內 · 表情符號不計入',

    displayTitle: 'Display 橫幅',
    displaySub: 'Display Banner',
    dispChipFormat: '格式：GIF / JPG / PNG',
    dispChipSize: '大小：≤500KB',
    dispChipDims: '尺寸：300×250 · 300×100 · 320×50',
    dispChipAnim: '建議動態 GIF',
    displayNote:
      '每個促銷出 300×250、300×100、320×50 三個尺寸；建議動態 GIF。小尺寸重新排版、非等比縮放。',

    nativeTitle: 'Native 原生',
    nativeSub: 'Native · 靜態',
    natChipFormat: '格式：JPG / PNG（靜態）',
    natChipSize: '大小：≤500KB',
    natChipDims: '尺寸：300×250',
    natChipStyle: '風格：融入內容（圖 + 標題 + 描述）',

    offerA: '促銷A · 首存 100% 紅利',
    offerB: '促銷B · 獨家老虎機 2% 返水',
    kvDealer: '真人荷官／美女',
    kvGame: '遊戲畫面',
    ftdBonus: '首存 100% 紅利',
    ftdSub: 'FTD 100% Offer · 新會員專享',
    exclSlots: '獨家老虎機 · 返水 2%',
    registerClaim: '立即註冊領取',
    registerPlay: '立即註冊試玩',
    disc: '18+ | 娛樂無度 | 須遵守條款',

    popTag1: '1 · Pop · 促銷A · 首存 100% 紅利',
    popTag2: '2 · Pop · 促銷A · 首存 100% 紅利',
    popTag3: '3 · Pop · 促銷B · 獨家老虎機 2% 返水',
    popTag4: '4 · Pop · 促銷B · 獨家老虎機 2% 返水',
    kv1: '主視覺一：真人荷官／美女',
    kv2: '主視覺二：遊戲畫面',

    pushAngle1: '角度一 · 緊迫感（限時） · 首存紅利倒計時',
    pushAngle2: '角度二 · 中獎爆獎（社群證明） · 獨家機台大獎',
    pushT1: '⏰ 首存 100% 紅利，僅剩 2 小時！',
    pushD1: '登入即可領取，錯過今晚不再有！',
    pushT2: '🔥 獨家機台開出 RM 8,888 大獎！',
    pushD2: '倒計時 30 分鐘，速來試試你的手氣！',
    pushBalance: '餘額',
    pushWon: '恭喜獲得',
    pushWonAmt: '首存紅利 100%',
    pushClaim: '領取 CLAIM',
    pushBigWin: 'BIG WIN 大獎',
    pushRebate: '返水',
    pushExclLabel: 'LUCKY88 · 獨家機台',

    dispOfferA: '促銷A · 首存 100% 紅利（同一視覺，出 3 個尺寸）',
    dispOfferB: '促銷B · 獨家老虎機 2% 返水（同一視覺，出 3 個尺寸）',
    dispFtdSub: '首存紅利',
    dispClaim: '立即領取',
    dispClaimShort: '領取',
    dispPlay: '立即試玩',
    dispPlayShort: '試玩',
    dispDouble: '紅利翻倍 ×2 · 新會員專享',
    dispDaily: '天天返水、越玩越賺',
    rebate2: '返水 2%',
    footTcs: '18+ | 須遵守條款',
    ribbonValue: '超值',
    ribbonExcl: '獨家',

    natOfferA: 'Offer A · 首存 100% 紅利',
    natOfferB: 'Offer B · 獨家老虎機 2% 返水',
    natBadgeLimited: '限時',
    natBadgeExcl: '獨家',
    natDeposit2x: '首存翻倍 ×2',
    natSponsored: '贊助',
    natTitleA: '2026 最受歡迎的迎新禮：首存翻倍',
    natTitleB: '老玩家都在玩的獨家機台，天天返水',
    natCtaA: '立即領取 →',
    natCtaB: '立即試玩 →',
    natRebateLabel: '獨家機台返水',
  },
}

const t = computed<Dict>(() => UI[props.lang] ?? UI.en)
</script>

<template>
  <div class="cpv" aria-hidden="true">
    <!-- ============ 1. POP ============ -->
    <section class="cpv-sec">
      <div class="cpv-h">
        <span class="cpv-no">1</span>
        <h3>{{ t.popTitle }}</h3>
        <span class="cpv-en">{{ t.popSub }}</span>
        <span class="gifbadge">{{ t.animated }}</span>
      </div>
      <div class="specrow">
        <div class="chip">{{ t.popChipFormat }}</div>
        <div class="chip">{{ t.popChipUrl }}</div>
        <div class="chip">{{ t.popChipMulti }}</div>
        <div class="chip">{{ t.popChipAnim }}</div>
      </div>

      <div class="pv">
        <div class="pv-col">
          <div class="offer-tag">{{ t.popTag1 }}</div>
          <div class="opttag">{{ t.kv1 }}</div>
          <div class="phone" style="min-height:auto;">
            <div class="lang">EN ▾ ZH · MY</div>
            <div class="hero">
              <div class="brand" style="font-size:20px;">LUCKY<b>88</b></div>
              <div class="hl" style="font-size:20px;margin-top:8px;">{{ t.ftdBonus }}</div>
              <div class="sub-w" style="font-size:10px;margin-top:1px;">{{ t.ftdSub }}</div>
              <div class="kv-dealer" style="width:90%;margin:10px auto 0;height:142px;">
                <div class="dz-tag">{{ t.kvDealer }}</div>
                <div class="felt"></div>
                <div class="pchip" style="left:16px;top:36px;"></div>
                <div class="pcard" style="left:13px;bottom:14px;transform:rotate(-12deg);">A♠</div>
                <div class="pcard" style="left:34px;bottom:12px;transform:rotate(8deg);color:#c8203a;">K♥</div>
                <div class="pchip" style="right:18px;bottom:26px;"></div>
                <div class="dealer-fig"><div class="body"></div><div class="hair"></div><div class="head"></div><div class="bowtie"></div></div>
              </div>
            </div>
            <div class="sec-cta"><div class="cta">{{ t.registerClaim }}</div><div class="disc">{{ t.disc }}</div></div>
          </div>
        </div>
        <div class="pv-col">
          <div class="offer-tag">{{ t.popTag2 }}</div>
          <div class="opttag">{{ t.kv2 }}</div>
          <div class="phone" style="min-height:auto;">
            <div class="lang">EN ▾ ZH · MY</div>
            <div class="hero">
              <div class="brand" style="font-size:20px;">LUCKY<b>88</b></div>
              <div class="hl" style="font-size:20px;margin-top:8px;">{{ t.ftdBonus }}</div>
              <div class="sub-w" style="font-size:10px;margin-top:1px;">{{ t.ftdSub }}</div>
              <div class="kv-game" style="width:90%;margin:10px auto 0;height:142px;">
                <div class="hudbar"><span style="color:#f6d67a;font-weight:700;">{{ t.kvGame }}</span><span>LINE 20 · RM 1,280</span></div>
                <div class="grid"><i>7</i><i>★</i><i>◆</i><i>◆</i><i>7</i><i>★</i><i>★</i><i>◆</i><i>7</i></div>
                <div class="spinbar">SPIN</div>
              </div>
            </div>
            <div class="sec-cta"><div class="cta">{{ t.registerClaim }}</div><div class="disc">{{ t.disc }}</div></div>
          </div>
        </div>
      </div>
      <div class="pv">
        <div class="pv-col">
          <div class="offer-tag">{{ t.popTag3 }}</div>
          <div class="opttag">{{ t.kv1 }}</div>
          <div class="phone" style="min-height:auto;">
            <div class="lang">EN ▾ ZH · MY</div>
            <div class="hero">
              <div class="brand" style="font-size:20px;">LUCKY<b>88</b></div>
              <div class="hl" style="font-size:19px;margin-top:8px;">{{ t.exclSlots }}</div>
              <div class="sub-w" style="font-size:10px;margin-top:1px;">Exclusive Slots · 2% Rebate</div>
              <div class="kv-dealer" style="width:90%;margin:10px auto 0;height:142px;">
                <div class="dz-tag">{{ t.kvDealer }}</div>
                <div class="felt"></div>
                <div class="pchip" style="left:16px;top:36px;"></div>
                <div class="pcard" style="left:13px;bottom:14px;transform:rotate(-12deg);">A♠</div>
                <div class="pcard" style="left:34px;bottom:12px;transform:rotate(8deg);color:#c8203a;">K♥</div>
                <div class="pchip" style="right:18px;bottom:26px;"></div>
                <div class="dealer-fig"><div class="body"></div><div class="hair"></div><div class="head"></div><div class="bowtie"></div></div>
              </div>
            </div>
            <div class="sec-cta"><div class="cta">{{ t.registerPlay }}</div><div class="disc">{{ t.disc }}</div></div>
          </div>
        </div>
        <div class="pv-col">
          <div class="offer-tag">{{ t.popTag4 }}</div>
          <div class="opttag">{{ t.kv2 }}</div>
          <div class="phone" style="min-height:auto;">
            <div class="lang">EN ▾ ZH · MY</div>
            <div class="hero">
              <div class="brand" style="font-size:20px;">LUCKY<b>88</b></div>
              <div class="hl" style="font-size:19px;margin-top:8px;">{{ t.exclSlots }}</div>
              <div class="sub-w" style="font-size:10px;margin-top:1px;">Exclusive Slots · 2% Rebate</div>
              <div class="kv-game" style="width:90%;margin:10px auto 0;height:142px;">
                <div class="hudbar"><span style="color:#f6d67a;font-weight:700;">{{ t.kvGame }}</span><span>LINE 20 · RM 1,280</span></div>
                <div class="grid"><i>7</i><i>★</i><i>◆</i><i>◆</i><i>7</i><i>★</i><i>★</i><i>◆</i><i>7</i></div>
                <div class="spinbar">SPIN</div>
              </div>
            </div>
            <div class="sec-cta"><div class="cta">{{ t.registerPlay }}</div><div class="disc">{{ t.disc }}</div></div>
          </div>
        </div>
      </div>
      <p class="cpv-note">{{ t.popNote }}</p>
    </section>

    <!-- ============ 2. PUSH ============ -->
    <section class="cpv-sec">
      <div class="cpv-h">
        <span class="cpv-no">2</span>
        <h3>{{ t.pushTitle }}</h3>
        <span class="cpv-en">{{ t.pushSub }}</span>
      </div>
      <div class="specrow">
        <div class="chip">{{ t.pushChipLogo }}</div>
        <div class="chip">{{ t.pushChipImg }}</div>
        <div class="chip">{{ t.pushChipTitle }}</div>
        <div class="chip">{{ t.pushChipDesc }}</div>
      </div>
      <div class="pv">
        <div class="pv-col">
          <div class="offer-tag">{{ t.pushAngle1 }}</div>
          <div class="push">
            <div class="top">
              <div class="ic"><b>L88</b></div>
              <div class="tt">
                <div class="t">{{ t.pushT1 }}</div>
                <div class="d">{{ t.pushD1 }}</div>
                <div class="s">lucky88.com · now</div>
              </div>
            </div>
            <div class="big">
              <div class="wincap">
                <div class="hud"><span>LUCKY88</span><span>{{ t.pushBalance }} <b>RM 1,280</b></span></div>
                <div class="coin" style="width:26px;height:26px;left:28px;top:52px;"></div>
                <div class="coin" style="width:20px;height:20px;left:60px;top:120px;"></div>
                <div class="coin" style="width:30px;height:30px;right:28px;top:60px;"></div>
                <span class="spark" style="width:12px;height:12px;left:96px;top:36px;"></span>
                <span class="spark" style="width:9px;height:9px;right:96px;top:44px;"></span>
                <div class="capc">
                  <div class="winbanner">{{ t.pushWon }}</div>
                  <div class="winamt" style="font-size:26px;">{{ t.pushWonAmt }}</div>
                  <div class="claimbtn">{{ t.pushClaim }}</div>
                </div>
              </div>
            </div>
          </div>
          <div class="legend">{{ t.pushLegend }}</div>
        </div>
        <div class="pv-col">
          <div class="offer-tag">{{ t.pushAngle2 }}</div>
          <div class="push">
            <div class="top">
              <div class="ic"><b>L88</b></div>
              <div class="tt">
                <div class="t">{{ t.pushT2 }}</div>
                <div class="d">{{ t.pushD2 }}</div>
                <div class="s">lucky88.com · now</div>
              </div>
            </div>
            <div class="big">
              <div class="wincap">
                <div class="hud"><span>{{ t.pushExclLabel }}</span><span>{{ t.pushRebate }} <b>2%</b></span></div>
                <div class="coin" style="width:26px;height:26px;left:26px;top:64px;"></div>
                <div class="coin" style="width:20px;height:20px;left:58px;top:128px;"></div>
                <div class="coin" style="width:30px;height:30px;right:26px;top:70px;"></div>
                <span class="spark" style="width:12px;height:12px;left:92px;top:34px;"></span>
                <span class="spark" style="width:9px;height:9px;right:92px;top:42px;"></span>
                <div class="capc">
                  <div class="winbanner">{{ t.pushBigWin }}</div>
                  <div class="reelbig"><span>7</span><span>7</span><span>7</span></div>
                  <div class="winamt">RM 8,888</div>
                </div>
              </div>
            </div>
          </div>
          <div class="legend">{{ t.pushLegend }}</div>
        </div>
      </div>
    </section>

    <!-- ============ 3. DISPLAY ============ -->
    <section class="cpv-sec">
      <div class="cpv-h">
        <span class="cpv-no">3</span>
        <h3>{{ t.displayTitle }}</h3>
        <span class="cpv-en">{{ t.displaySub }}</span>
        <span class="gifbadge">{{ t.animatedGif }}</span>
      </div>
      <div class="specrow">
        <div class="chip">{{ t.dispChipFormat }}</div>
        <div class="chip">{{ t.dispChipSize }}</div>
        <div class="chip">{{ t.dispChipDims }}</div>
        <div class="chip">{{ t.dispChipAnim }}</div>
      </div>

      <div class="offer-tag" style="margin-bottom:10px;">{{ t.dispOfferA }}</div>
      <div class="pv" style="margin-bottom:22px;">
        <div class="pv-col" style="margin-right:26px;">
          <div class="opttag">300 × 250</div>
          <div class="ad d300x250">
            <div class="ribbon">{{ t.ribbonValue }}</div>
            <div class="brand" style="font-size:15px;text-align:center;">LUCKY<b>88</b></div>
            <div class="kv" style="height:92px;margin-top:8px;border-radius:8px;">
              <div class="sun"></div><div class="glow"></div>
              <div class="coin" style="width:24px;height:24px;left:26px;top:16px;"></div>
              <div class="coin" style="width:30px;height:30px;right:26px;top:22px;"></div>
              <div class="coin" style="width:16px;height:16px;right:52px;top:66px;"></div>
              <span class="spark" style="width:9px;height:9px;left:64px;top:12px;"></span>
              <div class="center"><div class="sub-w" style="font-size:12px;">{{ t.dispFtdSub }}</div><div class="bignum" style="font-size:46px;">100%</div></div>
            </div>
            <div class="hl" style="font-size:17px;text-align:center;margin-top:7px;">{{ t.ftdBonus }}</div>
            <div style="text-align:center;font-size:11px;color:var(--gold-2);margin-top:3px;">{{ t.dispDouble }}</div>
            <div class="cta" style="margin:8px auto 0;padding:9px 26px;font-size:14px;">{{ t.dispClaim }}</div>
            <div class="foot" style="font-size:9px;">{{ t.footTcs }}</div>
          </div>
        </div>
        <div class="pv-col">
          <div class="opttag">300 × 100</div>
          <div class="ad d300x100">
            <div class="kv" style="width:92px;flex:0 0 92px;height:100%;border-radius:0;">
              <div class="sun"></div><div class="glow"></div>
              <div class="coin" style="width:16px;height:16px;left:12px;top:14px;"></div>
              <div class="coin" style="width:13px;height:13px;right:13px;bottom:16px;"></div>
              <div class="center"><div class="bignum" style="font-size:29px;">100%</div></div>
            </div>
            <div style="flex:1;display:flex;flex-direction:column;justify-content:center;padding:0 12px;">
              <div class="brand" style="font-size:11px;">LUCKY<b>88</b></div>
              <div class="hl" style="font-size:15px;margin-top:3px;white-space:nowrap;">{{ t.ftdBonus }}</div>
              <div style="font-size:9px;color:var(--gold-2);margin-top:3px;white-space:nowrap;">{{ t.dispDouble }}</div>
            </div>
            <div style="display:flex;align-items:center;padding-right:12px;"><div class="cta" style="padding:8px 15px;font-size:12px;white-space:nowrap;">{{ t.dispClaimShort }}</div></div>
          </div>
          <div class="opttag" style="margin-top:16px;">320 × 50</div>
          <div class="ad d320x50">
            <div class="kv" style="width:46px;flex:0 0 46px;height:100%;border-radius:0;"><div class="glow"></div><div class="center"><div class="bignum" style="font-size:17px;">100%</div></div></div>
            <div style="flex:1;padding:0 8px;display:flex;flex-direction:column;justify-content:center;"><div class="brand" style="font-size:10px;">LUCKY<b>88</b></div><div class="hl" style="font-size:13px;">{{ t.ftdBonus }}</div></div>
            <div class="cta" style="padding:6px 14px;font-size:11px;margin-right:3px;">{{ t.dispClaimShort }}</div>
          </div>
        </div>
      </div>

      <div class="offer-tag" style="margin-bottom:10px;">{{ t.dispOfferB }}</div>
      <div class="pv">
        <div class="pv-col" style="margin-right:26px;">
          <div class="opttag">300 × 250</div>
          <div class="ad d300x250">
            <div class="ribbon">{{ t.ribbonExcl }}</div>
            <div class="brand" style="font-size:15px;text-align:center;">LUCKY<b>88</b></div>
            <div class="kv" style="height:92px;margin-top:8px;border-radius:8px;">
              <div class="sun"></div><div class="glow"></div>
              <span class="spark" style="width:9px;height:9px;left:56px;top:14px;"></span>
              <span class="spark" style="width:8px;height:8px;right:56px;top:18px;"></span>
              <div class="center"><div class="reelset" style="justify-content:center;"><span>7</span><span>★</span><span>◆</span></div><div class="bignum" style="font-size:30px;margin-top:6px;">{{ t.rebate2 }}</div></div>
            </div>
            <div class="hl" style="font-size:17px;text-align:center;margin-top:7px;">{{ t.exclSlots }}</div>
            <div style="text-align:center;font-size:11px;color:var(--gold-2);margin-top:3px;">{{ t.dispDaily }}</div>
            <div class="cta" style="margin:8px auto 0;padding:9px 26px;font-size:14px;">{{ t.dispPlay }}</div>
            <div class="foot" style="font-size:9px;">{{ t.footTcs }}</div>
          </div>
        </div>
        <div class="pv-col">
          <div class="opttag">300 × 100</div>
          <div class="ad d300x100">
            <div class="kv" style="width:92px;flex:0 0 92px;height:100%;border-radius:0;">
              <div class="sun"></div><div class="glow"></div>
              <div class="center"><div class="reelset" style="justify-content:center;gap:3px;"><span style="width:17px;height:24px;font-size:13px;">7</span><span style="width:17px;height:24px;font-size:13px;">7</span><span style="width:17px;height:24px;font-size:13px;">7</span></div></div>
            </div>
            <div style="flex:1;display:flex;flex-direction:column;justify-content:center;padding:0 12px;">
              <div class="brand" style="font-size:11px;">LUCKY<b>88</b></div>
              <div class="hl" style="font-size:13.5px;margin-top:3px;white-space:nowrap;">{{ t.exclSlots }}</div>
              <div style="font-size:9px;color:var(--gold-2);margin-top:3px;white-space:nowrap;">{{ t.dispDaily }}</div>
            </div>
            <div style="display:flex;align-items:center;padding-right:12px;"><div class="cta" style="padding:8px 14px;font-size:12px;white-space:nowrap;">{{ t.dispPlayShort }}</div></div>
          </div>
          <div class="opttag" style="margin-top:16px;">320 × 50</div>
          <div class="ad d320x50">
            <div class="kv" style="width:46px;flex:0 0 46px;height:100%;border-radius:0;"><div class="glow"></div><div class="center"><div class="bignum" style="font-size:16px;">2%</div></div></div>
            <div style="flex:1;padding:0 8px;display:flex;flex-direction:column;justify-content:center;"><div class="brand" style="font-size:10px;">LUCKY<b>88</b></div><div class="hl" style="font-size:12.5px;">{{ t.exclSlots }}</div></div>
            <div class="cta" style="padding:6px 12px;font-size:11px;margin-right:3px;">{{ t.dispPlayShort }}</div>
          </div>
        </div>
      </div>
      <p class="cpv-note">{{ t.displayNote }}</p>
    </section>

    <!-- ============ 4. NATIVE ============ -->
    <section class="cpv-sec">
      <div class="cpv-h">
        <span class="cpv-no">4</span>
        <h3>{{ t.nativeTitle }}</h3>
        <span class="cpv-en">{{ t.nativeSub }}</span>
      </div>
      <div class="specrow">
        <div class="chip">{{ t.natChipFormat }}</div>
        <div class="chip">{{ t.natChipSize }}</div>
        <div class="chip">{{ t.natChipDims }}</div>
        <div class="chip">{{ t.natChipStyle }}</div>
      </div>
      <div class="pv">
        <div class="pv-col">
          <div class="offer-tag">{{ t.natOfferA }}</div>
          <div class="native">
            <div class="kv" style="height:120px;border-radius:0;">
              <div class="nbadge">{{ t.natBadgeLimited }}</div>
              <div class="sun"></div><div class="glow"></div>
              <div class="coin" style="width:20px;height:20px;left:30px;top:24px;"></div>
              <div class="coin" style="width:16px;height:16px;right:34px;top:82px;"></div>
              <span class="spark" style="width:11px;height:11px;left:78px;top:14px;"></span>
              <span class="spark" style="width:8px;height:8px;right:66px;top:22px;"></span>
              <div class="center"><div class="gift"><div class="box"></div><div class="lid"></div><div class="ribV"></div><div class="bow"><span></span><span></span></div></div><div class="hl" style="font-size:18px;margin-top:8px;">{{ t.natDeposit2x }}</div></div>
            </div>
            <div class="nfoot">
              <div class="nbrand"><div class="av">L88</div><div class="nm">LUCKY88</div><div class="sp">{{ t.natSponsored }}</div></div>
              <div style="font-size:14px;font-weight:800;color:var(--blue-d);line-height:1.35;">{{ t.natTitleA }}</div>
              <div class="ncta">{{ t.natCtaA }}</div>
            </div>
          </div>
        </div>
        <div class="pv-col">
          <div class="offer-tag">{{ t.natOfferB }}</div>
          <div class="native">
            <div class="kv" style="height:120px;border-radius:0;">
              <div class="nbadge">{{ t.natBadgeExcl }}</div>
              <div class="sun"></div><div class="glow"></div>
              <span class="spark" style="width:11px;height:11px;left:70px;top:20px;"></span>
              <span class="spark" style="width:8px;height:8px;right:72px;top:26px;"></span>
              <div class="center" style="display:flex;align-items:center;gap:14px;">
                <div class="slot"><div class="mq">LUCKY</div><div class="cab"></div><div class="win"><i>7</i><i>7</i><i>7</i></div><div class="lever"></div><div class="btns"><b></b><b></b></div></div>
                <div style="text-align:left;"><div class="bignum" style="font-size:30px;">2%</div><div class="sub-w" style="font-size:12px;">{{ t.natRebateLabel }}</div></div>
              </div>
            </div>
            <div class="nfoot">
              <div class="nbrand"><div class="av">L88</div><div class="nm">LUCKY88</div><div class="sp">{{ t.natSponsored }}</div></div>
              <div style="font-size:14px;font-weight:800;color:var(--blue-d);line-height:1.35;">{{ t.natTitleB }}</div>
              <div class="ncta">{{ t.natCtaB }}</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<style scoped>
.cpv {
  --blue-d: #0F1B2D;
  --muted: #64748B;
  --line: #E4EAF1;
  --gold: #e8b64c;
  --gold-2: #f6d67a;
  --gold-deep: #b8862f;
  --cbg1: #3a2a10;
  --cbg2: #1a1206;
  --cbg3: #0a0603;
  --cta: #E23B4E;
  --cta2: #ff5d6c;
  --ctext: #f4e9d6;
  margin: 24px 0;
}
.cpv * { box-sizing: border-box; }

/* section headers */
.cpv-sec { margin-top: 34px; }
.cpv-sec:first-child { margin-top: 8px; }
.cpv-h { display: flex; align-items: center; gap: 10px; margin-bottom: 8px; flex-wrap: wrap; }
.cpv-h .cpv-no {
  background: var(--vp-c-brand-1, #2F6EB5); color: #fff; font-weight: 800; font-size: 13px;
  width: 24px; height: 24px; border-radius: 7px; display: flex; align-items: center; justify-content: center; flex: 0 0 auto;
}
.cpv-h h3 { font-size: 17px; font-weight: 800; color: var(--vp-c-text-1); margin: 0; border: 0; padding: 0; letter-spacing: -0.2px; }
.cpv-h .cpv-en { color: var(--vp-c-text-3); font-weight: 600; font-size: 12.5px; }
.gifbadge {
  display: inline-flex; align-items: center; gap: 4px; background: #0F1B2D; color: #fff; font-size: 10px;
  font-weight: 700; padding: 2px 8px; border-radius: 5px; vertical-align: middle;
}
.specrow { display: flex; flex-wrap: wrap; gap: 8px; margin: 10px 0 18px; }
.chip {
  background: var(--vp-c-bg); border: 1px solid var(--vp-c-divider); border-radius: 20px;
  padding: 5px 13px; font-size: 12.5px; color: var(--vp-c-text-2);
}
.cpv-note { font-size: 12.5px; color: var(--vp-c-text-3); margin: 10px 0 0; line-height: 1.6; }

/* preview grid */
.pv { display: flex; flex-wrap: wrap; gap: 26px; align-items: flex-start; }
.pv-col { display: flex; flex-direction: column; gap: 6px; }
.offer-tag { font-size: 12.5px; font-weight: 700; color: var(--vp-c-text-1); }
.opttag { font-size: 11.5px; color: var(--vp-c-text-3); margin-bottom: 2px; }
.legend { margin-top: 6px; font-size: 11px; color: var(--vp-c-text-3); }

/* ===== casino creative shared ===== */
.ad {
  position: relative; overflow: hidden; color: var(--ctext);
  background:
    radial-gradient(120% 80% at 50% 0%, rgba(232,182,76,.16), rgba(0,0,0,0) 55%),
    radial-gradient(120% 90% at 50% 0%, var(--cbg1) 0%, var(--cbg2) 46%, var(--cbg3) 100%);
  border: 1px solid #4a3312; font-family: "PingFang SC", "Microsoft YaHei", Inter, sans-serif;
}
.ad::after {
  content: ""; position: absolute; inset: 0; border-radius: inherit; pointer-events: none;
  box-shadow: inset 0 0 0 1px rgba(246,214,122,.18);
}
.brand { font-weight: 900; font-style: italic; color: #fff; letter-spacing: -.4px; text-shadow: 0 1px 2px rgba(0,0,0,.5); }
.brand b { color: var(--gold-2); font-style: normal; }
.hl {
  font-weight: 900; line-height: 1.02;
  background: linear-gradient(180deg, #fff8e0 0%, #f6d67a 48%, #e0a52c 74%, #b8791b 100%);
  -webkit-background-clip: text; background-clip: text; color: transparent;
  filter: drop-shadow(0 1px 3px rgba(232,182,76,.35));
}
.bignum {
  font-weight: 900; line-height: .86; letter-spacing: -1px;
  background: linear-gradient(180deg, #fff8e0, #ffe6a0 40%, #eab52f 72%, #b8791b);
  -webkit-background-clip: text; background-clip: text; color: transparent;
  filter: drop-shadow(0 2px 6px rgba(232,182,76,.5));
}
.sub-w { color: #fff; font-weight: 700; }

/* CTA with gloss */
.cta {
  display: inline-block; font-weight: 800; color: #fff; text-align: center; position: relative; overflow: hidden;
  background: linear-gradient(180deg, var(--cta2), var(--cta)); border-radius: 999px;
  box-shadow: 0 3px 10px rgba(226,59,78,.45), inset 0 1px 0 rgba(255,255,255,.4);
}
.cta::after {
  content: ""; position: absolute; left: 6%; right: 6%; top: 0; height: 46%;
  background: linear-gradient(180deg, rgba(255,255,255,.4), rgba(255,255,255,0)); border-radius: 999px; pointer-events: none;
}
.cta::before {
  content: ""; position: absolute; top: 0; bottom: 0; left: -45%; width: 36%; z-index: 1; pointer-events: none;
  background: linear-gradient(100deg, transparent, rgba(255,255,255,.6), transparent); transform: skewX(-18deg);
  animation: cpv-sheen 3s ease-in-out infinite;
}

@keyframes cpv-sheen { 0% { left: -45%; } 55% { left: 125%; } 100% { left: 125%; } }
@keyframes cpv-spin { to { transform: translate(-50%,-50%) rotate(360deg); } }
@keyframes cpv-glowp { 0%,100% { opacity: .55; } 50% { opacity: 1; } }
@keyframes cpv-pulse { 0%,100% { transform: scale(1); } 50% { transform: scale(1.06); } }
@keyframes cpv-bob { 0%,100% { transform: translateY(0); } 50% { transform: translateY(-4px); } }
@keyframes cpv-twinkle { 0%,100% { opacity: .3; transform: scale(.8); } 50% { opacity: 1; transform: scale(1.2); } }
.sun { animation: cpv-spin 16s linear infinite; }
.glow { animation: cpv-glowp 2.6s ease-in-out infinite; }
.bignum { animation: cpv-pulse 2.1s ease-in-out infinite; display: inline-block; }
.coin { animation: cpv-bob 2.8s ease-in-out infinite; }
.coin:nth-child(3) { animation-delay: .5s; }
.coin:nth-child(4) { animation-delay: .9s; }
.spark { animation: cpv-twinkle 1.8s ease-in-out infinite; }
.reelset span { animation: cpv-bob 2.4s ease-in-out infinite; }
.reelset span:nth-child(2) { animation-delay: .25s; }
.reelset span:nth-child(3) { animation-delay: .5s; }

/* native gift (static) */
.gift { position: relative; width: 58px; height: 52px; margin: 0 auto; }
.gift .box { position: absolute; bottom: 0; left: 3px; width: 52px; height: 34px; border-radius: 3px; background: linear-gradient(180deg,#f6d67a,#c8901f); border: 1.5px solid #8a5e17; }
.gift .lid { position: absolute; top: 12px; left: 0; width: 58px; height: 13px; border-radius: 3px; background: linear-gradient(180deg,#fff2c4,#e0a52c); border: 1.5px solid #8a5e17; }
.gift .ribV { position: absolute; top: 12px; left: 25px; width: 7px; height: 40px; background: #c8203a; z-index: 2; }
.gift .bow span { position: absolute; top: 2px; width: 12px; height: 12px; background: #e23b4e; border-radius: 50% 50% 50% 0; z-index: 3; }
.gift .bow span:first-child { left: 16px; transform: rotate(-45deg); }
.gift .bow span:last-child { left: 29px; transform: rotate(45deg); }

/* slot machine (static) */
.slot { position: relative; width: 82px; height: 94px; flex: 0 0 82px; }
.slot .cab { position: absolute; top: 15px; left: 6px; width: 70px; height: 79px; border-radius: 11px 11px 8px 8px; background: linear-gradient(180deg,#3a2350,#1c1030); border: 2px solid var(--gold-deep); box-shadow: 0 0 12px rgba(232,182,76,.3); }
.slot .mq { position: absolute; top: 0; left: 13px; width: 56px; height: 20px; border-radius: 8px; z-index: 2; background: linear-gradient(180deg,#fff2c4,#e0a52c); border: 1.5px solid #8a5e17; display: flex; align-items: center; justify-content: center; font-size: 8px; font-weight: 900; color: #5a3a0a; letter-spacing: 1px; }
.slot .win { position: absolute; top: 34px; left: 15px; width: 52px; height: 32px; border-radius: 5px; z-index: 2; background: #0d0714; border: 1.5px solid var(--gold-deep); display: flex; gap: 3px; align-items: center; justify-content: center; }
.slot .win i { width: 13px; height: 23px; border-radius: 3px; background: linear-gradient(180deg,#2a1808,#100a03); border: 1px solid var(--gold-deep); display: flex; align-items: center; justify-content: center; font-style: normal; font-weight: 900; font-size: 13px; color: var(--gold-2); }
.slot .lever { position: absolute; top: 30px; right: 0; width: 6px; height: 24px; background: var(--gold-deep); border-radius: 3px; z-index: 1; }
.slot .lever::after { content: ""; position: absolute; top: -7px; left: -3px; width: 12px; height: 12px; border-radius: 50%; background: radial-gradient(circle at 35% 30%,#ff8a95,#c8203a); }
.slot .btns { position: absolute; bottom: 9px; left: 15px; width: 52px; display: flex; gap: 6px; justify-content: center; z-index: 2; }
.slot .btns b { width: 10px; height: 10px; border-radius: 50%; background: radial-gradient(circle at 35% 30%,#ffe,#e23b4e); }

/* key visual */
.kv { position: relative; overflow: hidden; display: flex; align-items: center; justify-content: center; border-radius: 10px; }
.sun { position: absolute; left: 50%; top: 52%; transform: translate(-50%,-50%); width: 260px; height: 260px; border-radius: 50%; background: repeating-conic-gradient(from 0deg, rgba(246,214,122,.15) 0deg 7deg, rgba(246,214,122,0) 7deg 20deg); }
.glow { position: absolute; left: 50%; top: 50%; transform: translate(-50%,-50%); width: 150px; height: 150px; border-radius: 50%; background: radial-gradient(circle, rgba(246,214,122,.35), rgba(246,214,122,0) 65%); }
.coin { position: absolute; border-radius: 50%; background: radial-gradient(circle at 34% 28%,#fff4cf,#f6d67a 44%,#c8901f 76%,#8a5e17); box-shadow: 0 2px 5px rgba(0,0,0,.5), inset 0 0 0 1.5px rgba(255,255,255,.35); }
.coin::after { content: "$"; position: absolute; inset: 0; display: flex; align-items: center; justify-content: center; color: #a9761f; font-weight: 900; font-size: 12px; }
.spark { position: absolute; background: #fff6df; opacity: .92; clip-path: polygon(50% 0,58% 42%,100% 50%,58% 58%,50% 100%,42% 58%,0 50%,42% 42%); }
.ribbon { position: absolute; top: 13px; left: -32px; transform: rotate(-45deg); z-index: 4; background: linear-gradient(180deg,#ff5d6c,#c8203a); color: #fff; font-size: 10px; font-weight: 800; letter-spacing: 1px; padding: 3px 38px; box-shadow: 0 2px 6px rgba(0,0,0,.45); }
.reelset { display: flex; gap: 5px; position: relative; z-index: 2; }
.reelset span { width: 30px; height: 40px; border-radius: 6px; background: linear-gradient(180deg,#2a1808,#100a03); border: 1.5px solid var(--gold-deep); display: flex; align-items: center; justify-content: center; font-weight: 900; font-size: 21px; color: var(--gold-2); box-shadow: inset 0 0 9px rgba(232,182,76,.3); }
.center { position: relative; z-index: 3; text-align: center; }

/* sizes */
.d300x250 { width: 300px; height: 250px; border-radius: 12px; padding: 14px 14px 20px; display: flex; flex-direction: column; }
.d300x100 { width: 300px; height: 100px; border-radius: 9px; padding: 0; display: flex; align-items: stretch; overflow: hidden; }
.d320x50 { width: 320px; height: 50px; border-radius: 7px; padding: 0 6px 0 0; display: flex; align-items: center; overflow: hidden; }
.native { width: 300px; height: 250px; border-radius: 12px; overflow: hidden; background: #fff; border: 1px solid var(--line); color: var(--blue-d); box-shadow: 0 4px 14px rgba(0,0,0,.08); font-family: "PingFang SC","Microsoft YaHei",Inter,sans-serif; }
.nfoot { padding: 11px 14px; }
.nbrand { display: flex; align-items: center; gap: 8px; margin-bottom: 5px; }
.nbrand .av { width: 22px; height: 22px; border-radius: 6px; flex: 0 0 22px; background: radial-gradient(120% 100% at 50% 0%, var(--cbg1), var(--cbg3)); border: 1px solid #4a3312; display: flex; align-items: center; justify-content: center; font-size: 8px; font-weight: 900; font-style: italic; color: var(--gold-2); }
.nbrand .nm { font-size: 11px; color: var(--muted); font-weight: 600; }
.nbrand .sp { margin-left: auto; font-size: 9px; color: #94a0b0; border: 1px solid var(--line); border-radius: 4px; padding: 1px 6px; }
.ncta { display: inline-block; margin-top: 9px; font-size: 12.5px; font-weight: 800; color: #7a5312; background: linear-gradient(180deg,#ffe6a0,#f6d67a 60%,#e0a52c); border-radius: 8px; padding: 7px 18px; box-shadow: 0 2px 6px rgba(232,182,76,.4); }
.nbadge { position: absolute; top: 10px; left: 10px; z-index: 4; background: linear-gradient(180deg,#ff5d6c,#c8203a); color: #fff; font-size: 10px; font-weight: 800; letter-spacing: .5px; padding: 3px 10px; border-radius: 999px; box-shadow: 0 2px 6px rgba(0,0,0,.35); }

/* push */
.push { width: 380px; max-width: 100%; background: #fff; border: 1px solid #e3e3e3; border-radius: 14px; box-shadow: 0 6px 18px rgba(0,0,0,.1); overflow: hidden; color: #202124; font-family: "PingFang SC",Inter,sans-serif; }
.push .top { display: flex; gap: 10px; padding: 12px 14px 8px; align-items: flex-start; }
.push .ic { width: 42px; height: 42px; border-radius: 10px; flex: 0 0 42px; overflow: hidden; position: relative; background: radial-gradient(120% 100% at 50% 0%, var(--cbg1), var(--cbg3)); display: flex; align-items: center; justify-content: center; border: 1px solid #4a3312; }
.push .ic b { font-size: 9px; font-style: italic; font-weight: 900; color: var(--gold-2); }
.push .tt { flex: 1; min-width: 0; }
.push .tt .t { font-size: 13.5px; font-weight: 700; color: #202124; }
.push .tt .d { font-size: 12.5px; color: #5f6368; margin-top: 1px; }
.push .tt .s { font-size: 11px; color: #80868b; margin-top: 3px; }
.push .big { width: 100%; height: 200px; position: relative; border-top: 1px solid #eee; }
.wincap { width: 100%; height: 100%; position: relative; overflow: hidden; background: radial-gradient(120% 95% at 50% 42%,#43305f,#1d1132 56%,#0b0718); }
.wincap .hud { position: absolute; top: 0; left: 0; right: 0; display: flex; justify-content: space-between; padding: 6px 11px; font-size: 9px; color: #cbb8e8; background: rgba(0,0,0,.3); z-index: 6; }
.wincap .hud b { color: var(--gold-2); font-weight: 800; }
.capc { position: absolute; inset: 0; display: flex; flex-direction: column; align-items: center; justify-content: center; z-index: 4; padding-top: 8px; }
.winbanner { font-size: 13px; font-weight: 900; letter-spacing: 2px; color: #fff; text-shadow: 0 0 10px rgba(246,214,122,.75); }
.reelbig { display: flex; gap: 6px; margin-top: 7px; }
.reelbig span { width: 40px; height: 50px; border-radius: 7px; background: linear-gradient(180deg,#2a1808,#100a03); border: 2px solid var(--gold); display: flex; align-items: center; justify-content: center; font-weight: 900; font-size: 28px; color: var(--gold-2); box-shadow: 0 0 12px rgba(246,214,122,.5), inset 0 0 10px rgba(232,182,76,.4); }
.winamt { font-weight: 900; font-size: 30px; margin-top: 9px; letter-spacing: -1px; background: linear-gradient(180deg,#fff8e0,#ffe6a0 40%,#eab52f 72%,#b8791b); -webkit-background-clip: text; background-clip: text; color: transparent; filter: drop-shadow(0 2px 6px rgba(232,182,76,.55)); }
.claimbtn { margin-top: 9px; font-size: 12px; font-weight: 800; color: #7a5312; background: linear-gradient(180deg,#ffe6a0,#f6d67a 60%,#e0a52c); border-radius: 8px; padding: 6px 22px; box-shadow: 0 2px 8px rgba(232,182,76,.5); }

/* phone / landing */
.phone {
  width: 280px; max-width: 100%; min-height: 500px; border-radius: 24px; overflow: hidden; position: relative;
  background:
    radial-gradient(120% 55% at 50% 0%, rgba(232,182,76,.18), rgba(0,0,0,0) 50%),
    radial-gradient(120% 60% at 50% 0%, var(--cbg1), var(--cbg2) 46%, var(--cbg3));
  border: 6px solid #0c0c0f; color: var(--ctext); font-family: "PingFang SC",Inter,sans-serif; padding-bottom: 14px;
}
.phone .lang { position: absolute; top: 12px; right: 12px; background: #1c1206; border: 1px solid #3a2810; color: var(--gold-2); font-size: 10px; padding: 3px 9px; border-radius: 20px; z-index: 5; }
.phone .hero { padding: 28px 16px 0; text-align: center; position: relative; }
.sec-cta { padding: 16px 16px 2px; }
.phone .cta { display: block; width: 100%; padding: 12px 0; font-size: 15px; }
.disc { text-align: center; font-size: 9px; color: #b79a67; margin-top: 8px; }

/* Pop key-visual themes */
.kv-dealer { position: relative; overflow: hidden; border-radius: 12px; background: radial-gradient(120% 90% at 50% 16%,#1f6f57,#0d2b22 66%,#071812); border: 1px solid #3a2810; }
.dz-tag { position: absolute; top: 8px; left: 8px; z-index: 6; background: rgba(0,0,0,.42); color: #f6d67a; font-size: 8px; padding: 2px 7px; border-radius: 5px; letter-spacing: .5px; }
.kv-dealer .felt { position: absolute; top: 28px; left: 8%; right: 8%; height: 1px; background: rgba(246,214,122,.3); }
.dealer-fig { position: absolute; left: 50%; bottom: 0; transform: translateX(-50%); width: 66px; height: 92px; }
.dealer-fig .body { position: absolute; left: 50%; bottom: 0; transform: translateX(-50%); width: 60px; height: 56px; border-radius: 26px 26px 0 0; background: linear-gradient(180deg,#20160a,#0c0905); border: 1px solid var(--gold-deep); }
.dealer-fig .hair { position: absolute; left: 50%; top: 6px; transform: translateX(-50%); width: 36px; height: 30px; border-radius: 50% 50% 40% 40%; background: #241610; }
.dealer-fig .head { position: absolute; left: 50%; top: 12px; transform: translateX(-50%); width: 26px; height: 28px; border-radius: 48%; background: linear-gradient(180deg,#f1cba1,#dcab7d); }
.dealer-fig .bowtie { position: absolute; left: 50%; top: 40px; transform: translateX(-50%); width: 16px; height: 9px; background: var(--gold); clip-path: polygon(0 0,50% 45%,0 100%,100% 100%,50% 55%,100% 0); z-index: 2; }
.pcard { position: absolute; width: 22px; height: 30px; border-radius: 3px; background: #fff; border: 1px solid #d0d0d0; display: flex; align-items: center; justify-content: center; font-size: 11px; font-weight: 900; color: #111; z-index: 3; box-shadow: 0 1px 3px rgba(0,0,0,.4); }
.pchip { position: absolute; width: 16px; height: 16px; border-radius: 50%; background: radial-gradient(circle at 35% 30%,#ff8a95,#c8203a); border: 2px dashed rgba(255,255,255,.85); z-index: 3; }
.kv-game { position: relative; overflow: hidden; border-radius: 12px; background: radial-gradient(120% 95% at 50% 26%,#3c2453,#160c26 70%); border: 1px solid #3a2810; padding: 9px 10px; }
.kv-game .hudbar { display: flex; justify-content: space-between; font-size: 8px; color: #c9b6e6; margin-bottom: 5px; }
.kv-game .grid { display: grid; grid-template-columns: repeat(3,1fr); gap: 4px; }
.kv-game .grid i { height: 26px; border-radius: 5px; background: linear-gradient(180deg,#2a1808,#100a03); border: 1px solid var(--gold-deep); display: flex; align-items: center; justify-content: center; font-style: normal; font-weight: 900; font-size: 15px; color: var(--gold-2); box-shadow: inset 0 0 6px rgba(232,182,76,.25); }
.kv-game .spinbar { margin-top: 6px; height: 15px; border-radius: 8px; background: linear-gradient(180deg,#ff5d6c,#c8203a); display: flex; align-items: center; justify-content: center; font-size: 8px; color: #fff; font-weight: 800; letter-spacing: 1px; }

@media (prefers-reduced-motion: reduce) {
  .sun, .glow, .bignum, .coin, .spark, .reelset span, .cta::before { animation: none !important; }
}
</style>
