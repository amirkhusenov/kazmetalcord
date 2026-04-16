import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { CategoryPathManager } from "@/components/CategoryPathManager";
import { FloatingActionButton } from "@/components/FloatingActionButton";
import Script from "next/script";

const inter = Inter({
  subsets: ["latin", "cyrillic"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "KazMetalCord",
  description: "KazMetalCord - интернет-магазин металлопроката",
  icons: {
    icon: "/favicon.ico",
  },
  openGraph: {
    title: "KazMetalCord",
    description:
      "KazMetalCord - Приобрести металлопрокат по всему Казахстану. В наличии металлоизделия всех марок, сплавов и типов металлов по ценам от производителя. Полное соответствие требованиям ГОСТ и ТУ.",
    url: "https://kazmetalcord.kz",
    siteName: "KazMetalCord",
    images: [
      {
        url: "https://kazmetalcord.kz/hero.webp",
        width: 1200,
        height: 630,
        alt: "KazMetalCord",
      },
    ],
    locale: "ru_RU",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <Script data-goatcounter="https://nurma.goatcounter.com/count" async src="//gc.zgo.at/count.js" />
        <Script
          id="yandex-metrika"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `(function(m,e,t,r,i,k,a){m[i]=m[i]||function(){(m[i].a=m[i].a||[]).push(arguments)};
        m[i].l=1*new Date();
        for (var j = 0; j < document.scripts.length; j++) {if (document.scripts[j].src === r) { return; }}
        k=e.createElement(t),a=e.getElementsByTagName(t)[0],k.async=1,k.src=r,a.parentNode.insertBefore(k,a)})
        (window, document, "script", "https://mc.yandex.ru/metrika/tag.js", "ym");

        ym(101105898, "init", {
            clickmap:true,
            trackLinks:true,
            accurateTrackBounce:true,
            webvisor:true,
            ecommerce:"dataLayer"
        });`,
          }}
        />
        <noscript>
          <div>
            <img src="https://mc.yandex.ru/watch/101105898" style={{ position: "absolute", left: "-9999px" }} alt="" />
          </div>
        </noscript>
      </head>
      <body className={`${inter.className} antialiased`}>
        <CategoryPathManager />
        <nav className="fixed inset-x-0 top-0 z-50">
          <Navbar />
        </nav>
        <main className="pt-[62px] lg:pt-[56px]">{children}</main>
        <Footer />
        <FloatingActionButton />
      </body>
    </html>
  );
}
