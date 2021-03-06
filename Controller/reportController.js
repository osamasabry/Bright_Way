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

		object = {
			$and:[
					{Reservation_Hotel_ID:Number(request.body.Reservation_Hotel_ID)},
					{Reservation_Status:{"$ne":0}},
					{Reservation_Date_From:{ $gte: date1, $lte: date2}},
				]
		};
		
		Reservation.find(object)
		.select('Reservation_Room Reservation_Date_From Reservation_Date_To Reservation_Customer_ID')
		.populate({ path: 'Customer', select: 'Customer_Name Customer_Phone' })
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

	getDailyReservationList:function (request,response){
		// var date1 = new Date('2019-06-05');
		// var date2 = new Date('2019-06-08');
		var date1 = new Date(request.body.ReservationsDate);
		var date2string = request.body.ReservationsDateTo +'T23:59:59.000Z';
		var date2 = new Date(date2string);

		object = {
			$and:[
					{Reservation_Date:{ $gte: date1, $lte: date2}},
				]
		};
		
		Reservation.find(object)
		.select('Reservation_Date_From Reservation_Date_To Reservation_Customer_ID Reservation_Hotel_ID Reservation_Grand_Total Reservation_Grand_Total_Cost Reservation_Discount Reservation_ByEmployee_ID')
		.populate({ path: 'Customer', select: 'Customer_Name Customer_Phone' })
		.populate({ path: 'Hotel', select: 'Hotel_Name' })
		.populate({ path: 'Employee', select: 'Employee_Name' })

		// Btw_ReservationSchema.virtual('Hotel',{
		// 	ref: 'btw_hotel',
		// 	localField: 'Reservation_Hotel_ID',
		// 	foreignField: 'Hotel_Code',
		// 	justOne: false // for many-to-1 relationships
		// });
		.lean()
		.exec(function(err, hotel) {
		    if (err){
		    	response.send(err);
		    }
	        if (hotel) {
	            response.send(hotel);
			} 
			else{
	    		response.send({message: 'Not Reservation Room'});
	        }
    	})
	},

	getDailyEmployeeReservationList:function (request,response){
		// var date1 = new Date('2019-06-05');
		// var date2 = new Date('2019-06-08');
		var date1 = new Date(request.body.ReservationsDate);
		var date2string = request.body.ReservationsDateTo +'T23:59:59.000Z';
		var date2 = new Date(date2string);

		object = {
			$and:[
					{Reservation_Date:{ $gte: date1, $lte: date2}},
					{Reservation_ByEmployee_ID:Number(request.body.Reservation_ByEmployee_ID)},
				]
		};
		
		Reservation.find(object)
		.select('Reservation_Date Reservation_Date_From Reservation_Date_To Reservation_Customer_ID Reservation_Hotel_ID Reservation_Grand_Total Reservation_Grand_Total_Cost Reservation_Discount Reservation_ByEmployee_ID')
		.populate({ path: 'Customer', select: 'Customer_Name Customer_Phone' })
		.populate({ path: 'Hotel', select: 'Hotel_Name' })
		.populate({ path: 'Employee', select: 'Employee_Name' })

		// Btw_ReservationSchema.virtual('Hotel',{
		// 	ref: 'btw_hotel',
		// 	localField: 'Reservation_Hotel_ID',
		// 	foreignField: 'Hotel_Code',
		// 	justOne: false // for many-to-1 relationships
		// });
		.lean().sort({Reservation_Date:1})
		.exec(function(err, hotel) {
		    if (err){
		    	response.send(err);
		    }
	        if (hotel) {
	            response.send(hotel);
			} 
			else{
	    		response.send({message: 'Not Reservation Room'});
	        }
    	})
	},

	getDailyOfficeReservation(request,response){
		var date1 = new Date(request.body.PaymentsDate);
		var date2string = request.body.PaymentsDate +'T23:59:59.000Z';
		var date2 = new Date(date2string);
		
		Reservation.aggregate([
			{$match: 
				{Reservation_Office_ID:Number(request.body.Office_ID)},

			},
			{$unwind: "$Reservation_Payment" },

			{$match:
				{'Reservation_Payment.Date':{ $gte: date1, $lte: date2}},
			},
			{ $group: { _id : 
							{	 	
								Customer_ID: '$Reservation_Customer_ID', 
								Hotel_ID: '$Reservation_Hotel_ID', 
							 },
							Amount :{$sum:'$Reservation_Payment.Ammount' }, 
							Grand_Total:{$first:'$Reservation_Grand_Total' }, 
							Payment:{$push:'$Reservation_Payment' }, 
						}
			},
			{
	        "$project": {
		            "Reservation_Customer_ID" : "$_id.Customer_ID",
		            "Reservation_Hotel_ID"    : "$_id.Hotel_ID",
		            "Reservation_Grand_Total" : "$Grand_Total",
		            "Ammount" 				  : "$Amount",
		            "Payment" 				  : "$Payment",

		        }		
		    },
		])
		.exec(function(err, reserv) {
		    if (err){
	    		response.send({message: err});
			}
	        if (reserv.length > 0) {
	        	Reservation.populate(reserv, { path: 'Customer' , select: 'Customer_Name'}, function(err, customer) {
	        		Reservation.populate(customer, { path: 'Hotel' , select: 'Hotel_Name'}, function(err, hotel) {
	    					response.send(hotel);
		        	});
		        });
	        }else{
	    		response.send({message: 'Not Reservation Room'});
	        }
    	})

	},
	getDailyOfficePayments(request,response){
		var date1 = new Date(request.body.PaymentsDate);
		var date2string = request.body.PaymentsDateTo +'T23:59:59.000Z';
		var date2 = new Date(date2string);

		Reservation.aggregate([
			{$match: {'Reservation_Office_ID':Number(request.body.Office_ID), 
					  'Reservation_Payment.Date':{ $gte: date1, $lte:  date2}}
			},
			{
			"$project": {

				"Reservation_Customer_ID" : "$Reservation_Customer_ID",
		        "Reservation_Hotel_ID"    : "$Reservation_Hotel_ID",
				"Reservation_Payment" : "$Reservation_Payment",
				"Reservation_Grand_Total": "$Reservation_Grand_Total",
				"Reservation_Discount" : "$Reservation_Discount",
				"SumAllPayments" :{$sum:'$Reservation_Payment.Ammount'},
				"Reservation_TodayPayment" : {
					'$filter': {
						input: '$Reservation_Payment',
						as: 'reservation_payment',
						cond: { $and: [
									{$gte: ['$$reservation_payment.Date', date1]},
									{$lte: ['$$reservation_payment.Date', date2]}
						]} 
						
					}
				},
				"Reservation_TodayPaymentCash" : {
						'$filter': {
						input: '$Reservation_Payment',
						as: 'reservation_payment',
						cond: { $and: [
										{$gte: ['$$reservation_payment.Date', date1]},
										{$lte: ['$$reservation_payment.Date', date2]},
										{$eq: ['$$reservation_payment.Type_Code', 1]}
								]} 
						
					}
					
				},
				"Reservation_TodayPaymentCC" : {
					
						'$filter': {
						input: '$Reservation_Payment',
						as: 'reservation_payment',
						cond: { $and: [
										{$gte: ['$$reservation_payment.Date', date1]},
										{$lte: ['$$reservation_payment.Date', date2]},
										{$eq: ['$$reservation_payment.Type_Code', 2]}
								]} 
						
					}
				},
				"Reservation_TodayPaymentBankTrans" : {
						'$filter': {
						input: '$Reservation_Payment',
						as: 'reservation_payment',
						cond: { $and: [
										{$gte: ['$$reservation_payment.Date', date1]},
										{$lte: ['$$reservation_payment.Date', date2]},
										{$eq: ['$$reservation_payment.Type_Code', 3]}
								]} 
						
					}
					
				}
						
			}		
		}])
		.exec(function(err, reserv) {
		    if (err){
	    		response.send({message: err});
			}
	        if (reserv.length > 0) {
	        	Reservation.populate(reserv, { path: 'Customer' , select: 'Customer_Name'}, function(err, customer) {
	        		Reservation.populate(customer, { path: 'Hotel' , select: 'Hotel_Name'}, function(err, hotel) {
	    					response.send(hotel);
		        	});
		        });
	        }else{
	    		response.send({message: 'Not Reservation Room'});
	        }
    	})

	}

}