var Reservation = require('../Model/btw_reservation');
var RoomBusy = require('../Model/btw_room_busy');
var Hotel = require('../Model/btw_hotel');
var Increment = require('../Model/btw_increment');
var BusDailyPassengers = require('../Model/btw_bus_daily_passenger');

var async = require('asyncawait/async');
var await = require('asyncawait/await');
var asyncLoop = require('node-async-loop');


module.exports = {
	checkDate:function(request,response){
		// var date1 = new Date('2019-06-06');
		// var date2 = new Date('2019-06-10');

		ArrayOfHotels= [];
		AarrayOfDays = [];
		var date1 = new Date(request.body.From);
		var date2 = new Date(request.body.To);

		checkDateFromRoomBusy();

		function checkDateFromRoomBusy(){

				RoomBusy.aggregate([
				{$match: { 
					$and:[
							{RoomBusy_HotelID:Number(request.body.RoomBusy_HotelID)},
							{RoomBusy_OfficeID:Number(request.body.RoomBusy_OfficeID)},
							{RoomBusy_Date:{ $gte: date1, $lte: date2}},
							{RoomBusy_Room_Type_Code:Number(request.body.RoomBusy_Room_Type_Code)},
							{RoomBusy_Room_View_Code:Number(request.body.RoomBusy_Room_View_Code)},
						]
				}},
				{ $group: { _id : {Room_Type: '$RoomBusy_Room_Type_Code' ,
									 date: '$RoomBusy_Date',
									 Room_View_Code: '$RoomBusy_Room_View_Code'}, 
									 maxcount : { $sum: "$RoomBusy_Room_Count" } } }
				,{$sort: {maxcount : -1}},{$limit : 1}
			])
			.exec(function(err, roomBusy) {
			    if (err){
			    	response.send({message: err});
					}
		        if (roomBusy.length > 0) {
		            checkDateFromHotel(roomBusy[0].maxcount) ;
		        }else{
		        	checkDateFromHotel(0);
		        }
	    	})

		}

		function checkDateFromHotel(count_room){
			// console.log(count_room);
			Hotel.aggregate([
			{$match: { Hotel_Code: Number(request.body.RoomBusy_HotelID) }},
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
						 "Data.Room_Details.RoomType_Code":{$eq:Number(request.body.RoomBusy_Room_Type_Code)} ,
						 "Data.Room_Details.RoomView_Code":{$eq:Number(request.body.RoomBusy_Room_View_Code)} ,
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
		        	getDates(date1,date2);
		        	// console.log('Date Is Not Vaild');
			    	// response.send({message: "Date Is Not Vaild"});
		        }
	    	})
		}

		var getDates = async function(startDate,endDate) {
		  	var dates = [],
		      currentDate = startDate,
		      addDays = function(days) {
		        var date = new Date(this.valueOf());
		        date.setDate(date.getDate() + days);
		        return date;
		      };
		  	while (currentDate <= endDate) {
			  		var hotel = await getHotelByDay(currentDate);
			  		var roombusy = await getRoomBusyByDay(currentDate);
			  		var availableCount = Getavailable(hotel[0].Data.Room_Details,roombusy)
			  		AarrayOfDays.push(availableCount);
		        	ArrayOfHotels = ArrayOfHotels.concat(hotel);
				    currentDate = addDays.call(currentDate, 1);
	  		}
	  		if (ArrayOfHotels.length > 0) {
				ArrayOfHotels =ArrayOfHotels.slice(0,(ArrayOfHotels.length-1));
				AarrayOfDays =AarrayOfDays.slice(0,(AarrayOfDays.length-1));
	  			var count_room = Math.min.apply(Math, AarrayOfDays) ;
				console.log(count_room) ;  
				GetAverage(ArrayOfHotels,count_room);
	  		}	
	  	}

		function getHotelByDay (currentDate){
		 	return new Promise((resolve, reject) => {

	 	 		Hotel.aggregate([
				{$match: { Hotel_Code: Number(request.body.RoomBusy_HotelID) }},
				{$unwind: "$Hotel_Contract" },
				{$unwind: "$Hotel_Contract.Hotel_Rooms" },
				{$group: { _id: { 
								  	from: "$Hotel_Contract.Hotel_Rooms.Room_From",
								  	to: "$Hotel_Contract.Hotel_Rooms.Room_To",
								},
				 	Data: { $push: "$Hotel_Contract.Hotel_Rooms" } } },
					{$unwind: "$Data" },
					{$unwind: "$Data.Room_Details" },
					{$match: {
							 "_id.from":{$lte:currentDate} ,"_id.to":{$gte:currentDate},
							 "Data.Room_Details.RoomType_Code":{$eq:Number(request.body.RoomBusy_Room_Type_Code)} ,
							 "Data.Room_Details.RoomView_Code":{$eq:Number(request.body.RoomBusy_Room_View_Code)} ,
					}},
				])
				.exec(function(err, hotel) {
				    if (err){
				    	response.send({message: err});
				    }
			        if (hotel.length > 0) {
			        	resolve(hotel)
			        } else{
			        	response.send({message: 'Date Is Not Vaild'});
			        }
		    	})
		 	})
		}
		
		function getRoomBusyByDay(currentDate){
		 	return new Promise((resolve, reject) => {

				RoomBusy.aggregate([
					{$match: { 
						$and:[
								{RoomBusy_HotelID:Number(request.body.RoomBusy_HotelID)},
								{RoomBusy_OfficeID:Number(request.body.RoomBusy_OfficeID)},
								{RoomBusy_Date:currentDate},
								{RoomBusy_Room_Type_Code:Number(request.body.RoomBusy_Room_Type_Code)},
								{RoomBusy_Room_View_Code:Number(request.body.RoomBusy_Room_View_Code)},
							]
					}},
					{ $group: { _id : {Room_Type: '$RoomBusy_Room_Type_Code' ,
										 date: '$RoomBusy_Date',
										 Room_View_Code: '$RoomBusy_Room_View_Code'}, 
										 maxcount : { $sum: "$RoomBusy_Room_Count" } } }
					,{$sort: {maxcount : -1}},{$limit : 1}
				])
					.exec(function(err, roomBusy) {
				    if (err){
				    	response.send({message: err});
						}
			        if (roomBusy.length > 0) {
			            resolve(roomBusy[0].maxcount) ;
			        }else{
			        	resolve(0);
			        }
		    	})
			})
		}

		function Getavailable(hotel,roombusy){
			var available= 0;
			if (Number(request.body.RoomBusy_OfficeID) == 1 ) 
				available = hotel.Cairo_Office - roombusy;
			if (Number(request.body.RoomBusy_OfficeID) == 2 ) 
				available = hotel.Alexandira_Office - roombusy;
			if (Number(request.body.RoomBusy_OfficeID) == 3 ) 
				available = hotel.Mansoura_Office - roombusy;
			if (Number(request.body.RoomBusy_OfficeID) == 4 ) 
				available = hotel.Mahalla_Office - roombusy;
			if (Number(request.body.RoomBusy_OfficeID) == 5 ) 
				available = hotel.Shobra_Office - roombusy;

			return  available;
		}

		function GetAverage (data,count_room){
			var ReturnObject = {};
			Cairo_Office = Mansoura_Office = Alexandira_Office = Mahalla_Office = Shobra_Office =
			AddonChildPrice = AddonChildCost = SingleBedPrice = SingleHalfPrice = 
			SingleFullPrice = SingleAllinclusivePrice = SingleUltraPrice = SingleFullCost =
			SingleAllinclusiveCost = SingleUltraCost = DoubleFullPrice = 
			DoubleAllinclusivePrice = DoubleUltraPrice = DoubleFullCost = DoubleAllinclusiveCost = 
			DoubleUltraCost = TripleFullPrice = TripleAllinclusivePrice = TripleUltraPrice = 
			TripleFullCost = TripleAllinclusiveCost = TripleUltraCost = 
			PriceDoubleRoom = PriceTripleRoom = PriceSingleRoom = PriceChild = CostSingleRoom =
			CostDoubleRoom = CostTripleRoom = CostChild = DoubleBedCost =DoubleBedPrice =
			DoubleHalfCost = DoubleHalfPrice = SingleBedCost = SingleHalfCost = 
			TripleBedCost = TripleBedPrice = TripleHalfCost = TripleHalfPrice = 0 ;
			var BasicPlan = '';
			for( var i = 0; i < data.length; i++ ){
				BasicPlan = data[i].Data.Basic_Plan;
			    AddonChildPrice += parseFloat( data[i].Data.Addon_Child_Percentage_Price ); 
			    AddonChildCost += parseFloat( data[i].Data.Addon_Child_Percentage_Cost ); 
			    SingleBedPrice += parseFloat( data[i].Data.Single_Bed_breakfast_Price ); 
			    SingleHalfPrice += parseFloat( data[i].Data.Single_Half_board_Price ); 
			    SingleFullPrice += parseFloat( data[i].Data.Single_Full_board_Price ); 
			    SingleAllinclusivePrice += parseFloat( data[i].Data.Single_Soft_allinclusive_Price ); 
			    SingleUltraPrice += parseFloat( data[i].Data.Single_Ultra_Price ); 
			    SingleFullCost += parseFloat( data[i].Data.Single_Full_board_Cost ); 
			    SingleAllinclusiveCost += parseFloat( data[i].Data.Single_Soft_allinclusive_Cost ); 
			    SingleUltraCost += parseFloat( data[i].Data.Single_Ultra_Cost ); 
			    DoubleFullPrice += parseFloat( data[i].Data.Double_Full_board_Price ); 
			    DoubleAllinclusivePrice += parseFloat( data[i].Data.Double_Soft_allinclusive_Price ); 
			    DoubleUltraPrice += parseFloat( data[i].Data.Double_Ultra_Price ); 
			    DoubleFullCost += parseFloat( data[i].Data.Double_Full_board_Cost ); 
			    DoubleAllinclusiveCost += parseFloat( data[i].Data.Double_Soft_allinclusive_Cost ); 
			    DoubleUltraCost += parseFloat( data[i].Data.Double_Ultra_Cost ); 
			    TripleFullPrice += parseFloat( data[i].Data.Triple_Full_board_Price ); 
			    TripleAllinclusivePrice += parseFloat( data[i].Data.Triple_Soft_allinclusive_Price ); 
			    TripleUltraPrice += parseFloat( data[i].Data.Triple_Ultra_Price ); 
			    TripleFullCost += parseFloat( data[i].Data.Triple_Full_board_Cost ); 
			    TripleAllinclusiveCost += parseFloat( data[i].Data.Triple_Soft_allinclusive_Cost ); 
			    TripleUltraCost += parseFloat( data[i].Data.Triple_Ultra_Cost ); 
			   
			    PriceSingleRoom += parseFloat( data[i].Data.Room_Details.Price_Single_Room ); 
			    PriceDoubleRoom += parseFloat( data[i].Data.Room_Details.Price_Double_Room ); 
			    PriceTripleRoom += parseFloat( data[i].Data.Room_Details.Price_Triple_Room ); 
			    
			    PriceChild += parseFloat( data[i].Data.Room_Details.Price_Child ); 
			    CostSingleRoom += parseFloat( data[i].Data.Room_Details.Cost_Single_Room ); 
			    CostDoubleRoom += parseFloat( data[i].Data.Room_Details.Cost_Double_Room ); 
			    CostTripleRoom += parseFloat( data[i].Data.Room_Details.Cost_Triple_Room ); 
			    CostChild += parseFloat( data[i].Data.Room_Details.Cost_Child ); 
			    
			    Cairo_Office += parseInt( data[i].Data.Room_Details.Cairo_Office ); 
			    Mansoura_Office += parseInt( data[i].Data.Room_Details.Mansoura_Office ); 
			    Alexandira_Office += parseInt( data[i].Data.Room_Details.Alexandira_Office ); 
			    Mahalla_Office += parseInt( data[i].Data.Room_Details.Mahalla_Office ); 
			    Shobra_Office += parseInt( data[i].Data.Room_Details.Shobra_Office ); 

			    DoubleBedCost += parseFloat( data[i].Data.Double_Bed_breakfast_Cost ); 
			    DoubleBedPrice += parseFloat( data[i].Data.Double_Bed_breakfast_Price ); 
			    DoubleHalfCost += parseFloat( data[i].Data.Double_Half_board_Cost ); 
			    DoubleHalfPrice += parseFloat( data[i].Data.Double_Half_board_Price ); 
			    SingleBedCost += parseFloat( data[i].Data.Single_Bed_breakfast_Cost ); 
			    SingleHalfCost += parseFloat( data[i].Data.Single_Half_board_Cost ); 
			    TripleBedCost += parseFloat( data[i].Data.Triple_Bed_breakfast_Cost ); 
			    TripleBedPrice += parseFloat( data[i].Data.Triple_Bed_breakfast_Price ); 
			    TripleHalfCost += parseFloat( data[i].Data.Triple_Half_board_Cost ); 
			    TripleHalfPrice += parseFloat( data[i].Data.Triple_Half_board_Price ); 
				
			}

			ReturnObject.Basic_Plan = BasicPlan;
			ReturnObject.Addon_Child_Percentage_Price = AddonChildPrice/data.length;
			ReturnObject.Addon_Child_Percentage_Cost = AddonChildCost/data.length;
			ReturnObject.Single_Bed_breakfast_Price = SingleBedPrice/data.length;
			ReturnObject.Single_Half_board_Price = SingleHalfPrice/data.length;
			ReturnObject.Single_Full_board_Price = SingleFullPrice/data.length;
			ReturnObject.Single_Soft_allinclusive_Price = SingleAllinclusivePrice/data.length;
			ReturnObject.Single_Ultra_Price = SingleUltraPrice/data.length;
			ReturnObject.Single_Full_board_Cost = SingleFullCost/data.length;
			ReturnObject.Single_Soft_allinclusive_Cost = SingleAllinclusiveCost/data.length;
			ReturnObject.Single_Ultra_Cost = SingleUltraCost/data.length;
			ReturnObject.Double_Full_board_Price = DoubleFullPrice/data.length;
			ReturnObject.Double_Soft_allinclusive_Price = DoubleAllinclusivePrice/data.length;
			ReturnObject.Double_Ultra_Price = DoubleUltraPrice/data.length;
			ReturnObject.Double_Full_board_Cost = DoubleFullCost/data.length;
			ReturnObject.Double_Soft_allinclusive_Cost = DoubleAllinclusiveCost/data.length;
			ReturnObject.Double_Ultra_Cost = DoubleUltraCost/data.length;
			ReturnObject.Triple_Full_board_Price = TripleFullPrice/data.length;
			ReturnObject.Triple_Soft_allinclusive_Price = TripleAllinclusivePrice/data.length;
			ReturnObject.Triple_Ultra_Price = TripleUltraPrice/data.length;
			ReturnObject.Triple_Full_board_Cost = TripleFullCost/data.length;
			ReturnObject.Triple_Soft_allinclusive_Cost = TripleAllinclusiveCost/data.length;
			ReturnObject.Triple_Ultra_Cost = TripleUltraCost/data.length;
			// **********************************************************
			ReturnObject.Room_Details = {};
			
			ReturnObject.Room_Details.Cairo_Office = Math.min.apply(null, data.map(function(a){return a.Data.Room_Details.Cairo_Office;}))
			ReturnObject.Room_Details.Mansoura_Office = Math.min.apply(null, data.map(function(a){return a.Data.Room_Details.Mansoura_Office;}))
			ReturnObject.Room_Details.Alexandira_Office = Math.min.apply(null, data.map(function(a){return a.Data.Room_Details.Alexandira_Office;}))
			ReturnObject.Room_Details.Mahalla_Office = Math.min.apply(null, data.map(function(a){return a.Data.Room_Details.Mahalla_Office;}))
			ReturnObject.Room_Details.Shobra_Office = Math.min.apply(null, data.map(function(a){return a.Data.Room_Details.Shobra_Office;}))
			
			ReturnObject.Room_Details.Count = Math.min.apply(null, data.map(function(a){return a.Data.Room_Details.Count;}))
			ReturnObject.Room_Details.Price_Child = PriceChild/data.length;
			ReturnObject.Room_Details.Cost_Single_Room = CostSingleRoom/data.length;
			ReturnObject.Room_Details.Cost_Double_Room = CostDoubleRoom/data.length;
			ReturnObject.Room_Details.Cost_Triple_Room = CostTripleRoom/data.length;
			ReturnObject.Room_Details.Cost_Child = CostChild/data.length;
			ReturnObject.Room_Details.Max_Capacity_Single_Room_Adult = Math.min.apply(null, data.map(function(a){return a.Data.Room_Details.Max_Capacity_Single_Room_Adult;}))
			ReturnObject.Room_Details.Max_Capacity_Double_Room_Adult = Math.min.apply(null, data.map(function(a){return a.Data.Room_Details.Max_Capacity_Double_Room_Adult;}))
			ReturnObject.Room_Details.Max_Capacity_Triple_Room_Adult = Math.min.apply(null, data.map(function(a){return a.Data.Room_Details.Max_Capacity_Triple_Room_Adult;}))
			ReturnObject.Room_Details.Max_Capacity_Single_Room_Child = Math.min.apply(null, data.map(function(a){return a.Data.Room_Details.Max_Capacity_Single_Room_Child;}))
			ReturnObject.Room_Details.Max_Capacity_Double_Room_Child = Math.min.apply(null, data.map(function(a){return a.Data.Room_Details.Max_Capacity_Double_Room_Child;}))
			ReturnObject.Room_Details.Max_Capacity_Triple_Room_Child = Math.min.apply(null, data.map(function(a){return a.Data.Room_Details.Max_Capacity_Triple_Room_Child;}))
			ReturnObject.Room_Details.Price_Single_Room = PriceSingleRoom/data.length;
			ReturnObject.Room_Details.Price_Double_Room = PriceDoubleRoom/data.length;
			ReturnObject.Room_Details.Price_Triple_Room = PriceTripleRoom/data.length;
			// ***********************************************************************
			ReturnObject.Double_Bed_breakfast_Cost = DoubleBedCost/data.length;
			ReturnObject.Double_Bed_breakfast_Price = DoubleBedPrice/data.length;
			ReturnObject.Double_Half_board_Cost = DoubleHalfCost/data.length;
			ReturnObject.Double_Half_board_Price = DoubleHalfPrice/data.length;
			ReturnObject.Single_Bed_breakfast_Cost = SingleBedCost/data.length;
			ReturnObject.Single_Half_board_Cost = SingleHalfCost/data.length;
			ReturnObject.Triple_Bed_breakfast_Cost = TripleBedCost/data.length;
			ReturnObject.Triple_Bed_breakfast_Price = TripleBedPrice/data.length;
			ReturnObject.Triple_Half_board_Cost = TripleHalfCost/data.length;
			ReturnObject.Triple_Half_board_Price = TripleHalfPrice/data.length;
			

			// ReturnObject.Price_Single_Room = PriceSingleRoom/data.length;
			// ReturnObject.Price_Double_Room = PriceDoubleRoom/data.length;
			// ReturnObject.Price_Triple_Room = PriceTripleRoom/data.length;
			
			ReturnObject.count_room = count_room;

			var data ={};
			data.roombusy = count_room;
			data.data ={};
			data.data.Data={};
			data.data.Data = ReturnObject;
			// console.log(sum);
			// console.log(avg);
			response.send(data);
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
			newReservation.Reservation_Nationality  				= request.body.Reservation_Nationality;
			newReservation.Reservation_Number_of_Adult  			= request.body.Reservation_Number_of_Adult;
			newReservation.Reservation_Number_of_Child  			= request.body.Reservation_Number_of_Child;
			newReservation.Reservation_ByEmployee_ID   				= request.body.Reservation_ByEmployee_ID;
			newReservation.Reservation_Office_ID   	    			= request.body.Reservation_Office_ID;
			newReservation.Reservation_Grand_Total      			= request.body.Reservation_Grand_Total;
			newReservation.Reservation_Grand_Total_Cost				= request.body.Reservation_Grand_Total_Cost;
			newReservation.Reservation_Room 						= request.body.Reservation_Room;
			newReservation.Reservation_Payment						= [] ;
			newReservation.Reservation_TransportationFrom_City_ID   = request.body.Reservation_TransportationFrom_City_ID;
			newReservation.Reservation_Place_To_Move                = request.body.Reservation_Place_To_Move;
			newReservation.Reservation_Time_To_Move 				= request.body.Reservation_Time_To_Move;
			newReservation.Reservation_Number_of_Chair_InPackage  	= request.body.Reservation_Number_of_Chair_InPackage;
			newReservation.Reservation_Chair_Price_InPackage      	= request.body.Reservation_Chair_Price_InPackage;
			newReservation.Reservation_Number_of_Chair_OutPackage  	= request.body.Reservation_Number_of_Chair_OutPackage;
			newReservation.Reservation_Chair_Price_OutPackage      	= request.body.Reservation_Chair_Price_OutPackage;
			newReservation.Reservation_Discount 					= request.body.Reservation_Discount;
			newReservation.Reservation_Note 						= request.body.Reservation_Note;
			

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
		  while (currentDate < endDate) {
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
        		newRoomBusy.RoomBusy_OfficeID           = request.body.Reservation_Office_ID,
				
				newRoomBusy.RoomBusy_Note  				= room.Note;
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
		var object = {};
		if (request.body.Ammount < 0 ) 
			object = {Increment_Code: 2};
		else 
			object = {Increment_Code: 1};

		Increment.findOne(object).exec(function(err,inc){
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
			if (request.body.Ammount < 0 ) 
				object = {Increment_Code: 2};
			else 
				object = {Increment_Code: 1};
			Increment.findOneAndUpdate(
				object,
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
		var object = {Reservation_Customer_ID:Search};

		if (request.body.Reservation_Office_ID != 1 )
			object = {Reservation_Customer_ID:Search,Reservation_Office_ID:Number(request.body.Reservation_Office_ID)};
		
		Reservation.find(object)
		.populate({ path: 'Office', select: 'Office_Name' })
		.populate({ path: 'Customer', select: 'Customer_Name' })
		.populate({ path: 'Hotel', select: 'Hotel_Name Hotel_ChildernPolicy_Hint Hotel_City Hotel_Stars' })
		.populate({ path: 'Employee', select: 'Employee_Name' })
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
				Reservation_Nationality  				: request.body.Reservation_Nationality,
				Reservation_Number_of_Adult 			: request.body.Reservation_Number_of_Adult,
				Reservation_Number_of_Child 			: request.body.Reservation_Number_of_Child,
				//Reservation_ByEmployee_ID 				: request.body.Reservation_ByEmployee_ID,
				Reservation_Office_ID 					: request.body.Reservation_Office_ID,
				Reservation_Grand_Total 				: request.body.Reservation_Grand_Total,
				Reservation_Grand_Total_Cost 			: request.body.Reservation_Grand_Total_Cost,
				Reservation_Room 						: request.body.Reservation_Room,
				Reservation_Number_of_Chair_InPackage 	: request.body.Reservation_Number_of_Chair_InPackage,
				Reservation_Chair_Price_InPackage 		: request.body.Reservation_Chair_Price_InPackage,
				Reservation_Number_of_Chair_OutPackage 	: request.body.Reservation_Number_of_Chair_OutPackage,
				Reservation_Chair_Price_OutPackage 		: request.body.Reservation_Chair_Price_OutPackage,
				Reservation_TransportationFrom_City_ID  : request.body.Reservation_TransportationFrom_City_ID,
				Reservation_Place_To_Move               : request.body.Reservation_Place_To_Move,
       			Reservation_Time_To_Move                : request.body.Reservation_Time_To_Move,
				Reservation_Discount 					: request.body.Reservation_Discount,
				Reservation_Note 						: request.body.Reservation_Note,
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
				newRoomBusy.RoomBusy_Note 				= room.Note;
				newRoomBusy.RoomBusy_Reservation_Code   = GetNextId;
        		newRoomBusy.RoomBusy_OfficeID           = request.body.Reservation_Office_ID;

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

	searchReservationByID:function(request,response){

		var object = {Reservation_Code:request.body.Reservation_Code};
		
		Reservation.find(object)
		.populate({ path: 'Customer'})
		.exec(function(err, reservation) {
		    if (err){
				console.log(err)
		    	response.send({message: 'Error'});
		    }
	        if (reservation) {
	            response.send(reservation);
	        } 
    	})
	},

	deleteReservation:function(request,response){

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
				Reservation_Status 						: 0,
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
					
					return response.send({
						message: true
					});
				}
			})
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