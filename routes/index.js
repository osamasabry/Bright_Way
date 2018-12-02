var express = require('express');
var router = express.Router();

var EmployeeController  = require('../Controller/employeeController');
var OfficeController   = require('../Controller/officeController');
var SetUpController = require('../Controller/setupController');
var CustomerController = require('../Controller/customerController');
// var MediaController = require('../Controller/mediaController');
// var CustomerController = require('../Controller/customerController');
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


/****************User****************/
router.post('/addUser', type,function(req, res) {
    var AddUser = async (function (){
        UserController.addUser(req,res);
    });
    AddUser();
});


router.post('/editUser', type,function(req, res) {
    var EditUser = async (function (){
        await (UserController.editUser(req,res));
    });
    EditUser();
});

router.get('/getAllUsers', type,function(req, res) {
    var GetAllUsers= async (function (){
        await (UserController.getAllUsers(req,res));
    });
    GetAllUsers();
});

router.get('/getActiveUsers', type,function(req, res) {
    var GetActiveUsers= async (function (){
        await (UserController.getActiveUsers(req,res));
    });
    GetActiveUsers();
});

/****************Tag****************/


router.post('/addTag', type,function(req, res) {
    var AddTag = async (function (){
        TagController.addTag(req,res);
    });
    AddTag();
});


router.post('/editTag', type,function(req, res) {
    var EditTag = async (function (){
        await (TagController.editTag(req,res));
    });
    EditTag();
});

router.get('/getAllTags', type,function(req, res) {
    var GetAllTags= async (function (){
        await (TagController.getAllTags(req,res));
    });
    GetAllTags();
});

router.get('/getActiveTags', type,function(req, res) {
    var GetActiveTags= async (function (){
        await (TagController.getActiveTags(req,res));
    });
    GetActiveTags();
});

/****************Category****************/

router.post('/addCategory', type,function(req, res) {
    var AddCategory = async (function (){
        CategoryController.addCategory(req,res);
    });
    AddCategory();
});


router.post('/editCategory', type,function(req, res) {
    var EditCategory = async (function (){
        await (CategoryController.editCategory(req,res));
    });
    EditCategory();
});

router.get('/getCategories', type,function(req, res) {
    var GetAllCategories= async (function (){
        await (CategoryController.getAllCategories(req,res));
    });
    GetAllCategories();
});

router.get('/getActiveCategories', type,function(req, res) {
    var GetActiveCategories= async (function (){
        await (CategoryController.getActiveCategories(req,res));
    });
    GetActiveCategories();
});


/****************Posts****************/

router.post('/addPost', type,function(req, res) {
    var AddPost = async (function (){
        PostController.addPost(req,res);
    });
    AddPost();
});

router.post('/editPosts', type,function(req, res) {
    var EditPost = async (function (){
        await (PostController.editPost(req,res));
    });
    EditPost();
});

router.get('/getPosts', type,function(req, res) {
    var GetAllPosts= async (function (){
        await (PostController.getAllPosts(req,res));
    });
    GetAllPosts();
});

router.get('/getActivePosts', type,function(req, res) {
    var GetActivePosts= async (function (){
        await (PostController.getActivePosts(req,res));
    });
    GetActivePosts();
});

router.get('/getPostByID', type,function(req, res) {
    var GetPostByID= async (function (){
        await (PostController.getPostByID(req,res));
    });
    GetPostByID();
});

router.get('/getPostByTitle', type,function(req, res) {
    var GetPostByTitle= async (function (){
        await (PostController.getPostByTitle(req,res));
    });
    GetPostByTitle();
});


/****************Media****************/

router.post('/addMedia', type,function(req, res) {
    // console.log(req.file);
    var AddMedia = async (function (){
        MediaController.addMedia(req,res);
    });
    AddMedia();
});

router.post('/editMedia', type,function(req, res) {
    var EditMedia = async (function (){
        await (MediaController.editMedia(req,res));
    });
    EditMedia();
});

router.get('/getMediaByID', type,function(req, res) {
    var GetMediaByID= async (function (){
        await (MediaController.getMediaByID(req,res));
    });
    GetMediaByID();
});

module.exports = router;
