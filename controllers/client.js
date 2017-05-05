// Load Module Dependencies
var moment = require('moment');
var event  = require('events');
var debug  = require('debug')('geberew-api');

var ClientDal = require('../dal/client');


exports.noop = function noop(req, res, next) {
  res.json({
    error:false,
    msg: 'To Implemented!',
    status:200
  });
};
/**
 * @desc Validate clients id exist or not
 * @param {req} HTTP Request
 * @param {res} HTTP Response
 * @param {id} id clients id from url
 */
exports.validateclient = function validateclient(req, res, next, id) {
  //Validate the id is mongoid or not
  req.checkParams('id', 'Invalid ID').isMongoId(id);
  var validationErrors = req.validationErrors();

  if (validationErrors) {

    res.status(400).json({
      error: true,
      msg: req.validationErrors(),
      status: 400
    });

  } else {
    ClientDal.get({ _id: id }, function (err, client) {
      if (client._id) {
        req.client_id = client._id;
        req.doc=client;
        next();
      } else {
        res.status(404)
          .json({
            error: true, status: 404,
            msg: 'client _id ' + id + ' not found'
          });
      }
    });
  }
};

exports.createClient = function createClient(req, res, next){
    debug('validate client data');
var body = req.body;
var workflow = new event.EventEmitter();

workflow.on('validateInput', function validateInput() {
     debug('validate client data');
    req.checkBody('user_name', 'invalid username').notEmpty().withMessage('USername  Should not be empty');
    req.checkBody('mobile', 'invalid mobile').notEmpty().withMessage('mobile Should not be empty');
    req.checkBody('acount_number', 'invalid account number').notEmpty().withMessage('account should not be empty');
    req.checkBody('adress', 'invalid adress').notEmpty().withMessage('adress should not be empty');
   
    if (req.validationErrors()) {
        res.status(400);
        res.json({ error: true, msg: req.validationErrors(), status: 400 })
        return;
    } else {
        workflow.emit('registerclient');
    }
});

workflow.on('registerclient', function registerfarm() {
    debug('Register client ')
  
    ClientDal.create(body, function createfarm(err, client) {
        if (err) {
            return next(err);
        }
        res.json(client);
      
    });
});

workflow.emit('validateInput');

};
exports.updateclient = function updateclient(req, res, next) {
    var body= req.body;
    ClientDal.update({ _id:req.farm_id }, body, function updateclient(err, client) {
        if (err) {
            return next(err);
        }
        res.json(client);
    });
};

exports.getclient = function getclient(req, res, next){
res.json(req.doc);
};
exports.getclients = function getclients(req, res, next) {
    ClientDal.getCollection({}, function getclients(err, clients) {
        if (err) {
            return next(err);
        }
        res.json(clients);
    });
};