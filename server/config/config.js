/* 
==========================
            PORT
==========================
*/

process.env.PORT = process.env.PORT || 3000;


/* 
==========================
            ENTORNO
==========================
*/

process.env.NODE_ENV = process.env.NODE_ENV || 'dev';

/* 
==========================
  Vencimiento del token
==========================
60 segundos
60 minutos
24 horas
30 días
*/
process.env.CADUCIDAD_TOKEN = 60 * 60 * 24 * 30;

/* 
==========================
  Seed de autenticación
==========================
*/

process.env.SEED = process.env.SEED || 'este-es-el-seed-desarrollo'
    /* 
    ==========================
                BASE DE DATOS
    ==========================
    */

let urlDB;
if (process.env.NODE_ENV === 'dev') {
    urlDB = 'mongodb://localhost:27017/cafe';
} else {
    //urlDB = 'mongodb+srv://moncho88vivi:r4UBzsmLzgJZCJed@cluster0.mew8g.mongodb.net/cafe';
    urlDB = process.env.MONGO_URI;
}

process.env.URLDB = urlDB; //.URLDB es un nombre inventado