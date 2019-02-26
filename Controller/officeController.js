var Office = require('../Model/btw_office');



module.exports = {

	addOffice:function(request,response){
		Office.getLastCode(function(err,office){
			if (office) 
				insetIntoOffice(office.Office_Code+1);
			else
				insetIntoOffice(1);
		});

		function insetIntoOffice(GetNextId){
			var newOffice = new Office();
			newOffice.Office_Code     		 	= GetNextId;
			newOffice.Office_Name 	     	 	= request.body.Office_Name;
			newOffice.Office_Phone   	 	    = request.body.Office_Phone;
			newOffice.Office_Address	 	    = request.body.Office_Address;
			newOffice.Office_Is_Active   		= 1;
			newOffice.Office_City_ID			= Number(request.body.Office_City_ID);
			newOffice.save(function(error, doneadd){
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

	editOffice:function(request,response){
		var newvalues = { $set: {
				Office_Name 				: request.body.Office_Name,
				Office_Phone 				: request.body.Office_Phone,
				Office_Address 				: request.body.Office_Address,
				Office_Is_Active 			: request.body.Office_Is_Active,
				Office_City_ID				: request.body.Office_City_ID,
			} };

		var myquery = { Office_Code: request.body.Office_Code }; 
		Office.findOneAndUpdate( myquery,newvalues, function(err, field) {
    	    if (err){
    	    	return response.send({
					message: 'Error'
				});
    	    }
            if (!field) {
            	return response.send({
					message: 'Office not exists'
				});
            } else {
                return response.send({
					message: true
				});
			}
		})
	},

	getAllOffice:function(request,response){
		Office.find({}) 
		.exec(function(err, office) {
		    if (err){
		    	response.send({message: 'Error'});
		    }
	        if (office) {
	            response.send(office);
	        } 
    	})
	},

	getActiveOffice:function(request,response){
		Office.find({Office_Is_Active:1})
		.exec(function(err, field) {
		    if (err){
		    	response.send({message: 'Error'});
		    }
	        if (field) {
	            response.send(field);
	        } 
    	});
	},

	searchOffice:function(request,response){
		var object={};
		if (request.body.Office_Name)
			object = {Office_Name:{ $regex: request.body.Office_Name, $options: 'i' } }	
			
		Office.find(object)
		.exec(function(err, office) {
		    if (err){
				console.log(err)
		    	response.send({message: 'Error'});
		    }
	        if (office) {
	            response.send(office);
	        } 
    	})
	},

	
}






