import api from "./axios"; // use your axios instance

// Get signed Cloudinary params from backend
export const getCloudinarySignature = async () => {
  const res = await api.get("/upload/cloudinary-signature");
  return res.data;
};

// Upload file directly to Cloudinary
export const uploadToCloudinary = async (file) => {
  const params = await getCloudinarySignature();

  const formData = new FormData();
  formData.append("file", file);
  formData.append("folder", params.folder);
  formData.append("timestamp", params.timestamp);
  formData.append("api_key", params.api_key);
  formData.append("signature", params.signature);

  const cloudinaryUrl = `https://api.cloudinary.com/v1_1/${import.meta.env.VITE_CLOUDINARY_CLOUD_NAME}/image/upload`;

  const uploadRes = await fetch(cloudinaryUrl, {
    method: "POST",
    body: formData,
  });

  if (!uploadRes.ok) {
    throw new Error("Cloudinary upload failed");
  }

  const data = await uploadRes.json();
  return {
    public_id: data.public_id,
    url: data.secure_url,
    version: data.version,
  };
};