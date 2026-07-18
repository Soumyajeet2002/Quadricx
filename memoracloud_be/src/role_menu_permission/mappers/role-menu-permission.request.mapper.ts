export const toRoleMenuPermissionSql = (data: any) => ({
  role_unq_id: data.role_unq_id,
  menu_unq_id: data.menu_unq_id,
  can_read: data.can_read,
  can_write: data.can_write,
  can_delete: data.can_delete,
  can_approve: data.can_approve,
});

export const toRoleMenuPermissionMongo = toRoleMenuPermissionSql;
