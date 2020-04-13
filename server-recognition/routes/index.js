var express = require('express');
var router = express.Router();

const Client = require('aliyun-api-gateway').Client;
const client = new Client('203804549', 'zj3dzq8wpe38ikva56xsztod7qieudem');
const bodyParser = require('body-parser')

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});


router.post('/getCarInfo', bodyParser.json({limit: '10mb'}), async (req, res) => {
  var url = 'https://ocrcp.market.alicloudapi.com/rest/160601/ocr/ocr_vehicle_plate.json';

  var result = await client.post(url, {
    data: {
      'image': req.body.image
    },
    headers: {
      accept: 'application/json'
    }
  });

  // console.log(JSON.stringify(result));
  res.json(result)
})


module.exports = router;
