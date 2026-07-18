export const roleResponseMapper = (role: any) => {
  if (!role) return null;

  return {
    id: role.role_unq_id || role._id,
    roleCode: role.role_code,
    roleName: role.role_name,
    status: role.status,
    createdBy: role.created_by,
    createdAt: role.created_at,
    updatedBy: role.updated_by,
    updatedAt: role.updated_at,
  };
};
