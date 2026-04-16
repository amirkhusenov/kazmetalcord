/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: "https://kazmetalcord.kz",
  generateRobotsTxt: true,
  robotsTxtOptions: {
    policies: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/api/", "/_next/", "/server/", "/static/", "/favicon.ico", "/404", "/500"],
      },
    ],
  },
};
