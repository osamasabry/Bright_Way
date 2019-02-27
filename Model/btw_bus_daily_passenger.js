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
		//1
},{
    toJSON: { virtuals: true }
});

Btw_BusDailyPassengersSchema.virtual('Hotel',{
    ref: 'btw_hotel',
    localField: 'BusDailyPassengers_Hotel_Code',
    foreignField: 'Hotel_Code',
    justOne: false // for many-to-1 relationships
});

Btw_BusDailyPassengersSchema.virtual('Customer',{
    ref: 'btw_customer',
    localField: 'BusDailyPassengers_Customer_Code',
    foreignField: 'Customer_Code',
    justOne: false // for many-to-1 relationships
});


Btw_BusDailyPassengersSchema.virtual('CityFrom',{
    ref: 'btw_city',
    localField: 'BusDailyPassengers_Place_To',
    foreignField: 'City_Code',
    justOne: false // for many-to-1 relationships
});

var BusDailyPassengers = module.exports = mongoose.model('btw_bus_daily_passenger', Btw_BusDailyPassengersSchema);



module.exports.getLastCode = function(callback){
    
    BusDailyPassengers.findOne({},callback).sort({BusDailyPassengers_Code:-1});
}