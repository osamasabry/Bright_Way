var mongoose = require('mongoose');

var Btw_EmployeeSchema = mongoose.Schema({
   
		Employee_Code                   :Number,
        Employee_Name                   :String,
        Employee_Address                :String,
		Employee_Phone                  :Number,
		Employee_Email                  :String,
        Employee_Password               :Number,
        Employee_NationalID             :Number,
        Employee_Job_Title              :String,
        Employee_Permissions            :[String],
        Employee_Office_Code            :Number,
        Employee_IsActive               :Number,

},{
    toJSON: { virtuals: true }
});

Btw_EmployeeSchema.virtual('Office',{
    ref: 'btw_office',
    localField: 'Employee_Office_Code',
    foreignField: 'Office_Code',
    justOne: false // for many-to-1 relationships
});


var Employees = module.exports = mongoose.model('btw_employee', Btw_EmployeeSchema);



module.exports.getLastCode = function(callback){
    
    Employees.findOne({},callback).sort({Employee_Code:-1});
}