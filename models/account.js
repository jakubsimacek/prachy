const mongoose = require('mongoose')
const Schema = mongoose.Schema
const passportLocalMongoose = require('passport-local-mongoose')

// username, password, salt are added automatically by passport-local-mongoose plugin
// var accountSchema = new Schema({ email : { type: String, required: true } });
var accountSchema = new Schema({ });

/*accountSchema.statics.findCoaches = function (cb) {
  return this.find({ roles: 'coach'}, cb);
};*/

accountSchema.plugin(passportLocalMongoose) 

module.exports = mongoose.model('Account', accountSchema);
