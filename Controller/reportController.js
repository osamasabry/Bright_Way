var Reservation = require('../Model/btw_reservation');
var RoomBusy = require('../Model/btw_room_busy');
var Hotel = require('../Model/btw_hotel');
var BusDailyPassengers = require('../Model/btw_bus_daily_passenger');

var asyncLoop = require('node-async-loop');

module.exports = {

	getReservationByHotelID:function (request,response){
		
		// var date1 = new Date('2019-02-15');
		// var date2 = new Date('2019-02-18');

		date1 = new Date(request.body.From);
		date2 = new Date(request.body.To);

		Reservation.aggregate([
			{$match: { $and :[
					{Reservation_Hotel_ID  			:Number(request.body.Reservation_Hotel_ID)},
		    		{Reservation_Date_From			: { $gte: date1, $lte: date2}},

			]}},
				{$group: 
					{ 	
						_id :  "$Reservation_Hotel_ID" ,
						Price : { $sum: "$Reservation_Grand_Total" },
						Cost : { $sum: "$Reservation_Grand_Total_Cost" },
			        	Reservation_Hotel_ID : { $first: '$Reservation_Hotel_ID' },
			        	Reservation_Customer_ID : { $push: '$Reservation_Customer_ID' },
					}	
				},
			])
			.exec(function(err, reserv) {
			    if (err){
			    	response.send({message: err});
			    }
		        if (reserv.length > 0) {
		        	   Reservation.populate(reserv, { path: 'Hotel' , select: 'Hotel_Name'}, function(err, hotel) {
			    			Reservation.populate(hotel, { path: 'Customer' , select: 'Customer_Name'}, function(err, customer) {
				    			response.send(customer);
					        });
				        });
		        }else{
			    	response.send({message: 'This Hotel Not Have Reservation'});
		        } 
	    	})
	},

	getBusDailyPassengerByDate:function (request,response){
		// var date1 = new Date('2019-02-25');
		// var date2 = new Date('2019-02-28');

		var date1 = new Date(request.body.From);
		var date2 = new Date(request.body.To);
		    		
		BusDailyPassengers.aggregate([
			{$match: 
		    		{BusDailyPassengers_Date			: { $gte: date1, $lte: date2}},
			},
				{$group: 
					{ 	
						_id :  null ,
						Passenger_Count : { $sum: "$BusDailyPassengers_Count" },
						Trip_Count : { $sum: "$BusDailyPassengers_Code" },
					}	
				},
			])
			.exec(function(err, reserv) {
			    if (err){
			    	response.send({message: err});
			    }
		        if (reserv.length > 0) {

		        	response.send(reserv);
		        // 	   Reservation.populate(reserv, { path: 'Hotel' , select: 'Hotel_Name'}, function(err, hotel) {
			    			// Reservation.populate(hotel, { path: 'Customer' , select: 'Customer_Name'}, function(err, customer) {
				    		// 	response.send(customer);
					     //    });
				      //   });
		        }else{
			    	response.send({message: 'This Hotel Not Have Reservation'});
		        } 
	    	})
	},

	getReservationDetailsByHotelID:function (request,response){
		
		// var date1 = new Date('2019-02-15');
		// var date2 = new Date('2019-02-18');

		date1 = new Date(request.body.From);
		date2 = new Date(request.body.To);

		Reservation.aggregate([
			{$match: { $and :[
					{Reservation_Hotel_ID  			:Number(request.body.Reservation_Hotel_ID)},
		    		{Reservation_Date_From			: { $gte: date1, $lte: date2}},
			]}},

				 { "$unwind": "$Reservation_Room" },
				{$group: 
					{ 	
						_id:{ 	view: "$Reservation_Room.View",
						  		type: "$Reservation_Room.Type",
						},
						Price : { $sum: "$Reservation_Room.Price" },
			        	Cost : { $sum: '$Reservation_Room.Cost' },
			        	// Reservation_Customer_ID : { $push: '$Reservation_Room.View' },
					}	
				},
				{
		        "$project": {
			            "Reservation_Room.View": "$_id.view",
			            "Reservation_Room.Type": "$_id.type",
			            "Price" : '$Price',
			        	"Cost" : '$Cost',
			        }		
			    },

			])
			.exec(function(err, reserv) {
			    if (err){
			    	response.send({message: err});
			    }
		        if (reserv.length > 0) {
		        	   Reservation.populate(reserv, { path: 'RoomView' , select: 'RoomView_Name'}, function(err, view) {
			    			Reservation.populate(view, { path: 'RoomType' , select: 'RoomType_Name'}, function(err, type) {
				    			response.send(type);
					        });
				        });
		        }else{
			    	response.send({message: 'This Hotel Not Have Reservation'});
		        } 
	    	})
	},
	
	getBusyRoom:function(request,response){
		// var date1 = new Date('2019-02-15');
		// var date2 = new Date('2019-02-18');

		var date1 = new Date(request.body.From);
		var date2 = new Date(request.body.To);

		RoomBusy.aggregate([
				{$match: { 
					$and:[
							{RoomBusy_HotelID:Number(request.body.RoomBusy_HotelID)},
							{RoomBusy_Date:{ $gte: date1, $lte: date2}},
							{RoomBusy_Room_Type_Code:Number(request.body.RoomBusy_Room_Type_Code)},

						]
				}},
				{ $group: { _id : {	 date: '$RoomBusy_Date',
									 Room_View_Code: '$RoomBusy_Room_View_Code'}, 
									 maxcount : { $sum: "$RoomBusy_Room_Count" },
			        				 RoomBusy_Room_View_Code : { $first: '$RoomBusy_Room_View_Code' },

									  } }
			])
			.exec(function(err, roomBusy) {
			    if (err){
		    		response.send({message: err});
				}
		        if (roomBusy.length > 0) {
		        	RoomBusy.populate(roomBusy, { path: 'RoomView' , select: 'RoomView_Name'}, function(err, view) {
		    			response.send(view);
			        });
		        }else{
		    		response.send({message: 'Not Busy Room'});
		        }
	    	})
	},

	getBusSituation:function (request,response){

		// var date = new Date('2019-02-15');

		var date = new Date(request.body.Date);

		BusDailyPassengers.aggregate([
			{$match: 
		    		{
		    			BusDailyPassengers_Date	 	   : date ,
		    			BusDailyPassengers_Place_From  : Number(request.body.BusDailyPassengers_Place_From) ,
		    			BusDailyPassengers_Place_To	   : Number(request.body.BusDailyPassengers_Place_To) ,
		    		},
			},
				{$group: 
					{ 	
						_id : { 
								busNumber:'$BusDailyPassengers_Bus_Number',
								hotel: '$BusDailyPassengers_Hotel_Code' ,
								customer:'$BusDailyPassengers_Customer_Code',
								reservation_id:'$BusDailyPassengers_Reservation_Code',
								
								},
						BusDailyPassengers_Count : { $first: "$BusDailyPassengers_Count" },
						BusDailyPassengers_Hotel_Code : { $first: "$BusDailyPassengers_Hotel_Code" },
						BusDailyPassengers_Customer_Code : { $first: "$BusDailyPassengers_Customer_Code" },
						BusDailyPassengers_Reservation_Code : { $first: "$BusDailyPassengers_Reservation_Code" }
					}	
				},
			])
			.exec(function(err, bus) {
			    if (err){
			    	response.send({message: err});
			    }
		        if (bus.length > 0) {
		        	// response.send(bus)
		        	   BusDailyPassengers.populate(bus, { path: 'Hotel' , select: 'Hotel_Name'}, function(err, hotel) {
			    			BusDailyPassengers.populate(hotel, { path: 'Customer' , select: 'Customer_Name Customer_Phone'}, function(err, customer) {
			    				BusDailyPassengers.populate(customer, { path: 'Reservation' , select :'Reservation_Number_of_Child Reservation_Room Reservation_Payment Reservation_Grand_Total' }, function(err, reservation) {
				    				response.send(reservation);
				    			});
					        });
				        });
		        }else{
			    	response.send({message: 'This Date Not Have Reservation'});
		        } 
	    	})
	},

	// RoomingList:function (request,response){
	// 	// var date1 = new Date('2019-02-15');
	// 	// var date2 = new Date('2019-02-18');

	// 	var date1 = new Date(request.body.From);
	// 	var date2 = new Date(request.body.To);

	// 	RoomBusy.aggregate([
	// 			{$match: { 
	// 				$and:[
	// 						{RoomBusy_HotelID:Number(request.body.RoomBusy_HotelID)},
	// 						{RoomBusy_Date:{ $gte: date1, $lte: date2}},
	// 					]
	// 			}},
	// 			{ $group: { _id : 
	// 						{	 	
	// 								 RoomBusy_Room_View_Code: '$RoomBusy_Room_View_Code', 
	// 								 RoomBusy_Room_Type_Code: '$RoomBusy_Room_Type_Code', 
	// 								 RoomBusy_Room_Count: '$RoomBusy_Room_Count', 
	// 								 RoomBusy_Reservation_Code: '$RoomBusy_Reservation_Code',
	// 								 RoomBusy_Note: '$RoomBusy_Note' 
	// 						 },
	// 						 RoomBusy_Room_Type_Code: {$first : '$RoomBusy_Room_Type_Code'}, 
	// 						 RoomBusy_Room_View_Code: {$first:'$RoomBusy_Room_View_Code'}, 
	// 						 RoomBusy_Reservation_Code :{$first:'$RoomBusy_Reservation_Code' }
	// 					}
	// 			}
	// 		])
	// 		.exec(function(err, roomBusy) {
	// 		    if (err){
	// 	    		response.send({message: err});
	// 			}
	// 	        if (roomBusy.length > 0) {
	// 	        	RoomBusy.populate(roomBusy, { path: 'Reservation'}, function(err, reserv) {
	// 	        		RoomBusy.populate(reserv, { path: 'RoomType'}, function(err, type) {
	// 	        			RoomBusy.populate(type, { path: 'RoomView'}, function(err, view) {
	// 	    					response.send(view);
	// 		        		});
	// 		        	});
	// 		        });
	// 	        }else{
	// 	    		response.send({message: 'Not Busy Room'});
	// 	        }
	//     	})
	// },

	getReservationDetails:function (request,response){
		// var date1 = new Date('2019-02-15');
		// var date2 = new Date('2019-02-18');

		var date1 = new Date(request.body.From);
		var date2 = new Date(request.body.To);

		Reservation.aggregate([
				{$match: { 
					$and:[
							{Reservation_Hotel_ID:Number(request.body.Reservation_Hotel_ID)},
							{Reservation_Date_From:{ $gte: date1, $lte: date2}},
							{Reservation_Date_To:{ $gte: date1, $lte: date2}},

						]
				}},
				{ "$unwind": "$Reservation_Room" },

				{ $group: { _id : 
							{	 	
									 View: '$Reservation_Room.View', 
									 Type: '$Reservation_Room.Type', 
									 Reservation_Office_ID: '$Reservation_Office_ID', 
							 },
							 // View: {$first : '$Reservation_Room.View'}, 
							 // Type: {$first:'$Reservation_Room.Type'}, 
							 Count :{$sum:'$Reservation_Room.Count' },
							 Reservation_Office_ID:{$first:'$Reservation_Office_ID' }, 
						}
				},
				{
		        "$project": {
			            "Reservation_Room.View": "$_id.View",
			            "Reservation_Room.Type": "$_id.Type",
			            "Count" : '$Count',
			        	"Reservation_Office_ID" : '$Reservation_Office_ID',
			        }		
			    },
			])
			.exec(function(err, reserv) {
			    if (err){
		    		response.send({message: err});
				}
		        if (reserv.length > 0) {
		        	// response.send(reserv);
		        	Reservation.populate(reserv, { path: 'Office'}, function(err, office) {
		        		Reservation.populate(office, { path: 'RoomType'}, function(err, type) {
		        			Reservation.populate(type, { path: 'RoomView'}, function(err, view) {
		    					response.send(view);
			        		});
			        	});
		        		// response.send(office);

			        });
		        }else{
		    		response.send({message: 'Not Reservation Room'});
		        }
	    	})
	},

	getRoomingList:function (request,response){
		// var date1 = new Date('2019-06-05');
		// var date2 = new Date('2019-06-08');

		var date1 = new Date(request.body.From);
		var date2 = new Date(request.body.To);

		Reservation.aggregate([
				{$match: { 
					$and:[
							{Reservation_Hotel_ID:Number(request.body.Reservation_Hotel_ID)},
							{Reservation_Date_From:{ $gte: date1},Reservation_Date_To: {$lte: date2}},
						]
				}},
				{$unwind: "$Reservation_Room" },
				{ $group: { _id : 
							{	 	
									 Reservation_View_Code: '$Reservation_Room.View', 
									 Reservation_Type_Code: '$Reservation_Room.Type', 
									 RoomBusy_Room_Count: '$Reservation_Room.Count', 
									 Reservation_Customer_ID: '$Reservation_Customer_ID',
									 Reservation_Note: '$Reservation_Note' 
							 },
							 // RoomBusy_Room_Type_Code: {$first : '$RoomBusy_Room_Type_Code'}, 
							 // RoomBusy_Room_View_Code: {$first:'$RoomBusy_Room_View_Code'}, 
						}
				},
				{
		        "$project": {
			            "Reservation_Room.View": "$_id.Reservation_View_Code",
			            "Reservation_Room.Type": "$_id.Reservation_Type_Code",
			            "Reservation_Customer_ID":"$_id.Reservation_Customer_ID",
			        }		
			    },
			])
			.exec(function(err, reserve) {
			    if (err){
		    		response.send({message: err});
				}
		        if (reserve.length > 0) {
		        		Reservation.populate(reserve, { path: 'RoomType'}, function(err, type) {
		        			Reservation.populate(type, { path: 'RoomView'}, function(err, view) {
		    					Reservation.populate(view, { path: 'Customer'}, function(err, customer) {
		    						response.send(customer);
			        			});
			        		});
			        	});
		        }else{
		    		response.send({message: 'Not Reserve Room In This Date'});
		        }
	    	})
	},

}
