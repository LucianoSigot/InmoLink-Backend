import express from "express";
import { register } from "../registro/authenticador.js";
import { login } from "../login/login.js";
import { checkOut } from "../config/checkOut.js";
import { logout } from "../controladores/logout.js";
import { getPerfil, deleteCuenta, updatePerfil } from "../controladores/perfil.controller.js";
import { uploadProfileImage, deleteProfileImage } from "../controladores/upload.controller.js";
import { authRequired } from "../Middleware/authMiddleware.js"
import { validarSchema } from "../Middleware/validatorMiddleware.js"
import { registroSchema, loginSchema } from "../schemas/auth.schemas.js"
import { upload } from "../config/multer.js"

const router = express.Router();

router.post("/register", validarSchema(registroSchema), register);
router.post("/login", validarSchema(loginSchema), login);
router.get("/checkOut", checkOut);
router.post("/logout", logout)
router.get("/perfil", authRequired, getPerfil)
router.delete("/perfil", authRequired, deleteCuenta)
router.put("/perfil", authRequired, updatePerfil)
router.post("/upload-profile-image", authRequired, upload.single('image'), uploadProfileImage)
router.delete("/delete-profile-image", authRequired, deleteProfileImage)

export default router;