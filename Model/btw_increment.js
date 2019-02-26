var mongoose = require('mongoose');

var Btw_IncrementSchema = mongoose.Schema({
   
		Increment_Code                :Number,
        Increment_sequence            :Number,
});


var Increment = module.exports = mongoose.model('btw_increment', Btw_IncrementSchema);



module.exports.getLastCode = function(callback){
    
    Increment.findOne({},callback).sort({Increment_Code:-1});
}