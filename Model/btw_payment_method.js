var mongoose = require('mongoose');

var Btw_PaymentMethodSchema = mongoose.Schema({
   
		PaymentMethod_Code                :Number,
        PaymentMethod_Name                :String,
        PaymentMethod_Description         :String,
        
});


var PaymentMethod = module.exports = mongoose.model('btw_payment_method', Btw_PaymentMethodSchema);



module.exports.getLastCode = function(callback){
    
    PaymentMethod.findOne({},callback).sort({PaymentMethod_Code:-1});
}