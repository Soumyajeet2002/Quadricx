export interface MenuWithPermission {
  menuId: string; // unique_id in SQL / _id in Mongo
  menuCode: number; // menu_code
  menuName: string;
  menuDesc?: string;
  parentMenu?: number | null; // parent menu_code
  menuLevel: number;
  menuSeq: number;
  menuUrl?: string;
  menuIcon?: string;
  permissions: {
    canRead: boolean;
    canWrite: boolean;
    canDelete: boolean;
    canApprove: boolean;
  };
  children?: MenuWithPermission[];
}

/**
 * Builds a hierarchical menu tree from a flat list of menus.
 * Auto-disables children if parent has read-only permissions.
 */
export function buildMenuTree(flatList: MenuWithPermission[]): MenuWithPermission[] {
  const map = new Map<number, MenuWithPermission>();
  const roots: MenuWithPermission[] = [];

  // Initialize map
  flatList.forEach((item) => {
    map.set(item.menuCode, { ...item, children: [] });
  });

  // Recursive function to apply parent read-only propagation
  function propagateReadOnly(node: MenuWithPermission, parentReadOnly = false) {
    const isParentReadOnly = parentReadOnly || 
      (node.permissions.canRead && !node.permissions.canWrite && !node.permissions.canDelete && !node.permissions.canApprove);

    if (isParentReadOnly) {
      node.permissions.canWrite = false;
      node.permissions.canDelete = false;
      node.permissions.canApprove = false;
    }

    node.children?.forEach((child) => propagateReadOnly(child, isParentReadOnly));
  }

  // Build hierarchy
  flatList.forEach((item) => {
    const current = map.get(item.menuCode)!;

    if (item.parentMenu && item.parentMenu != item.menuCode && map.has(item.parentMenu)) {
      map.get(item.parentMenu)!.children!.push(current);
    } else {
      roots.push(current);
    }
  });

  // Apply read-only propagation
  roots.forEach((root) => propagateReadOnly(root));

  return roots;
}
