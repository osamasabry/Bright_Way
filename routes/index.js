var express = require('express');
var router = express.Router();

var EmployeeController  = require('../Controller/employeeController');
var OfficeController   = require('../Controller/officeController');
var SetUpController = require('../Controller/setupController');
var CustomerController = require('../Controller/customerController');
var HotelController = require('../Controller/hotelController');
var ReservationController = require('../Controller/reservationController');
// var SearchController = require('../Controller/searchController');

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
        console.log('req.body');
        var SearchEmployee= async (function (){
            await (EmployeeController.searchEmployee(req,res));
        });
        SearchEmployee();
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

    router.get('/getAllHotels', type,function(req, res) {
        var GetAllHotels= async (function (){
            await (HotelController.getAllHotels(req,res));
        });
        GetAllHotels();
    });

    router.get('/getHotelByID', type,function(req, res) {
        var GetHotelByID= async (function (){
            await (HotelController.getHotelByID(req,res));
        });
        GetHotelByID();
    });


/*****************Reservation Rooms************************************/

    router.post('/checkDate', type,function(req, res) {
        var CheckDate= async (function (){
            await (ReservationController.checkDate(req,res));
        });
        CheckDate();
    });

    router.post('/addReservation', type,function(req, res) {
        var AddReservation= async (function (){
            await (ReservationController.addReservation(req,res));
        });
        AddReservation();
    });

module.exports = router;
