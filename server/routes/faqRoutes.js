const { Router } = require('express');
const faqController = require('../controllers/faqController');
const { authenticateUser, authorizeRoles } = require('../middleware/auth');

const router = Router();

router.get('/', faqController.getFAQs);
router.get('/categories', faqController.getCategories);
router.get('/search', faqController.searchFAQs);
router.get('/trending', faqController.getTrending);
router.get('/:id', faqController.getFaqById);

router.post('/', authenticateUser, authorizeRoles('admin', 'super_admin'), faqController.createFaq);
router.put('/:id', authenticateUser, authorizeRoles('admin', 'super_admin'), faqController.updateFaq);
router.delete('/:id', authenticateUser, authorizeRoles('admin', 'super_admin'), faqController.deleteFaq);

module.exports = router;
