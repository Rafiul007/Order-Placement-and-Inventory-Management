const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

// POST route to create a super admin
router.post('/superAdmin', userController.createSuperAdmin);

module.exports = router;
