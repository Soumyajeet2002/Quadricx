import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ timestamps: true })
export class UserMongo extends Document {
  @Prop({ unique: true })
  mobile: string;

  @Prop()
  name?: string;

  @Prop()
  email?: string;

  @Prop({ default: 'user' })
  role: string;

  @Prop()
  refresh_token_hash?: string;

  @Prop()
  password_hash?: string;

  @Prop({ index: true })
  role_unq_id?: string;

  @Prop({ default: 1 })
  status: number;

  @Prop()
  created_by?: string;

  @Prop()
  updated_by?: string;

  // created_at & updated_at come from timestamps
  created_at: Date;
  updated_at: Date;
}

export const UserMongoSchema = SchemaFactory.createForClass(UserMongo);
