/**
 * 📦 Services Index
 * Central export point for all services
 */

// Main Appwrite Services
export {
  categoriesService,
  subjectsService,
  fileTypesService,
  materialsService,
  usersService,
  userProfilesService,
  bookmarksService,
  downloadsService,
  storageService,
  statisticsService
} from './appwriteService';

// Auth Service
export { authService } from './authService';

// Hierarchy Service
export { hierarchyService } from './hierarchyService';

// Legacy Services (for backward compatibility)
export { databaseService } from './databaseService';
export { default as DatabaseService } from '../config/DatabaseService';

// Default export
export { default } from './appwriteService';
