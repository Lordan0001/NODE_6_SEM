const router = require('express').Router();
const fs = require('fs');

const {getAll, getRepo, addRepo, updRepo, delRepo} = require('../controllers/repos');
const {getCommits, getCommit, addCommit, updCommit, delCommit} = require('../controllers/commits');
const {auth} = require('../middleware/index')


router.get('/', getAll);
router.get('/:id', getRepo);
router.post('/', auth, addRepo);
router.put('/:id', auth, updRepo);
router.delete('/:id', auth, delRepo);

router.get('/:id/commits', auth, getCommits);
router.get('/:id/commits/:commitId', auth, getCommit);
router.post('/:id/commits', auth, addCommit);
router.put('/:id/commits/:commitId', auth, updCommit);
router.delete('/:id/commits/:commitId', auth, delCommit);

module.exports = router;
