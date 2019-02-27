var mongoose = require('mongoose');

var Btw_BusDailyPassengersSchema = mongoose.Schema({
   
		BusDailyPassengers_Code                		:Number,
        BusDailyPassengers_Customer_Code       		:Number,
		BusDailyPassengers_Hotel_Code               :Number,
		BusDailyPassengers_Date 	              	:Date,
		BusDailyPassengers_Place_From               :Number,
		BusDailyPassengers_Place_To               	:Number,
		BusDailyPassengers_Direction               	:String,
		BusDailyPassengers_Count               		:Number,
		BusDailyPassengers_Transportation_Method   	:Number,
		BusDailyPassengers_Transportation_Details   :String,
		BusDailyPassengers_Bus_Number              	:String,

});


var BusDailyPassengers = module.exports = mongoose.model('btw_bus_daily_passenger', Btw_BusDailyPassengersSchema);



module.exports.getLastCode = function(callback){
    
    BusDailyPassengers.findOne({},callback).sort({BusDailyPassengers_Code:-1});
}