var Reservation = require('../Model/btw_reservation');
var RoomBusy = require('../Model/btw_room_busy');
var Hotel = require('../Model/btw_hotel');
var BusDailyPassengers = require('../Model/btw_bus_daily_passenger');

var asyncLoop = require('node-async-loop');
var async = require('asyncawait/async');
var await = require('asyncawait/await');

var loop = require('wait-loop');
const delay = require('delay');


module.exports = {

	getReservationByHotelID:function (request,response){
		
		// var date1 = new Date('2019-02-9');
		// var date2 = new Date('2019-02-20');

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
		var ArrayData = [];

		function getDates(startDate, endDate) {
		  	var dates = [],
		      	currentDate = startDate,
		      	addDays = function(days) {
			        var date = new Date(this.valueOf());
			        date.setDate(date.getDate() + days);
			        return date;
			    };
			  	while (currentDate <= endDate) {
					   GetData(currentDate);
					    currentDate = addDays.call(currentDate, 1);
				}
		}

		function GetData (day){
				RoomBusy.aggregate(
		        [	
		        	{$match: { 
						$and:[
				    		{RoomBusy_HotelID:Number(request.body.RoomBusy_HotelID)},
				    		{RoomBusy_Date:day},
				    	]
					}},
			        { "$group": {
			            "_id": '$RoomBusy_Date',
			            "Standerd": {
			              	"$sum": { 
			                	"$cond": [
			                 	 	{ "$eq": [ "$RoomBusy_Room_Type_Code", 1 ] },
			                 	 	"$RoomBusy_Room_Count",
			                 	 	0,
			                	]
			              	}
		            	},
			            "Suite": {
			              	"$sum": { 
			                	"$cond": [
			                 	 	{ "$eq": [ "$RoomBusy_Room_Type_Code", 2 ] },
			                 	 	"$RoomBusy_Room_Count",
			                 	 	0,
			                	]
			              	}
		            	},
		            	"Garden View": {
			              	"$sum": { 
			                	"$cond": [
			                 	 	{ "$eq": [ "$RoomBusy_Room_View_Code", 1 ] },
			                 	 	"$RoomBusy_Room_Count",
			                 	 	0,
			                	]
			              	}
		            	},
		            	"Pool View": {
			              	"$sum": { 
			                	"$cond": [
			                 	 	{ "$eq": [ "$RoomBusy_Room_View_Code", 2 ] },
			                 	 	"$RoomBusy_Room_Count",
			                 	 	0,
			                	]
			              	}
		            	},
		            	"Sea View": {
			              	"$sum": { 
			                	"$cond": [
			                 	 	{ "$eq": [ "$RoomBusy_Room_View_Code", 3 ] },
			                 	 	"$RoomBusy_Room_Count",
			                 	 	0,
			                	]
			              	}
		            	},
		          	}}
		        ])
				.exec(function(err, roomBusy) {
				    if (err){
				    	response.send({message: err});
				    }
			        if (roomBusy.length > 0) {
			        	console.log(roomBusy)
				    	ArrayData.push(roomBusy[0]);
			        }else{
			        	console.log('no')
				    	response.send({message: 'Not Have Room'});
			        }
				})
		}

		 var Result= async (function (){
           var days =  await (getDates(date1,date2));
           await (delay(100));
           response.send(ArrayData)
        });
        Result();
	},
}
