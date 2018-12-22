var Reservation = require('../Model/btw_reservation');
var RoomBusy = require('../Model/btw_room_busy');
var Hotel = require('../Model/btw_hotel');


module.exports = {
	checkDate:function(request,response){
		var date1 = new Date('2018-12-14');
		var date2 = new Date('2018-12-18');

		checkDateFromRoomBusy();
		
		function checkDateFromRoomBusy(){
		    object = {RoomBusy_Date: { $gte: date1, $lte: date2}}
			RoomBusy.findOne(object)
			.sort('-RoomBusy_Count')
			.limit(1)
			.exec(function(err, roomBusy) {
			    if (err){
			    	response.send({message: err});
			    }
		        if (roomBusy) {
		        	console.log(roomBusy);
		            checkDateFromHotel(roomBusy.RoomBusy_Count) ;
		        }else{
		        	checkDateFromHotel();
		        }
	    	})

		}

		function checkDateFromHotel(count_room){
			console.log(count_room);
			Hotel.aggregate([
			{$match: { Hotel_Code: 1 }},
			{$unwind: "$Hotel_Contract" },
			{$unwind: "$Hotel_Contract.Hotel_Rooms" },
			{$group: { _id: { to: "$Hotel_Contract.Hotel_Rooms.Room_To", from: "$Hotel_Contract.Hotel_Rooms.Room_From" }, Hotel_Contract: { $push: "$Hotel_Contract.Hotel_Rooms.Room_Count" } } },
			{$match: { "_id.from":{$lte:date1} ,"_id.to":{$gte:date2}} },
			])
			.exec(function(err, hotel) {
			    if (err){
			    	response.send({message: err});
			    }
		        if (hotel.length >0) {
		        	var available_room =  hotel[0].Hotel_Contract[0] - count_room ;
		            response.send({count: available_room});
		        } else{
			    	response.send({message: "Date Is Not Vaild"});
		        }
	    	})
		}
	},

	addReservation:function(request,response){

		Reservation.getLastCode(function(err,reservation){
			if (reservation) 
				insetIntoReservation(reservation.Reservation_Code+1);
			else
				insetIntoReservation(1);
		});

		arrayrooms=[
			{
				Count   :3,
				View    :1,
				Type    :1,
				SNTType :1,
				Price   :3000,
				Adult   :3,
				Child   :0,
			},
			{
				Count   :3,
				View    :2,
				Type    :2,
				SNTType :2,
				Price   :2200,
				Adult   :6,
				Child   :2,
			}
		]

		function insetIntoReservation(GetNextId){
			var newReservation = new Reservation();
			newReservation.Reservation_Code     		= GetNextId;
			newReservation.Reservation_Customer_ID 	    = request.body.Reservation_Customer_ID;
			// newReservation.Reservation_Date   	 		= request.body.Reservation_Date;
			newReservation.Reservation_Hotel_ID	 		= request.body.Reservation_Hotel_ID;
			
			// newReservation.Reservation_Date_From   	    = request.body.Reservation_Date_From;
			// newReservation.Reservation_Date_To   	    = request.body.Reservation_Date_To;
			
			newReservation.Reservation_Date_From   	    = new Date('2018-12-15');
			newReservation.Reservation_Date_To   	    = new Date('2018-12-18');


			// newReservation.Reservation_Number_of_Adult  = request.body.Reservation_Number_of_Adult;
			// newReservation.Reservation_Number_of_Child  = request.body.Reservation_Number_of_Child;
			// newReservation.Reservation_ByEmployee_ID   	= request.body.Reservation_ByEmployee_ID;
			// newReservation.Reservation_Office_ID   	    = request.body.Reservation_Office_ID;
			// newReservation.Reservation_Grand_Total      = request.body.Reservation_Grand_Total;
			// newReservation.Reservation_Room 			= request.body.Reservation_Room
			newReservation.Reservation_Room 			= arrayrooms ;
			
			// newReservation.Reservation_Payment			= request.body.Reservation_Payment ;
			// newReservation.Reservation_Number_of_Chair  = request.body.Reservation_Number_of_Chair;
			// newReservation.Reservation_Chair_Price      = request.body.Reservation_Chair_Price;
			
			newReservation.save(function(error, doneadd){
				if(error){
					return response.send({
						message: error
					});
				}
				else{

					 getDates(new Date('2018-12-15'),new Date('2018-12-18'))
					// return response.send({
					// 	message: true
					// });
				}
			});
		}

		var getDates = function(startDate, endDate) {
		  var dates = [],
		      currentDate = startDate,
		      addDays = function(days) {
		        var date = new Date(this.valueOf());
		        date.setDate(date.getDate() + days);
		        return date;
		      };
		  while (currentDate <= endDate) {
		   	InsertBusyRoom(currentDate);
		    currentDate = addDays.call(currentDate, 1);
		  }
		  // return dates;
		  return response.send({
				message: true
			});
		}

		function InsertBusyRoom(date){

			roombusy=[
				{
					Count   :3,
					Type    :1,
					View    :1
				},
				{
					Count   :3,
					Type    :2,
					View    :2
				}
			];
			var newRoomBusy = new RoomBusy();

			newRoomBusy.RoomBusy_Date     		 	= date;
			newRoomBusy.RoomBusy_HotelID 	     	= request.body.Reservation_Hotel_ID;
			newRoomBusy.RoomBusy_Details   	 		= roombusy;
			newRoomBusy.RoomBusy_Count 				= request.body.RoomBusy_Count;
			newRoomBusy.save(function(error, doneadd){
				if(error){
					return response.send({
						message: error
					});
				}
			});
		}
	}

}




	// Hotel.aggregate([
		// 	{$match: {Hotel_Code: 1}},
	 //  		{
		//       	$project: {
		//          Hotel_Contract: {
		//             $filter: {
		//                input: "$Hotel_Contract",
		//                as: "room",
		//                cond:   {$gt: [date1,'$$room.Hotel_Rooms.Room_From']}
		//             }
		//          }
		//       }
		//    }
		// ])