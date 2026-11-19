---
title: "S2S Server Events overview"
description: "Send confirmed registrations, deposits and other business events from your backend with Server Events v3."
---

# S2S Server Events overview

S2S (server-to-server) tracking sends confirmed business events directly from your backend to RevoSurge. Use it when your own system records registrations, deposits and other outcomes and can supply their required data.

<a id="server-to-server-s2s-overview"></a>
<a id="_1-what-s2s-is-and-why-it-matters"></a>
<a id="_4-s2s-vs-web-tracker"></a>
<a id="what-s2s-unlocks"></a>

## How it works

Your backend sends authenticated JSON requests. Preserve the original RevoSurge click ID and use the same stable player ID across the browser, app and backend. S2S v3 and Partner Postback v2 share the Product event catalog; their encoding, authentication and response rules remain different.

<a id="_2-two-tiers-basic-and-full"></a>
<a id="what-basic-covers"></a>
<a id="what-full-adds"></a>
<a id="_3-which-tier-do-i-need"></a>
<a id="_5-portal-setup-generate-your-api-key"></a>
<a id="_5-1-prerequisites"></a>
<a id="_5-2-open-the-s2s-panel"></a>
<a id="_5-3-generate-the-api-key"></a>
<a id="_5-4-send-events-from-your-backend"></a>
<a id="_6-verify-in-the-portal"></a>
<a id="if-nothing-arrives"></a>
<a id="_8-api-versions"></a>
<a id="next-steps"></a>
<a id="related"></a>

## Follow the guide

1. [Set up and test S2S](/en/tracking/s2s/setup-s2s): select events, connect the Product and key, validate requests, then verify the real business journey.
2. [Server Events API (v3)](/en/tracking/s2s/v3/server-events-api): JSON envelope, single/batch endpoints, modes, response and retry rules.
3. [Integration validation](/en/tracking/s2s/validation): identity, IP, field and end-to-end checks.

<a id="_7-the-event-catalog"></a>
<a id="standard-preset-9-events"></a>
<a id="igaming-preset-15-events"></a>
<a id="crypto-preset"></a>

## Events & fields

Use [Choose your events](/en/tracking/events/choose-events), [Common fields & identity](/en/tracking/events/common-fields) and [Event availability & validation](/en/tracking/events/catalog-validation) for the shared contract. Event-specific definitions live in [Standard](/en/tracking/events/events-standard), [iGaming](/en/tracking/events/events-igaming) and [Crypto](/en/tracking/events/events-crypto), outside the S2S section.

**Next:** [Set up and test S2S](/en/tracking/s2s/setup-s2s).
