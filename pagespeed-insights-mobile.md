# PageSpeed Insights Report — go2rinjani.com

## Mobile Result

### ⚠️ Improve image delivery — Est. savings of 461 KiB

Reducing the download time of images can improve the perceived load time of the page and LCP. ([Learn more about optimizing image size](https://developer.chrome.com/docs/performance/insights/image-delivery?utm_source=lighthouse&utm_medium=lr)) — Tags: `LCP`, `FCP`, `Unscored`

**1st Party — go2rinjani.com**
Resource Size: **392.3 KiB** | Est Savings: **365.1 KiB**

| Image / Element                                                                                                                                                                                        | URL                                                            | Resource Size | Est Savings | Issue                                                                                                                               |
| ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | -------------------------------------------------------------- | ------------- | ----------- | ----------------------------------------------------------------------------------------------------------------------------------- |
| A group of happy trekkers celebrating at the peak during a Mount Rinjani summit... `<img src="/_astro/summit-mount-rinjani-3726m.Da8YYjW5.avif" ... loading="eager" fetchpriority="high">`             | `/_astro/summit-mo....Da8YYjW5.avif`                           | 142.7 KiB     | 137.3 KiB   | Image file is larger than needed (1979x1500) for its displayed dimensions (384x288). Use responsive images to reduce download size. |
| Trekking Smart on Mount Rinjani: Your Complete Preparation Guide `<img src="/images/blog/planning-your-first-mount-rinjani-trek.avif" ...>`                                                            | `.../blog/planning-your-first-mount-rinjani-trek.avif`         | 114.4 KiB     | 106.9 KiB   | Image file is larger than needed (1520x1200) for its displayed dimensions (400x300). Use responsive images to reduce download size. |
| Hikers trekking along the stunning Mount Rinjani trail, enjoying panoramic view... `<img src="/_astro/mount-rinjani-crater-rim-trekking-view.CnYoqWaA.avif" ... loading="eager" fetchpriority="high">` | `/_astro/mount-rinjani-crater-rim-trekking-view.CnYoqWaA.avif` | 79.0 KiB      | 69.0 KiB    | Image file is larger than needed (1241x941) for its displayed dimensions (512x288). Use responsive images to reduce download size.  |
| A group of adventurers sitting on the rocky edge of Mount Rinjani at sunrise, w... `<img src="/_astro/mount-rinjani-sunrise-crater-lake-view.Dwul9Z4j.avif" ... loading="lazy">`                       | `/_astro/mount-rin....Dwul9Z4j.avif`                           | 33.7 KiB      | 29.5 KiB    | Image file is larger than needed (1241x941) for its displayed dimensions (512x288). Use responsive images to reduce download size.  |
| Ivana Cattafi `<img alt="Ivana Cattafi" loading="lazy" src="/_astro/ivana.DDmh2u12.avif" class="am-customer-stories-testimonial-img shrink-0 mt-0.5">`                                                 | `/_astro/ivana.DDmh2u12.avif`                                  | 22.5 KiB      | 22.4 KiB    | Image file is larger than needed (520x520) for its displayed dimensions (32x32). Use responsive images to reduce download size.     |

---

### ⚠️ Render-blocking requests — Est. savings of 310 ms

Requests are blocking the page's initial render, which may delay LCP. ([Deferring or inlining](https://developer.chrome.com/docs/performance/insights/render-blocking?utm_source=lighthouse&utm_medium=lr)) can move these network requests out of the critical path. — Tags: `LCP`, `FCP`, `Unscored`

**1st Party — go2rinjani.com**
Transfer Size: **16.4 KiB** | Duration: **160 ms**

| URL                                            | Transfer Size | Duration |
| ---------------------------------------------- | ------------- | -------- |
| `/_astro/schema.B8348IQH.css` (go2rinjani.com) | 16.4 KiB      | 160 ms   |

---

### ⚠️ Forced reflow

A forced reflow occurs when JavaScript queries geometric properties (such as offsetWidth) after styles have been invalidated by a change to the DOM state. This can result in poor performance. ([Learn more about forced reflows](https://developer.chrome.com/docs/performance/insights/forced-reflow?utm_source=lighthouse&utm_medium=lr) and possible mitigations.) — Tags: `Unscored`

| Source                            | Total reflow time |
| --------------------------------- | ----------------- |
| `https://go2rinjani.com:2:206779` | 33 ms             |

---

### ⚠️ Network dependency tree

[Avoid chaining critical requests](https://developer.chrome.com/docs/performance/insights/network-dependency-tree?utm_source=lighthouse&utm_medium=lr) by reducing the length of chains, reducing the download size of resources, or deferring the download of unnecessary resources to improve page load. — Tags: `LCP`, `Unscored`

Maximum critical path latency: **2,360 ms**

**Initial Navigation**

```
https://go2rinjani.com - 136 ms, 20.12 KiB
├─ /_astro/HeaderIsland.DplV7bCg.js (go2rinjani.com) - 816 ms, 2.18 KiB
│  ├─ /_astro/react.BDK-lp-S.js (go2rinjani.com) - 1,049 ms, 8.17 KiB
│  ├─ /_astro/jsx-runtime.Dr5dDviS.js (go2rinjani.com) - 1,118 ms, 2.85 KiB
│  ├─ /_astro/proxy.Dx8bfz5B.js (go2rinjani.com) - 1,135 ms, 41.34 KiB
│  ├─ /_astro/AnimatePresence.D-2mJ3WE.js (go2rinjani.com) - 1,064 ms, 2.58 KiB
│  ├─ /_astro/LanguageS....BZR8MRHN.js (go2rinjani.com) - 1,117 ms, 1.47 KiB
│  └─ /_astro/booking.BGMaNKef.js (go2rinjani.com) - 1,048 ms, 1.10 KiB
├─ /_astro/client.CALm0Lnb.js (go2rinjani.com) - 938 ms, 102.58 KiB
├─ /_astro/schema.B8348IQH.css (go2rinjani.com) - 577 ms, 16.42 KiB
├─ /_astro/GlobalToa....DJpTrro6.js (go2rinjani.com) - 900 ms, 16.84 KiB
│  ├─ /_astro/react-dom.JIEQHkMS.js (go2rinjani.com) - 1,199 ms, 3.55 KiB
│  └─ /_astro/toastManager.Co--Mm31.js (go2rinjani.com) - 1,143 ms, 0.93 KiB
├─ /_astro/AnimatedA....Cba7iwTG.js (go2rinjani.com) - 1,622 ms, 2.57 KiB
└─ /_astro/BookingFormIsland.B1Kx_JB2.js (go2rinjani.com) - 2,339 ms, 3.33 KiB
   └─ /_astro/company.Cm8krQ9t.js (go2rinjani.com) - 2,360 ms, 0.97 KiB
```

**Preconnected origins**
[Preconnect](https://developer.chrome.com/docs/lighthouse/performance/uses-rel-preconnect/?utm_source=lighthouse&utm_medium=lr) hints help the browser establish a connection earlier in the page load, saving time when the first request for that origin is made. The following are the origins that the page preconnected to.

> No origins were preconnected

**Preconnect candidates**
Add [preconnect](https://developer.chrome.com/docs/lighthouse/performance/uses-rel-preconnect/?utm_source=lighthouse&utm_medium=lr) hints to your most important origins, but try to use no more than 4.

> No additional origins are good candidates for preconnecting

---

### 🟧 Use efficient cache lifetimes — Est. savings of 5 KiB

A long cache lifetime can speed up repeat visits to your page. ([Learn more about caching](https://developer.chrome.com/docs/performance/insights/cache?utm_source=lighthouse&utm_medium=lr).) — Tags: `LCP`, `FCP`, `Unscored`

**Cloudflare `Utility`**
Transfer Size: **11 KiB**

| Request                                                      | Cache TTL | Transfer Size |
| ------------------------------------------------------------ | --------- | ------------- |
| `/beacon.min.js/v4513226...` (static.cloudflareinsights.com) | 1d        | 11 KiB        |

---

## Diagnostics

### ⚠️ Reduce unused JavaScript — Est. savings of 63 KiB

Reduce unused JavaScript and defer loading scripts until they are required to decrease bytes consumed by network activity. ([Learn how to reduce unused JavaScript](https://developer.chrome.com/docs/lighthouse/performance/unused-javascript/?utm_source=lighthouse&utm_medium=lr).) — Tags: `LCP`, `FCP`, `Unscored`

**1st Party — go2rinjani.com**
Transfer Size: **142.5 KiB** | Est Savings: **62.7 KiB**

| URL                                           | Transfer Size | Est Savings |
| --------------------------------------------- | ------------- | ----------- |
| `/_astro/client.CALm0Lnb.js` (go2rinjani.com) | 101.9 KiB     | 39.1 KiB    |
| `/_astro/proxy.Dx8bfz5B.js` (go2rinjani.com)  | 40.6 KiB      | 23.6 KiB    |

---

## Names and Labels

### ⚠️ Buttons do not have an accessible name

When a button doesn't have an accessible name, screen readers announce it as "button", making it unusable for users who rely on screen readers. ([Learn how to make buttons more accessible](https://dequeuniversity.com/rules/axe/4.12/button-name).)

**Failing Elements**

- `astro-island > nav.sticky > div.flex > button.w-8`
  ```html
  <button class="relative flex h-3.5 w-8 flex-col justify-between"></button>
  ```
  _(Elemen tombol "hamburger menu" di navbar sticky, berisi ikon garis-garis mirip tombol "BOOK NOW")_

---

## Content Best Practices

### ⚠️ Links do not have descriptive text — 1 link found

Descriptive link text helps search engines understand your content. ([Learn how to make links more accessible](https://developer.chrome.com/docs/lighthouse/seo/link-text/?utm_source=lighthouse&utm_medium=lr).)

**1st Party — go2rinjani.com**

| Link destination                                                                      | Link Text |
| ------------------------------------------------------------------------------------- | --------- |
| `/blog/trekking-smart-on-mount-rinjani-your-complete-preparation...` (go2rinjani.com) | READ MORE |

---

## Agentic Browsing — 1/3

These checks ensure high-quality, [browsable websites for AI agents](https://goo.gle/lighthouse-agentic-web) and validate the correctness of WebMCP integrations. This category is still under development and subject to change.

### Agent Accessibility

#### ⚠️ Accessibility tree is not well-formed

A well-formed [accessibility tree](http://goo.gle/lighthouse-agentic-a11y) helps AI agents to navigate and interact with the page.

**Failed Audits**

| Description                        | Failing Element                                                                                                                                                          |
| ---------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| Buttons must have discernible text | `astro-island > nav.sticky > div.flex > button.w-8`<br>`<button class="w-8 h-3.5 relative flex flex-col justify-between">`<br>_(tombol hamburger menu di navbar sticky)_ |

#### ⚠️ llms.txt does not follow recommendations

If your llms.txt file does not follow recommendations, large language models may not be able to understand how you want your website to be crawled or used for training. The [llms.txt](https://llmstxt.org/) file should be a Markdown file containing at least one H1 header.

| Error                                      |
| ------------------------------------------ |
| File does not appear to contain any links. |
