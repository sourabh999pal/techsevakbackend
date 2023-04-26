const express = require('express');
const router = express.Router();
const userCtrl = require('../controllers/userController');
const jwtAuth = require('../middleware/middleware');

const upload = require('../middleware/multer');

// passport setup for authentication //
var passport = require('passport');
require('../middleware/passport')(passport)

var bodyParser = require('body-parser')

router.use(bodyParser.urlencoded({extended:false}));


router.get('/', (req , resp)=>{
  resp.send('hello')
});

router.get('/getkey', (req , resp)=>{
  resp.status(200).json({ key: process.env.RAZORPAY_API_KEY , status:200})
});

router.post('/checkout',userCtrl.checkOut);

router.get('/list', passport.authenticate('jwt',{session:false}), userCtrl.userList);

router.get('/userdata/:id', userCtrl.userData);

router.get('/userServiceList/:id', userCtrl.userServiceList);

router.get('/userInstallationList/:id', userCtrl.userInstallationList);

router.get('/userpayment/:id', userCtrl.userPaymentList);

router.post('/add', userCtrl.userAdd);

router.post('/googlelogin',userCtrl.googleLogin);

router.post('/sendotp', userCtrl.sendOtp);

router.post('/emailsendotp', userCtrl.emailOtpsend);

router.post('/registerotp', userCtrl.registerOtp);

router.post('/changepassword', userCtrl.changepassword);

router.post('/verifyotp', userCtrl.verifyOtp);

router.post('/login',userCtrl.userLogin);



router.post('/paymentverfication/:id',userCtrl.paymentVerification);


const cpUpload = upload.upload.fields([{ name: 'invoice', maxCount: 1 }, { name: 'issue_image', maxCount: 4 }, { name: 'under_warranty', maxCount: 1 }])
router.post('/update/:id' , userCtrl.userUpdate);

// router.post('/update', upload.upload , userCtrl.userUpdate);


module.exports = router;