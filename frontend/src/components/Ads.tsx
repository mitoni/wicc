"use client";

import * as React from "react";

type Props = React.ComponentPropsWithRef<"div"> & { slot: string };

declare global {
  interface Window {
    adsbygoogle: any;
  }
}

function Ads(props: Props) {
  const { slot, ...args } = props;

  React.useEffect(() => {
    try {
      (window.adsbygoogle = window.adsbygoogle || []).push({});
    } catch (e) {}
  }, []);

  return (
    <div {...args}>
      <script
        async
        src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-5468215328024967"
        crossOrigin="anonymous"
      ></script>

      <ins
        className="adsbygoogle"
        style={{
          display: "block",
          border:
            process.env.NODE_ENV === "development" ? "1px solid red" : "unset",
        }}
        data-ad-client="ca-pub-5468215328024967"
        data-ad-slot={slot}
        data-ad-format="auto"
        data-ad-test="on"
        data-full-width-responsive="true"
      ></ins>
    </div>
  );
}

export default Ads;
