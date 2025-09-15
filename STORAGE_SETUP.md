# Supabase Storage Setup for Building Photos

## Manual Setup Steps

1. **Go to Supabase Dashboard**
   - Visit your Supabase project dashboard
   - Navigate to Storage section

2. **Create Storage Bucket**
   - Click "New bucket"
   - Name: `building-photos`
   - Make it **Public**
   - Click "Create bucket"

3. **Set Up RLS Policies**
   - Go to Authentication > Policies
   - Create the following policies for `storage.objects`:

   **Policy 1: Public Read Access**
   ```sql
   CREATE POLICY "Public read access for building photos" ON storage.objects
   FOR SELECT USING (bucket_id = 'building-photos');
   ```

   **Policy 2: Authenticated Upload**
   ```sql
   CREATE POLICY "Authenticated users can upload building photos" ON storage.objects
   FOR INSERT WITH CHECK (
     bucket_id = 'building-photos' 
     AND auth.role() = 'authenticated'
   );
   ```

   **Policy 3: Authenticated Update**
   ```sql
   CREATE POLICY "Authenticated users can update building photos" ON storage.objects
   FOR UPDATE USING (
     bucket_id = 'building-photos' 
     AND auth.role() = 'authenticated'
   );
   ```

   **Policy 4: Authenticated Delete**
   ```sql
   CREATE POLICY "Authenticated users can delete building photos" ON storage.objects
   FOR DELETE USING (
     bucket_id = 'building-photos' 
     AND auth.role() = 'authenticated'
   );
   ```

4. **Test Upload**
   - Go to admin panel
   - Upload photos for a building
   - Check if photos appear on the condo page

## Current Implementation

- Photos are uploaded to Supabase Storage bucket `building-photos`
- URLs are stored in the database as public URLs
- Condo page displays photos from Supabase Storage
- Fallback to default images if no photos available
