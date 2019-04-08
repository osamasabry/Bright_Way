var express = require('express');
var router = express.Router();

var EmployeeController  = require('../Controller/employeeController');
var OfficeController   = require('../Controller/officeController');
var SetUpController = require('../Controller/setupController');
var CustomerController = require('../Controller/customerController');
var HotelController = require('../Controller/hotelController');
var ReservationController = require('../Controller/reservationController');
var SearchController = require('../Controller/searchController');
var BusController = require('../Controller/busController');
var BusDailyPassengersController = require('../Controller/busDailyPassengerController');
var SystemSettingsController = require('../Controller/systemSettingController');
var ReportController = require('../Controller/reportController');


var passport = require('passport');
var multer=require('multer');
var upload=multer({dest:'uploads/'});
var type=upload.single('image');
var async = require('asyncawait/async');
var await = require('asyncawait/await');



router.get('/logout', function(request, response) {
	request.logout();
	response.redirect('/');
});


router.post('/login', type,function(req, res, next) {
      passport.authenticate('login', function(err, user, info) {
        if (err) { return next(err); }
        if (!user) { return res.send(info); }
        req.logIn(user, function(err) {
          if (err) { return next(info); }
          return res.send(user);
        });
      })(req, res, next);
});


/****************Setup ****************/

    router.get('/getPaymentMethods', type,function(req, res) {
        var GetPaymentMethods= async (function (){
            await (SetUpController.getPaymentMethods(req,res));
        });
        GetPaymentMethods();
    });

    router.get('/getSystemSettings', type,function(req, res) {
        var GetSystemSettings= async (function (){
            await (SetUpController.getSystemSettings(req,res));
        });
        GetSystemSettings();
    });

    router.get('/getRoomTypes', type,function(req, res) {
        var GetRoomTypes= async (function (){
            await (SetUpController.getRoomTypes(req,res));
        });
        GetRoomTypes();
    });

    router.get('/getRoomViews', type,function(req, res) {
        var GetRoomViews= async (function (){
            await (SetUpController.getRoomViews(req,res));
        });
        GetRoomViews();
    });

    router.get('/getCities', type,function(req, res) {
        var GetCities= async (function (){
            await (SetUpController.getCities(req,res));
        });
        GetCities();
    });

    router.get('/getActiveCities', type,function(req, res) {
        var GetActiveCities= async (function (){
            await (SetUpController.getActiveCities(req,res));
        });
        GetActiveCities();
    });

    router.post('/addCity', type,function(req, res) {
        var AddCity = async (function (){
            SetUpController.addCity(req,res);
        });
        AddCity();
    });

    router.post('/editCity', type,function(req, res) {
        var EditCity = async (function (){
            SetUpController.editCity(req,res);
        });
        EditCity();
    });

     router.get('/getTransportationMethod', type,function(req, res) {
        var GetTransportationMethod= async (function (){
            await (SetUpController.getTransportationMethod(req,res));
        });
        GetTransportationMethod();
    });

/****************Office****************/


    router.post('/addOffice', type,function(req, res) {
        var AddOffice = async (function (){
            OfficeController.addOffice(req,res);
        });
        AddOffice();
    });


    router.post('/editOffice', type,function(req, res) {
        var EditOffice = async (function (){
            await (OfficeController.editOffice(req,res));
        });
        EditOffice();
    });

    router.get('/getAllOffice', type,function(req, res) {
        var GetAllOffice= async (function (){
            await (OfficeController.getAllOffice(req,res));
        });
        GetAllOffice();
    });

    router.get('/getActiveOffice', type,function(req, res) {
        var GetActiveOffice= async (function (){
            await (OfficeController.getActiveOffice(req,res));
        });
        GetActiveOffice();
    });

    router.post('/searchOffice', type,function(req, res) {
        var SearchOffice= async (function (){
            await (OfficeController.searchOffice(req,res));
        });
        SearchOffice();
    });


/****************Customer****************/

    router.post('/addCustomer', type,function(req, res) {
        var AddCustomer = async (function (){
            CustomerController.addCustomer(req,res);
        });
        AddCustomer();
    });


    router.post('/editCustomer', type,function(req, res) {
        var EditCustomer = async (function (){
            await (CustomerController.editCustomer(req,res));
        });
        EditCustomer();
    });

    router.get('/getAllCustomer', type,function(req, res) {
        var GetAllCustomer= async (function (){
            await (CustomerController.getAllCustomer(req,res));
        });
        GetAllCustomer();
    });

    router.post('/searchCustomer', type,function(req, res) {
        var SearchCustomer= async (function (){
            await (CustomerController.searchCustomer(req,res));
        });
        SearchCustomer();
    });



/****************Employee****************/

    router.post('/addEmployee', type,function(req, res) {
        var AddEmployee = async (function (){
            EmployeeController.addEmployee(req,res);
        });
        AddEmployee();
    });

    router.post('/editEmployee', type,function(req, res) {
        var EditEmployee = async (function (){
            await (EmployeeController.editEmployee(req,res));
        });
        EditEmployee();
    });

    router.get('/getAllEmployee', type,function(req, res) {
        var GetAllEmployee= async (function (){
            await (EmployeeController.getAllEmployee(req,res));
        });
        GetAllEmployee();
    });


    router.post('/searchEmployee', type,function(req, res) {
        var SearchEmployee= async (function (){
            await (EmployeeController.searchEmployee(req,res));
        });
        SearchEmployee();
    });

    router.post('/editEmployeePermissions', type,function(req, res) {
        var EditEmployeePermissions= async (function (){
            await (EmployeeController.editEmployeePermissions(req,res));
        });
        EditEmployeePermissions();
    });
    
/****************Hotel****************/

    router.post('/addHotel', type,function(req, res) {
        var AddHotel = async (function (){
            HotelController.addHotel(req,res);
        });
        AddHotel();
    });

    router.post('/editHotel', type,function(req, res) {
        var EditHotel = async (function (){
            await (HotelController.editHotel(req,res));
        });
        EditHotel();
    });
    
    router.post('/editHotelContact', type,function(req, res) {
        var EditHotelContact = async (function (){
            await (HotelController.editHotelContact(req,res));
        });
        EditHotelContact();
    });

    router.post('/editHotelContractBasicInfo', type,function(req, res) {
        var EditHotelContractBasicInfo = async (function (){
            await (HotelController.editHotelContractBasicInfo(req,res));
        });
        EditHotelContractBasicInfo();
    });

    router.post('/addHotelContractRoom', type,function(req, res) {
        var AddHotelContractRoom = async (function (){
            await (HotelController.addHotelContractRoom(req,res));
        });
        AddHotelContractRoom();
    });

    router.post('/editHotelContractRoom', type,function(req, res) {
        var EditHotelContractRoom = async (function (){
            await (HotelController.editHotelContractRoom(req,res));
        });
        EditHotelContractRoom();
    });

    router.post('/addHotelContractRoomDetails', type,function(req, res) {
        var AddHotelContractRoomDetails = async (function (){
            await (HotelController.addHotelContractRoomDetails(req,res));
        });
        AddHotelContractRoomDetails();
    });

    router.post('/editHotelContractRoomDetails', type,function(req, res) {
        var EditHotelContractRoomDetails = async (function (){
            await (HotelController.editHotelContractRoomDetails(req,res));
        });
        EditHotelContractRoomDetails();
    });

    router.get('/getAllHotels', type,function(req, res) {
        var GetAllHotels= async (function (){
            await (HotelController.getAllHotels(req,res));
        });
        GetAllHotels();
    });

    router.post('/getHotelByID', type,function(req, res) {
        var GetHotelByID= async (function (){
            await (HotelController.getHotelByID(req,res));
        });
        GetHotelByID();
    });

    router.post('/getHotelContractByID', type,function(req, res) {
        var GetHotelContractByID= async (function (){
            await (HotelController.getHotelContractByID(req,res));
        });
        GetHotelContractByID();
    });


/*****************Reservation Rooms************************************/

    router.post('/checkDate', type,function(req, res) {
        var CheckDate= async (function (){
            await (ReservationController.checkDate(req,res));
        });
        CheckDate();
    });

    router.post('/editReservation', type,function(req, res) {
        var EditReservation= async (function (){
            await (ReservationController.editReservation(req,res));
        });
        EditReservation();
    });

    router.post('/addReservation', type,function(req, res) {
        var AddReservation= async (function (){
            await (ReservationController.addReservation(req,res));
        });
        AddReservation();
    });

    router.post('/addPayemtnReservation', type,function(req, res) {
        var AddPayemtnReservation= async (function (){
            await (ReservationController.addPayemtnReservation(req,res));
        });
        AddPayemtnReservation();
    });

    router.post('/getReservationByCustomerID', type,function(req, res) {
        var GetReservationByCustomerID= async (function (){
            await (ReservationController.getReservationByCustomerID(req,res));
        });
        GetReservationByCustomerID();
    });

    router.post('/searchReservationByID', type,function(req, res) {
        var SearchReservationByID= async (function (){
            await (ReservationController.searchReservationByID(req,res));
        });
        SearchReservationByID();
    });

/*****************Resarch Tool************************************/

    router.post('/searchData', type,function(req, res) {
        var SearchData= async (function (){
            await (SearchController.searchData(req,res));
        });
        SearchData();
    });

/*************************Buses*************************************/
    router.post('/addBus', type,function(req, res) {
        var AddBus = async (function (){
            BusController.addBus(req,res);
        });
        AddBus();
    });

    router.post('/editBus', type,function(req, res) {
        var EditBus = async (function (){
            await (BusController.editBus(req,res));
        });
        EditBus();
    });

    router.get('/getAllBuses', type,function(req, res) {
        var GetAllBuses= async (function (){
            await (BusController.getAllBuses(req,res));
        });
        GetAllBuses();
    });


    router.post('/searchBuses', type,function(req, res) {
        var SearchBuses= async (function (){
            await (BusController.searchBuses(req,res));
        });
        SearchBuses();
    });

/*************************Bus daily Passenger*************************************/
    router.post('/editBusDailyPassengers', type,function(req, res) {
        var EditBusDailyPassengers = async (function (){
            BusDailyPassengersController.editBusDailyPassengers(req,res);
        });
        EditBusDailyPassengers();
    });

    router.post('/editBusDailyPassengersGoAndBack', type,function(req, res) {
        var EditBusDailyPassengersGoAndBack = async (function (){
            BusDailyPassengersController.editBusDailyPassengersGoAndBack(req,res);
        });
        EditBusDailyPassengersGoAndBack();
    });

    router.post('/searchBusDailyPassengers', type,function(req, res) {
        var SearchBusDailyPassengers = async (function (){
            await (BusDailyPassengersController.searchBusDailyPassengers(req,res));
        });
        SearchBusDailyPassengers();
    });

    router.post('/getCustomerByBusNumber', type,function(req, res) {
        var GetCustomerByBusNumber = async (function (){
            await (BusDailyPassengersController.getCustomerByBusNumber(req,res));
        });
        GetCustomerByBusNumber();
    });
    router.post('/getCustomerForGoBus', type,function(req, res) {
        var GetCustomerForGoBus = async (function (){
            await (BusDailyPassengersController.getCustomerForGoBus(req,res));
        });
        GetCustomerForGoBus();
    });

    router.post('/getCustomerForCustomerConvenience', type,function(req, res) {
        var GetCustomerForCustomerConvenience = async (function (){
            await (BusDailyPassengersController.getCustomerForCustomerConvenience(req,res));
        });
        GetCustomerForCustomerConvenience();
    });
   
//************** System Setting **********************************
router.get('/getMasterPermisions', function(req, res) {
    var GetMasterPermisions = async (function (){
        await (SystemSettingsController.getMasterPermisions(req,res));
    });
    GetMasterPermisions();
});

/*************************Reports*************************************/
    router.post('/getReservationByHotelID', type,function(req, res) {
        var GetReservationByHotelID = async (function (){
            ReportController.getReservationByHotelID(req,res);
        });
        GetReservationByHotelID();
    });

    router.post('/getBusDailyPassengerByDate', type,function(req, res) {
        var GetBusDailyPassengerByDate = async (function (){
            ReportController.getBusDailyPassengerByDate(req,res);
        });
        GetBusDailyPassengerByDate();
    });

    router.post('/getReservationDetailsByHotelID', type,function(req, res) {
        var GetReservationDetailsByHotelID = async (function (){
            ReportController.getReservationDetailsByHotelID(req,res);
        });
        GetReservationDetailsByHotelID();
    });

    router.post('/getBusyRoom', type,function(req, res) {
        var GetBusyRoom = async (function (){
            ReportController.getBusyRoom(req,res);
        });
        GetBusyRoom();
    });

    router.post('/getBusSituation', type,function(req, res) {
        var GetBusSituation = async (function (){
            ReportController.getBusSituation(req,res);
        });
        GetBusSituation();
    });

    router.post('/getRoomingList', type,function(req, res) {
        var GetRoomingList = async (function (){
            ReportController.getRoomingList(req,res);
        });
        GetRoomingList();
    });
    
module.exports = router;
