const jwt = require('jsonwebtoken');



/*====================
    VERIFICAR TOKEN   
======================
*/

let verificaToken = (req, res, next) => {
    let token = req.get('token'); //está en el header

    jwt.verify(token, process.env.SEED, (err, decoded) => {
        if (err) {
            return res.status(401).json({
                ok: false,
                err: {
                    message: 'token no válido'
                }
            });
        }
        req.usuario = decoded.usuario;
        next();
    });
    //console.log(token);    
}


/*====================
    VERIFICAR AdminRole
======================
*/

let verificaAdmin_Role = (req, res, next) => {

    let usuario = req.usuario;
    console.log(usuario.nombre);


    if (usuario.role === "ADMIN_ROLE") {
        next();
    } else {
        return res.json({
            ok: false,
            err: {
                message: 'el usuario no es administrador'
            }

        });
    }


}

/*====================
    VERIFICAR token para imagen
======================
*/
let verificaTokenImg = (req, res, next) => {
    let token = req.query.token;

    jwt.verify(token, process.env.SEED, (err, decoded) => {
        if (err) {
            return res.status(401).json({
                ok: false,
                err: {
                    message: 'token no válido'
                }
            });
        }
        req.usuario = decoded.usuario;
        next();
    });
}


module.exports = {
    verificaToken,
    verificaAdmin_Role,
    verificaTokenImg
}