---
title: Landing page and conversion path
description: How players move from your ad to a deposit, what to track at each step, and how to build a landing page that converts.
prev:
  text: '2. Connect tracking'
  link: '/en/tracking/overview'
---

# Landing page and conversion path

**For:** Advertisers and marketers preparing the page players see after they click your ad.

Your ad earns the click, but your landing page earns the registration. This page explains the path a player takes, what to track at each step, and how to set up a page that converts.

<nav class="article-toc" aria-label="In this article">
<p class="article-toc-title">In this article</p>

- [1. The conversion path](#_1-the-conversion-path)
- [2. Direct page or pre-lander?](#_2-direct-page-or-pre-lander)
- [3. Use a pre-lander template](#_3-use-a-pre-lander-template)
- [4. Landing page checklist](#_4-landing-page-checklist)
- [5. Register the page in RevoSurge](#_5-register-the-page-in-revosurge)

</nav>

## 1. The conversion path

A typical iGaming path has five steps. Players drop off at every one, so each step needs to be tracked to see where you lose them.

| Step | What happens | Event tracked | Tracked by |
| --- | --- | --- | --- |
| **1. Ad** | The player sees and clicks your ad | Impression, click | AdWave (automatic) |
| **2. Pre-lander** (optional) | A short page warms the player up: bonus, quiz, wheel | `page_view`, `lp_*` events | Web Tracker / template |
| **3. Landing page** | The player sees your sign-up page | `page_view` | Web Tracker |
| **4. Register** | The player creates an account | `register` | Web Tracker |
| **5. Deposit** | The player makes a first deposit (FTD) | `deposit` | S2S or Partner Postback (recommended), or Web Tracker |

::: tip Match your target event to how far your tracking goes
If you only track up to **Register**, choose Register as your campaign's target event. Choose **FTD** only when deposits are tracked reliably. See [Connect tracking](/en/tracking/overview).
:::

## 2. Direct page or pre-lander?

| Option | How it works | Use when |
| --- | --- | --- |
| **Direct** | The ad goes straight to your sign-up page | Your sign-up page is fast, mobile-friendly and already shows the offer |
| **Pre-lander** | The ad goes to a short page first, which then sends players to sign-up | You want to explain the offer, add interaction, or test different angles without changing your main site |

In RevoSurge, these map to **Funnel Types**: a direct sign-up page is **Direct Register**, and a pre-lander that sends players on is **Redirect Register**. Register both pages on the same Product.

## 3. Use a pre-lander template

RevoSurge offers seven free, mobile-first [pre-lander templates](https://www.revosurge.com/resources/landing-page-templates):

| Template    | What it does                                  | Good for                                          |
| ----------- | --------------------------------------------- | ------------------------------------------------- |
| **Form**    | Asks for a mobile number                      | Players who leave a detail convert better later   |
| **Bonus**   | Shows the bonus big and clear, no interaction | **Beginners** — the simplest template             |
| **Quiz**    | Asks 3 short questions                        | Building interest and learning what players want  |
| **Wheel**   | Spin to reveal a prize                        | Creating a sense of winning                       |
| **Scratch** | Scratch to reveal a prize                     | A stronger gesture than a tap; test against Wheel |
| **Games**   | Shows your games before the install           | App install campaigns                             |
| **Urgency** | Shows a live countdown                        | Pushing a faster decision                         |

::: tip New to pre-landers? Start with Bonus or Form
They are the lightest and lowest-risk templates.
:::

**To use a template:**

1. Pick a template that fits your offer.
2. Edit its `CONFIG` block: brand, logo, headline, sub-headline, button text and legal text. **The headline must match your ad copy word for word.**
3. Keep it fast: one hero image (WebP), no web fonts, CSS animation only.
4. Set `CONFIG.endpoint` so the template sends its `lp_*` events to RevoSurge. <!-- TODO: document the collector endpoint value and how lp_* events show in DataPulse -->
5. Host the file on your domain, and set the button to link to your real sign-up page.

## 4. Landing page checklist

Check every page players land on, on a phone, before launch:

- ✅ **Fast:** loads in under 2 seconds on mobile data (first screen under 150 KB)
- ✅ **Matches the ad:** same offer, same wording, same language. A page that feels even slightly different from the ad loses the player in under a second
- ✅ **One clear action:** a single button (register or claim) visible without scrolling
- ✅ **Short form:** ask only for what you need to create the account
- ✅ **Legal text:** age limit (e.g. 18+), responsible gambling message and T&Cs link, as required in each market
- ✅ **Tracked:** Web Tracker installed, and the domain registered on your Product

## 5. Register the page in RevoSurge

1. Go to **Product → Manage Product** and open your Product.
2. Add each landing page URL and pre-lander domain with its **Funnel Type**.
3. Make sure the Web Tracker is installed on each one and the events arrive in the **Event Stream**.

::: warning Unregistered pages do not serve
A campaign's Destination URL must be a registered, active domain on the Product. Add pre-landers, mirrors and redirect domains before you create the campaign.
:::

**Next:** [Creatives](./creatives)
