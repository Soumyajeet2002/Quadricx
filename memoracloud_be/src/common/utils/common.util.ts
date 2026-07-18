export function buildMenuTree(flatMenus: any[]) {
  const map = new Map<string, any>();
  const roots: any[] = [];

  // Initialize map & children
  flatMenus.forEach(menu => {
    map.set(menu.menuCode, { ...menu, children: [] });
  });

  // Build hierarchy
  flatMenus.forEach(menu => {
    const mappedMenu = map.get(menu.menuCode);

    if (
      menu.menuLevel === 1 ||
      !menu.parentMenu ||
      menu.parentMenu === menu.menuCode
    ) {
      roots.push(mappedMenu);
    } else {
      const parent = map.get(menu.parentMenu);
      if (parent) {
        parent.children.push(mappedMenu);
      }
    }
  });

  return roots;
}
