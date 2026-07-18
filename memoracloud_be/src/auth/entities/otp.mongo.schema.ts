import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class OtpMongo extends Document {
  @Prop({ required: true })
  mobile: string;

  @Prop({ required: true })
  otp: string;

  @Prop({ default: Date.now })
  createdAt: Date;
}

export const OtpMongoSchema = SchemaFactory.createForClass(OtpMongo);
