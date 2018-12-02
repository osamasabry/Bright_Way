var Customer = require('../Model/btw_customer');


module.exports = {

	addCategory:function(request,response){
		Categories.getLastCode(function(err,category){
			if (category) 
				insetIntoCategory(category.Category_Code+1);
			else
				insetIntoCategory(1);
		});

		function insetIntoCategory(GetNextId){
			var newCategory = new Categories();
			newCategory.Category_Code     		 	    	= GetNextId;
			newCategory.Category_Name 	     	 			= request.body.name;
			newCategory.Category_Description   	 			= request.body.desc;
			newCategory.Category_MetaTitle	 				= request.body.meta_title;
			newCategory.Category_FocusKeyWord   	    	= request.body.focus_keyword;
			newCategory.Category_KeyeordsList   	 		= request.body.keyeords_list ;
			newCategory.Category_FeaturedImage_Media_ID 	= request.body.featured_image_media_id;
			newCategory.Category_URL   						= request.body.url;
       		newCategory.Category_ParentCategory_Category_ID = request.body.parent_category;
       		newCategory.Category_Status 				  	= 1;


			newCategory.save(function(error, doneadd){
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

	editCategory:function(request,response){
		var newvalues = { $set: {
				Category_Name 						: request.body.name,
				Category_Description 				: request.body.desc,
				Category_MetaTitle 					: request.body.meta_title,
				Category_FocusKeyWord 				: request.body.focus_keyword,
				Category_KeyeordsList 				: request.body.keyeords_list,
				Category_FeaturedImage_Media_ID 	: request.body.featured_image_media_id,
				Category_URL 						: request.body.url,
				Category_ParentCategory_Category_ID : request.body.parent_category,
				Category_IsActive 					: request.body.status,
			} };
		var myquery = { Category_Code: request.body.row_id }; 
		Categories.findOneAndUpdate( myquery,newvalues, function(err, field) {
    	    if (err){
    	    	return response.send({
					message: 'Error'
				});
    	    }
            if (!field) {
            	return response.send({
					message: 'Category not exists'
				});
            } else {
                return response.send({
					message: true
				});
			}
		})
	},

	getAllCategories:function(request,response){
		Categories.find({})
		.populate({ path: 'Media', select: 'Media_Code Media_Title' })
		.lean()
		.exec(function(err, Category) {
		    if (err){
		    	response.send({message: 'Error'});
		    }
	        if (Category) {
	        	
	            response.send(Category);
	        } 
    	}).sort({Category_Code:-1}).limit(20)
	},

	getActiveCategories:function(request,response){
		Categories.find({Category_IsActive:1})
		.populate({ path: 'Media', select: 'Media_Code Media_Title' })
		.lean()
		.exec(function(err, field) {
		    if (err){
		    	response.send({message: 'Error'});
		    }
	        if (field) {
	        	
	            response.send(field);
	        } 
    	});
	}
}






