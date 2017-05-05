'use strict';
// Farmer Model Definiton.

/**
 * Load Module Dependencies.
 */
const mongoose  = require('mongoose');
const moment    = require('moment');

var Schema = mongoose.Schema;

// New Farmer Schema Instance
var MusicianSchema = new Schema({
    name:           { type: String },
    thumbnail:      {type:String}
  
});
// Expose Farmer model
module.exports = mongoose.model('Musician', MusicianSchema);
