import { BadRequestException, Injectable } from '@nestjs/common';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { env } from 'src/common/utils/env';

@Injectable()
export class FileService {
  private supabase: SupabaseClient;
  private bucket: string;

  constructor() {
    this.supabase = createClient(
      env("SUPABASE_URL"),
      env("SUPABASE_KEY"),
    ); 
    this.bucket = env('SUPABASE_BUCKET')
  }

  async upload(file: Express.Multer.File) {
    const filename = `uploads/${Date.now()}-${file.originalname}`;

    const { data, error } = await this.supabase.storage
      .from(this.bucket)
      .upload(filename, file.buffer, {
        contentType: file.mimetype,
        upsert: false,
      });

    if (error) {
      throw new BadRequestException(error.message);
    }

    const {
      data: { publicUrl },
    } = this.supabase.storage.from(this.bucket).getPublicUrl(data.path);

    return {
      success: true,
      path: data.path,
      url: publicUrl,
    };
  }

  async remove(path: string) {
    const { error } = await this.supabase.storage
      .from(this.bucket)
      .remove([path]);

    if (error) {
      throw new BadRequestException(error.message);
    }

    return { success: true };
  }
}
