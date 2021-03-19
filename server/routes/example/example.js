const express = require('express')
const router= express.Router()

router.get('/', (req, res) => {
    res.send('It worked');
    console.log('It worked');
});

module.exports = router;