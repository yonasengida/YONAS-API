// Access Layer for Muscian Data.

// NOTES:
// .population() specifies the references that you want
// mongodb to fill in with the corresponding document
// instead of returning an id.

/**
 * Load Module Dependencies.
 */
var debug   = require('debug')('api:dal-Muscian');
var moment  = require('moment');

var Muscian        = require('../models/muscian');

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
 * create a new Muscian.
 *
 * @desc  creates a new Muscian and saves them
 *        in the database
 *
 * @param {Object}  MuscianData  Data for the Muscian to create
 * @param {Function} cb       Callback for once saving is complete
 */
exports.create = function create(muscianData, cb) {
  debug('creating a new Muscian');

  // Create Muscian
  var MuscianModel  = new Muscian(muscianData);

  MuscianModel.save(function saveMuscian(err, data) {
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
 * delete a Muscian
 *
 * @desc  delete data of the Muscian with the given
 *        id
 *
 * @param {Object}  query   Query Object
 * @param {Function} cb Callback for once delete is complete
 */
exports.delete = function deleteItem(query, cb) {
  debug('deleting Muscian: ', query);

  Muscian
    .findOne(query)
    .populate(population)
    .exec(function deleteMuscian(err, doc) {
      if (err) {
        return cb(err);
      }

      if(!doc) {
        return cb(null, {});
      }

      Muscian.remove(function(err) {
        if(err) {
          return cb(err);
        }

        cb(null, doc);

      });

    });
};

/**
 * update a Muscian
 *
 * @desc  update data of the Muscian with the given
 *        id
 *
 * @param {Object} query Query object
 * @param {Object} updates  Update data
 * @param {Function} cb Callback for once update is complete
 */
exports.update = function update(query, updates,  cb) {
  debug('updating Muscian: ', query);

  var now = moment().toISOString();

  updates.last_modified = now;

  Muscian
    .findOneAndUpdate(query, updates)
    .populate(population)
    .exec(function updateMuscian(err, doc) {
      if(err) {
        return cb(err);
      }

      cb(null, doc || {});
    });
};

/**
 * get a Muscian.
 *
 * @desc get a Muscian with the given id from db
 *
 * @param {Object} query Query Object
 * @param {Function} cb Callback for once fetch is complete
 */
exports.get = function get(query, cb) {
  debug('getting Muscian ', query);

  Muscian
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
 * get a collection of Muscian
 *
 * @desc get a collection of Muscian from db
 *
 * @param {Object} query Query Object
 * @param {Function} cb Callback for once fetch is complete
 */
exports.getCollection = function getCollection(query, cb) {
  debug('fetching a collection of Muscian');
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
 Muscian.find(query)
.populate(population)
    .exec(function getMuscianCollection(err, doc) {
      if(err) {
        return cb(err);
      }

     return cb(null, doc);

  });

};

exports.getCollectionBYPagination = function getCollectionBYPagination(query,queryOpts, cb) {

  Muscian.paginate(query, queryOpts, function (err, result) {
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
