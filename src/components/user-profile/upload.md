# 📤 Media Upload Guide (Frontend)

This section explains how to handle image/video uploads. We use a **Direct-to-Cloudinary** flow to keep the backend light and fast.

## The Flow
1. **Frontend** asks Backend for a "Signature" (permission to upload).
2. **Backend** returns a secure signature + API key + Upload URL.
3. **Frontend** uploads the file directly to Cloudinary using that signature.
4. **Cloudinary** returns the `secure_url` of the uploaded image.
5. **Frontend** sends this `secure_url` to the Backend (e.g., when creating a property).

---

## Step 1: Get Upload Signature
Call this endpoint before uploading any file.

**Endpoint:** `POST /api/media/upload-signature`  
**Headers:** `Authorization: Bearer <admin_token>`

**Request Body (JSON):**
```json
{
  "property_id": 123,          // Optional: Groups images by property in Cloudinary
  "resource_type": "image",    // "image" or "video"
  "file_size_bytes": 102400    // Optional: Size of file in bytes
}
```

**Response:**
```json
{
  "signature": "a6fd...",
  "timestamp": 1705829...,
  "api_key": "6396...",
  "cloud_name": "dsjl...",
  "folder": "pol-properties/property_123",
  "upload_url": "https://api.cloudinary.com/v1_1/dsjl.../image/upload"
}
```

---

## Step 2: Upload to Cloudinary
Use the data from Step 1 to upload the file.

**JavaScript Example (using Fetch):**
```javascript
const formData = new FormData();
formData.append("file", fileInput.files[0]); // The file object
formData.append("api_key", response.api_key);
formData.append("timestamp", response.timestamp);
formData.append("signature", response.signature);
formData.append("folder", response.folder);

const uploadRes = await fetch(response.upload_url, {
  method: "POST",
  body: formData
});

const data = await uploadRes.json();
const imageUrl = data.secure_url; // 👈 THIS IS WHAT YOU NEED
console.log("Uploaded URL:", imageUrl);
```

---

## 🎥 Handling Video Uploads

### 📦 File Size Limits & Strategy
- **Small Files (0 - 100MB)**: Can be uploaded in a single request (standard `fetch`).
- **Large Files (100MB - 4GB+)**: **MUST** be uploaded in chunks.
- **Our Limit**: We support uploads up to **500MB** when using chunked uploads.

The process for videos is exactly the same, but you **MUST** set `resource_type: "video"` when requesting the signature.

1. **Request Signature for Video:**
   ```json
   {
     "resource_type": "video",
     "property_id": 123
   }
   ```

2. **Backend Response:**
   The `upload_url` will automatically change to `.../video/upload`.

3. **Frontend Upload:**
   
   **✅ OPTION A: For files < 100MB (Simple)**
   Use the standard `fetch` code shown in Step 2.

   **✅ OPTION B: For files > 100MB (REQUIRED for 200MB-500MB)**
   You **MUST** use the Cloudinary Upload Widget or the Cloudinary JS SDK. These tools automatically slice the file into 6MB chunks to bypass the 100MB limit.

   **Recommended: Use Cloudinary Upload Widget**
   ```html
   <!-- 1. Include the Widget Script -->
   <script src="https://upload-widget.cloudinary.com/global/all.js" type="text/javascript"></script>
   
   <script type="text/javascript">
   // 2. Configure the Widget
   var myWidget = cloudinary.createUploadWidget({
     cloudName: 'your_cloud_name', 
     uploadPreset: null, // We use signed uploads, so preset is null
     
     // 🔐 Security Parameters (from our Backend)
     apiKey: response.api_key,
     uploadSignature: response.signature,
     uploadSignatureTimestamp: response.timestamp,
     folder: response.folder,
     
     // ⚙️ Large File Settings
     sources: ['local', 'url'],
     resourceType: 'video',
     clientAllowedFormats: ['mp4', 'mov', 'avi'],
    maxFileSize: 550000000, // 550MB limit (enforces 500MB rule client-side)
     
   }, (error, result) => { 
     if (!error && result && result.event === "success") { 
       console.log('✅ Upload Complete:', result.info.secure_url); 
       // Call your backend to save this URL
     }
   });

   // 3. Open the Widget
   myWidget.open();
   </script>
   ```

---

## Step 3: Send URL to Admin Endpoint
Now include the `imageUrl` (or `videoUrl`) when creating a property or update.

### Example: Creating a Property
**Endpoint:** `POST /api/admin/properties`
```json
{
  "title": "Luxury Villa",
  "location": "Lekki Phase 1",
  "image_urls": [
    "https://res.cloudinary.com/dsjl.../image/upload/v1/villa_front.jpg", 
    "https://res.cloudinary.com/dsjl.../image/upload/v1/villa_pool.jpg"
  ],
  "price": 50000000
}
```

### Example: Creating an Update
**Endpoint:** `POST /api/admin/updates`
```json
{
  "title": "Construction Update",
  "content": "We have completed the foundation...",
  "image_url": "https://res.cloudinary.com/dsjl.../image/upload/v1/foundation.jpg"
}
```
