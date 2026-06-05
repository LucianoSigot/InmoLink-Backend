import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import User from "../models/user.js";

// Función para configurar Google OAuth
export const configureGoogleOAuth = () => {
  // Solo configura Google OAuth si las credenciales están disponibles
  if (process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET) {
    console.log("Configurando Google OAuth Strategy");
    
    // Estrategia Google
    passport.use(
      new GoogleStrategy(
        {
          clientID: process.env.GOOGLE_CLIENT_ID,
          clientSecret: process.env.GOOGLE_CLIENT_SECRET,
          callbackURL: "http://localhost:4000/auth/google/callback",
        },
        async (accessToken, refreshToken, profile, done) => {
          try {
            const email = profile.emails[0].value;
            const name = profile.displayName;
            const picture = profile.photos[0]?.value || null;

            // Buscar o crear usuario en MongoDB
            let usuario = await User.findOne({ email });
            
            if (!usuario) {
              usuario = new User({
                email,
                name,
                foto: picture,
                googleId: profile.id
              });
              await usuario.save();
            }

            done(null, usuario);
          } catch (error) {
            done(error);
          }
        }
      )
    );

    // Guardar usuario en sesión 
    passport.serializeUser((user, done) => {
      done(null, user._id);
    });

    // Recuperar usuario de sesión desde MongoDB
    passport.deserializeUser(async (id, done) => {
      try {
        const user = await User.findById(id);
        done(null, user);
      } catch (error) {
        done(error);
      }
    });
  } else {
    console.warn("  Google OAuth no configurado (falta GOOGLE_CLIENT_ID o GOOGLE_CLIENT_SECRET)");
  }
};
