/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  experimental: {
    ...(process.env.NODE_ENV === "development"
      ? {
          // Disable the devtools segment explorer that can break on this Windows/Next combo.
          devtoolSegmentExplorer: false,
          // Avoid reusing stale Server Component data across hot reloads.
          serverComponentsHmrCache: false,
        }
      : {}),
  },
  // Keep generated build artifacts off the OneDrive-backed .next tree.
  distDir: ".next-local",
};

module.exports = nextConfig;
