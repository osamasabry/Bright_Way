var mongoose = require('mongoose');

var Btw_BusesSchema = mongoose.Schema({
        
        Bus_Code                    :Number,
		Bus_From                    :Number,
        Bus_To                      :Number,
        Bus_PriceIncludePackage     :Number,
        Bus_PriceOutPackage         :Number,
},{
    toJSON: { virtuals: true }
});


var Buses = module.exports = mongoose.model('btw_bus', Btw_BusesSchema);


module.exports.getLastCode = function(callback){
    
    Buses.findOne({},callback).sort({Bus_Code:-1});
}