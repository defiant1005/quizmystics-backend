const Router = require('express');
const router = new Router();
const questionsController = require('../controllers/questionsController')
const checkRole = require('../middleware/checkRoleMiddleware')


router.post('/', checkRole(2), questionsController.createQuestion)
router.get('/', questionsController.getAllQuestion)
router.get('/:id', questionsController.getOneQuestion)
router.delete('/', checkRole(2), questionsController.deleteQuestion)

module.exports = router