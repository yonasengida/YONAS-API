'use strict';
// Farmer Model Definiton.

/**
 * Load Module Dependencies.
 */
const mongoose  = require('mongoose');
const moment    = require('moment');

var Schema = mongoose.Schema;
// New Farmer Schema Instance
var MusicSchema = new Schema({
    title:          { type: String  },
    path:           { type: String  },
    year :          { type: String  },
    thumbnail:      { type: String  },
    status:         { type: String  },
    album_name:     { type: String  },
    artist_name:    { type: String  },
    muscian:{type:mongoose.Schema.Types.ObjectId, ref:'Muscian'},
},{versionKey: false}, {
        timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' }
    });
// Expose Farmer model
module.exports = mongoose.model('Music', MusicSchema);
