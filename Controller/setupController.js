var PaymentMethod = require('../Model/btw_payment_method');
var SystemSetting = require('../Model/btw_system_setting');
var RoomType = require('../Model/lut_btw_room_type');
var RoomView = require('../Model/lut_btw_room_view');



module.exports = {

	// addTag:function(request,response){
	// 	Tags.getLastCode(function(err,tag){
	// 		if (tag) 
	// 			insetIntoTag(tag.Tag_Code+1);
	// 		else
	// 			insetIntoTag(1);
	// 	});

	// 	function insetIntoTag(GetNextId){
	// 		var newTag = new Tags();
	// 		newTag.Tag_Code     		 		= GetNextId;
	// 		newTag.Tag_Name 	     	 		= request.body.name;
	// 		newTag.Tag_Description   	 		= request.body.desc;
	// 		newTag.Tag_MetaTitle	 			= request.body.meta_title;
	// 		newTag.Tag_FocusKeyWord   			= request.body.focus_keyword;
	// 		newTag.Tag_KeyeordsList   	 	    = request.body.keyeords_list ;
	// 		newTag.Tag_FeaturedImage_Media_ID  	= request.body.featured_image_media_id;
	// 		newTag.Tag_URL   					= request.body.url;
	// 		newTag.Tag_IsActive 				= 1;

	// 		newTag.save(function(error, doneadd){
	// 			if(error){
	// 				return response.send({
	// 					message: error
	// 				});
	// 			}
	// 			else{
	// 				return response.send({
	// 					message: true
	// 				});
	// 			}
	// 		});
	// 	}
	// },

	// editTag:function(request,response){
	// 	var newvalues = { $set: {
	// 			Tag_Name 					: request.body.name,
	// 			Tag_Description 			: request.body.desc,
	// 			Tag_MetaTitle 				: request.body.meta_title,
	// 			Tag_FocusKeyWord 			: request.body.focus_keyword,
	// 			Tag_KeyeordsList 			: request.body.keyeords_list,
	// 			Tag_FeaturedImage_Media_ID 	: request.body.featured_image_media_id,
	// 			Tag_URL 					: request.body.url,
	// 			Tag_IsActive 				: request.body.status,
	// 		} };

	// 	var myquery = { Tag_Code: request.body.row_id }; 


	// 	Tags.findOneAndUpdate( myquery,newvalues, function(err, field) {
 //    	    if (err){
 //    	    	return response.send({
	// 				message: 'Error'
	// 			});
 //    	    }
 //            if (!field) {
 //            	return response.send({
	// 				message: 'Tags not exists'
	// 			});
 //            } else {
 //                return response.send({
	// 				message: true
	// 			});
	// 		}
	// 	})
	// },

	getPaymentMethods:function(request,response){
		PaymentMethod.find({})
		.exec(function(err, payment) {
		    if (err){
		    	response.send({message: 'Error'});
		    }
	        if (payment) {
	            response.send(payment);
	        } 
    	})
	},

	getSystemSettings:function(request,response){
		SystemSetting.find({})
		.exec(function(err, system) {
		    if (err){
		    	response.send({message: 'Error'});
		    }
	        if (system) {
	        	
	            response.send(system);
	        } 
    	})
	},

	getRoomTypes:function(request,response){
		RoomType.find({})
		.exec(function(err, room_type) {
		    if (err){
		    	response.send({message: 'Error'});
		    }
	        if (room_type) {
	        	
	            response.send(room_type);
	        } 
    	})
	},

	getRoomViews:function(request,response){
		RoomView.find({})
		.exec(function(err, room_view) {
		    if (err){
		    	response.send({message: 'Error'});
		    }
	        if (room_view) {
	            response.send(room_view);
	        } 
    	})
	},
	
}






