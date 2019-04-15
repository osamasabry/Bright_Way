var Bus = require('../Model/btw_buses');


module.exports = {

	addBus:function(request,response){
		Bus.getLastCode(function(err,bus){
			if (bus) 
				insetIntoBus(bus.Bus_Code+1);
			else
				insetIntoBus(1);
		});

		function insetIntoBus(GetNextId){
			var newBus = new Bus();
			newBus.Bus_Code     				= GetNextId;
			newBus.Bus_From 	     			= request.body.Bus_From;
			newBus.Bus_To   	 				= request.body.Bus_To;
			newBus.Bus_PriceOutPackage	 		= request.body.Bus_PriceOutPackage;
			newBus.Bus_PriceIncludePackage   	= request.body.Bus_PriceIncludePackage;
			newBus.Bus_cost   					= request.body.Bus_cost;
			
			newBus.save(function(error, doneadd){
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

	editBus:function(request,response){
		var newvalues = { $set: {
				Bus_From 					: request.body.Bus_From,
				Bus_To 						: request.body.Bus_To,
				Bus_PriceOutPackage 		: request.body.Bus_PriceOutPackage,
				Bus_PriceIncludePackage 	: request.body.Bus_PriceIncludePackage,
				Bus_cost					: request.body.Bus_cost,
			} };
		var myquery = { Bus_Code: request.body.Bus_Code }; 
		Bus.findOneAndUpdate( myquery,newvalues, function(err, field) {
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

	getAllBuses:function(request,response){
		Bus.find({})
		.populate({ path: 'CityFrom', select: 'City_Name' })
		.populate({ path: 'CityTo', select: 'City_Name' })
		.exec(function(err, bus) {
		    if (err){
		    	response.send({message: err});
		    }
	        if (bus) {
	            response.send(bus);
	        } 
    	})
	},

	searchBuses:function(request,response){
		var object={
		$and :[
				{Bus_From:Number(request.body.Bus_From)},
				{Bus_To:Number(request.body.Bus_To)},
		]};
		Bus.find(object)
		.populate({ path: 'CityFrom', select: 'City_Name' })
		.populate({ path: 'CityTo', select: 'City_Name' })
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






