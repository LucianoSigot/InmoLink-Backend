//Destruye las cokies y deslogea la cuenta 
export const logout = (req, res) => {
    res.cookie('token', "",{
        expires: new Date(0) // Expira inmediatamente
    })
    return res.sendStatus(200);
}