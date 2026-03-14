import type { NextApiRequest, NextApiResponse } from 'next';
import { getAuth } from '@clerk/nextjs/server';
import { supabaseAdmin } from '@/lib/supabase';
import { IncomingForm, File } from 'formidable';
import fs from 'fs';
import path from 'path';

// Disable Next.js body parser so formidable can handle file uploads
export const config = {
  api: { bodyParser: false },
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { userId } = getAuth(req);
  if (!userId) return res.status(401).json({ error: 'Unauthorized' });

  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  try {
    const form = new IncomingForm({
      maxFileSize: 5 * 1024 * 1024, // 5MB
      keepExtensions: true,
    });

    const [fields, files] = await new Promise<[any, any]>((resolve, reject) => {
      form.parse(req, (err, fields, files) => {
        if (err) reject(err);
        else resolve([fields, files]);
      });
    });

    const fileArray = files.file;
    const file: File = Array.isArray(fileArray) ? fileArray[0] : fileArray;

    if (!file) return res.status(400).json({ error: 'No file provided' });

    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
    if (!allowedTypes.includes(file.mimetype || '')) {
      return res.status(400).json({ error: 'Invalid file type. Use JPEG, PNG, GIF, or WebP.' });
    }

    // Read file buffer
    const fileBuffer = fs.readFileSync(file.filepath);
    const ext = path.extname(file.originalFilename || '.jpg');
    const fileName = `${userId}/${Date.now()}${ext}`;

    // Upload to Supabase Storage
    const { data, error } = await supabaseAdmin.storage
      .from('card-images')
      .upload(fileName, fileBuffer, {
        contentType: file.mimetype || 'image/jpeg',
        cacheControl: '31536000', // 1 year cache
        upsert: false,
      });

    if (error) return res.status(500).json({ error: error.message });

    // Get public URL
    const { data: urlData } = supabaseAdmin.storage
      .from('card-images')
      .getPublicUrl(data.path);

    // Clean up temp file
    fs.unlinkSync(file.filepath);

    return res.status(200).json({ url: urlData.publicUrl });
  } catch (err: any) {
    return res.status(500).json({ error: err.message || 'Upload failed' });
  }
}

