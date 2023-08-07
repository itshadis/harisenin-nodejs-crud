const express = require('express');
const { create, login, update, deleteUser, uploadPic, changePassword } = require('../controllers/userController');
const { verifyToken } = require('../middlewares/verifyToken');
const multer = require('multer');

const uploadFotoDir = `${process.cwd()}/uploads`; 
const uploadDocDir = `${process.cwd()}/documents`;
const uploadFoto = multer({dest: uploadFotoDir});
const uploadDoc = multer({dest: uploadDocDir});

const router = express.Router();

router.post('/register', create);
router.post('/login', login);
router.put('/update', verifyToken, update);
router.delete('/delete', verifyToken, deleteUser);
router.post('/uploadfoto', verifyToken, uploadFoto.single('profilepic'), uploadPic);
router.put('/changepassword', verifyToken, changePassword);

module.exports = router;