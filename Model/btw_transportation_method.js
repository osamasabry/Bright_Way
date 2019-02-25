var mongoose = require('mongoose');

var Btw_TransportationMethodSchema = mongoose.Schema({
   
		TransportationMethod_Code                :Number,
        TransportationMethod_Name                :String,
        TransportationMethod_Description         :String,
});


var TransportationMethod = module.exports = mongoose.model('btw_transportation_method', Btw_TransportationMethodSchema);



module.exports.getLastCode = function(callback){
    
    TransportationMethod.findOne({},callback).sort({TransportationMethod_Code:-1});
}