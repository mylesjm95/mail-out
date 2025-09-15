-- Create storage policies for building photos
-- This allows public read access to building photos

-- Policy for public read access to building-photos bucket
CREATE POLICY "Public read access for building photos" ON storage.objects
FOR SELECT USING (bucket_id = 'building-photos');

-- Policy for authenticated users to upload building photos
CREATE POLICY "Authenticated users can upload building photos" ON storage.objects
FOR INSERT WITH CHECK (
  bucket_id = 'building-photos' 
  AND auth.role() = 'authenticated'
);

-- Policy for authenticated users to update building photos
CREATE POLICY "Authenticated users can update building photos" ON storage.objects
FOR UPDATE USING (
  bucket_id = 'building-photos' 
  AND auth.role() = 'authenticated'
);

-- Policy for authenticated users to delete building photos
CREATE POLICY "Authenticated users can delete building photos" ON storage.objects
FOR DELETE USING (
  bucket_id = 'building-photos' 
  AND auth.role() = 'authenticated'
);
