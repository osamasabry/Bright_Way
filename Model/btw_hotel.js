var mongoose = require('mongoose');

var Btw_HotelSchema = mongoose.Schema({
   
		Hotel_Code                         :Number,
        Hotel_Name                         :String,
        Hotel_Address                      :String,
	    Hotel_Contact        :[{
            Hotel_ContactTitle           : String,
            Hotel_ContactName            : String,
            Hotel_ContactTelphone        : [String],
            Hotel_ContactEmail           : [String],
        },{
            toJSON: { virtuals: true }
        }],

        Hotel_City                         :Number,
        Hotel_Stars                        :Number,
        Hotel_HasChildernPolicy            :Number, 
        Hotel_FirstChildernAge             :Number,
        Hotel_SecondChildernAge            :Number, 
        Hotel_ThirdChildernAge             :Number, 
        Hotel_ChildernPolicy_Hint          :String,
        Hotel_Contract : [{
            Title                   :String,
            Deposit_Amount          :Number,
            Limit_Reservation_For   :Number,
            Date                    :Date,
            ByEmployee_Code         :Number,
            Hotel_Rooms                :[{
                Room_From   : Date,
                Room_To     : Date,
                Room_Count  :Number,
                Room_Details:[{
                    RoomType_Code :Number, 
                    RoomView_Code :Number,
                    Count         :Number,
                    Price         :{
                        Price_Single_Room:Number,
                        Price_Double_Room:Number,
                        Price_Triple_Room:Number,
                    },
                    Room_Cost          :{
                        Cost_Single_Room:Number,
                        Cost_Double_Room:Number,
                        Cost_Triple_Room:Number,
                    },
                }],
            }],
        }],
       
        Hotel_Bank_Name                 :String,
        Hotel_Bank_Account_Number       :String,
        Hotel_Bank_Account_Holder_Name  :String,
        Hotel_Bank_IBAN_Number          :String,
        Hotel_IsActive                  :Number,

},{
    toJSON: { virtuals: true }
});

// Btw_EmployeeSchema.virtual('Office',{
//     ref: 'btw_office',
//     localField: 'Employee_Office_Code',
//     foreignField: 'Office_Code',
//     justOne: false // for many-to-1 relationships
// });




var Hotels = module.exports = mongoose.model('btw_hotel', Btw_HotelSchema);


module.exports.getLastCode = function(callback){
    
    Hotels.findOne({},callback).sort({Hotel_Code:-1});
}