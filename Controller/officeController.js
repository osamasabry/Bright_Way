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

	getOfficeByID:function(request,response){
		var Searchquery = Number(request.body.row_id); 
		Office.find({'Office_Code':Searchquery})
		.exec(function(err, office) {
			if (err){
	    		return response.send({
					message: err
				});
	    	}
	    	if (office.length == 0) {
				return response.send({
					message: 'No offices Found !!',
					length: office.length
				});
        	} else {
				return response.send({
					office: office
				});
			}
		})
	},

	// getPostByTitle:function(request,response){
	// 	var Searchquery = request.body.row_id; 
	// 	 Posts.find({'Post_Title':Searchquery})
	// 	.populate({ path: 'Category', select: 'Category_Code Category_Name' })
	// 	.populate({ path: 'Tag', select: 'Tag_Code Tag_Name' })
	// 	.populate({ path: 'Media', select: 'Media_Code Media_Title' })
	// 	.populate({ path: 'User', select: 'CP_User_Code CP_User_Name' })
	// 	.lean()
	// 	.exec(function(err, post) {
	// 		if (err){
	//     		return response.send({
	// 				message: err
	// 			});
	//     	}
	//     	if (post.length == 0) {
	// 			return response.send({
	// 				message: 'No Posts Found !!',
	// 				length: post.length
	// 			});
 //        	} else {
	// 			return response.send({
	// 				post: post
	// 			});
	// 		}
	// 	})
	// }
}






