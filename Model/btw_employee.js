var mongoose = require('mongoose');
var passwordHash = require('password-hash');

var Btw_EmployeeSchema = mongoose.Schema({
   
		Employee_Code                   :Number,
        Employee_Name                   :String,
        Employee_Address                :String,
		Employee_Phone                  :String,
		Employee_Email                  :String,
        Employee_Password               :String,
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

Btw_EmployeeSchema.methods.verifyPassword = function(password) {
    console.log(passwordHash.verify(password,this.Employee_Password))
    if(passwordHash.verify(password,this.Employee_Password) == 1)
        return 1;
    else
        return 0;
};


var Employees = module.exports = mongoose.model('btw_employee', Btw_EmployeeSchema);


module.exports.getLastCode = function(callback){
    
    Employees.findOne({},callback).sort({Employee_Code:-1});
}