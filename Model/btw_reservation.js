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
            View            : Number,
            Type            : Number,
            SNTType         : Number,
            Price           : Number,
            Adult           : Number,
            Child           : Number,
        },{
            toJSON: { virtuals: true }
        }],
        Reservation_ByEmployee_ID               :Number,
        Reservation_Office_ID                   :Number, 
        Reservation_Grand_Total                 :Number, 
        Reservation_Payment             :[{
            Date        :Date,
            Type_ID     :Number,
            Ammount     :Number,
            Payment_Code:String,
        }],

        Reservation_Number_of_Chair             :Number,
        Reservation_Chair_Price                 :Number,
},{
    toJSON: { virtuals: true }
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