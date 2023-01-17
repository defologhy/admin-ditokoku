/** @type {import('next').NextConfig} */
// const nextConfig = {
//   env: {
//     REACT_APP_NAME: "ADMIN DITOKOKU",
//     REACT_APP_VERSION: "001.001.001",
//     REACT_APP_PORT: "3000",
//     REACT_APP_LANGUAGE: "INDONESIA",
//     REACT_APP_TIMEZONE: "Asia/Jakarta",
//     // REACT_APP_URL: "http://localhost:3002",
//     // REACT_APP_RESELLER_API_BASE_URL: "http://localhost:2694",
//     REACT_APP_URL: "https://admin-ditokoku.vercel.app/",
//     REACT_APP_RESELLER_API_BASE_URL: "https://api-ditokoku.herokuapp.com",
//     REACT_APP_RESELLER_API_VERSION_URL: "/api/v1",
//     REACT_APP_COOKIE_EXPIRES: "365"
//   },
//   reactStrictMode: true,
//   swcMinify: true,
// }

const nextConfig = {
  env: {
    REACT_APP_NAME: process.env.REACT_APP_NAME,
    REACT_APP_VERSION: process.env.REACT_APP_VERSION,
    REACT_APP_PORT: process.env.REACT_APP_PORT,
    REACT_APP_LANGUAGE: process.env.REACT_APP_LANGUAGE,
    REACT_APP_TIMEZONE: process.env.REACT_APP_TIMEZONE,
    // REACT_APP_URL: "http://localhost:3002",
    // REACT_APP_RESELLER_API_BASE_URL: "http://localhost:2694",
    REACT_APP_URL: process.env.REACT_APP_URL,
    REACT_APP_DITOKOKU_API_BASE_URL: process.env.REACT_APP_DITOKOKU_API_BASE_URL,
    REACT_APP_DITOKOKU_API_VERSION_URL: process.env.REACT_APP_DITOKOKU_API_VERSION_URL,
    REACT_APP_COOKIE_EXPIRES: process.env.REACT_APP_COOKIE_EXPIRES
  },
  reactStrictMode: true,
  swcMinify: true,
  async headers() {
    return [
      {
        // matching all API routes
        source: "/banners/:path*",
        headers: [
          { key: "Access-Control-Allow-Credentials", value: "true" },
          { key: "Access-Control-Allow-Origin", value: "*" },
          { key: "Access-Control-Allow-Methods", value: "GET,OPTIONS,PATCH,DELETE,POST,PUT" },
          { key: "Access-Control-Allow-Headers", value: "X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version" },
        ]
      }
    ]
  }
}


module.exports = nextConfig
