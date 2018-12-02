var mongoose = require('mongoose');

var Btw_RoomViewSchema = mongoose.Schema({

    	RoomView_Code             :Number,
        RoomView_Name             :String,
        RoomView_Description      :String,
});

var RoomView = module.exports = mongoose.model('btw_room_view', Btw_RoomViewSchema);



module.exports.getLastCode = function(callback){
    
    RoomView.findOne({},callback).sort({RoomView_Code:-1});
}