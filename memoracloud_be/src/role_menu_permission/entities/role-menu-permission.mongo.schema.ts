import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document } from 'mongoose';

@Schema({ collection: 'role_menu_permissions', timestamps: true })
export class RoleMenuPermissionMongo extends Document {
  @Prop({ required: true })
  role_unq_id: string;

  @Prop({ required: true })
  menu_unq_id: string;

  @Prop({ default: false })
  can_read: boolean;

  @Prop({ default: false })
  can_write: boolean;

  @Prop({ default: false })
  can_delete: boolean;

  @Prop({ default: false })
  can_approve: boolean;
}

export const RoleMenuPermissionMongoSchema =
  SchemaFactory.createForClass(RoleMenuPermissionMongo);

// Composite unique index
RoleMenuPermissionMongoSchema.index(
  { role_unq_id: 1, menu_unq_id: 1 },
  { unique: true },
);
