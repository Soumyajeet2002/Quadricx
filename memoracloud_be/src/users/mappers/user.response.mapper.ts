
export const userResponseMapper = (user: any) => {
  if (!user) return null;

  return {
    id: user.id,
    name: user.name,
    mobileNo: user.mobile,
    emailId: user.email,
    roleId: user.role_unq_id,
    roleCode: user.role?.role_code,
    roleName: user.role?.role_name ?? null,
    status: user.status
  };
};
