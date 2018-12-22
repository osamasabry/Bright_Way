var mongoose = require('mongoose');

var Btw_CitySchema = mongoose.Schema({

    	City_Code             :Number,
        City_Name             :String,
        City_IsActive      	  :Number,
});

var City = module.exports = mongoose.model('btw_city', Btw_CitySchema);


module.exports.getLastCode = function(callback){
    
    City.findOne({},callback).sort({City_Code:-1});
}