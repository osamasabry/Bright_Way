var BusDailyPassengers = require('../Model/btw_bus_daily_passenger');



module.exports = {

	editBusDailyPassengers:function(request,response){
		var newvalues = { $set: {
				BusDailyPassengers_Transportation_Method 	: request.body.BusDailyPassengers_Transportation_Method,
				BusDailyPassengers_Transportation_Details 	: request.body.BusDailyPassengers_Transportation_Details,
				BusDailyPassengers_Bus_Number 				: request.body.BusDailyPassengers_Bus_Number,
			} };
		var myquery = { BusDailyPassengers_Code: request.body.BusDailyPassengers_Code }; 
		BusDailyPassengers.findOneAndUpdate( myquery,newvalues, function(err, field) {
    	    if (err){
    	    	return response.send({
					message: err
				});
    	    }
            if (!field) {
            	return response.send({
					message: 'Bus not exists'
				});
            } else {
                return response.send({
					message: true
				});
			}
		})
	},

	searchBusDailyPassengers:function(request,response){
		if (request.body.Date && request.body.Place_From &&request.body.Place_To ) {
			var object={
			$and :[
					{BusDailyPassengers_Place_From  :request.body.Place_From},
					{BusDailyPassengers_Place_To	:request.body.Place_To},
					{BusDailyPassengers_Date 		:new Date(request.body.Date)},
			]};
		}else{
			var object = {BusDailyPassengers_Date 		:new Date(request.body.Date)};
		}

		BusDailyPassengers.find(object)
		.exec(function(err, bus) {
		    if (err){
		    	response.send({message: err});
		    }
	        if (bus) {
	            response.send(bus);
	        } 
    	})
	},

}






