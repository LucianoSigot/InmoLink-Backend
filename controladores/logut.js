//Destruye las cokies y deslogea la cuenta 
export const logout = (req, res) =>{
    res.clearCookie({
        httpOnly: true,
        sameSite: "lax",
        secure: process.env.NODE_ENV === "production"
    });
}