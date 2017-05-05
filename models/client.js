'use strict';
// Farmer Model Definiton.

/**
 * Load Module Dependencies.
 */
const mongoose  = require('mongoose');
const moment    = require('moment');

var Schema = mongoose.Schema;

// New Farmer Schema Instance
var ClientSchema = new Schema({
    user_name:    { type: String },
    mobile:       { type: String },
    acount_number:{type:String},
    adress:       {type:String},
   //order:[{type:mongoose.Schema.Types.ObjectId, ref:'Order'}]
});
// Expose Farmer model
module.exports = mongoose.model('Client', ClientSchema);
