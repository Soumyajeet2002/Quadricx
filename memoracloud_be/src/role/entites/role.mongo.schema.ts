import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' } })
export class RoleMongo extends Document {
  @Prop({ type: Number, unique: true })
  role_code: number;

  @Prop({ type: String, unique: true })
  role_name: string;

  @Prop({ default: 1 })
  status: number; // 0=Inactive,1=Active,2=Delete

  @Prop()
  created_by: string;

  @Prop()
  updated_by: string;
}

export const RoleMongoSchema = SchemaFactory.createForClass(RoleMongo);
