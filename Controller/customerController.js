var Customer = require('../Model/btw_customer');


module.exports = {

	addCustomer:function(request,response){
		Customer.getLastCode(function(err,customer){
			if (customer) 
				insetIntoCustomer(customer.Customer_Code+1);
			else
				insetIntoCustomer(1);
		});

		function insetIntoCustomer(GetNextId){
			var newCustomer = new Customer();
			newCustomer.Customer_Code     		 	= GetNextId;
			newCustomer.Customer_Name 	     	 	= request.body.Customer_Name;
			newCustomer.Customer_Phone   	 		= request.body.Customer_Phone;
			newCustomer.Customer_Job	 			= request.body.Customer_Job;
			newCustomer.Customer_Address   	    	= request.body.Customer_Address;
			newCustomer.Customer_NationalID   	    = request.body.Customer_NationalID;
			
			newCustomer.save(function(error, doneadd){
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

	editCustomer:function(request,response){
		var newvalues = { $set: {
				Customer_Name 				: request.body.Customer_Name,
				Customer_Phone 				: request.body.Customer_Phone,
				Customer_Job 				: request.body.Customer_Job,
				Customer_Address 			: request.body.Customer_Address,
				Customer_NationalID 		: request.body.Customer_NationalID,
			} };
		var myquery = { Customer_Code: request.body.Customer_Code }; 
		Customer.findOneAndUpdate( myquery,newvalues, function(err, field) {
    	    if (err){
    	    	return response.send({
					message: 'Error'
				});
    	    }
            if (!field) {
            	return response.send({
					message: 'Customer not exists'
				});
            } else {
                return response.send({
					message: true
				});
			}
		})
	},

	getAllCustomer:function(request,response){
		Customer.find({})
		.exec(function(err, customer) {
		    if (err){
		    	response.send({message: 'Error'});
		    }
	        if (customer) {
	        	
	            response.send(customer);
	        } 
    	})
	},

	searchCustomer:function(request,response){
		var object={};
		 if(request.body.Customer_Phone )	
			object = {Customer_Phone: { $regex: new RegExp('.*' + request.body.Customer_Phone+ '.*', "i") }};
		else
			object = {Customer_Name:{ $regex: new RegExp('.*' +request.body.Customer_Name+ '.*', "i") } }	

		Customer.find(object)
		.exec(function(err, customer) {
		    if (err){
				console.log(err)
		    	response.send({message: 'Error'});
		    }
	        if (customer) {
	            response.send(customer);
	        } 
    	})
	},

}






