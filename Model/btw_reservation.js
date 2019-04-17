var mongoose = require('mongoose');

var Btw_ReservationSchema = mongoose.Schema({
   
		Reservation_Code                        :Number,
        Reservation_Customer_ID                 :Number,
        Reservation_Date                        :Date,
        Reservation_Hotel_ID                    :Number,
        Reservation_Date_From                   :Date,
        Reservation_Date_To                     :Date, 
        Reservation_Number_of_Adult             :Number,
        Reservation_Number_of_Child             :Number,

        Reservation_Room        :[{
            Count           : Number,
            Nights_Count    : Number,
            View            : Number,
            Type            : Number,
            SNTType         : Number,
            Price           : Number,
            Adult           : Number,
            Child           : Number,
            Free_Child      : Number,
            Addons          : String,
            Price_Child     : Number,
            Price_Adult     : Number,
            Cost            : Number,
            Cost_Child      : Number,
            Cost_Adult      : Number,
            Note            : String,

        },{
            toJSON: { virtuals: true }
        }],
        Reservation_ByEmployee_ID               :Number,
        Reservation_Office_ID                   :Number, 
        Reservation_Grand_Total                 :Number, 
        Reservation_Grand_Total_Cost            :Number, 
        Reservation_Payment             :[{
            Receipt_Number      :Number,
            Date                :Date,
            Type_Code           :Number,
            Ammount             :Number,
            CC_Transaction_Code :String,
        }],
        Reservation_TransportationFrom_City_ID :Number,
        Reservation_Place_To_Move              :String,
        Reservation_Time_To_Move               :String,

        Reservation_Discount                    :Number,
        Reservation_Number_of_Chair_InPackage   :Number,
        Reservation_Chair_Price_InPackage       :Number,
        Reservation_Number_of_Chair_OutPackage  :Number,
        Reservation_Chair_Price_OutPackage      :Number,
        Reservation_Note                        :String,
        Reservation_Status                      :Number,

},{
    toJSON: { virtuals: true }
});
Btw_ReservationSchema.virtual('TransportationFromCity',{
    ref: 'btw_city',
    localField: 'Reservation_TransportationFrom_City_ID',
    foreignField: 'City_Code',
    justOne: false // for many-to-1 relationships
});
Btw_ReservationSchema.virtual('RoomType',{
    ref: 'btw_room_type',
    localField: 'Reservation_Room.Type',
    foreignField: 'RoomType_Code',
    justOne: false // for many-to-1 relationships
});
Btw_ReservationSchema.virtual('RoomView',{
    ref: 'btw_room_view',
    localField: 'Reservation_Room.View',
    foreignField: 'RoomView_Code',
    justOne: false // for many-to-1 relationships
});
Btw_ReservationSchema.virtual('Office',{
    ref: 'btw_office',
    localField: 'Reservation_Office_ID',
    foreignField: 'Office_Code',
    justOne: false // for many-to-1 relationships
});


Btw_ReservationSchema.virtual('Customer',{
    ref: 'btw_customer',
    localField: 'Reservation_Customer_ID',
    foreignField: 'Customer_Code',
    justOne: false // for many-to-1 relationships
});

Btw_ReservationSchema.virtual('Hotel',{
    ref: 'btw_hotel',
    localField: 'Reservation_Hotel_ID',
    foreignField: 'Hotel_Code',
    justOne: false // for many-to-1 relationships
});

Btw_ReservationSchema.virtual('Employee',{
    ref: 'btw_employee',
    localField: 'Reservation_ByEmployee_ID',
    foreignField: 'Employee_Code',
    justOne: false // for many-to-1 relationships
});

var Reservation = module.exports = mongoose.model('btw_reservation', Btw_ReservationSchema);



module.exports.getLastCode = function(callback){
    Reservation.findOne({},callback).sort({Reservation_Code:-1});
}

