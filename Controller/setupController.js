var PaymentMethod = require('../Model/btw_payment_method');
var SystemSetting = require('../Model/btw_system_setting');
var RoomType = require('../Model/lut_btw_room_type');
var RoomView = require('../Model/lut_btw_room_view');
var City = require('../Model/lut_btw_city');


module.exports = {

	
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

	getCities:function(request,response){
		City.find({})
		.exec(function(err, city) {
		    if (err){
		    	response.send({message: 'Error'});
		    }
	        if (city) {
	            response.send(city);
	        } 
    	})
	},

	addCity:function(request,response){
		City.getLastCode(function(err,city){
			if (city) 
				insetIntoCity(city.City_Code+1);
			else
				insetIntoCity(1);
		});

		function insetIntoCity(GetNextId){
			var newCity = new City();
			newCity.City_Code     		 	= GetNextId;
			newCity.City_Name 	     	 	= request.body.City_Name;
			newCity.City_IsActive 	     	= 0;
			newCity.save(function(error, doneadd){
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
	
	editCity:function(request,response){
		var newvalues = { $set: {
				City_Name 				    : request.body.City_Name,
				City_IsActive 				: request.body.City_IsActive,
			} };
		
		var myquery = { City_Code: request.body.City_Code }; 
		City.findOneAndUpdate( myquery,newvalues, function(err, field) {
    	    if (err){
    	    	return response.send({
					message: 'Error'
				});
    	    }
            if (!field) {
            	return response.send({
					message: 'City not exists'
				});
            } else {
                return response.send({
					message: true
				});
			}
		})
	},

	getActiveCities:function(request,response){
		City.find({City_IsActive:1})
		.exec(function(err, city) {
		    if (err){
		    	response.send({message: 'Error'});
		    }
	        if (city) {
	            response.send(city);
	        } 
    	})
	},

}






