const router = require('express').Router();
const {getAll, getUser, getAbility} = require('../controllers/user');
const {auth} = require('../middleware/index');

router.get('/ability', getAbility);
router.get('/', auth, getAll);
router.get('/:id', auth, getUser);

module.exports = router;