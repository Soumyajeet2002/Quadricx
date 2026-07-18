export const toRoleSql = (dto: any) => {
  return {
    role_code: dto.roleCode,
    role_name: dto.roleName,
    created_by: (dto as any).createdBy ?? null,
    updated_by: (dto as any).updatedBy ?? null,
    status: dto.status ?? 1,
  };
};

export const toRoleMongo = (dto: any) => {
  return {
    role_code: dto.roleCode,
    role_name: dto.roleName,
    created_by: (dto as any).createdBy ?? null,
    updated_by: (dto as any).updatedBy ?? null,
    status: dto.status ?? 1,
  };
};