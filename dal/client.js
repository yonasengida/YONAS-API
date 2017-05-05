// Access Layer for Client Data.

// NOTES:
// .population() specifies the references that you want
// mongodb to fill in with the corresponding document
// instead of returning an id.

/**
 * Load Module Dependencies.
 */
var debug   = require('debug')('api:dal-Client');
var moment  = require('moment');

var Client        = require('../models/client');

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
 * create a new Client.
 *
 * @desc  creates a new Client and saves them
 *        in the database
 *
 * @param {Object}  ClientData  Data for the Client to create
 * @param {Function} cb       Callback for once saving is complete
 */
exports.create = function create(clientData, cb) {
  debug('creating a new Client');

  // Create Client
  var ClientModel  = new Client(clientData);

  ClientModel.save(function saveClient(err, data) {
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
 * delete a Client
 *
 * @desc  delete data of the Client with the given
 *        id
 *
 * @param {Object}  query   Query Object
 * @param {Function} cb Callback for once delete is complete
 */
exports.delete = function deleteItem(query, cb) {
  debug('deleting Client: ', query);

  Client
    .findOne(query)
    .populate(population)
    .exec(function deleteClient(err, doc) {
      if (err) {
        return cb(err);
      }

      if(!doc) {
        return cb(null, {});
      }

      Client.remove(function(err) {
        if(err) {
          return cb(err);
        }

        cb(null, doc);

      });

    });
};

/**
 * update a Client
 *
 * @desc  update data of the Client with the given
 *        id
 *
 * @param {Object} query Query object
 * @param {Object} updates  Update data
 * @param {Function} cb Callback for once update is complete
 */
exports.update = function update(query, updates,  cb) {
  debug('updating Client: ', query);

  var now = moment().toISOString();

  updates.last_modified = now;

  Client
    .findOneAndUpdate(query, updates)
    .populate(population)
    .exec(function updateClient(err, doc) {
      if(err) {
        return cb(err);
      }

      cb(null, doc || {});
    });
};

/**
 * get a Client.
 *
 * @desc get a Client with the given id from db
 *
 * @param {Object} query Query Object
 * @param {Function} cb Callback for once fetch is complete
 */
exports.get = function get(query, cb) {
  debug('getting Client ', query);

  Client
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
 * get a collection of Client
 *
 * @desc get a collection of Client from db
 *
 * @param {Object} query Query Object
 * @param {Function} cb Callback for once fetch is complete
 */
exports.getCollection = function getCollection(query, cb) {
  debug('fetching a collection of Client');
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
 Client.find(query)
.populate(population)
    .exec(function getClientCollection(err, doc) {
      if(err) {
        return cb(err);
      }

     return cb(null, doc);

  });

};

exports.getCollectionBYPagination = function getCollectionBYPagination(query,queryOpts, cb) {

  Client.paginate(query, queryOpts, function (err, result) {
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
