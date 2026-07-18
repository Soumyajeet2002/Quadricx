// menu.request.mapper.ts
export const toMenuSql = (dto: any) => ({
  menu_code: dto.menuCode,
  menu_name: dto.menuName,
  menu_desc: dto.menuDesc,
  parent_menu: dto.parentMenu,
  menu_level: dto.menuLevel,
  menu_seq: dto.menuSeq,
  menu_url: dto.menuUrl,
  menu_icon: dto.menuIcon,
  menu_type : dto.menuType,
  status: dto.status ?? 1,
});

export const toMenuMongo = (dto: any) => ({
  menu_code: dto.menuCode,
  menu_name: dto.menuName,
  menu_desc: dto.menuDesc,
  parent_menu: dto.parentMenu,
  menu_level: dto.menuLevel,
  menu_seq: dto.menuSeq,
  menu_url: dto.menuUrl,
  menu_icon: dto.menuIcon,
  status: dto.status ?? 1,
});
