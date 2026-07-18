
export const mapUserReq = (dto: any) => {
  return {
    name: dto.name,
    email: dto.emailId,
    mobile: dto.mobileNo,
    role_unq_id: dto.roleId,
    refresh_token_hash: dto.refreshToken,
    password_hash: dto.password_hash,
    created_by: (dto as any).createdBy ?? null,
    updated_by: (dto as any).updatedBy ?? null,
    status: dto.status ?? 1,
  };
};

export const mapUserMongo = (dto: any) => {
  return {
    name: dto.name,
    email: dto.emailId,
    mobile: dto.mobileNo,
    role_unq_id: dto.roleId,
    refresh_token_hash: dto.refreshToken,
    password_hash: dto.password_hash,
    created_by: (dto as any).createdBy ?? null,
    updated_by: (dto as any).updatedBy ?? null,
    status: dto.status ?? 1,
  };
};