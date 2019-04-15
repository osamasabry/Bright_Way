var mongoose = require('mongoose');

var Btw_BusesSchema = mongoose.Schema({
        
        Bus_Code                    :Number,
		Bus_From                    :Number,
        Bus_To                      :Number,
        Bus_PriceIncludePackage     :Number,
        Bus_PriceOutPackage         :Number,
        Bus_cost                    :Number,
},{
    toJSON: { virtuals: true }
});

Btw_BusesSchema.virtual('CityFrom',{
    ref: 'btw_city',
    localField: 'Bus_From',
    foreignField: 'City_Code',
    justOne: false // for many-to-1 relationships
});

Btw_BusesSchema.virtual('CityTo',{
    ref: 'btw_city',
    localField: 'Bus_To',
    foreignField: 'City_Code',
    justOne: false // for many-to-1 relationships
});

var Buses = module.exports = mongoose.model('btw_bus', Btw_BusesSchema);


module.exports.getLastCode = function(callback){
    
    Buses.findOne({},callback).sort({Bus_Code:-1});
}