import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ collection: 'menu_master', timestamps: true })
export class MenuMongo extends Document {
  @Prop({ type: Number, unique: true, required: true })
  menu_code: number;

  @Prop({ type: String, required: true })
  menu_name: string;

  @Prop({ type: String, default: null })
  menu_desc?: string;

  @Prop({ type: Number, default: null })
  parent_menu?: number;

  @Prop({ type: Number, default: 1 })
  menu_level: number;

  @Prop({ type: Number, default: 1 })
  menu_seq: number;

  @Prop({ type: String, default: null })
  menu_url?: string;

  @Prop({ type: String, default: null })
  menu_icon?: string; // Base64 data

  @Prop({ type: Number, default: 1 }) // 0=Inactive,1=Active,2=Deleted
  status: number;

  @Prop({ type: String, default: null })
  created_by?: string;

  @Prop({ type: String, default: null })
  updated_by?: string;
}

export const MenuMongoSchema = SchemaFactory.createForClass(MenuMongo);
