export const menuResponseMapper = (data: any) => {
  if (!data) return null;
  return {
    id: data.menu_unq_id ?? data._id,
    menuCode: data.menu_code,
    menuName: data.menu_name,
    menuDesc: data.menu_desc,
    parentMenu: data.parent_menu,
    menuLevel: data.menu_level,
    menuSeq: data.menu_seq,
    menuUrl: data.menu_url,
    menuIcon: data.menu_icon,
    status: data.status,
    // createdBy: data.created_by,
    // createdAt: data.created_at,
    // updatedBy: data.updated_by,
    // updatedAt: data.updated_at,
    menuType : data.menu_type //newly added , requested by FE team 
  };
};
