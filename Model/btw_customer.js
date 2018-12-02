var mongoose = require('mongoose');

var Btw_CustomerSchema = mongoose.Schema({
   
		Customer_Code                :Number,
        Customer_Name                :String,
        Customer_Phone               :String,
		Customer_Job                 :String,
		Customer_Address             :String,
		Customer_NationalID          :String,

});


var Customers = module.exports = mongoose.model('btw_customer', Btw_CustomerSchema);



module.exports.getLastCode = function(callback){
    
    Customers.findOne({},callback).sort({Customer_Code:-1});
}