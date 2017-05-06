var moment = require('moment');
var event  = require('events');
var debug  = require('debug')('autar-api');
var multer      =   require('multer');
var fs          =   require('fs');


var MusicDal = require('../dal/music');


exports.test = function test(req, res, next){
var body = req.body;
console.log(body);
};

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
exports.validateMusic = function validateMusic(req, res, next, id) {
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
    MusicDal.get({ _id: id }, function (err, doc) {
      if (doc._id) {
          req.doc=doc;
        next();
      } else {
        res.status(404)
          .json({
            error: true, status: 404,
            msg: 'Music _id ' + id + ' not found'
          });
      }
    });
  }
};

exports.createMusic = function createMusic(req, res, next){
    debug('create music');
  
var body = req.body;
var workflow = new event.EventEmitter();

workflow.on('validateInput', function validateInput() {
    debug('validate Music music');
    //console.log(body);
    req.checkBody('title', 'invalid title').notEmpty().withMessage('Title  Should not be empty');
    req.checkBody('year', 'invalid year').notEmpty().withMessage('Year Should not be empty');
    req.checkBody('album_name', 'invalid album name').notEmpty().withMessage('Album Name  Should not be empty');
    req.checkBody('artist_name', 'invalid artist name').notEmpty().withMessage('Artist Name Should not be empty');
  
    if (req.validationErrors()) {
        res.status(400);
        res.json({ error: true, msg: req.validationErrors(), status: 400 })
        return;
    } else {
        workflow.emit('registerMusic');
    }
});

workflow.on('registerMusic', function registerMusic() {
    debug('Register Music ');
console.log(body);
    MusicDal.create(body, function createMusic(err, doc) {
        if (err) {
            return next(err);
        }
        res.json(doc);
      
    });
});

workflow.emit('validateInput');

};

exports.update = function update(req, res,next){
    MusicDal.update({_id:req.doc_id},body,function updateMusic(err,doc){
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
    MusicDal.getCollection({}, function getAll(err, docs) {
        if (err) {
            return next(err);
        }
        res.json(docs);
    });
};



var maxSize =1024*1024*1024;

var upload1 = multer({
    
    dest: 'public/images/', inMemory: true, //storage: storage,
    limits: { fileSize: 4*1024* 1024 },
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

    upload1(req, res, function (err) {
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
        file.path = 'images/' +req.doc._id+ '.' + ext;// req.doc._id -> music Id
     

        fs.rename('public/images/'+ file.filename, file.path, function (err) {
            if (err) return next(err);
            MusicDal.update({
              _id: req.doc._id
            }, { thumbnail: file.path }, function updateMusic(err, path) {

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

/**
 * This is to  Upload Music
 */


var upload = multer({
 
    dest: 'public/musics/', inMemory: true, //storage: storage,
    limits: { fileSize: 4*1024* 1024 },
    fileFilter: function (req, file, cb) {

        if (!file.originalname.match(/\.(mp3)$/)) {
            return cb(new Error("Only music files (.mp3) are Allowed!"));
        };
        if (file.fieldname !== 'music') {
            return cb(new Error("Field name should be 'music', not '" + file.fieldname + "'"));
        }

        cb(null, true);
    }
}).single('music');

exports.uploadMusic = function uploadMusic(req, res, next) {
debug("Uploading Music......")
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
        file.path = 'musics/' +req.doc._id+ '.' + ext;// req.doc._id -> music Id
     

        fs.rename('public/musics/'+ file.filename, file.path, function (err) {
            if (err) return next(err);
            MusicDal.update({
              _id: req.doc._id
            }, { path: file.path }, function updateMusic(err, path) {

              if (err) {
                return next(err);
              }
              res.json({
                msg:"Succesffuly Upload",
                path:file.path
              });
              
            });       
        });
    });
};