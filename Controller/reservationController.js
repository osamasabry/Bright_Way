var Reservation = require('../Model/btw_reservation');
var RoomBusy = require('../Model/btw_room_busy');
var Hotel = require('../Model/btw_hotel');
var Increment = require('../Model/btw_increment');
var BusDailyPassengers = require('../Model/btw_bus_daily_passenger');

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
				insetIntoReservation(92300);
		});

		// var From  =  new Date('2019-02-15');
		// var To = new Date('2019-02-18');

		//  var Reservation_Room = [
	 //        {
	 //            Count : 2, 
	 //            View : 2, 
	 //            Type : 1, 
	 //            SNTType : 2, 
	 //            Price : 45600, 
	 //            Cost : 24600, 
	 //            Price_Child : 1000, 
	 //            Cost_Child : 550, 
	 //            Price_Adult : 1600, 
	 //            Cost_Adult : 850, 
	 //            Adult : 4, 
	 //            Child : 5, 
	 //            Nights_Count : 4, 
	 //            Addons : "Soft All Inclusive (S.All)"
	 //        }
	 //    ]
		
		// request.body.Reservation_Room = Reservation_Room;	    
		var From  =  new Date(request.body.Reservation_Date_From);
		var To = new Date(request.body.Reservation_Date_To);

		function insetIntoReservation(GetNextId){
			var newReservation = new Reservation();
			newReservation.Reservation_Code     					= GetNextId;
			newReservation.Reservation_Customer_ID 	    			= request.body.Reservation_Customer_ID;
			newReservation.Reservation_Date   	 					= request.body.Reservation_Date;
			newReservation.Reservation_Hotel_ID	 					= request.body.Reservation_Hotel_ID;
			newReservation.Reservation_Date_From   	    			= From;
			newReservation.Reservation_Date_To   	    			= To;
			newReservation.Reservation_Number_of_Adult  			= request.body.Reservation_Number_of_Adult;
			newReservation.Reservation_Number_of_Child  			= request.body.Reservation_Number_of_Child;
			newReservation.Reservation_ByEmployee_ID   				= request.body.Reservation_ByEmployee_ID;
			newReservation.Reservation_Office_ID   	    			= request.body.Reservation_Office_ID;
			newReservation.Reservation_Grand_Total      			= request.body.Reservation_Grand_Total;
			newReservation.Reservation_Grand_Total_Cost				= request.body.Reservation_Grand_Total_Cost;
			newReservation.Reservation_Room 						= request.body.Reservation_Room;
			newReservation.Reservation_Payment						= [] ;
			newReservation.Reservation_Number_of_Chair_InPackage  	= request.body.Reservation_Number_of_Chair_InPackage;
			newReservation.Reservation_Chair_Price_InPackage      	= request.body.Reservation_Chair_Price_InPackage;
			newReservation.Reservation_Number_of_Chair_OutPackage  	= request.body.Reservation_Number_of_Chair_OutPackage;
			newReservation.Reservation_Chair_Price_OutPackage      	= request.body.Reservation_Chair_Price_OutPackage;
			newReservation.Reservation_Discount 					= request.body.Reservation_Discount;
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
		   	InsertBusyRoom(currentDate,GetNextId);
		    currentDate = addDays.call(currentDate, 1);
		  }
		  // return dates;
		  
		  	if (request.body.Reservation_Number_of_Chair_InPackage || request.body.Reservation_Number_of_Chair_OutPackage ) 
		  		InsertBusDailyPassenger(GetNextId);
		  	else{
			  	return response.send({
					message: true,
					Code:GetNextId
				});
			}
		}

		function InsertBusyRoom(date,GetNextId){
			var rooms = request.body.Reservation_Room;
			asyncLoop(rooms, function (room, next)
			{

				var newRoomBusy = new RoomBusy();
				newRoomBusy.RoomBusy_Date     		 	= date;
				newRoomBusy.RoomBusy_HotelID 	     	= request.body.Reservation_Hotel_ID;
				newRoomBusy.RoomBusy_Room_Type_Code   	= room.Type;
				newRoomBusy.RoomBusy_Room_View_Code 	= room.View;
				newRoomBusy.RoomBusy_Room_Count 		= room.Count;
				newRoomBusy.RoomBusy_Reservation_Code   = GetNextId;
				newRoomBusy.save(function(error, doneadd){
					if(error){
						response.send({
							message: error
						});
					}else{
						next();
					}
				});

				// object = {$and:[
				//     		{RoomBusy_HotelID:request.body.Reservation_Hotel_ID},
				//     		{RoomBusy_Date:new Date(date)},
				//     		{RoomBusy_Room_Type_Code:room.Type},
				//     		{RoomBusy_Room_View_Code:room.View},
			 //    	]}
				// RoomBusy.findOne(object)
				// .exec(function(err, roomBusy) {
				//     if (err){
				//     	// response.send({message: err});
				//     	next(err);
			 //            return;
				//     }
			 //        if (roomBusy) {
			 //        	// console.log(roomBusy);
			 //        	// console.log('update');
			 //        	var count = roomBusy.RoomBusy_Room_Count + room.Count;
			 //        	var Id = roomBusy._id;
			 //        	UpdateRow(Id,count,GetNextId);
			 //        	next();
			 //        }else{
			 //        	InsertRow(room.Type,room.View,room.Count,GetNextId);
			 //        	next();
			 //        }
		  //   	})
			});

			// function InsertRow(type,view,count,GetNextId){
			// 	var newRoomBusy = new RoomBusy();
			// 	newRoomBusy.RoomBusy_Date     		 	= date;
			// 	newRoomBusy.RoomBusy_HotelID 	     	= request.body.Reservation_Hotel_ID;
			// 	newRoomBusy.RoomBusy_Room_Type_Code   	= type;
			// 	newRoomBusy.RoomBusy_Room_View_Code 	= view;
			// 	newRoomBusy.RoomBusy_Room_Count 		= count;
			// 	newRoomBusy.RoomBusy_Reservation_Code   = GetNextId;
			// 	newRoomBusy.save(function(error, doneadd){
			// 		if(error){
			// 			return response.send({
			// 				message: error
			// 			});
			// 		}
			// 	});
			// }

			// function UpdateRow(Id,count,GetNextId){
			// 	var newvalues = { $set: {
			// 			RoomBusy_Room_Count : count,
			// 		},
			// 		$push :{RoomBusy_Reservation_Code:GetNextId}
			// 	};
			// 	var myquery = { _id: Id }; 
			// 	RoomBusy.findOneAndUpdate( myquery,newvalues, function(err, field) {
		 //    	    if (err){
		 //    	    	return response.send({
			// 				message: 'Error'
			// 			});
		 //    	    }
		 //            if (!field) {
		 //            	return response.send({
			// 				message: 'Room not exists'
			// 			});
		 //            } 
			// 	})
			// }
		}

		function InsertBusDailyPassenger(GetNextId){
			
			BusDailyPassengers.getLastCode(function(err,busreserve){
				if (busreserve) 
					insetIntoReservBus(busreserve.BusDailyPassengers_Code+1);
				else
					insetIntoReservBus(1);
			});

			function insetIntoReservBus(NextId){

				var newReservBus = new BusDailyPassengers();
				newReservBus.BusDailyPassengers_Code     		= NextId;
				newReservBus.BusDailyPassengers_Customer_Code 	= request.body.Reservation_Customer_ID;
				newReservBus.BusDailyPassengers_Hotel_Code   	= request.body.Reservation_Hotel_ID;
				newReservBus.BusDailyPassengers_Reservation_Code = GetNextId;
				newReservBus.BusDailyPassengers_Date	 		= From;
				newReservBus.BusDailyPassengers_Place_From      = request.body.BusDailyPassengers_Place_From;
				newReservBus.BusDailyPassengers_Place_To		= request.body.BusDailyPassengers_Place_To;
				newReservBus.BusDailyPassengers_Direction   	= 'Go';
				newReservBus.BusDailyPassengers_Count   	   	= request.body.Reservation_Number_of_Chair_OutPackage + request.body.Reservation_Number_of_Chair_InPackage ;
				newReservBus.BusDailyPassengers_Transportation_Method =0;
				newReservBus.save();

				var NewNextId =  NextId + 1;

				var newNextReservBus = new BusDailyPassengers();
				newNextReservBus.BusDailyPassengers_Code     		= NewNextId;
				newNextReservBus.BusDailyPassengers_Customer_Code 	= request.body.Reservation_Customer_ID;
				newNextReservBus.BusDailyPassengers_Hotel_Code   	= request.body.Reservation_Hotel_ID;
				newNextReservBus.BusDailyPassengers_Reservation_Code = GetNextId;
				newNextReservBus.BusDailyPassengers_Date	 		= To;
				newNextReservBus.BusDailyPassengers_Place_From      = request.body.BusDailyPassengers_Place_To;
				newNextReservBus.BusDailyPassengers_Place_To		= request.body.BusDailyPassengers_Place_From;
				newNextReservBus.BusDailyPassengers_Direction   	= 'Back';
				newNextReservBus.BusDailyPassengers_Count   	   	= request.body.Reservation_Number_of_Chair_OutPackage + request.body.Reservation_Number_of_Chair_InPackage;
				newNextReservBus.BusDailyPassengers_Transportation_Method =0;
				newNextReservBus.save();

				return response.send({
					message: true,
					Code:GetNextId
				});
			}
		}
	},

	addPayemtnReservation:function(request,response){
		var NextPaymentCode;
		Increment.findOne({Increment_Code: 1}).exec(function(err,inc){
			NextPaymentCode = inc.Increment_sequence + 1;
			PaymantArray = {
				Receipt_Number : NextPaymentCode,
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
	   				increment(PaymantArray);
				}
			})
			
		})


		function increment(AddedPayment){
			Increment.findOneAndUpdate(
			   { Increment_Code: 1 },
			   { $inc: { Increment_sequence: 1} }
			).exec(function(err,done){
				if (err) return response.send({message:err})
				else {
					return response.send({ message: true, data:AddedPayment});
				}
			})
		}
	},

	getReservationByCustomerID:function(request,response){
		var Search = Number(request.body.Customer_Code);
		Reservation.find({Reservation_Customer_ID:Search})
		// .select('Reservation_Customer_ID Reservation_Payment Reservation_Date Reservation_Grand_Total')
		// .populate({ path: 'City', select: 'City_Name' })
		.populate({ path: 'Customer', select: 'Customer_Name' })
		.populate({ path: 'Hotel', select: 'Hotel_Name Hotel_ChildernPolicy_Hint Hotel_City' })
		.populate({ path: 'RoomType', select: 'RoomType_Name' })
		.populate({ path: 'RoomView', select: 'RoomView_Name' })
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

	editReservation:function(request,response){

		// var From  =  new Date('2019-02-15');
		// var To = new Date('2019-02-18');

		var From  =  new Date(request.body.Reservation_Date_From);
		var To = new Date(request.body.Reservation_Date_To);

		var reserv_id = Number(request.body.Reservation_Code);

		var object = {RoomBusy_Reservation_Code:reserv_id};
		RoomBusy.remove(object)
		.exec(function(err, done) {
		    if (err){
		    	response.send({message: err});
		    }
	        if (done) {
	        	if (request.body.Reservation_Chair == 1) {
	        		RemoveFromBusDailyPassenger();
	        	}else{
	        		EditReservation();
	        	}
	        }else{
		    	response.send({message: "This Reservation Not Have Rooms"});
	        }
    	})

    	function RemoveFromBusDailyPassenger(){
    		var object = {BusDailyPassengers_Reservation_Code:reserv_id};
			BusDailyPassengers.remove(object)
			.exec(function(err, done) {
			    if (err){
			    	response.send({message: err});
			    }
		        if (done) {
		        	EditReservation();
		        }
	    	})
    	}

    	function EditReservation(){

    		var newvalues = { $set: {
				// Reservation_Customer_ID 				: request.body.Customer_Name,
				Reservation_Date 						: request.body.Reservation_Date,
				Reservation_Hotel_ID 					: request.body.Reservation_Hotel_ID,
				Reservation_Date_From 					: From,
				Reservation_Date_To 					: To,
				Reservation_Number_of_Adult 			: request.body.Reservation_Number_of_Adult,
				Reservation_Number_of_Child 			: request.body.Reservation_Number_of_Child,
				Reservation_ByEmployee_ID 				: request.body.Reservation_ByEmployee_ID,
				Reservation_Office_ID 					: request.body.Reservation_Office_ID,
				Reservation_Grand_Total 				: request.body.Reservation_Grand_Total,
				Reservation_Grand_Total_Cost 			: request.body.Reservation_Grand_Total_Cost,
				Reservation_Room 						: request.body.Reservation_Room,
				Reservation_Number_of_Chair_InPackage 	: request.body.Reservation_Number_of_Chair_InPackage,
				Reservation_Chair_Price_InPackage 		: request.body.Reservation_Chair_Price_InPackage,
				Reservation_Number_of_Chair_OutPackage 	: request.body.Reservation_Number_of_Chair_OutPackage,
				Reservation_Chair_Price_OutPackage 		: request.body.Reservation_Chair_Price_OutPackage,
				Reservation_Discount 					: request.body.Reservation_Discount,
			} };
			var myquery = { Reservation_Code: reserv_id }; 
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
					
					getDates(From,To,reserv_id);
				}
			})
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
		   	InsertBusyRoom(currentDate,GetNextId);
		    currentDate = addDays.call(currentDate, 1);
		  }
		  	if (request.body.Reservation_Number_of_Chair_InPackage || request.body.Reservation_Number_of_Chair_OutPackage ) 
		  		InsertBusDailyPassenger(GetNextId);
		  	else{
			  	return response.send({
					message: true,
					Code:GetNextId
				});
			}
		}

		function InsertBusyRoom(date,GetNextId){
			var rooms = request.body.Reservation_Room;
			asyncLoop(rooms, function (room, next)
			{
				var newRoomBusy = new RoomBusy();
				newRoomBusy.RoomBusy_Date     		 	= date;
				newRoomBusy.RoomBusy_HotelID 	     	= request.body.Reservation_Hotel_ID;
				newRoomBusy.RoomBusy_Room_Type_Code   	= room.Type;
				newRoomBusy.RoomBusy_Room_View_Code 	= room.View;
				newRoomBusy.RoomBusy_Room_Count 		= room.Count;
				newRoomBusy.RoomBusy_Reservation_Code   = GetNextId;
				newRoomBusy.save(function(error, doneadd){
					if(error){
						response.send({
							message: error
						});
					}
				});
			});
		}

		function InsertBusDailyPassenger(GetNextId){
			
			BusDailyPassengers.getLastCode(function(err,busreserve){
				if (busreserve) 
					insetIntoReservBus(busreserve.BusDailyPassengers_Code+1);
				else
					insetIntoReservBus(1);
			});

			function insetIntoReservBus(NextId){

				var newReservBus = new BusDailyPassengers();
				newReservBus.BusDailyPassengers_Code     				= NextId;
				newReservBus.BusDailyPassengers_Customer_Code 			= request.body.Reservation_Customer_ID;
				newReservBus.BusDailyPassengers_Hotel_Code   			= request.body.Reservation_Hotel_ID;
				newReservBus.BusDailyPassengers_Reservation_Code 		= GetNextId;
				newReservBus.BusDailyPassengers_Date	 				= From;
				newReservBus.BusDailyPassengers_Place_From      		= request.body.BusDailyPassengers_Place_From;
				newReservBus.BusDailyPassengers_Place_To				= request.body.BusDailyPassengers_Place_To;
				newReservBus.BusDailyPassengers_Direction   			= 'Go';
				newReservBus.BusDailyPassengers_Count   	   			= request.body.Reservation_Number_of_Chair_OutPackage + request.body.Reservation_Number_of_Chair_InPackage ;
				newReservBus.BusDailyPassengers_Transportation_Method   = 0;
				newReservBus.save();

				var NewNextId =  NextId + 1;

				var newNextReservBus = new BusDailyPassengers();
				newNextReservBus.BusDailyPassengers_Code     			  = NewNextId;
				newNextReservBus.BusDailyPassengers_Customer_Code 		  = request.body.Reservation_Customer_ID;
				newNextReservBus.BusDailyPassengers_Hotel_Code   		  = request.body.Reservation_Hotel_ID;
				newNextReservBus.BusDailyPassengers_Reservation_Code 	  = GetNextId;
				newNextReservBus.BusDailyPassengers_Date	 			  = To;
				newNextReservBus.BusDailyPassengers_Place_From      	  = request.body.BusDailyPassengers_Place_To;
				newNextReservBus.BusDailyPassengers_Place_To			  = request.body.BusDailyPassengers_Place_From;
				newNextReservBus.BusDailyPassengers_Direction   		  = 'Back';
				newNextReservBus.BusDailyPassengers_Count   	   		  = request.body.Reservation_Number_of_Chair_OutPackage + request.body.Reservation_Number_of_Chair_InPackage;
				newNextReservBus.BusDailyPassengers_Transportation_Method = 0;
				newNextReservBus.save();

				return response.send({
					message: true,
					Code:GetNextId
				});
			}
		}
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