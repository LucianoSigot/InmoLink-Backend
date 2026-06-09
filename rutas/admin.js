import { Router } from "express";
import { authRequired } from "../Middleware/authMiddleware.js";
import { adminRequired } from "../Middleware/adminMiddleware.js";
import {
  adminListProperties,
  adminGetPropertyDetail,
  adminUpdatePropertyStatus,
  adminDeleteProperty,
  adminListUsers,
  adminGetUserDetail,
  adminChangeUserRole,
  adminDeleteUser,
} from "../controladores/adminController.js";

const router = Router();

// All admin routes require auth + admin role
router.use(authRequired, adminRequired);

// ── Properties ──
router.get("/properties", adminListProperties);
router.get("/properties/:id", adminGetPropertyDetail);
router.put("/properties/:id/status", adminUpdatePropertyStatus);
router.delete("/properties/:id", adminDeleteProperty);

// ── Users ──
router.get("/users", adminListUsers);
router.get("/users/:id", adminGetUserDetail);
router.put("/users/:id/role", adminChangeUserRole);
router.delete("/users/:id", adminDeleteUser);

export default router;
