import ImageKit from "imagekit";

// Safety check
if (
  !process.env.IMAGEKIT_PUBLIC_KEY ||
  !process.env.IMAGEKIT_PRIVATE_KEY ||
  !process.env.IMAGEKIT_URL_ENDPOINT
) {
  throw new Error("❌ ImageKit environment variables are missing");
}

// ✅ CORRECT INITIALIZATION
const imageKit = new ImageKit({
  publicKey: process.env.IMAGEKIT_PUBLIC_KEY,   // ✅ public key yahan
  privateKey: process.env.IMAGEKIT_PRIVATE_KEY, // ✅ private key yahan
  urlEndpoint: process.env.IMAGEKIT_URL_ENDPOINT,
});

export default imageKit;
