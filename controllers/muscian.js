var moment = require('moment');
var event  = require('events');
var debug  = require('debug')('autar-api');
var multer      =   require('multer');
var fs          =   require('fs');


var MuscianDal = require('../dal/muscian');


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
exports.validateMuscian = function validateMuscian(req, res, next, id) {
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
    MuscianDal.get({ _id: id }, function (err, doc) {
      if (doc._id) {
          req.doc=doc;
        next();
      } else {
        res.status(404)
          .json({
            error: true, status: 404,
            msg: 'muscian _id ' + id + ' not found'
          });
      }
    });
  }
};

exports.createMuscian = function createMuscian(req, res, next){
    debug('create muscian');
  
var body = req.body;
var workflow = new event.EventEmitter();

workflow.on('validateInput', function validateInput() {
    debug('validate muscian muscian');
    //console.log(body);
    req.checkBody('name', 'invalid name').notEmpty().withMessage('Name  Should not be empty');
    req.checkBody('year', 'invalid year').notEmpty().withMessage('Year Should not be empty');
  
    if (req.validationErrors()) {
        res.status(400);
        res.json({ error: true, msg: req.validationErrors(), status: 400 })
        return;
    } else {
        workflow.emit('registermuscian');
    }
});

workflow.on('registermuscian', function registermuscian() {
    debug('Register muscian ');
console.log(body);
    MuscianDal.create(body, function createmuscian(err, doc) {
        if (err) {
            return next(err);
        }
        res.json(doc);
      
    });
});

workflow.emit('validateInput');

};

exports.update = function update(req, res,next){
    MuscianDal.update({_id:req.doc_id},body,function updatemuscian(err,doc){
        if(err){
            return next(err);
        }
        res.json(doc);
    })
};

exports.get = function get(req, res, next){
    res.json(req.doc);
};

exports.getCollection = function getCollection(req, res, next) {
    MuscianDal.getCollection({}, function getAll(err, docs) {
        if (err) {
            return next(err);
        }
        res.json(docs);
    });
};



var maxSize =1024*1024*1024;

var upload = multer({
    
    dest: 'images/', inMemory: true, //storage: storage,
    limits: { fileSize: 10*1024* 1024 },
    fileFilter: function (req, file, cb) {

        if (!file.originalname.match(/\.(jpg|jpeg|png)$/)) {
            return cb(new Error("Only image files (jpg|jpeg|png) are Allowed!"));
        };
        if (file.fieldname !== 'image') {
            return cb(new Error("Field name should be 'image', not '" + file.fieldname + "'"));
        }

        cb(null, true);
    }
}).single('image');

exports.uploadImage = function uploadImage(req, res, next) {

    upload(req, res, function (err) {
       //check The field name is correct ot not
        if (err) {
            res.status(400).json({ error:true,
              msg: err.message,
              status:400
             });
            return;
        }

        var file = req.file;

        if (!file) {
            res.status(400).json({error:true, msg: 'Please specify the file you are going to upload.', status:400 });
            return;
        }

        // get the extension of the file name
        var ext = file.originalname.substr(file.originalname.lastIndexOf('.') + 1);

        if (!ext) {
            return next(new Error("The extenstion (jpg|jpeg|png) of the file must be set!"));
        }
        // rename the file name
        file.path = 'images/' +req.doc._id+ '.' + ext;// req.doc._id -> muscian Id
     

        fs.rename('images/'+ file.filename, file.path, function (err) {
            if (err) return next(err);
            MuscianDal.update({
              _id: req.doc._id
            }, { path: file.path }, function updatemuscian(err, path) {

              if (err) {
                return next(err);
              }
              res.json({
                msg:"Succesffuly Upload",
                path:file.path
              })
            });       
        });
    });
}
