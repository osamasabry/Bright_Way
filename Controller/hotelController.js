var Hotel = require('../Model/btw_hotel');


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
			newHotel.Hotel_HasChildernPolicy   		= request.body.Hotel_HasChildernPolicy;
			newHotel.Hotel_FirstChildernAge   	    = request.body.Hotel_FirstChildernAge;
			newHotel.Hotel_SecondChildernAge   	    = request.body.Hotel_SecondChildernAge;
			newHotel.Hotel_ThirdChildernAge   	    = request.body.Hotel_ThirdChildernAge;
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
				Hotel_HasChildernPolicy 		: request.body.Hotel_HasChildernPolicy,
				Hotel_FirstChildernAge 			: request.body.Hotel_FirstChildernAge,
				Hotel_SecondChildernAge 		: request.body.Hotel_SecondChildernAge,
				Hotel_ThirdChildernAge 			: request.body.Hotel_ThirdChildernAge,
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

	getHotelByID:function(request,response){
		var Search = Numer(request.body.Hotel_Code);
		Hotel.find({Hotel_Code:Search})
		.exec(function(err, hotel) {
		    if (err){
		    	response.send({message: 'Error'});
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
		var ContractBasic = [
			{
				Title 					: request.body.Title,
    			Deposit_Amount          : Number(request.body.Deposit_Amount),
	            Limit_Reservation_For   : Number(request.body.Limit_Reservation_For),
	            Date                    : request.body.Date,
	            ByEmployee_Code         : Number(request.body.ByEmployee_Code),
			}
        ]

		var myquery = { Hotel_Code: request.body.Hotel_Code }; 

		var newvalues = { 
			$push:{Hotel_Contract:ContractBasic},
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

	addHotelContractRoom:function(request,res){
		arrayhotel={
			Room_From :request.body.Room_From,
			Room_To :request.body.Room_To,
			Room_Details:request.body.Room_Details
		}
			// Room_From :new Date('2018-12-15'),
			// Room_To :new Date('2018-12-18'),
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
		var myquery = {
				 Hotel_Code: request.body.Hotel_Code,
				'Hotel_Contract._id' : request.body.Hotel_ContractID, 
			}; 

		var newvalues = { 
			$push: { 
					 "Hotel_Contract.$.Hotel_Rooms"   : arrayhotel,
					},
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
            	console.log(field);
                return res.send({
					message: true
				});
			}
		})
	},

	editHotelContractRoom:function(request,res){

		var myquery = {
				 Hotel_Code 			: request.body.Hotel_Code,
				'Hotel_Contract._id' 	: request.body.Hotel_ContractID, 
				'Hotel_Rooms._id' 		: request.body.Hotel_RoomID, 
			}; 

		var newvalues = { 
			$push: { 
					"Hotel_Rooms.$.Room_Details"   : request.body.Room_Details,
				},
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
	}

}






