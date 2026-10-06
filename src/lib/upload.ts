import { supabase } from '@/lib/supabase';

export async function uploadFile(
  file: File,
  folder: string
): Promise<{ url: string; error: string | null }> {
  const ext = file.name.split('.').pop();
  const fileName = `${folder}/${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;

  const { error: uploadError } = await supabase.storage
    .from('katana-media')
    .upload(fileName, file, { cacheControl: '3600', upsert: false });

  if (uploadError) {
    return { url: '', error: uploadError.message };
  }

  const { data } = supabase.storage.from('katana-media').getPublicUrl(fileName);
  return { url: data.publicUrl, error: null };
}

export function isVideoFile(file: File): boolean {
  return file.type.startsWith('video/');
}

export function isImageFile(file: File): boolean {
  return file.type.startsWith('image/');
}

export function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1048576) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / 1048576).toFixed(1)} MB`;
}
