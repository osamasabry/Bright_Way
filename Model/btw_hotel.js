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
        // Hotel_HasChildernPolicy            :Number, 
        // Hotel_FirstChildernAge             :Number,
        // Hotel_SecondChildernAge            :Number, 
        // Hotel_ThirdChildernAge             :Number, 
        Hotel_ChildernPolicy_Hint          :String,
        Hotel_Contract : [{
            Title                   :String,
            Deposit_Amount          :Number,
            Limit_Reservation_For   :Number,
            // Bed_only_Price          :Number,
            // Bed_breakfast_Price             :Number,
            // Half_board_Price                :Number,
            // Full_board_Price                :Number,
            // Soft_allinclusive_Price         :Number,
            // Ultra_Price                     :Number,
            // Addon_Child_Percentage_Price    :Number,
            // // Bed_only_Cost           :Number,
            // Bed_breakfast_Cost              :Number,
            // Half_board_Cost                 :Number,
            // Full_board_Cost                 :Number,
            // Soft_allinclusive_Cost          :Number,
            // Ultra_Cost                      :Number,
            // Addon_Child_Percentage_Cost     :Number,
            // Basic_Plan                      :String,
            Date                    :Date,
            ByEmployee_Code         :Number,
            Hotel_Rooms                :[{
                Room_From   : Date,
                Room_To     : Date,
                Room_Count  :Number,

                Basic_Plan                             :String,
                Addon_Child_Percentage_Price           :Number,
                Addon_Child_Percentage_Cost            :Number,

                Single_Bed_breakfast_Price             :Number,
                Single_Half_board_Price                :Number,
                Single_Full_board_Price                :Number,
                Single_Soft_allinclusive_Price         :Number,
                Single_Ultra_Price                     :Number,
                Single_Bed_breakfast_Cost              :Number,
                Single_Half_board_Cost                 :Number,
                Single_Full_board_Cost                 :Number,
                Single_Soft_allinclusive_Cost          :Number,
                Single_Ultra_Cost                      :Number,

                Double_Bed_breakfast_Price             :Number,
                Double_Half_board_Price                :Number,
                Double_Full_board_Price                :Number,
                Double_Soft_allinclusive_Price         :Number,
                Double_Ultra_Price                     :Number,
                Double_Bed_breakfast_Cost              :Number,
                Double_Half_board_Cost                 :Number,
                Double_Full_board_Cost                 :Number,
                Double_Soft_allinclusive_Cost          :Number,
                Double_Ultra_Cost                      :Number,

                Triple_Bed_breakfast_Price             :Number,
                Triple_Half_board_Price                :Number,
                Triple_Full_board_Price                :Number,
                Triple_Soft_allinclusive_Price         :Number,
                Triple_Ultra_Price                     :Number,
                Triple_Bed_breakfast_Cost              :Number,
                Triple_Half_board_Cost                 :Number,
                Triple_Full_board_Cost                 :Number,
                Triple_Soft_allinclusive_Cost          :Number,
                Triple_Ultra_Cost                      :Number,
                
                Room_Details:[{
                    RoomType_Code                 :Number, 
                    RoomView_Code                 :Number,
                    Count                         :Number,
                    Max_Capacity_Single_Room_Adult:Number, 
                    Max_Capacity_Single_Room_Child:Number, 
                    Max_Capacity_Double_Room_Adult:Number,
                    Max_Capacity_Double_Room_Child:Number, 
                    Max_Capacity_Triple_Room_Adult:Number,
                    Max_Capacity_Triple_Room_Child:Number,
                    Price_Single_Room             :Number,
                    Price_Double_Room             :Number,
                    Price_Triple_Room             :Number,
                    Price_Child                   :Number,
                    Cost_Single_Room              :Number,
                    Cost_Double_Room              :Number,
                    Cost_Triple_Room              :Number,
                    Cost_Child                    :Number,
                }],
            }],
        }],
       
        Hotel_Bank_Name                 :String,
        Hotel_Bank_Account_Number       :String,
        Hotel_Bank_Account_Holder_Name  :String,
        Hotel_Bank_IBAN_Number          :String,
        Hotel_IsActive                  :Number,

},{
    toObject: { virtuals: true },
    toJSON: { virtuals: true }
});

Btw_HotelSchema.virtual('City',{
    ref: 'btw_city',
    localField: 'Hotel_City',
    foreignField: 'City_Code',
    justOne: false // for many-to-1 relationships
});


Btw_HotelSchema.virtual('Employee',{
    ref: 'btw_employee',
    localField: 'Hotel_Contract.ByEmployee_Code',
    foreignField: 'Employee_Code',
    justOne: false // for many-to-1 relationships
});

Btw_HotelSchema.virtual('RoomType',{
    ref: 'btw_room_type',
    localField: 'Hotel_Contract.Hotel_Rooms.Room_Details.RoomType_Code',
    foreignField: 'RoomType_Code',
    justOne: false // for many-to-1 relationships
});


Btw_HotelSchema.virtual('RoomView',{
    ref: 'btw_room_view',
    localField: 'Hotel_Contract.Hotel_Rooms.Room_Details.RoomView_Code',
    foreignField: 'RoomView_Code',
    justOne: false // for many-to-1 relationships
});

var Hotels = module.exports = mongoose.model('btw_hotel', Btw_HotelSchema);


module.exports.getLastCode = function(callback){
    
    Hotels.findOne({},callback).sort({Hotel_Code:-1});
}