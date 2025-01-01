/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    // loader: "custom",
    // loaderFile: "./public/images",
    domains: [
      "res.cloudinary.com",
      "images.unsplash.com",
      "media.istockphoto.com",
      "www.notion.so",
    ],
  },
};

export default nextConfig;
