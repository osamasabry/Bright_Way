var SystemSetting = require('../Model/system_setting');



module.exports = {

	getMasterPermisions:function(request,res){

        SystemSetting.findOne({System_Setting_ConfigName:"CP_Users_Permissions"}, function(err, permision) {
            if (err){
                res.send({message: 'Error'});
            }
            if (permision) {
                
                res.send(permision.System_Setting_ConfigValue);
            } 
    
    
        });
	},

}






