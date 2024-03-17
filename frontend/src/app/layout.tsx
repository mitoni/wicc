import "@mantine/core/styles.css";
import "./global.css";
import { MantineProvider, MantineProviderProps } from "@mantine/core";

import { Instrument_Sans } from "next/font/google";
const instrumentSans = Instrument_Sans({
  weight: ["400", "600"],
  subsets: ["latin"],
});

import { Cormorant } from "next/font/google";
const cormorant = Cormorant({ weight: ["400", "600"], subsets: ["latin"] });

export const metadata = {
  title: "What I Can Cook",
  description:
    "Simple recipes finder from ingredients you have to avoid wasting food",
};

const theme: MantineProviderProps["theme"] = {
  primaryColor: "gray",
  primaryShade: 9,
  fontFamily: instrumentSans.style.fontFamily,
  headings: {
    fontFamily: cormorant.style.fontFamily,
    sizes: {
      h1: { fontSize: "5.61rem" },
      h2: { fontSize: "4.209rem" },
      h3: { fontSize: "3.157rem" },
      h4: { fontSize: "2.369rem" },
      h5: { fontSize: "1.777rem" },
      h6: { fontSize: "1.333rem" },
    },
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body
        style={{
          maxWidth: "100vw",
          minHeight: "100vh",
          overflowX: "hidden",
          background: "#ebedee",
        }}
      >
        <MantineProvider theme={theme}>{children}</MantineProvider>
      </body>
    </html>
  );
}
