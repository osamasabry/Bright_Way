var Reservation = require('../Model/btw_reservation');
var RoomBusy = require('../Model/btw_room_busy');
var Hotel = require('../Model/btw_hotel');
var asyncLoop = require('node-async-loop');


module.exports = {
	searchData:function(request,response){
		// var From = new Date('2019-02-14');
		// var To = new Date('2019-02-28');
		// console.log(From,To);
		var From  =  new Date(request.body.Reservation_Date_From);
		var To = new Date(request.body.Reservation_Date_To);
		var AllHotels =[];
		function getHotelByCityID(){
			Hotel.aggregate([
			{$match: { Hotel_City: Number(request.body.City_Code) }},
			{$unwind: "$Hotel_Contract" },
			{$unwind: "$Hotel_Contract.Hotel_Rooms" },
			{$group: { _id: { 	to: "$Hotel_Contract.Hotel_Rooms.Room_To",
							  	from: "$Hotel_Contract.Hotel_Rooms.Room_From",
							},
			        	HotelStars : { $first: '$Hotel_Stars' },
			        	HotelName : { $first: '$Hotel_Name' },
			        	Hotel_Code : { $first: '$Hotel_Code' },
			        	
			 	Data: { $push: "$Hotel_Contract" } } },
				{$unwind: "$Data" },
				{$unwind: "$Data.Hotel_Rooms" },
				{$unwind: "$Data.Hotel_Rooms.Room_Details" },
				{$match: {
						 "_id.from":{$lte:From} ,"_id.to":{$gte:To},
						 "Data.Hotel_Rooms.Room_Details.RoomType_Code":{$eq:Number(request.body.Room_Type_Code)} ,
						 "Data.Hotel_Rooms.Room_Details.RoomView_Code":{$eq:Number(request.body.Room_View_Code)} ,
				}},
			])
			.exec(function(err, hotel) {
			    if (err){
			    	response.send({message: err});
			    }
		        if (hotel.length > 0) {
		        	// console.log(hotel);
		        	AllHotels =hotel;
					 GetBusyRoom();
					 // response.send(hotel)
		        }else{
			    	response.send({message: "This City Doesn't have any Hotel"});
		        }
	    	})
		}

		function GetBusyRoom(){
			
			asyncLoop(AllHotels, function (hotel, next)
			{

				RoomBusy.aggregate([
				{$match: { 
						$and:[
				    		{RoomBusy_HotelID:hotel.Hotel_Code},
				    		{RoomBusy_Date:{ $gte: From, $lte: To}},
				    		{RoomBusy_Room_Type_Code:Number(request.body.Room_Type_Code)},
				    		{RoomBusy_Room_View_Code:Number(request.body.Room_View_Code)},
				    	]
					}},
				
					{ $group: { _id : null, sum : { $sum: "$RoomBusy_Room_Count" } } }
				])
				.exec(function(err, roomBusy) {
				    if (err){
				    	next(err);
			            return;
				    }
			        if (roomBusy.length > 0) {
			        	hotel.ReservationRoom = roomBusy[0].sum;
						response.send(AllHotels)	 
			        }else{
						response.send(AllHotels)	 
			        }
		    	})
			}, function (err)
			{
			    if (err)
			    {
			        console.error('Error: ' + err.message);
			        return;
			    }
			 
			    console.log('Finished!');
			});
		}

		getHotelByCityID();
	},

}
