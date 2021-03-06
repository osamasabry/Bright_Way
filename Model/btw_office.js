var mongoose = require('mongoose');

var Btw_OfficeSchema = mongoose.Schema({
   
		Office_Code           :Number,
        Office_Name           :String,
        Office_Phone          :String,
		Office_Address        :String,
		Office_Is_Active      :Number,
		Office_City_ID        :Number,
});


var Office = module.exports = mongoose.model('btw_office', Btw_OfficeSchema);


module.exports.getLastCode = function(callback){
    
    Office.findOne({},callback).sort({Office_Code:-1});
}