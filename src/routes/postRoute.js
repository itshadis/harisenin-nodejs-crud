const express = require('express');
const { craetePost, getAllPost, getPostsByUsername, updatePost, deletePost, getPostById, } = require('../controllers/postController');
const { verifyToken } = require('../middlewares/verifyToken');

const router = express.Router();

router.get('/', getAllPost);
router.get('/:username', getPostsByUsername);
router.get('/detail/:id', getPostById);
router.post('/createpost', verifyToken, craetePost);
router.put('/update/:id', verifyToken, updatePost);
router.delete('/delete/:id', verifyToken, deletePost);

module.exports = router;