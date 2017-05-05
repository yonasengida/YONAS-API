// Load Module Dependencies
var express   =   require('express');

var music  = require('../controllers/music');

// Create a Router
//var router = express.Router();
var router = express.Router();
/**
 * @api {post} /musics  Create Music
 * @apiName CreateMusic
 * @apiGroup Music
 *
 * @apiParam {String} name Music Name
 * @apiParam {String} year  Year OF release
 * 
 * 
 * @apiParamExample Request Exmaple
 * {
 *  
 *   "title":  "music1",
 *   "year":   "1970",
 *   "album_name":"Album1",
 *   "artist_name":"Johnny Raga"
 *  }
 * * @apiSuccessExample {json} Success-Response:
 * HTTP/1.1 200 OK
 *  {
 * "_id": "58af8cbd7544b94c8fa864e7",
 *   "title":  "music1",
 *   "year":   "1970",
 *   "album_name":"Album1",
 *   "artist_name":"Johnny Raga"
 * }
 */
router.post('/', music.createMusic);
/**
 * @api {get} /musics  Get Music Collections
 * @apiName Get Music Collections
 * @apiGroup Music

 * @apiSuccessExample {json} Success-Response:
 * HTTP/1.1 200 OK
 * [ 
 * {
 * "_id": "58af8cbd7544b94c8fa864e7",
 *   "title":  "music1",
 *   "year":   "1970",
 *   "album_name":"Album1",
 *   "artist_name":"Johnny Raga"
 *   "thumbnail":"images/artistx.png",
 *   "path":"musics/music.mp3",
 *   "status":"enable"
 * }
 * {
 * "_id": "58af8cbd7544b94c8fa864e7",
 *   "title":  "music1",
 *   "year":   "1970",
 *   "album_name":"Album1",
 *   "artist_name":"Johnny Raga"
 *   "thumbnail":"images/artistx.png",
 *   "path":"musics/music.mp3",
 *   "status":"enable"
 * }
 * {
 * "_id": "58af8cbd7544b94c8fa864e7",
 *   "title":  "music1",
 *   "year":   "1970",
 *   "album_name":"Album1",
 *   "artist_name":"Johnny Raga"
 *   "thumbnail":"images/artistx.png",
 *   "path":"musics/music.mp3",
 *   "status":"enable"
 * }
 * ]
 */
router.get('/', music.getCollection);
/**
 * @api {post} /musics/upload/:id  Uplaod Music
 * @apiName Upload Music
 * @apiGroup Music
 *
 * @apiParam {file} music field Name
 * @apiParam {String} id   music ID
 * 

 * * @apiSuccessExample {json} Success-Response:
 * HTTP/1.1 200 OK
 *  {
 * "_id": "58af8cbd7544b94c8fa864e7",
 *  "name": "musicq",
 * "Year": "1978",
 * "path":"musics/music1.mp3"
 * }
 */
router.param('id', music.validateMusic);
router.post('/upload/:id',music.uploadMusic) ;
router.post('/image/:id',music.uploadImage) ;


module.exports= router;