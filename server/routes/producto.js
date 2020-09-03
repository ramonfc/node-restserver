const express = require('express');
const { verificaToken } = require('../middlewares/autenticacion');

let app = express();
let Producto = require('../models/producto');
const { path } = require('./categoria');


/* 
==========================
  obtener todos los productos
==========================
*/
app.get('/productos', verificaToken, (req, res) => {
    //trae todos los productos
    //populate: usuario categoria
    //paginado

    let desde = req.query.desde || 0;
    desde = Number(desde);

    let limite = req.query.limite || 3;
    limite = Number(limite);

    Producto.find({ disponible: true })
        .skip(desde)
        .limit(limite)
        .populate('usuario', 'nombre email')
        .populate({ path: 'categoria', populate: { path: 'categoriaSchema' }, model: 'Categoria' })
        .exec((err, productos) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                });
            }

            res.json({
                ok: true,
                productos
            });
        });
});


/* 
==========================
  obtener un producto por id
==========================
*/
app.get('/productos/:id', verificaToken, (req, res) => {
    //populate: usuario categoria
    let id = req.params.id;

    Producto.findById(id)
        .populate('usuario', 'nombre email')
        .populate('categoria', 'descripcion')
        .exec((err, producto) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                });
            }

            if (!producto) {
                return res.status(400).json({
                    ok: false,
                    err: {
                        message: 'el id de producto no existe'
                    }
                });
            }

            res.json({
                ok: true,
                producto
            });

        });


});

/* 
==========================
  Buscar Producto
==========================
*/

app.get('/productos/buscar/:termino', verificaToken, (req, res) => {

    let termino = req.params.termino;
    let regex = new RegExp(termino, 'i');

    Producto.find({ nombre: regex })
        .populate('categoria', 'descripcion')
        .exec((err, productos) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                });
            }

            res.json({
                ok: true,
                productos
            });

        });
});

/* 
==========================
  Crear un producto
==========================
*/
app.post('/productos', verificaToken, (req, res) => {
    //grabar el usuario
    //grabar la categoria

    let body = req.body;

    let producto = new Producto({
        usuario: req.usuario._id,
        nombre: body.nombre,
        precioUni: body.precioUni,
        descripcion: body.descripcion,
        disponible: body.disponible,
        categoria: body.categoria,

    });

    producto.save((err, productoDB) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        };

        // if (!productoDB) {
        // return res.status(400).json({
        // ok: false,
        // err
        // });
        // };

        res.status(201).json({
            ok: true,
            producto: productoDB
        });
    });


});

/* 
==========================
  actualizar producto
==========================
*/
app.put('/productos/:id', verificaToken, (req, res) => {
    let id = req.params.id;
    let body = req.body;

    let datosProducto = {
        nombre: body.nombre,
        descripcion: body.descripcion || '',
        precioUni: body.precioUni,
        disponible: body.disponible || true
    }

    Producto.findByIdAndUpdate(id, datosProducto, { new: true }, (err, productoDB) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        };

        if (!productoDB) {
            return res.status(400).json({
                ok: false,
                err
            });
        };

        res.json({
            ok: true,
            producto: productoDB
        });
    });

});

/* 
==========================
 borrar producto
==========================
*/
app.delete('/productos/:id', verificaToken, (req, res) => {
    //cambiar estado de disponible
    let id = req.params.id;

    let cambiaDisponible = {
        disponible: false
    };

    Producto.findByIdAndUpdate(id, cambiaDisponible, { new: true }, (err, productoDB) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        };

        if (!productoDB) {
            return res.status(400).json({
                ok: false,
                err
            });
        };

        res.json({
            ok: true,
            producto: productoDB,
            mensaje: 'producto borrado'
        });
    });

});


module.exports = app;