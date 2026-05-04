// Simple Cloudinary upload helper (uses unsigned uploads)
// Requires Vite env vars: VITE_CLOUDINARY_CLOUD_NAME and VITE_CLOUDINARY_UPLOAD_PRESET

export async function uploadToCloudinary(file) {
  const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
  const uploadPreset = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;

  if (!cloudName || !uploadPreset) {
    throw new Error('Cloudinary not configured. Set VITE_CLOUDINARY_CLOUD_NAME and VITE_CLOUDINARY_UPLOAD_PRESET');
  }

  const url = `https://api.cloudinary.com/v1_1/${cloudName}/auto/upload`;
  const form = new FormData();
  form.append('file', file);
  form.append('upload_preset', uploadPreset);

  const res = await fetch(url, { method: 'POST', body: form });
  if (!res.ok) {
    const text = await res.text();
    throw new Error('Upload failed: ' + text);
  }
  const data = await res.json();
  return data.secure_url;
}
