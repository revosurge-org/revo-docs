# Choose an integration method

Choose a guide based on whether your website already uses Google Ad Manager (GAM) and how you run auctions and render ads.

## Website integration

<div class="adflow-table" role="region" aria-label="Website integration" tabindex="0">

| Guide | When to use it |
| --- | --- |
| [Install the AdFlow JS Tag directly](./adflow-sdk) | Install the AdFlow code directly if you can edit the page. |
| [Connect AdFlow S2S through Prebid.js](./s2s-integration) | Configure AdFlow server-side bidding in your existing Prebid.js initialization. |

</div>

## Your own GAM {#gam}

<div class="adflow-table" role="region" aria-label="GAM" tabindex="0">

| Guide | When to use it |
| --- | --- |
| [Your own GAM + Prebid.js](./gam-prebid) | Pass auction results to GAM if your site already bids through Prebid.js. |
| [Your own GAM + AdFlow JS Tag (without Prebid.js)](./gam-adflow-sdk) | Load the AdFlow JS Tag from a GAM creative. |

</div>

Once set up, check requests, rendering, and reporting on the live page. See [3. Verify and launch](./verify-and-launch).
