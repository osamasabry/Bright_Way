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

	editBusDailyPassengersGoAndBack:function(request,response){
		var newvalues = { $set: {
				BusDailyPassengers_Transportation_Method 	: request.body.BusDailyPassengers_Transportation_Method,
				BusDailyPassengers_Transportation_Details 	: request.body.BusDailyPassengers_Transportation_Details,
				BusDailyPassengers_Bus_Number 				: request.body.BusDailyPassengers_Bus_Number,
			} };
		var myquery = { BusDailyPassengers_Reservation_Code: request.body.BusDailyPassengers_Reservation_Code }; 
		BusDailyPassengers.findAndUpdate( myquery,newvalues, function(err, field) {
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
		var Data = [];
		var obj = {};
		if (request.body.Date && request.body.Place_From &&request.body.Place_To ) {
			console.log('multiple option');
			var object={
			$and :[
					{BusDailyPassengers_Place_From  			:Number(request.body.Place_From)},
					{BusDailyPassengers_Place_To				:Number(request.body.Place_To)},
					{BusDailyPassengers_Date 					:new Date(request.body.Date)},
					{BusDailyPassengers_Transportation_Method 	:0},
			]};
		}else{
			console.log('single');
			var object = {
				BusDailyPassengers_Date 		:new Date(request.body.Date),
				BusDailyPassengers_Transportation_Method 	:0,
			};
			console.log(object);
		}

		BusDailyPassengers.find(object)
		.populate({ path: 'Hotel', select: 'Hotel_Name' })
		.populate({ path: 'Customer', select: 'Customer_Name' })
		.populate({ path: 'CityFrom', select: 'City_Name' })
		.populate({ path: 'CityTo', select: 'City_Name' })
		.lean()
		.exec(function(err, field) {
		    if (err){
		    	response.send({message: err});
		    }
	        if (field) {
	        	obj.pending = field;
	        	if(request.body.Place_From &&request.body.Place_To){
	        		getBrightWayPassenger();
	        	}else{
					console.log(field);
					console.log('adfsadf');
	      		  	Data.push(obj);
	            	response.send(Data);
	        	}
	        }else{
		    	response.send({message: "This Date Dosen't Reserved"});
	        } 
    	})

    	function getBrightWayPassenger(){
	  		BusDailyPassengers.aggregate([
			{$match: { $and :[
					{BusDailyPassengers_Place_From  			:Number(request.body.Place_From)},
					{BusDailyPassengers_Place_To				:Number(request.body.Place_To)},
					{BusDailyPassengers_Date 					:new Date(request.body.Date)},
					{BusDailyPassengers_Transportation_Method 	:1},
			]}},
				{$group: 
					{ 	
						_id : null, 
						Sum : { $sum: "$BusDailyPassengers_Count" },
						BusNumber : { $first: "$BusDailyPassengers_Bus_Number" },
					}
			 	},
			])
			.exec(function(err, brw_way) {
			    if (err){
			    	response.send({message: err});
			    }
		        if (brw_way) {
		        	obj.BrightWay = brw_way;
	        		getGoBusPassenger();
		        }else{
	        		getGoBusPassenger();
		        } 
	    	})
    	}


    	function getGoBusPassenger(){
	  		BusDailyPassengers.aggregate([
			{$match: { $and :[
					{BusDailyPassengers_Place_From  			:Number(request.body.Place_From)},
					{BusDailyPassengers_Place_To				:Number(request.body.Place_To)},
					{BusDailyPassengers_Date 					:new Date(request.body.Date)},
					{BusDailyPassengers_Transportation_Method 	:2},
			]}},
				{$group: 
					{ 	
						_id : null, 
						Sum : { $sum: "$BusDailyPassengers_Count" },
						// BusNumber : { $first: "$BusDailyPassengers_Bus_Number" },
					}
			 	},
			])
			.exec(function(err, gobus) {
			    if (err){
			    	response.send({message: err});
			    }
		        if (gobus) {
		        	obj.GoBus = gobus;
	        		getCancelledPassenger();
		        }else{
	        		getCancelledPassenger();
		        } 
	    	})
    	}

    	function getCancelledPassenger(){
	  		BusDailyPassengers.aggregate([
			{$match: { $and :[
					{BusDailyPassengers_Place_From  			:Number(request.body.Place_From)},
					{BusDailyPassengers_Place_To				:Number(request.body.Place_To)},
					{BusDailyPassengers_Date 					:new Date(request.body.Date)},
					{BusDailyPassengers_Transportation_Method 	:3},
			]}},
				{$group: 
					{ 	
						_id : null, 
						Sum : { $sum: "$BusDailyPassengers_Count" },
						// BusNumber : { $first: "$BusDailyPassengers_Bus_Number" },
					}
			 	},
			])
			.exec(function(err, cancel) {
			    if (err){
			    	response.send({message: err});
			    }
		        if (cancel) {
		        	obj.Cancelled = cancel;
	        		Data.push(obj);
		            response.send(Data);
		        }else{
	        		Data.push(obj);
		            response.send(Data);
		        } 
	    	})
    	}
	},

	getCustomerByBusNumber:function(request,response){
		var object={
			$and :[
					{BusDailyPassengers_Place_From  	:Number(request.body.BusDailyPassengers_Place_From)},
					{BusDailyPassengers_Place_To		:Number(request.body.BusDailyPassengers_Place_To)},
					{BusDailyPassengers_Date 			:new Date(request.body.BusDailyPassengers_Date)},
					{BusDailyPassengers_Bus_Number 		:request.body.BusDailyPassengers_Bus_Number},
			]
		};
		BusDailyPassengers.find(object)
		.populate({ path: 'Hotel', select: 'Hotel_Name' })
		.populate({ path: 'Customer', select: 'Customer_Name' })
		.populate({ path: 'CityFrom', select: 'City_Name' })
		.populate({ path: 'CityTo', select: 'City_Name' })
		.lean()
		.exec(function(err, field) {
		    if (err){
		    	response.send({message: err});
		    }
	        if (field) {
            	response.send(field);
	        }else{
		    	response.send({message: "This Data Not Match Any Reservation"});
	        } 
    	})
	},

}






