var Hotel = require('../Model/btw_hotel');
var City = require('../Model/lut_btw_city');
var RoomType = require('../Model/lut_btw_room_type');
var RoomView = require('../Model/lut_btw_room_view');
var Employee = require('../Model/btw_employee');

var mongoose = require('mongoose');
// mongoose.set('debug', true);

module.exports = {

	addHotel:function(request,response){
		Hotel.getLastCode(function(err,hotel){
			if (hotel) 
				insetIntoHotel(hotel.Hotel_Code+1);
			else
				insetIntoHotel(1);
		});
		function insetIntoHotel(GetNextId){
			var newHotel = new Hotel();
			newHotel.Hotel_Code     		 		= GetNextId;
			newHotel.Hotel_Name 	     	 		= request.body.Hotel_Name;
			newHotel.Hotel_Address   	 			= request.body.Hotel_Address;
			newHotel.Hotel_City	 					= request.body.Hotel_City;
			newHotel.Hotel_Stars   	    			= request.body.Hotel_Stars;
			// newHotel.Hotel_HasChildernPolicy   		= request.body.Hotel_HasChildernPolicy;
			// newHotel.Hotel_FirstChildernAge   	    = request.body.Hotel_FirstChildernAge;
			// newHotel.Hotel_SecondChildernAge   	    = request.body.Hotel_SecondChildernAge;
			// newHotel.Hotel_ThirdChildernAge   	    = request.body.Hotel_ThirdChildernAge;
			newHotel.Hotel_ChildernPolicy_Hint   	= request.body.Hotel_ChildernPolicy_Hint;
			newHotel.Hotel_Bank_Name   	    		= request.body.Hotel_Bank_Name;
			newHotel.Hotel_Bank_Account_Number   	= request.body.Hotel_Bank_Account_Number;
			newHotel.Hotel_Bank_Account_Holder_Name = request.body.Hotel_Bank_Account_Holder_Name;
			newHotel.Hotel_Bank_IBAN_Number   	    = request.body.Hotel_Bank_IBAN_Number;
			newHotel.Hotel_IsActive   	    		= 1;
			
			newHotel.save(function(error, doneadd){
				if(error){
					return response.send({
						message: error
					});
				}
				else{
					return response.send({
						message: true
					});
				}
			});
		}
	},

	editHotel:function(request,response){
		var newvalues = { $set: {
				Hotel_Name 						: request.body.Hotel_Name,
				Hotel_Address 					: request.body.Hotel_Address,
				Hotel_City 						: request.body.Hotel_City,
				Hotel_Stars 					: request.body.Hotel_Stars,
				// Hotel_HasChildernPolicy 		: request.body.Hotel_HasChildernPolicy,
				// Hotel_FirstChildernAge 			: request.body.Hotel_FirstChildernAge,
				// Hotel_SecondChildernAge 		: request.body.Hotel_SecondChildernAge,
				// Hotel_ThirdChildernAge 			: request.body.Hotel_ThirdChildernAge,
				Hotel_ChildernPolicy_Hint 		: request.body.Hotel_ChildernPolicy_Hint,
				Hotel_Bank_Name 				: request.body.Hotel_Bank_Name,
				Hotel_Bank_Account_Number 		: request.body.Hotel_Bank_Account_Number,
				Hotel_Bank_Account_Holder_Name 	: request.body.Hotel_Bank_Account_Holder_Name,
				Hotel_Bank_IBAN_Number 			: request.body.Hotel_Bank_IBAN_Number,
				Hotel_IsActive 					: request.body.Hotel_IsActive,
				
			} };
		var myquery = { Hotel_Code: request.body.Hotel_Code }; 
		Hotel.findOneAndUpdate( myquery,newvalues, function(err, field) {
    	    if (err){
    	    	return response.send({
					message: 'Error'
				});
    	    }
            if (!field) {
            	return response.send({
					message: 'Hotel not exists'
				});
            } else {
                return response.send({
					message: true
				});
			}
		})
	},

	getAllHotels:function(request,response){
		Hotel.find({})
		.sort({Hotel_Code: -1})
		.exec(function(err, hotel) {
		    if (err){
		    	response.send({message: 'Error'});
		    }
	        if (hotel) {
	            response.send(hotel);
	        } 
    	})
	},

	getAllHotelsMinData:function(request,response){
		Hotel.find({}, { Hotel_Contact: 0, Hotel_Contract: 0} )
		.sort({Hotel_Code: -1})
		.exec(function(err, hotel) {
		    if (err){
		    	response.send({message: 'Error'});
		    }
	        if (hotel) {
	            response.send(hotel);
	        } 
    	})
	},

	getHotelByID:function(request,response){
		var Search = Number(request.body.Hotel_Code);
		Hotel.findOne({Hotel_Code:Search})
		.populate({ path: 'City', select: 'City_Name' })
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

	editHotelContact:function(request,res){
		
		var myquery = { Hotel_Code: request.body.Hotel_Code }; 

		var newvalues = { 
			Hotel_Contact	: request.body.Hotel_Contact,
		};
		Hotel.findOneAndUpdate( myquery,newvalues, function(err, field) {
    	    if (err){
    	    	return res.send({
					message: 'Error'
				});
    	    }
            if (!field) {
            	return res.send({
					message: 'Hotel not exists'
				});
            } else {

                return res.send({
					message: true
				});
			}
		})
	},

	editHotelContractBasicInfo:function(request,res){

		if (request.body.row_id) {
			var Row_ID = mongoose.Types.ObjectId(request.body.row_id);

			Hotel.updateOne({ Hotel_Code:Number(request.body.Hotel_Code) ,
				"Hotel_Contract._id" : Row_ID},
			{$set: 
				{
					"Hotel_Contract.$.Title"							: request.body.Title,
					"Hotel_Contract.$.Deposit_Amount"					: request.body.Deposit_Amount,
					"Hotel_Contract.$.Limit_Reservation_For"			: request.body.Limit_Reservation_For,
					"Hotel_Contract.$.Date"								: request.body.Date,
					"Hotel_Contract.$.ByEmployee_Code"					: request.body.ByEmployee_Code,
					// "Hotel_Contract.$.Bed_breakfast_Price"				: request.body.Bed_breakfast_Price,
					// "Hotel_Contract.$.Half_board_Price" 				: request.body.Half_board_Price,
					// "Hotel_Contract.$.Full_board_Price"					: request.body.Full_board_Price,
					// "Hotel_Contract.$.Soft_allinclusive_Price"			: request.body.Soft_allinclusive_Price,
					// "Hotel_Contract.$.Ultra_Price"						: request.body.Ultra_Price,
					
					// "Hotel_Contract.$.Bed_breakfast_Cost"				: request.body.Bed_breakfast_Cost,
					// "Hotel_Contract.$.Half_board_Cost"					: request.body.Half_board_Cost,
					// "Hotel_Contract.$.Full_board_Cost"					: request.body.Full_board_Cost,
					// "Hotel_Contract.$.Soft_allinclusive_Cost"			: request.body.Soft_allinclusive_Cost,
					// "Hotel_Contract.$.Ultra_Cost"						: request.body.Ultra_Cost,
					// "Hotel_Contract.$.Addon_Child_Percentage_Price"		: request.body.Addon_Child_Percentage_Price,
					// "Hotel_Contract.$.Addon_Child_Percentage_Cost"		: request.body.Addon_Child_Percentage_Cost,
					// "Hotel_Contract.$.Basic_Plan"						: request.body.Basic_Plan
				}	
			},
			// { arrayFilters : [ 
			// 			{"Hotel_Contract._id" : Row_ID }
			// 		],
			 	// multi : true
			// }
			)
			.exec(function(err, field){
	    	    if (err){
	    	    	return res.send({
						message: err,
					});
	    	    }
	            if (!field) {
	            	return res.send({
						message: 'Hotel not exists'
					});
	            } else {
	                return res.send({
						message: true
					});
				}
			})
		}else{

			var ContractBasic = [
				{
					Title 							: request.body.Title,
	    			Deposit_Amount          		: Number(request.body.Deposit_Amount),
		            Limit_Reservation_For   		: Number(request.body.Limit_Reservation_For),
		            Date                    		: request.body.Date,
		            ByEmployee_Code         		: Number(request.body.ByEmployee_Code),
		            // Bed_only_Price  				: request.body.Bed_only_Price, 
					// Bed_breakfast_Price				: request.body.Bed_breakfast_Price,
					// Half_board_Price				: request.body.Half_board_Price,
					// Full_board_Price				: request.body.Full_board_Price,
					// Soft_allinclusive_Price			: request.body.Soft_allinclusive_Price,
					// Ultra_Price						: request.body.Ultra_Price,
					// // Bed_only_Cost          			: request.body.Bed_only_Cost,
		   //          Bed_breakfast_Cost     			: request.body.Bed_breakfast_Cost,
		   //          Half_board_Cost        			: request.body.Half_board_Cost,
		   //          Full_board_Cost        			: request.body.Full_board_Cost,
		   //          Soft_allinclusive_Cost 			: request.body.Soft_allinclusive_Cost,
		   //          Ultra_Cost             			: request.body.Ultra_Cost,
	    //         	Addon_Child_Percentage_Price    : request.body.Addon_Child_Percentage_Price,
	    //         	Addon_Child_Percentage_Cost     : request.body.Addon_Child_Percentage_Cost,
	    //         	Basic_Plan     					: request.body.Basic_Plan,
					
				}
	        ]

			var myquery = {Hotel_Code: request.body.Hotel_Code};
			var newvalues = { 
				$push:{Hotel_Contract:ContractBasic},
			 }; 

			 Hotel.findOneAndUpdate( myquery,newvalues, function(err, field) {
	    	    if (err){
	    	    	return res.send({
						message: err
					});
	    	    }
	            if (!field) {
	            	return res.send({
						message: 'Hotel not exists'
					});
	            } else {
	                return res.send({
						message: true
					});
				}
			})
		}
	},

	addHotelContractRoom:function(request,res){
		// var From = new Date('2019-09-18');
		// var To = new Date('2019-10-15');


		var From = request.body.Room_From; 
		var To = request.body.Room_To;
		var arrayhotel={
			Room_From 							 :From,
			Room_To 							 :To,
			Room_Count 							 :request.body.Room_Count,
			
			Basic_Plan			 				 :request.body.Basic_Plan,
			Addon_Child_Percentage_Price		 :request.body.Addon_Child_Percentage_Price,
			Addon_Child_Percentage_Cost			 :request.body.Addon_Child_Percentage_Cost,
			
			Single_Bed_breakfast_Price			 :request.body.Single_Bed_breakfast_Price,
			Single_Half_board_Price			 	 :request.body.Single_Half_board_Price,
			Single_Full_board_Price			 	 :request.body.Single_Full_board_Price,
			Single_Soft_allinclusive_Price		 :request.body.Single_Soft_allinclusive_Price,
			Single_Ultra_Price			 		 :request.body.Single_Ultra_Price,
			Single_Bed_breakfast_Cost			 :request.body.Single_Bed_breakfast_Cost,
			Single_Half_board_Cost			 	 :request.body.Single_Half_board_Cost,
			Single_Full_board_Cost			 	 :request.body.Single_Full_board_Cost,
			Single_Soft_allinclusive_Cost		 :request.body.Single_Soft_allinclusive_Cost,
			Single_Ultra_Cost			 		 :request.body.Single_Ultra_Cost,
			
			Double_Bed_breakfast_Price			 :request.body.Double_Bed_breakfast_Price,
			Double_Half_board_Price			 	 :request.body.Double_Half_board_Price,
			Double_Full_board_Price			 	 :request.body.Double_Full_board_Price,
			Double_Soft_allinclusive_Price		 :request.body.Double_Soft_allinclusive_Price,
			Double_Ultra_Price			 		 :request.body.Double_Ultra_Price,
			Double_Bed_breakfast_Cost			 :request.body.Double_Bed_breakfast_Cost,
			Double_Half_board_Cost			 	:request.body.Double_Half_board_Cost,
			Double_Full_board_Cost			 	:request.body.Double_Full_board_Cost,
			Double_Soft_allinclusive_Cost		:request.body.Double_Soft_allinclusive_Cost,
			Double_Ultra_Cost			 		:request.body.Double_Ultra_Cost,
			
			Triple_Bed_breakfast_Price			:request.body.Triple_Bed_breakfast_Price,
			Triple_Half_board_Price			 	:request.body.Triple_Half_board_Price,
			Triple_Full_board_Price			 	:request.body.Triple_Full_board_Price,
			Triple_Soft_allinclusive_Price		:request.body.Triple_Soft_allinclusive_Price,
			Triple_Ultra_Price			 		:request.body.Triple_Ultra_Price,
			Triple_Bed_breakfast_Cost			:request.body.Triple_Bed_breakfast_Cost,
			Triple_Half_board_Cost			 	:request.body.Triple_Half_board_Cost,
			Triple_Full_board_Cost			 	:request.body.Triple_Full_board_Cost,
			Triple_Soft_allinclusive_Cost		:request.body.Triple_Soft_allinclusive_Cost,
			Triple_Ultra_Cost			 		:request.body.Triple_Ultra_Cost,

			Room_Details 						 :request.body.Room_Details
		}

		var Hotel_ContractID = mongoose.Types.ObjectId(request.body.Hotel_ContractID);

			// object = {	
			// 		$and :[
			// 			{Hotel_Code:Number(request.body.Hotel_Code)},
			// 			// {'Hotel_Contract._id':Hotel_ContractID},
			// 			 {'Hotel_Contract.Hotel_Rooms.Room_From': { $gt: From, $lt: To}},
			// 			// {'Hotel_Contract.Hotel_Rooms.Room_To': { $gte: From, $lte: To}}]}

			// 	]}
			// console.log(object);
			// Hotel.findOne(object)


			Hotel.aggregate([
			{$match: { Hotel_Code: Number(request.body.Hotel_Code),
					}},
			{$unwind: "$Hotel_Contract" },
			{$unwind: "$Hotel_Contract.Hotel_Rooms" },
			{$group: { _id: { 	to: "$Hotel_Contract.Hotel_Rooms.Room_To",
							  	from: "$Hotel_Contract.Hotel_Rooms.Room_From",
							},
			 	Data: { $push: "$Hotel_Contract.Hotel_Rooms" } } },
				{$unwind: "$Data" },
					{$match: {
							 "_id.from":{$lte:From,$lte:To} ,
							 "_id.to":{$gte:To,$gte:From},
					}
				},
			])
			.exec(function(err, busy) {
			    if (err){
			    	res.send({message: err});
			    }
		        if (busy.length > 0) {
		            res.send({message: 'This Date has been Reserved'});
		        }else{
		            addDateContract();
		        }
    	})

		function addDateContract(){
				var myquery = {
					 Hotel_Code: request.body.Hotel_Code,
					'Hotel_Contract._id' : Hotel_ContractID,
				};
				var newvalues = { 
					$push: { "Hotel_Contract.$.Hotel_Rooms"   : arrayhotel},
				};
			Hotel.findOneAndUpdate( myquery,newvalues, function(err, field) {
	    	    if (err){
	    	    	return res.send({
						message: err,
					});
	    	    }
	            if (!field) {
	            	return res.send({
						message: 'Hotel not exists'
					});
	            } else {
	            	// console.log(field);
	                return res.send({
						message: true
					});
				}
			})
		}
	},

	editHotelContractRoom:function(request,res){
		// var From = new Date('2019-03-15');
		// var To = new Date('2019-04-25');
		

		var From = new Date(request.body.Room_From); 
		var To = new Date(request.body.Room_To);
		var Hotel_ContractID = mongoose.Types.ObjectId(request.body.Hotel_ContractID);
		var Hotel_RoomID = mongoose.Types.ObjectId(request.body.Hotel_RoomID);
			
		Hotel.aggregate([
		{$match: { Hotel_Code: Number(request.body.Hotel_Code),
					"Hotel_Contract._id":Hotel_ContractID
				}},
		{$unwind: "$Hotel_Contract" },
		{$unwind: "$Hotel_Contract.Hotel_Rooms" },
		{$group: { _id: { 	to: "$Hotel_Contract.Hotel_Rooms.Room_To",
						  	from: "$Hotel_Contract.Hotel_Rooms.Room_From",
						},
		 	Data: { $push: "$Hotel_Contract.Hotel_Rooms" } } },
			{$unwind: "$Data" },
				{$match: {
						'Data._id':{$ne:Hotel_RoomID},
						 "_id.from":{$lte:From,$lte:To} ,
						 "_id.to":{$gte:To,$gte:From},
				}
			},
		])
		.exec(function(err, busy) {
		    if (err){
		    	res.send({message: err});
		    }
	        if (busy.length > 0) {
	            res.send({message: 'This Date has been Reserved'});
	        }else{
	            addDateContract();
	            // res.send({message: 'Update'});

	        }
		})

		function addDateContract(){
			// Hotel.findOne({Hotel_Code: request.body.Hotel_Code}).then((Hotel) => {
			// 	var Hotel_Contract = Hotel.Hotel_Contract.filter((object) => {
			// 		return object["_id"] == request.body.Hotel_ContractID
			// 	})
			// 	var Hotel_Rooms = Hotel_Contract[0].Hotel_Rooms.filter((object) => {
			// 		return object["_id"] == request.body.Hotel_RoomID
			// 	})
			// 	Hotel_Rooms[0].Room_From = request.body.Room_From;
			// 	Hotel_Rooms[0].Room_To = request.body.Room_To;
			// 	Hotel_Rooms[0].Room_Count = request.body.Room_Count;
			// 	Hotel.save();
			// 	return res.send({
			// 		message: true
			// 	})
			// })
			//###################################

			Hotel.updateOne({ Hotel_Code:request.body.Hotel_Code},
			{$set: 
				{
					"Hotel_Contract.$[con1].Hotel_Rooms.$[con2].Room_From" 							: request.body.Room_From,
					"Hotel_Contract.$[con1].Hotel_Rooms.$[con2].Room_To"							: request.body.Room_To,
					"Hotel_Contract.$[con1].Hotel_Rooms.$[con2].Room_Count"							: request.body.Room_Count,
					
					"Hotel_Contract.$[con1].Hotel_Rooms.$[con2].Basic_Plan" 						: request.body.Basic_Plan,
					"Hotel_Contract.$[con1].Hotel_Rooms.$[con2].Addon_Child_Percentage_Price"		: request.body.Addon_Child_Percentage_Price,
					"Hotel_Contract.$[con1].Hotel_Rooms.$[con2].Addon_Child_Percentage_Cost"		: request.body.Addon_Child_Percentage_Cost,
					"Hotel_Contract.$[con1].Hotel_Rooms.$[con2].Single_Bed_breakfast_Price"			: request.body.Single_Bed_breakfast_Price,
					"Hotel_Contract.$[con1].Hotel_Rooms.$[con2].Single_Half_board_Price"			: request.body.Single_Half_board_Price,
					"Hotel_Contract.$[con1].Hotel_Rooms.$[con2].Single_Full_board_Price"			: request.body.Single_Full_board_Price,
					"Hotel_Contract.$[con1].Hotel_Rooms.$[con2].Single_Soft_allinclusive_Price"		: request.body.Single_Soft_allinclusive_Price,
					"Hotel_Contract.$[con1].Hotel_Rooms.$[con2].Single_Ultra_Price"					: request.body.Single_Ultra_Price,
					"Hotel_Contract.$[con1].Hotel_Rooms.$[con2].Single_Bed_breakfast_Cost"			: request.body.Single_Bed_breakfast_Cost,
					"Hotel_Contract.$[con1].Hotel_Rooms.$[con2].Single_Half_board_Cost"				: request.body.Single_Half_board_Cost,
					"Hotel_Contract.$[con1].Hotel_Rooms.$[con2].Single_Full_board_Cost"				: request.body.Single_Full_board_Cost,
					"Hotel_Contract.$[con1].Hotel_Rooms.$[con2].Single_Soft_allinclusive_Cost"		: request.body.Single_Soft_allinclusive_Cost,
					"Hotel_Contract.$[con1].Hotel_Rooms.$[con2].Single_Ultra_Cost"					: request.body.Single_Ultra_Cost,
					"Hotel_Contract.$[con1].Hotel_Rooms.$[con2].Double_Bed_breakfast_Price" 		: request.body.Double_Bed_breakfast_Price,
					"Hotel_Contract.$[con1].Hotel_Rooms.$[con2].Double_Half_board_Price"			: request.body.Double_Half_board_Price,
					"Hotel_Contract.$[con1].Hotel_Rooms.$[con2].Double_Full_board_Price"			: request.body.Double_Full_board_Price,
					"Hotel_Contract.$[con1].Hotel_Rooms.$[con2].Double_Soft_allinclusive_Price"		: request.body.Double_Soft_allinclusive_Price,
					"Hotel_Contract.$[con1].Hotel_Rooms.$[con2].Double_Ultra_Price"					: request.body.Double_Ultra_Price,
					"Hotel_Contract.$[con1].Hotel_Rooms.$[con2].Double_Bed_breakfast_Cost"			: request.body.Double_Bed_breakfast_Cost,
					"Hotel_Contract.$[con1].Hotel_Rooms.$[con2].Double_Half_board_Cost"				: request.body.Double_Half_board_Cost,
					"Hotel_Contract.$[con1].Hotel_Rooms.$[con2].Double_Full_board_Cost"				: request.body.Double_Full_board_Cost,
					"Hotel_Contract.$[con1].Hotel_Rooms.$[con2].Double_Soft_allinclusive_Cost"		: request.body.Double_Soft_allinclusive_Cost,
					"Hotel_Contract.$[con1].Hotel_Rooms.$[con2].Double_Ultra_Cost"					: request.body.Double_Ultra_Cost,
					"Hotel_Contract.$[con1].Hotel_Rooms.$[con2].Triple_Bed_breakfast_Price"			: request.body.Triple_Bed_breakfast_Price,
					"Hotel_Contract.$[con1].Hotel_Rooms.$[con2].Triple_Half_board_Price"			: request.body.Triple_Half_board_Price,
					"Hotel_Contract.$[con1].Hotel_Rooms.$[con2].Triple_Full_board_Price"			: request.body.Triple_Full_board_Price,
					"Hotel_Contract.$[con1].Hotel_Rooms.$[con2].Triple_Soft_allinclusive_Price"		: request.body.Triple_Soft_allinclusive_Price,
					"Hotel_Contract.$[con1].Hotel_Rooms.$[con2].Triple_Ultra_Price"					: request.body.Triple_Ultra_Price,
					"Hotel_Contract.$[con1].Hotel_Rooms.$[con2].Triple_Bed_breakfast_Cost"			: request.body.Triple_Bed_breakfast_Cost,
					"Hotel_Contract.$[con1].Hotel_Rooms.$[con2].Triple_Half_board_Cost"				: request.body.Triple_Half_board_Cost,
					"Hotel_Contract.$[con1].Hotel_Rooms.$[con2].Triple_Full_board_Cost"				: request.body.Triple_Full_board_Cost,
					"Hotel_Contract.$[con1].Hotel_Rooms.$[con2].Triple_Soft_allinclusive_Cost"		: request.body.Triple_Soft_allinclusive_Cost,
					"Hotel_Contract.$[con1].Hotel_Rooms.$[con2].Triple_Ultra_Cost"					: request.body.Triple_Ultra_Cost,
				}	
			},
			{ arrayFilters : [ 
						{"con1._id" : Hotel_ContractID },
						{"con2._id" : Hotel_RoomID }
					],
			 	multi : true })
			.exec(function(err, field){
	    	    if (err){
	    	    	return res.send({
						message: err,
					});
	    	    }
	            if (!field) {
	            	return res.send({
						message: 'Hotel not exists'
					});
	            } else {
	                return res.send({
						message: true
					});
				}
			})
		}	
	},

	addHotelContractRoomDetails:function(request,res){
		Hotel.findOne({Hotel_Code: request.body.Hotel_Code}).then((Hotel) => {
			var Hotel_Contract = Hotel.Hotel_Contract.filter((object) => {
				return object["_id"] == request.body.Hotel_ContractID
			})
			var Hotel_Rooms = Hotel_Contract[0].Hotel_Rooms.filter((object) => {
				return object["_id"] == request.body.Hotel_RoomID
			})
			Hotel_Rooms[0].Room_Details.push(request.body.Room_Details);
			Hotel.save();
			return res.send({
				message: true
			})
		})
		.catch((err)=>{
            return res.send({
				message: err
			});
		});
	},

	editHotelContractRoomDetails:function(request,res){

		var Hotel_ContractID = mongoose.Types.ObjectId(request.body.Hotel_ContractID);
		var Hotel_RoomID = mongoose.Types.ObjectId(request.body.Hotel_RoomID);
		var Hotel_RoomDetailsID = mongoose.Types.ObjectId(request.body.Hotel_RoomDetailsID);

		Hotel.updateOne({ Hotel_Code:request.body.Hotel_Code},
			{$set: 
				{
					"Hotel_Contract.$[con1].Hotel_Rooms.$[con2].Room_Details.$[con3].RoomType_Code"					: request.body.RoomType_Code,
					"Hotel_Contract.$[con1].Hotel_Rooms.$[con2].Room_Details.$[con3].RoomView_Code"					: request.body.RoomView_Code,
					"Hotel_Contract.$[con1].Hotel_Rooms.$[con2].Room_Details.$[con3].Count"							: request.body.Count,
					"Hotel_Contract.$[con1].Hotel_Rooms.$[con2].Room_Details.$[con3].Max_Capacity_Single_Room_Adult": request.body.Max_Capacity_Single_Room_Adult,
					"Hotel_Contract.$[con1].Hotel_Rooms.$[con2].Room_Details.$[con3].Max_Capacity_Single_Room_Child": request.body.Max_Capacity_Single_Room_Child,
					"Hotel_Contract.$[con1].Hotel_Rooms.$[con2].Room_Details.$[con3].Max_Capacity_Double_Room_Adult": request.body.Max_Capacity_Double_Room_Adult,
					"Hotel_Contract.$[con1].Hotel_Rooms.$[con2].Room_Details.$[con3].Max_Capacity_Double_Room_Child": request.body.Max_Capacity_Double_Room_Child,
					"Hotel_Contract.$[con1].Hotel_Rooms.$[con2].Room_Details.$[con3].Max_Capacity_Triple_Room_Adult": request.body.Max_Capacity_Triple_Room_Adult,
					"Hotel_Contract.$[con1].Hotel_Rooms.$[con2].Room_Details.$[con3].Max_Capacity_Triple_Room_Child": request.body.Max_Capacity_Triple_Room_Child,
					"Hotel_Contract.$[con1].Hotel_Rooms.$[con2].Room_Details.$[con3].Price_Single_Room"				: request.body.Price_Single_Room,
					"Hotel_Contract.$[con1].Hotel_Rooms.$[con2].Room_Details.$[con3].Price_Double_Room"				: request.body.Price_Double_Room,
					"Hotel_Contract.$[con1].Hotel_Rooms.$[con2].Room_Details.$[con3].Price_Triple_Room"				: request.body.Price_Triple_Room,
					"Hotel_Contract.$[con1].Hotel_Rooms.$[con2].Room_Details.$[con3].Price_Child"					: request.body.Price_Child,
					"Hotel_Contract.$[con1].Hotel_Rooms.$[con2].Room_Details.$[con3].Cost_Single_Room"				: request.body.Cost_Single_Room,
					"Hotel_Contract.$[con1].Hotel_Rooms.$[con2].Room_Details.$[con3].Cost_Double_Room"				: request.body.Cost_Double_Room,
					"Hotel_Contract.$[con1].Hotel_Rooms.$[con2].Room_Details.$[con3].Cost_Triple_Room"				: request.body.Cost_Triple_Room,
					"Hotel_Contract.$[con1].Hotel_Rooms.$[con2].Room_Details.$[con3].Cost_Child"					: request.body.Cost_Child
				}	
			},
			{ arrayFilters : [ 
						{"con1._id" : Hotel_ContractID },
						{"con2._id" : Hotel_RoomID },
						{"con3._id" : Hotel_RoomDetailsID }
					],
			 	multi : true })
			.exec(function(err, field){
	    	    if (err){
	    	    	return res.send({
						message: err,
					});
	    	    }
	            if (!field) {
	            	return res.send({
						message: 'Hotel not exists'
					});
	            } else {
	                return res.send({
						message: true
					});
				}
			})
	},

	getHotelContractByID:function(request,response){

		Hotel.aggregate([
			{$match: { Hotel_Code: Number(request.body.Hotel_Code),
					}},
			{$unwind: "$Hotel_Contract" },
			{$unwind: "$Hotel_Contract.Hotel_Rooms"},
			{
				$sort: {
				 "Hotel_Contract.Hotel_Rooms.Room_From":-1
				}
			},
		])
		.exec(function(err, hotel) {
		    if (err){
		    	response.send({message: err});
		    }
	        if (hotel) {
	        	Hotel.populate(hotel[0], { path: 'Employee' , select: 'Employee_Name'}, function(err, employee) {
	    			Hotel.populate(employee, { path: 'City' , select: 'City_Name'}, function(err, city) {
		    			Hotel.populate(city, { path: 'RoomType' , select: 'RoomType_Name'}, function(err, roomType) {
		    				Hotel.populate(roomType, { path: 'RoomView' , select: 'RoomView_Name'}, function(err, roomView) {
			    				response.send(roomView);
				        	});
			        	});
			        });
		        });
	        } 
    	})
	},

}






//hashed by osama 

// Room_Details:
			// [
			// 	{
			// 		RoomType_Code:1,
			// 		RoomView_Code:1,
			// 		Count:5,
			// 		Price :{
	  //                   Price_Single_Room:1000,
	  //                   Price_Double_Room:1500,
	  //                   Price_Triple_Room:1700,
	  //               },
			// 	},
			// 	{
			// 		RoomType_Code:2,
			// 		RoomView_Code:2,
			// 		Count:7,
			// 		Price :{
	  //                   Price_Single_Room:500,
	  //                   Price_Double_Room:700,
	  //                   Price_Triple_Room:900,
	  //               },
			// 	},
			// ]
			// },
			// {
			// // Room_From :request.body.Room_From,
			// // Room_To :request.body.Room_To,
			// // Room_Details:request.body.Room_Details
			// Room_From :new Date('2018-12-19'),
			// Room_To :new Date('2018-12-25'),
			// Room_Details:
			// [
			// 	{
			// 		RoomType_Code:2,
			// 		RoomView_Code:2,
			// 		Count:7,
			// 		Price :{
	  //                   Price_Single_Room:900,
	  //                   Price_Double_Room:600,
	  //                   Price_Triple_Room:350,
	  //               },
			// 	},
			// 	{
			// 		RoomType_Code:2,
			// 		RoomView_Code:2,
			// 		Count:7,
			// 		Price :{
	  //                   Price_Single_Room:1100,
	  //                   Price_Double_Room:1300,
	  //                   Price_Triple_Room:1400,
	  //               },
			// 	},
			// ]
		// }]