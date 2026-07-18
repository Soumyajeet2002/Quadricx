export const roleMenuPermissionMapper = (data: any) => ({
  id: data.id ?? data._id,
  roleUnqId: data.role_unq_id,
  menuUnqId: data.menu_unq_id,
  canRead: data.can_read,
  canWrite: data.can_write,
  canDelete: data.can_delete,
  canApprove: data.can_approve,
});
