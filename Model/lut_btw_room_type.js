var mongoose = require('mongoose');

var Btw_RoomTypeSchema = mongoose.Schema({

        RoomType_Code             :Number,
        RoomType_Name             :String,
        RoomType_Description      :String,
});

var RoomType = module.exports = mongoose.model('btw_room_type', Btw_RoomTypeSchema);



module.exports.getLastCode = function(callback){
    
    RoomType.findOne({},callback).sort({RoomType_Code:-1});
}