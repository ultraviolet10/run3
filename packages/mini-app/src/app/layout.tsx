import type { Metadata } from "next";
import { Dela_Gothic_One, Schibsted_Grotesk } from "next/font/google";

import { getSession } from "~/auth";
import "~/app/globals.css";
import { Providers } from "~/app/providers";
import { APP_NAME, APP_DESCRIPTION } from "~/lib/constants";

// Initialize the Dela Gothic One font
const delagothicone = Dela_Gothic_One({
  subsets: ["latin"],
  display: "swap",
  weight: ["400"],
  variable: "--font-delagothicone",
});

const grotesk = Schibsted_Grotesk({
  subsets: ["latin"],
  display: "swap",
  weight: ["400", "500", "600", "700"],
  variable: "--font-grotesk",
});

export const metadata: Metadata = {
  title: APP_NAME,
  description: APP_DESCRIPTION,
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await getSession();

  return (
    <html lang="en" className={`${delagothicone.variable} ${grotesk.variable}`}>
      <body>
        <Providers session={session}>{children}</Providers>
      </body>
    </html>
  );
}
