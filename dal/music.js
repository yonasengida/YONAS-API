// Access Layer for Music Data.

// NOTES:
// .population() specifies the references that you want
// mongodb to fill in with the corresponding document
// instead of returning an id.

/**
 * Load Module Dependencies.
 */
var debug   = require('debug')('api:dal-Music');
var moment  = require('moment');

var Music        = require('../models/music');

// var population = [{ 
//      path: 'land'
//   }
// ];
var population = [{ 
    path: 'land',
     populate: {
       path: 'land',
       model: 'Land'
     } 
  }
];
/**
 * create a new Music.
 *
 * @desc  creates a new Music and saves them
 *        in the database
 *
 * @param {Object}  MusicData  Data for the Music to create
 * @param {Function} cb       Callback for once saving is complete
 */
exports.create = function create(musicData, cb) {
  debug('creating a new Music');
  // Create Music
  var MusicModel  = new Music(musicData);

  MusicModel.save(function saveMusic(err, data) {
    if (err) {
      return cb(err);
    }


    exports.get({ _id: data._id }, function (err, doc) {
      if(err) {
        return cb(err);
      }

      cb(null, doc);

    });

  });

};

/**
 * delete a Music
 *
 * @desc  delete data of the Music with the given
 *        id
 *
 * @param {Object}  query   Query Object
 * @param {Function} cb Callback for once delete is complete
 */
exports.delete = function deleteItem(query, cb) {
  debug('deleting Music: ', query);

  Music
    .findOne(query)
    .populate(population)
    .exec(function deleteMusic(err, doc) {
      if (err) {
        return cb(err);
      }

      if(!doc) {
        return cb(null, {});
      }

      Music.remove(function(err) {
        if(err) {
          return cb(err);
        }

        cb(null, doc);

      });

    });
};

/**
 * update a Music
 *
 * @desc  update data of the Music with the given
 *        id
 *
 * @param {Object} query Query object
 * @param {Object} updates  Update data
 * @param {Function} cb Callback for once update is complete
 */
exports.update = function update(query, updates,  cb) {
  debug('updating Music: ', query);

  var now = moment().toISOString();

  updates.last_modified = now;

  Music
    .findOneAndUpdate(query, updates)
    .populate(population)
    .exec(function updateMusic(err, doc) {
      if(err) {
        return cb(err);
      }

      cb(null, doc || {});
    });
};

/**
 * get a Music.
 *
 * @desc get a Music with the given id from db
 *
 * @param {Object} query Query Object
 * @param {Function} cb Callback for once fetch is complete
 */
exports.get = function get(query, cb) {
  debug('getting Music ', query);

  Music
    .findOne(query)
    .populate(population)
    .exec(function(err, doc) {
      if(err) {
        return cb(err);
      }

      cb(null, doc || {});
    });
};

/**
 * get a collection of Music
 *
 * @desc get a collection of Music from db
 *
 * @param {Object} query Query Object
 * @param {Function} cb Callback for once fetch is complete
 */
exports.getCollection = function getCollection(query, cb) {
  debug('fetching a collection of Music');
/**
 * Mongoose 4.5 support this

Project.find(query)
  .populate({ 
     path: 'pages',
     populate: {
       path: 'components',
       model: 'Component'
     } 
  })
  .exec(function(err, docs) {});
 */
 Music.find(query)
.populate(population)
    .exec(function getMusicCollection(err, doc) {
      if(err) {
        return cb(err);
      }

     return cb(null, doc);

  });

};

exports.getCollectionBYPagination = function getCollectionBYPagination(query,queryOpts, cb) {

  Music.paginate(query, queryOpts, function (err, result) {
    // result.docs
    // result.total
    // result.limit - 10
    // result.page - 3
    // result.pages

    if (err) {
      return cb(err);
    }
    return cb(null, result);
  });
};
