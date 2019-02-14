var Reservation = require('../Model/btw_reservation');
var RoomBusy = require('../Model/btw_room_busy');
var Hotel = require('../Model/btw_hotel');
var asyncLoop = require('node-async-loop');


module.exports = {
	searchData:function(request,response){
		// var From = new Date('2019-02-09');
		// var To = new Date('2019-02-12');
		var From  =  new Date(request.body.Reservation_Date_From);
		var To = new Date(request.body.Reservation_Date_To);
		var AllHotels =[];
		function getHotelByCityID(){
			object = {Hotel_City:request.body.City_Code}
			Hotel.find(object)
			.populate({ path: 'City', select: 'City_Name' })
			.populate({ path: 'Employee', select: 'Employee_Name' })
			.populate({ path: 'RoomType', select: 'RoomType_Name' })
			.populate({ path: 'RoomView', select: 'RoomView_Name' })
			.lean()
			.exec(function(err, hotel) {
			    if (err){
			    	response.send({message: err});
			    }
		        if (hotel) {
		        	AllHotels =hotel;
					 GetBusyRoom();
		        }else{
			    	response.send({message: "This City Doesn't have any Hotel"});
		        }
	    	})
		}

		function GetBusyRoom(){
			asyncLoop(AllHotels, function (hotel, next)
			{
				object = {$and:[
				    		{RoomBusy_HotelID:hotel.Hotel_Code},
				    		{RoomBusy_Date:{ $gte: From, $lte: To}},
				    		{RoomBusy_Room_Type_Code:request.body.Room_Type_Code},
				    		{RoomBusy_Room_View_Code:request.body.Room_View_Code},
			    	]}
				RoomBusy.findOne(object)
				.sort('-RoomBusy_Room_Count')
				.limit(1)
				.exec(function(err, roomBusy) {
				    if (err){
				    	next(err);
			            return;
				    }
			        if (roomBusy) {
			        	hotel.ReservationRoom = roomBusy.RoomBusy_Room_Count;
			        	console.log(AllHotels);
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
