"use client";

import Script from "next/script";
import { siteConfig } from "@/lib/site-config";

// Live chat via Tawk.to (free). Create a free account at https://www.tawk.to,
// then copy your Property ID and Widget ID into site-config.ts.
export function TawkWidget() {
  if (!siteConfig.tawkPropertyId || !siteConfig.tawkWidgetId) {
    return null;
  }

  return (
    <Script id="tawk-to" strategy="lazyOnload">
      {`
        var Tawk_API = Tawk_API || {};
        var Tawk_LoadStart = new Date();
        (function () {
          var s1 = document.createElement("script");
          var s0 = document.getElementsByTagName("script")[0];
          s1.async = true;
          s1.src = "https://embed.tawk.to/${siteConfig.tawkPropertyId}/${siteConfig.tawkWidgetId}";
          s1.charset = "UTF-8";
          s1.setAttribute("crossorigin", "*");
          s0.parentNode.insertBefore(s1, s0);
        })();
      `}
    </Script>
  );
}
