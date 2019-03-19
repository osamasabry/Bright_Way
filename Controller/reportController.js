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
		
		var date1 = new Date('2019-02-9');
		var date2 = new Date('2019-02-20');

		// date1 = new Date(request.body.From);
		// date2 = new Date(request.body.To);

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
					}	
				},

			])
			.exec(function(err, reserv) {
			    if (err){
			    	response.send({message: err});
			    }
		        if (reserv.length > 0) {
		        	response.send(reserv)
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
}
