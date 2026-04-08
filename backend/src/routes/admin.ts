import express from 'express';
import { getAllUsers, getUserById } from '../controllers/userController';
import { 
    getStats, getAnalytics, 
    getUniversities, addUniversity, deleteUniversity,
    getCountries, addCountry, deleteCountry,
    getApplicationsTracker, updateApplicationStatus 
} from '../controllers/adminController';
import { verifyToken, requireRole } from '../middleware/auth';

const router = express.Router();

// All admin routes require authentication + admin role
router.use(verifyToken, requireRole(['admin']));

// Users
router.get('/users', getAllUsers);
router.get('/users/:id', getUserById);

// Stats & Analytics
router.get('/stats', getStats);
router.get('/analytics', getAnalytics);

// Universities
router.get('/university', getUniversities);
router.post('/university', addUniversity);
router.delete('/university/:id', deleteUniversity);

// Countries
router.get('/country', getCountries);
router.post('/country', addCountry);
router.delete('/country/:id', deleteCountry);

// Applications
router.get('/application', getApplicationsTracker);
router.put('/application/:id/status', updateApplicationStatus);

export default router;
