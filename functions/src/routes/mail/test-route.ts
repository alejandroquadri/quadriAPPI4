import * as express from 'express';
import { db } from '../../db';
import { sql } from '../../dbHelper';
import * as moment from 'moment';

const router = express.Router();

const facturacionSQLOk = sql(__dirname, './facturacion.sql');

router.get('/', (request, response) => {
  response.set('Cache-Control','public, max-age=300, s-maxage=600');
  response.send(`${Date.now()}`); 
})

router.get('/ventas', function(req, res, next) {
  console.log('arranca');
  const today = moment();
  const hasta = today.format('YYYYMMDD');
  const desde = today.subtract(6, 'months').format('YYYYMMDD');
  db.any(facturacionSQLOk, {fechaDesde:desde, fechaHasta:hasta })
  .then( (data: any) => {
    console.log(data);
    res.status(200)
      .json({
        status: 'success',
        data: data,
        message: 'Retrieved sales'
      });
  })
  .catch((err: any) => {
    next(err);
  });
});

module.exports = router;

