import { Router } from "express";
import passport from "passport";
import { setAuthCookie, generateToken } from "../servicios/servicioAuth.js";

const router = Router();

// Inicia login redirige a Google
router.get(
  "/google",
  passport.authenticate("google", {
    scope: ["profile", "email"],
  })
);

// Google vuelve a esta ruta
router.get(
  "/google/callback",
  passport.authenticate("google", {
    failureRedirect: "http://localhost:5173/login",
  }),
  (req, res) => {
    // Generar token JWT y establecer cookie
    const token = generateToken(req.user);
    setAuthCookie(res, token);
    
    // Redirigir al Frontend con autenticación establecida
    res.redirect("http://localhost:5173/auth/google/callback");
  }
);

//  Obtener usuario logueado
router.get("/user", (req, res) => {
  if (!req.user) return res.json({ logged: false });

  return res.json({
    logged: true,
    user: req.user,
  });
});

//  Logout
router.get("/logout", (req, res) => {
  req.logout(() => {});
  res.redirect("http://localhost:5173/login");
});

export default router;
