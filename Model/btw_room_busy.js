var mongoose = require('mongoose');

var Btw_RoomBusySchema = mongoose.Schema({
   
		RoomBusy_Date           :Date,
        RoomBusy_HotelID        :Number,
        RoomBusy_Details 		:[{
            Type            :Number,
			View            :Number,
			Count               :Number,
         // ReservationID       :Number,

        }],
        RoomBusy_Count:Number,

},{
    toJSON: { virtuals: true }
});

Btw_RoomBusySchema.virtual('Hotel',{
    ref: 'btw_hotel',
    localField: 'RoomBusy_HotelID',
    foreignField: 'Hotel_Code',
    justOne: false // for many-to-1 relationships
});


Btw_RoomBusySchema.virtual('RoomType',{
    ref: 'btw_room_type',
    localField: 'RoomBusy_Details.RoomType',
    foreignField: 'RoomType_Code',
    justOne: false // for many-to-1 relationships
});



Btw_RoomBusySchema.virtual('RoomView',{
    ref: 'btw_room_view',
    localField: 'RoomBusy_Details.RoomView',
    foreignField: 'RoomView_Code',
    justOne: false // for many-to-1 relationships
});

Btw_RoomBusySchema.virtual('Reservation',{
    ref: 'btw_reservation',
    localField: 'RoomBusy_Details.ReservationID',
    foreignField: 'Reservation_Code',
    justOne: false // for many-to-1 relationships
});

var RoomBusy = module.exports = mongoose.model('btw_room_busy', Btw_RoomBusySchema);



// module.exports.getLastCode = function(callback){
    
//     RoomBusy.findOne({},callback).sort({Customer_Code:-1});
// }