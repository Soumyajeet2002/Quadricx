/* ---------- Types ---------- */

interface PermissionInput {
  canRead?: boolean;
  canWrite?: boolean;
  canDelete?: boolean;
  canApprove?: boolean;
}

interface MenuNode {
  menuUnqId: string;
  permissions?: PermissionInput;
  children?: MenuNode[];
}

interface NormalizedPermissionRow {
  role_unq_id: string;
  menu_unq_id: string;
  can_read: boolean;
  can_write: boolean;
  can_delete: boolean;
  can_approve: boolean;
}

/* ---------- Normalizer ---------- */

export function normalizeRoleMenuPermissions(
  roleUnqId: string,
  menus: MenuNode[],
): NormalizedPermissionRow[] {
  const rows: NormalizedPermissionRow[] = [];

  const walk = (
    node: MenuNode,
    parentPerm?: NormalizedPermissionRow,
  ): void => {
    const selfPerm = node.permissions ?? {};

    /* Rule:
       If parent is READ-ONLY → children READ-ONLY
    */
    const isParentReadOnly =
      parentPerm &&
      parentPerm.can_read &&
      !parentPerm.can_write &&
      !parentPerm.can_delete &&
      !parentPerm.can_approve;

    const row: NormalizedPermissionRow = {
      role_unq_id: roleUnqId,
      menu_unq_id: node.menuUnqId,
      can_read: isParentReadOnly ? true : !!selfPerm.canRead,
      can_write: isParentReadOnly ? false : !!selfPerm.canWrite,
      can_delete: isParentReadOnly ? false : !!selfPerm.canDelete,
      can_approve: isParentReadOnly ? false : !!selfPerm.canApprove,
    };

    rows.push(row);

    if (node.children?.length) {
      node.children.forEach((child) => walk(child, row));
    }
  };

  menus.forEach((menu) => walk(menu));

  return rows;
}
