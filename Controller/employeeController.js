var Employee = require('../Model/btw_employee');
var Office = require('../Model/btw_office');

// var shell = require('shelljs');
// var UrlResizeImage =[];
// var multer=require('multer');
// var upload=multer({dest:'uploads/'});
// var path = require('path'),
//      fs = require('fs');
// var tinify = require("tinify");
// tinify.key = "JCtv2CQ646psz31PcLRNr4kXWMQSqM6R";

module.exports = {

	addMedia:function(request,response){
		UrlResizeImage = [];
		var filename  = request.file.originalname;
    	var file_name = filename.split('.')[0] ;
    	var extension = filename.split('.')[1] ;
    	var date 	  = new Date();
    	var year  	  = date.getFullYear();
    	var month     = date.getMonth()+1; 
    	var dir = path.resolve('./public/images/'+year+'/'+month);
		if (!fs.existsSync(dir)){
    		shell.mkdir('-p', dir);
		}

		var source = tinify.fromFile(request.file.path);

		Medias.getLastCode(function(err,media){
			if (media){
				var UrlOriginalImage  =  CompressOrignalImage();
				UrlResizeImage.push(ResizeOrignalImage(150,150));
				UrlResizeImage.push(ResizeOrignalImage(565,355));
				insertIntoMedia(media.Media_Code+1,UrlOriginalImage,UrlResizeImage);
			} 
			else{
				var UrlOriginalImage  =  CompressOrignalImage();
				UrlResizeImage.push(ResizeOrignalImage(150,150));
				UrlResizeImage.push(ResizeOrignalImage(565,355));
				insertIntoMedia(1,UrlOriginalImage,UrlResizeImage);
			}
		});

		function CompressOrignalImage(){
			// var data = new Promise((resolve, reject) => {
			    source.toFile(dir+'/'+file_name+'_'+Date.now()+'.'+extension);
				return dir+'/'+file_name+'_'+Date.now()+'.'+extension;
			// })
			 // return data;
		}

		function ResizeOrignalImage(width,height){
			// return new Promise((resolve, reject) => {
				var resized = source.resize({
				  method: "fit",
				  width: width,
				  height: height
				});
				resized.toFile(dir+'/'+file_name+width+'x'+height+'_'+Date.now() +'.'+extension);
				return  dir+'/'+file_name+width+'x'+height+'_'+Date.now() +'.'+extension;
			// })
		}

		function insertIntoMedia(GetNextId,UrlOriginalImage,UrlResizeImage){
			var newMedia = new Medias();
			newMedia.Media_Code     		 		= GetNextId;
			newMedia.Media_Type 	     	 		= request.body.type;
			newMedia.Media_URL   	 				= UrlOriginalImage;
			newMedia.Media_images_url   	 		= UrlResizeImage;
			newMedia.save(function(error, doneadd){
				if(error){
					return response.send({
						message: error
					});
				}
				else{
					return response.send({
						message: true,
						media_id:GetNextId
					});
				}
			});
		}
	},

	editMedia:function(request,response){
		var newvalues = { $set: {
			Media_Title	 				: request.body.title,
			Media_Description   		: request.body.desc,
			Media_DescriptionKeywords   : request.body.desc_keywords,
			Media_ReplacedText  	    : request.body.replace_text,

		} };
		var myquery = { Media_Code: request.body.row_id }; 
		Medias.findOneAndUpdate( myquery,newvalues, function(err, field) {
    	    if (err){
    	    	return response.send({
					message: 'Error'
				});
    	    }
            if (!field) {
            	return response.send({
					message: 'Media not exists'
				});
            } else {
                return response.send({
					message: true
				});
			}
		})
	},

	getMediaByID:function(request,response){
		Medias.find({Media_Code:request.query.row_id}, function(err, field) {
		    if (err){
		    	response.send({message: 'Error'});
		    }
	        if (field) {
	            response.send(field);
	        } 
    	});
	},

	
}






