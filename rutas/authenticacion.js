import express from "express";
import { register } from "../registro/authenticador.js";
import { login } from "../login/login.js";
import { checkOut } from "../config/checkOut.js";

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.get("/checkOut", checkOut);

export default router;