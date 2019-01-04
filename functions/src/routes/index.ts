const router = require('express').Router();

router.get('/', (req, res) => {
  res.status(200).send('Queo functions').end();
});

router.use('/test', require('./mail/test-route'));

module.exports = router;