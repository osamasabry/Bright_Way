var Reservation = require('../Model/btw_reservation');
var RoomBusy = require('../Model/btw_room_busy');
var Hotel = require('../Model/btw_hotel');
var async = require('asyncawait/async');
var await = require('asyncawait/await');

module.exports = {
	checkDate:function(request,response){
		// var date1 = new Date('2019-02-09');
		// var date2 = new Date('2019-02-12');

		var date1 = new Date(request.body.From);
		var date2 = new Date(request.body.To);

		checkDateFromRoomBusy();

		function checkDateFromRoomBusy(){
		    object = {$and:[
		    		// {RoomBusy_HotelID:1},
		    		// {RoomBusy_Date: { $gte: date1, $lte: date2}},
		    		// {RoomBusy_Room_Type_Code:1},
		    		// {RoomBusy_Room_View_Code:1},

		    		{RoomBusy_HotelID:request.body.RoomBusy_HotelID},
		    		{RoomBusy_Date: { $gte: date1, $lte: date2}},
		    		{RoomBusy_Room_Type_Code:request.body.RoomBusy_Room_Type_Code},
		    		{RoomBusy_Room_View_Code:request.body.RoomBusy_Room_View_Code},
		    	]}
			RoomBusy.findOne(object)
			.sort('-RoomBusy_Room_Count')
			.limit(1)
			.exec(function(err, roomBusy) {
			    if (err){
			    	response.send({message: err});
			    }
		        if (roomBusy) {
		        	// console.log(roomBusy)
		            checkDateFromHotel(roomBusy.RoomBusy_Room_Count) ;
		        }else{
		        	// console.log('no')
		        	checkDateFromHotel(0);
		        }
	    	})

		}

		function checkDateFromHotel(count_room){
			Hotel.aggregate([
			{$match: { Hotel_Code: request.body.RoomBusy_HotelID }},
			{$unwind: "$Hotel_Contract" },
			{$unwind: "$Hotel_Contract.Hotel_Rooms" },
			{$group: { _id: { 	to: "$Hotel_Contract.Hotel_Rooms.Room_To",
							  	from: "$Hotel_Contract.Hotel_Rooms.Room_From",
							},
			 	Data: { $push: "$Hotel_Contract.Hotel_Rooms" } } },
				{$unwind: "$Data" },
				{$unwind: "$Data.Room_Details" },
				{$match: {
						 "_id.from":{$lte:date1} ,"_id.to":{$gte:date2},
						 "Data.Room_Details.RoomType_Code":{$eq:request.body.RoomBusy_Room_Type_Code} ,
						 "Data.Room_Details.RoomView_Code":{$eq:request.body.RoomBusy_Room_View_Code} ,
				}},
			])
			.exec(function(err, hotel) {
			    if (err){
			    	response.send({message: err});
			    }
		        if (hotel.length > 0) {
		        	// console.log(hotel[0]);
		        	// var available_room =  hotel[0].Hotel_Contract[0] - count_room ;
		            response.send({
		            	data:hotel[0],
		            	roombusy:count_room,
		            });
		        } else{
		        	// console.log('Date Is Not Vaild');
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

		// arrayrooms=[
		// 	{
		// 		Count   :3,
		// 		View    :1,
		// 		Type    :1,
		// 		SNTType :1,
		// 		Price   :3000,
		// 		Adult   :3,
		// 		Child   :0,
		// 	},
		// 	{
		// 		Count   :3,
		// 		View    :2,
		// 		Type    :2,
		// 		SNTType :2,
		// 		Price   :2200,
		// 		Adult   :6,
		// 		Child   :2,
		// 	}
		// ]
		var From  =  new Date(request.body.Reservation_Date_From);
		var To = new Date(request.body.Reservation_Date_To);

		function insetIntoReservation(GetNextId){
			var newReservation = new Reservation();
			newReservation.Reservation_Code     		= GetNextId;
			newReservation.Reservation_Customer_ID 	    = request.body.Reservation_Customer_ID;
			newReservation.Reservation_Date   	 		= request.body.Reservation_Date;
			newReservation.Reservation_Hotel_ID	 		= request.body.Reservation_Hotel_ID;
			newReservation.Reservation_Date_From   	    = From;
			newReservation.Reservation_Date_To   	    = To;
			// newReservation.Reservation_Date_From   	    = new Date('2018-12-15');
			// newReservation.Reservation_Date_To   	    = new Date('2018-12-18');
			newReservation.Reservation_Number_of_Adult  = request.body.Reservation_Number_of_Adult;
			newReservation.Reservation_Number_of_Child  = request.body.Reservation_Number_of_Child;
			newReservation.Reservation_ByEmployee_ID   	= request.body.Reservation_ByEmployee_ID;
			newReservation.Reservation_Office_ID   	    = request.body.Reservation_Office_ID;
			newReservation.Reservation_Grand_Total      = request.body.Reservation_Grand_Total;
			newReservation.Reservation_Room 			= request.body.Reservation_Room
			// newReservation.Reservation_Room 			= arrayrooms ;
			
			// newReservation.Reservation_Payment			= request.body.Reservation_Payment ;
			newReservation.Reservation_Number_of_Chair  = request.body.Reservation_Number_of_Chair;
			newReservation.Reservation_Chair_Price      = request.body.Reservation_Chair_Price;
			
			newReservation.save(function(error, doneadd){
				if(error){
					return response.send({
						message: error
					});
				}
				else{
					 getDates(From,To);
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

			var rooms = request.body.Reservation_Room;
			// var GetPaymentMethods= async (function (){
	  //           await (SetUpController.getPaymentMethods(req,res));
	  //       });

			
			for (var i = 0; i < rooms.length; i++) {
			 	
				// var returndata  = await checkRoom(i);

				var returndata = async (function (){
		            await (checkRoom(i));
		        });

				returndata();

		    	function InsertRow(){
					var newRoomBusy = new RoomBusy();
					newRoomBusy.RoomBusy_Date     		 	= date;
					newRoomBusy.RoomBusy_HotelID 	     	= request.body.Reservation_Hotel_ID;
					newRoomBusy.RoomBusy_Room_Type_Code   	= request.body.rooms[i].Type;
					newRoomBusy.RoomBusy_Room_View_Code 	= request.body.rooms[i].View;
					newRoomBusy.RoomBusy_Room_Count 		= request.body.rooms[i].Count;
					// RoomBusy_Reservation_Code
					newRoomBusy.save(function(error, doneadd){
						if(error){
							return response.send({
								message: error
							});
						}
					});
				}

				function UpdateRow(Id,count){
					var newvalues = { $set: {
							RoomBusy_Room_Count : count,
						} };
					var myquery = { _id: Id }; 
					RoomBusy.findOneAndUpdate( myquery,newvalues, function(err, field) {
			    	    if (err){
			    	    	return response.send({
								message: 'Error'
							});
			    	    }
			            if (!field) {
			            	return response.send({
								message: 'Room not exists'
							});
			            } 
					})
				}
			}

			function checkRoom(j){

				object = {$and:[
		    		{RoomBusy_HotelID:request.body.Reservation_Hotel_ID},
		    		{RoomBusy_Date:new Date(date)},
		    		{RoomBusy_Room_Type_Code:rooms[j].Type},
		    		{RoomBusy_Room_View_Code:rooms[j].View},
		    	]}
				RoomBusy.findOne(object)
				.exec(function(err, roomBusy) {
				    if (err){
				    	response.send({message: err});
				    }
			        if (roomBusy) {
			        	var Id =roomBusy._id;
			        	var count = roomBusy.RoomBusy_Room_Count + rooms[i].Count;
			            UpdateRow(Id,count) ;
			        }else{
			        	InsertRow();
			        }
		    	})
			}
			// function InsertRow(){
			// 	var newRoomBusy = new RoomBusy();
			// 	newRoomBusy.RoomBusy_Date     		 	= date;
			// 	newRoomBusy.RoomBusy_HotelID 	     	= request.body.Reservation_Hotel_ID;
			// 	newRoomBusy.RoomBusy_Room_Type_Code   	= request.body.Reservation_Room[i].Type;
			// 	newRoomBusy.RoomBusy_Room_View_Code 	= request.body.Reservation_Room[i].View;
			// 	newRoomBusy.RoomBusy_Room_Count 		= request.body.Reservation_Room[i].Count;
			// 	// RoomBusy_Reservation_Code
			// 	newRoomBusy.save(function(error, doneadd){
			// 		if(error){
			// 			return response.send({
			// 				message: error
			// 			});
			// 		}
			// 	});
			// }
			
		}
	},

	editPayemtnReservation:function(request,response){

		var newvalues = { $set: {
				Reservation_Payment : request.body.Reservation_Payment,
			} };
		var myquery = { Reservation_Code: request.body.Reservation_Code }; 
		Reservation.findOneAndUpdate( myquery,newvalues, function(err, field) {
    	    if (err){
    	    	return response.send({
					message: 'Error'
				});
    	    }
            if (!field) {
            	return response.send({
					message: 'Reservation not exists'
				});
            } else {
                return response.send({
					message: true
				});
			}
		})	
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