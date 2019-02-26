var Reservation = require('../Model/btw_reservation');
var RoomBusy = require('../Model/btw_room_busy');
var Hotel = require('../Model/btw_hotel');
var Increment = require('../Model/btw_increment');

var async = require('asyncawait/async');
// var await = require('asyncawait/await');
var asyncLoop = require('node-async-loop');


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
		// 		View    :2,
		// 		Type    :2,
		// 		SNTType :1,
		// 		Price   :2500,
		// 		Adult   :2,
		// 		Child   :1,
		// 	}
			// ,
			// {
			// 	Count   :3,
			// 	View    :2,
			// 	Type    :2,
			// 	SNTType :2,
			// 	Price   :2200,
			// 	Adult   :6,
			// 	Child   :2,
			// }
		// ]

		// var From = new Date('2019-02-09');
		// var To = new Date('2019-02-12');
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
			newReservation.Reservation_Room 			= request.body.Reservation_Room;
			// newReservation.Reservation_Room 			= arrayrooms ;
			
			newReservation.Reservation_Payment			= [] ;
			newReservation.Reservation_Number_of_Chair  = request.body.Reservation_Number_of_Chair;
			newReservation.Reservation_Chair_Price      = request.body.Reservation_Chair_Price;
			newReservation.Reservation_Discount 		= request.body.Discount;
			
			newReservation.save(function(error, doneadd){
				if(error){
					return response.send({
						message: error
					});
				}
				else{
					 getDates(From,To,GetNextId);
				}
			});
		}

		var getDates = function(startDate, endDate,GetNextId) {
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
				message: true,
				Code:GetNextId
			});
		}

		function InsertBusyRoom(date){
			// var rooms = arrayrooms;
			var rooms = request.body.Reservation_Room
			asyncLoop(rooms, function (room, next)
			{
				object = {$and:[
				    		{RoomBusy_HotelID:request.body.Reservation_Hotel_ID},
				    		{RoomBusy_Date:new Date(date)},
				    		{RoomBusy_Room_Type_Code:room.Type},
				    		{RoomBusy_Room_View_Code:room.View},
			    	]}
				RoomBusy.findOne(object)
				.exec(function(err, roomBusy) {
				    if (err){
				    	// response.send({message: err});
				    	next(err);
			            return;
				    }
			        if (roomBusy) {
			        	console.log(roomBusy);
			        	// console.log('update');
			        	var count = roomBusy.RoomBusy_Room_Count + room.Count;
			        	var Id = roomBusy._id;
			        	UpdateRow(Id,count);
			        	next();
			   //      	var count = roomBusy.RoomBusy_Room_Count + room.Count;
						// roomobject.count = count;
						// roomobject.Id = roomBusy._id;
						// roomobject.status = 'Update';
						// checkreturn.push(roomobject);	 
			        }else{
			        	// console.log('Insert');
			        	InsertRow(room.Type,room.View,room.Count);
			        	next();
						// roomobject.status = 'Insert';
						// checkreturn.push(roomobject);	 
			        }
		    	})
			}, function (err)
			{
			    if (err)
			    {
			        console.error('Error: ' + err.message);
			        return;
			    }
			 
			    // console.log('Finished!');
			});

			function InsertRow(type,view,count){
				var newRoomBusy = new RoomBusy();
				newRoomBusy.RoomBusy_Date     		 	= date;
				newRoomBusy.RoomBusy_HotelID 	     	= request.body.Reservation_Hotel_ID;
				newRoomBusy.RoomBusy_Room_Type_Code   	= type;
				newRoomBusy.RoomBusy_Room_View_Code 	= view;
				newRoomBusy.RoomBusy_Room_Count 		= count;
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
	},

	addPayemtnReservation:function(request,response){
			PaymantArray = {
				Date :new Date(request.body.Date),
				Type_Code :request.body.Type_Code,
				Ammount :request.body.Ammount,
				CC_Transaction_Code :request.body.CC_Transaction_Code,
			}
			var myquery = { Reservation_Code: request.body.Reservation_Code }; 

			var newvalues = {
				$push:{Reservation_Payment:PaymantArray},
			}	
			Reservation.findOneAndUpdate( myquery,newvalues)
			.exec(function(err, field){
	    	    if (err){
	    	    	return response.send({
						message: err,
					});
	    	    }
	            if (!field) {
	            	return response.send({
						message: 'Reservation not exists'
					});
	            } else {
	   				increment();
				}
			})

			function increment(){
				Increment.findOneAndUpdate(
				   { Increment_Code: 1 },
				   { $inc: { Increment_sequence: 1} }
				).exec(function(err,done){
					if (err) return response.send({message:err})
					else {
						return response.send({ message: true});
					}
				})
			}
	},

	getReservationByCustomerID:function(request,response){
		var Search = Number(request.body.Customer_ID);
		Reservation.find({Reservation_Customer_ID:Search})
		// .select('Reservation_Customer_ID Reservation_Payment Reservation_Date Reservation_Grand_Total')
		.populate({ path: 'City', select: 'City_Name' })
		.populate({ path: 'Customer', select: 'Customer_Name' })
		.populate({ path: 'Hotel', select: 'Hotel_Name' })
		.lean()
		.exec(function(err, hotel) {
		    if (err){
		    	response.send(err);
		    }
	        if (hotel) {
	            response.send(hotel);
	        } 
    	})
	},
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