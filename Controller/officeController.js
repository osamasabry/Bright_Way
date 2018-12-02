var Office = require('../Model/btw_office');



module.exports = {

	addPost:function(request,response){
		Posts.getLastCode(function(err,post){
			if (post) 
				insetIntoPost(post.Post_Code+1);
			else
				insetIntoPost(1);
		});

		function insetIntoPost(GetNextId){
			var newPost = new Posts();
			newPost.Post_Code     		 			= GetNextId;
			newPost.Post_Title 	     	 			= request.body.title;
			newPost.Post_URL   	 					= request.body.url;
			newPost.Post_Content	 				= request.body.content;
			newPost.Post_FocusKeyword   			= request.body.focus_keyword;
			newPost.Post_MetaDescription   	 	    = request.body.meta_desc ;
			newPost.Post_FeaturedImage_Media_ID  	= request.body.featured_image_media_id;
			newPost.Post_KeywordsList   			= request.body.keyeords_list ;
			newPost.Post_CategoriesList_Category_ID = request.body.category_id;
			newPost.Post_TagsList_Tag_ID 		 	= request.body.tag_id;
			newPost.Post_CreatedBy_User_ID 			= request.body.create_by;
			newPost.Post_CreatedOn 					= Date.now();
			newPost.Post_SentToPublishOn 			= request.body.publish_on;
			newPost.Post_PublishedBy_User_ID 		= request.body.publish_by;
			newPost.Post_PublishedOn 				= request.body.publish_date;
			newPost.Post_Status 					= 0;
			newPost.save(function(error, doneadd){
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

	editPost:function(request,response){
		var newvalues = { $set: {
				Post_Title 						: request.body.title,
				Post_URL 						: request.body.url,
				Post_Content 					: request.body.content,
				Post_FocusKeyword 				: request.body.focus_keyword,
				Post_MetaDescription 			: request.body.meta_desc,
				Post_FeaturedImage_Media_ID 	: request.body.featured_image_media_id,
				Post_KeywordsList 				: request.body.keywords_list,
				Post_CategoriesList_Category_ID : request.body.category_id,
				Post_TagsList_Tag_ID 			: request.body.tag_id,
				Post_CreatedBy_User_ID 			: request.body.user_id,
				Post_CreatedOn 					: Date.now(),
				Post_SentToPublishOn 			: request.body.date_to_publish,
				Post_PublishedBy_User_ID 		: request.body.publish_user_id,
				Post_PublishedOn 				: request.body.date_published,
				Post_Status 					: request.body.status,

			} };

		var myquery = { Post_Code: request.body.row_id }; 
		Posts.findOneAndUpdate( myquery,newvalues, function(err, field) {
    	    if (err){
    	    	return response.send({
					message: 'Error'
				});
    	    }
            if (!field) {
            	return response.send({
					message: 'Posts not exists'
				});
            } else {

                return response.send({
					message: true
				});
			}
		})
	},

	getAllPosts:function(request,response){
		Posts.find({}) 
		.populate({ path: 'Category', select: 'Category_Code Category_Name' })
		.populate({ path: 'Tag', select: 'Tag_Code Tag_Name' })
		.populate({ path: 'Media', select: 'Media_Code Media_Title' })
		.populate({ path: 'User', select: 'CP_User_Code CP_User_Name' })
		.lean()
		.exec(function(err, post) {
		    if (err){
		    	response.send({message: 'Error'});
		    }
	        if (post) {
	        	
	            response.send(post);
	        } 
    	})
	},

	getActivePosts:function(request,response){
		Posts.find({Post_Status:1})
		.populate({ path: 'Category', select: 'Category_Code Category_Name' })
		.populate({ path: 'Tag', select: 'Tag_Code Tag_Name' })
		.populate({ path: 'Media', select: 'Media_Code Media_Title' })
		.populate({ path: 'User', select: 'CP_User_Code CP_User_Name' })
		.lean()
		.exec(function(err, field) {
		    if (err){
		    	response.send({message: 'Error'});
		    }
	        if (field) {
	        	
	            response.send(field);
	        } 
    	});
	},

	getPostByID:function(request,response){
		var Searchquery = Number(request.body.row_id); 
		Posts.find({'Post_Code':Searchquery})
		.populate({ path: 'Category', select: 'Category_Code Category_Name' })
		.populate({ path: 'Tag', select: 'Tag_Code Tag_Name' })
		.populate({ path: 'Media', select: 'Media_Code Media_Title' })
		.populate({ path: 'User', select: 'CP_User_Code CP_User_Name' })
		.lean()
		.exec(function(err, post) {
			if (err){
	    		return response.send({
					message: err
				});
	    	}
	    	if (post.length == 0) {
				return response.send({
					message: 'No Posts Found !!',
					length: post.length
				});
        	} else {
				return response.send({
					post: post
				});
			}
		})
	},

	getPostByTitle:function(request,response){
		var Searchquery = request.body.row_id; 
		 Posts.find({'Post_Title':Searchquery})
		.populate({ path: 'Category', select: 'Category_Code Category_Name' })
		.populate({ path: 'Tag', select: 'Tag_Code Tag_Name' })
		.populate({ path: 'Media', select: 'Media_Code Media_Title' })
		.populate({ path: 'User', select: 'CP_User_Code CP_User_Name' })
		.lean()
		.exec(function(err, post) {
			if (err){
	    		return response.send({
					message: err
				});
	    	}
	    	if (post.length == 0) {
				return response.send({
					message: 'No Posts Found !!',
					length: post.length
				});
        	} else {
				return response.send({
					post: post
				});
			}
		})
	}
}






