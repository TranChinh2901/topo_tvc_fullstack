const express = require('express');
const { registerController, loginController, getAllUsers, getUserById, deleteUser, updateUserController, countUser, logoutController } = require('../controllers/userController');
const { requireSignIn, isAdmin } = require('../middleware/middleware');
const router = express.Router();

router.post('/register', registerController)
router.post('/login', loginController)
router.get('/users', getAllUsers)
router.get('/users/:id', getUserById)
router.delete('/delete/user/:id', deleteUser)
router.put('/update/user/:id', updateUserController)
router.get('/countUser', countUser)
router.post('/logout', logoutController)

router.get('/user-auth', requireSignIn, (req, res) => {
    res.status(200).send({ ok: true });
})

router.get('/admin-auth', requireSignIn, isAdmin, (req, res) => {
    res.status(200).send({ ok: true });
})

module.exports = router