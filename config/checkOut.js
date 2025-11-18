import jwt from "jsonwebtoken";
//Funcion que se encarga de verificar el token en la cookie
export const checkOut =(req, res) => {
    const token = req.cookies.token;
    //Si no tiene token es porque no se logeo, entonces le envio una respuesta de no autorizado
    if(!token){
        return res.status(401).json({auth: false, message: "No esta autorizado"});
    }
    //Si tiene token, verifico que sea valido
    try {
        jwt.verify(token, process.env.JWT_SECRET);
        //Si el token es valido, envio una respuesta de autorizado 201
        return res.status(201).json({auth: true, message: "Usuario autorizado"});
    } catch (error) {
        //Si el token no es valido, envio una respuesta de no autorizado 401
        return res.status(401).json({auth: false, message: "Token no valido"});
    }
}