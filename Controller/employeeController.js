var Employee = require('../Model/btw_employee');
var Office = require('../Model/btw_office');

var passwordHash = require('password-hash');


module.exports = {

	addEmployee:function(request,response){
		Employee.getLastCode(function(err,employee){
			if (employee) 
				insetIntoEmployee(employee.Employee_Code+1);
			else
				insetIntoEmployee(1);
		});
		function insetIntoEmployee(GetNextId){
			var newEmployee = new Employee();
			newEmployee.Employee_Code     		 	= GetNextId;
			newEmployee.Employee_Name 	     	 	= request.body.Employee_Name;
			newEmployee.Employee_Address   	 		= request.body.Employee_Address;
			newEmployee.Employee_Phone	 			= request.body.Employee_Phone;
			newEmployee.Employee_Email   	    	= request.body.Employee_Email;
			newEmployee.Employee_Password   	    = passwordHash.generate(request.body.Employee_Password);
			newEmployee.Employee_NationalID   	    = request.body.Employee_NationalID;
			newEmployee.Employee_Job_Title   	    = request.body.Employee_Job_Title;
			newEmployee.Employee_Permissions   	    = request.body.Employee_Permissions;
			newEmployee.Employee_Office_Code   	    = request.body.Employee_Office_Code;
			newEmployee.Employee_IsActive   	    = 1;
			
			newEmployee.save(function(error, doneadd){
				if(error){
					return response.send({
						message: error
					});
				}
				else{
					return response.send({
						message: true
					});
				}
			});
		}
	},

	editEmployee:function(request,response){
		var newvalues = { $set: {
				Employee_Name 			: request.body.Employee_Name,
				Employee_Address 		: request.body.Employee_Address,
				Employee_Phone 			: request.body.Employee_Phone,
				Employee_Email 			: request.body.Employee_Email,
				// Employee_Password 		: request.body.Employee_Password,
				Employee_NationalID 	: request.body.Employee_NationalID,
				Employee_Job_Title 		: request.body.Employee_Job_Title,
				Employee_Permissions 	: request.body.Employee_Permissions,
				Employee_Office_Code 	: request.body.Employee_Office_Code,
				Employee_IsActive 		: request.body.Employee_IsActive,
				
			} };
		var myquery = { Employee_Code: request.body.Employee_Code }; 
		Employee.findOneAndUpdate( myquery,newvalues, function(err, field) {
    	    if (err){
    	    	return response.send({
					message: 'Error'
				});
    	    }
            if (!field) {
            	return response.send({
					message: 'Employee not exists'
				});
            } else {
                return response.send({
					message: true
				});
			}
		})
	},

	getAllEmployee:function(request,response){
		Employee.find({})
		.populate({ path: 'Office', select: 'Office_Code Office_Name' })
		.lean()
		.exec(function(err, employee) {
		    if (err){
		    	response.send({message: 'Error'});
		    }
	        if (employee) {
	        	
	            response.send(employee);
	        } 
    	}).sort({Employee_Code:-1}).limit(20)
	},

}






