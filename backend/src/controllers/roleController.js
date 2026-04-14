const { pool } = require("../config/mysql");

async function getRoles(req, res, next) {
  try {
    const [roles] = await pool.query(
      "SELECT id, name, description, created_at FROM backend_roles",
    );
    res.json(roles);
  } catch (error) {
    next(error);
  }
}

async function getRoleById(req, res, next) {
  try {
    const { id } = req.params;
    const [roles] = await pool.query(
      "SELECT * FROM backend_roles WHERE id = ?",
      [id],
    );
    if (roles.length === 0) {
      return res.status(404).json({ message: "Role not found" });
    }

    // Get permissions for this role
    const [permissions] = await pool.query(
      `SELECT p.id, p.name, p.description 
       FROM backend_permissions p
       JOIN backend_role_permissions rp ON p.id = rp.permission_id
       WHERE rp.role_id = ?`,
      [id],
    );

    res.json({ ...roles[0], permissions });
  } catch (error) {
    next(error);
  }
}

async function createRole(req, res, next) {
  try {
    const { name, description, permissions = [] } = req.body;

    // Check if role already exists
    const [existingRoles] = await pool.query(
      "SELECT * FROM backend_roles WHERE name = ?",
      [name],
    );
    if (existingRoles.length > 0) {
      return res.status(400).json({ message: "Role already exists" });
    }

    // Create role
    const [result] = await pool.query(
      "INSERT INTO backend_roles (name, description) VALUES (?, ?)",
      [name, description],
    );
    const roleId = result.insertId;

    // Assign permissions
    if (permissions.length > 0) {
      const permissionValues = permissions.map((permissionId) => [
        roleId,
        permissionId,
      ]);
      await pool.query(
        "INSERT INTO backend_role_permissions (role_id, permission_id) VALUES ?",
        [permissionValues],
      );
    }

    res.status(201).json({ message: "Role created successfully" });
  } catch (error) {
    next(error);
  }
}

async function updateRole(req, res, next) {
  try {
    const { id } = req.params;
    const { name, description, permissions = [] } = req.body;

    // Check if role exists
    const [existingRoles] = await pool.query(
      "SELECT * FROM backend_roles WHERE id = ?",
      [id],
    );
    if (existingRoles.length === 0) {
      return res.status(404).json({ message: "Role not found" });
    }

    // Check if name is already taken by another role
    const [conflictingRoles] = await pool.query(
      "SELECT * FROM backend_roles WHERE name = ? AND id != ?",
      [name, id],
    );
    if (conflictingRoles.length > 0) {
      return res.status(400).json({ message: "Role name already exists" });
    }

    // Update role
    await pool.query(
      "UPDATE backend_roles SET name = ?, description = ? WHERE id = ?",
      [name, description, id],
    );

    // Update permissions
    await pool.query("DELETE FROM backend_role_permissions WHERE role_id = ?", [
      id,
    ]);
    if (permissions.length > 0) {
      const permissionValues = permissions.map((permissionId) => [
        id,
        permissionId,
      ]);
      await pool.query(
        "INSERT INTO backend_role_permissions (role_id, permission_id) VALUES ?",
        [permissionValues],
      );
    }

    res.json({ message: "Role updated successfully" });
  } catch (error) {
    next(error);
  }
}

async function deleteRole(req, res, next) {
  try {
    const { id } = req.params;

    // Check if role exists
    const [existingRoles] = await pool.query(
      "SELECT * FROM backend_roles WHERE id = ?",
      [id],
    );
    if (existingRoles.length === 0) {
      return res.status(404).json({ message: "Role not found" });
    }

    // Delete role (cascade will delete related permissions and user roles)
    await pool.query("DELETE FROM backend_roles WHERE id = ?", [id]);

    res.json({ message: "Role deleted successfully" });
  } catch (error) {
    next(error);
  }
}

async function getPermissions(req, res, next) {
  try {
    const [permissions] = await pool.query(
      "SELECT id, name, description, created_at FROM backend_permissions",
    );
    res.json(permissions);
  } catch (error) {
    next(error);
  }
}

async function assignRoleToUser(req, res, next) {
  try {
    const { userId, roleId } = req.body;

    // Check if user exists
    const [users] = await pool.query(
      "SELECT * FROM backend_user WHERE id = ?",
      [userId],
    );
    if (users.length === 0) {
      return res.status(404).json({ message: "User not found" });
    }

    // Check if role exists
    const [roles] = await pool.query(
      "SELECT * FROM backend_roles WHERE id = ?",
      [roleId],
    );
    if (roles.length === 0) {
      return res.status(404).json({ message: "Role not found" });
    }

    // Check if role is already assigned
    const [existingAssignments] = await pool.query(
      "SELECT * FROM backend_user_roles WHERE user_id = ? AND role_id = ?",
      [userId, roleId],
    );
    if (existingAssignments.length > 0) {
      return res.status(400).json({ message: "Role already assigned to user" });
    }

    // Assign role to user
    await pool.query(
      "INSERT INTO backend_user_roles (user_id, role_id) VALUES (?, ?)",
      [userId, roleId],
    );

    res.json({ message: "Role assigned successfully" });
  } catch (error) {
    next(error);
  }
}

async function removeRoleFromUser(req, res, next) {
  try {
    const { userId, roleId } = req.body;

    // Remove role from user
    const [result] = await pool.query(
      "DELETE FROM backend_user_roles WHERE user_id = ? AND role_id = ?",
      [userId, roleId],
    );
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Role assignment not found" });
    }

    res.json({ message: "Role removed successfully" });
  } catch (error) {
    next(error);
  }
}

async function getUserRoles(req, res, next) {
  try {
    const { userId } = req.params;

    // Check if user exists
    const [users] = await pool.query(
      "SELECT * FROM backend_user WHERE id = ?",
      [userId],
    );
    if (users.length === 0) {
      return res.status(404).json({ message: "User not found" });
    }

    // Get user roles
    const [roles] = await pool.query(
      `SELECT r.id, r.name, r.description 
       FROM backend_roles r
       JOIN backend_user_roles ur ON r.id = ur.role_id
       WHERE ur.user_id = ?`,
      [userId],
    );

    res.json(roles);
  } catch (error) {
    next(error);
  }
}

module.exports = {
  getRoles,
  getRoleById,
  createRole,
  updateRole,
  deleteRole,
  getPermissions,
  assignRoleToUser,
  removeRoleFromUser,
  getUserRoles,
};
