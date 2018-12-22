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
	
}






