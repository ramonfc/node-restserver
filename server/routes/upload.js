const express = require('express');
const fileUpload = require('express-fileupload');
const app = express();

const Usuario = require('../models/usuario');
const Producto = require('../models/producto');

const fs = require('fs');
const path = require('path');

//default options
app.use(fileUpload({ useTempFiles: true }));

app.put('/upload/:tipo/:id', function(req, res) {
    console.log(req.files);

    let tipo = req.params.tipo;
    let id = req.params.id;

    if (!req.files) {
        return res.status(400).json({
            ok: false,
            err: {
                message: 'No se ha seleccionado ningún archivo'
            }
        });
    };

    ////validar tipo:
    let tiposValidos = ['usuarios', 'productos'];
    if (tiposValidos.indexOf(tipo) < 0) {
        return res.status(400).json({
            ok: false,
            err: {
                message: 'los tipos permitidos son: ' + tiposValidos.join(', ')

            }
        });
    }

    let sampleFile = req.files.archivo;
    let nombreCortado = sampleFile.name.split('.');
    let extension = nombreCortado[nombreCortado.length - 1];

    ////extensiones validas:
    let extensionesValidas = ['jpg', 'png', 'gif', 'jpeg'];

    if (extensionesValidas.indexOf(extension) < 0) {
        return res.status(400).json({
            ok: false,
            err: {
                message: 'las extensiones permitidas son: ' + extensionesValidas.join(', '),
                extension
            }
        });
    };

    ////cambiar nombre al archivo:
    let nombreArchivo = `${id}-${new Date().getMilliseconds()}.${extension}`;

    sampleFile.mv(`uploads/${tipo}/${nombreArchivo}`, function(err) {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }

        //Aquí la imagen está cargada

        if (tipo === tiposValidos[0]) { //tipo=usuarios
            imagenUsuario(id, res, nombreArchivo);
        } else
        if (tipo === tiposValidos[1]) { //tipo = productos
            imagenProducto(id, res, nombreArchivo);
        }

    });
});




function imagenUsuario(id, res, nombreArchivo) {
    Usuario.findById(id, (err, usuarioDB) => {
        if (err) {
            borraArchivo(nombreArchivo, 'usuarios');
            return res.status(500).json({
                ok: false,
                err
            });
        };

        if (!usuarioDB) {
            borraArchivo(nombreArchivo, 'usuarios'); //aunque el id enviado fuera errado, se subiria la img
            return res.status(500).json({
                ok: false,
                err: {
                    message: 'usuario no existe'
                }
            });
        };

        // let pathImagen = path.resolve(__dirname, `../../uploads/usuarios/${usuarioDB.img}`);

        // if (fs.existsSync(pathImagen)) {
        //     fs.unlinkSync(pathImagen);
        // }

        borraArchivo(usuarioDB.img, 'usuarios');

        usuarioDB.img = nombreArchivo;

        usuarioDB.save((err, usuarioGuardado) => {
            res.json({
                ok: true,
                usuarioDB: usuarioGuardado,
                img: nombreArchivo
            });
        })

    })
};

function imagenProducto(id, res, nombreArchivo) {
    Producto.findById(id, (err, productoDB) => {
        if (err) {
            borraArchivo(nombreArchivo, 'productos');
            return res.status(500).json({
                ok: false,
                err
            });
        };

        if (!productoDB) {
            borraArchivo(nombreArchivo, 'productos'); //aunque el id enviado fuera errado, se subiria la img
            return res.status(500).json({
                ok: false,
                err: {
                    message: 'producto no existe'
                }
            });
        };

        // let pathImagen = path.resolve(__dirname, `../../uploads/usuarios/${usuarioDB.img}`);

        // if (fs.existsSync(pathImagen)) {
        //     fs.unlinkSync(pathImagen);
        // }

        borraArchivo(productoDB.img, 'productos');

        productoDB.img = nombreArchivo;

        productoDB.save((err, productoGuardado) => {
            res.json({
                ok: true,
                productoDB: productoGuardado,
                img: nombreArchivo
            });
        })

    })
};

function borraArchivo(nombreImagen, tipo) {
    let pathImagen = path.resolve(__dirname, `../../uploads/${tipo}/${nombreImagen}`);

    if (fs.existsSync(pathImagen)) {
        fs.unlinkSync(pathImagen);
    }

};
module.exports = app;