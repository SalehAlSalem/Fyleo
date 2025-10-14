import { 
  categoriesService, 
  subjectsService, 
  materialsService 
} from './appwriteService';

/**
 * 🏗️ Hierarchy Service
 * Manages hierarchical relationships: Categories → Subjects → Materials
 */

export const hierarchyService = {
  /**
   * Get complete hierarchy with all categories, subjects, and materials
   */
  async getCompleteHierarchy() {
    try {
      console.log('📊 Fetching complete hierarchy...');
      
      // Fetch all data in parallel
      const [categories, subjects, materials] = await Promise.all([
        categoriesService.getAll(),
        subjectsService.getAll(),
        materialsService.getAll(1000) // Get more materials
      ]);

      console.log('✅ Data fetched:', {
        categories: categories.length,
        subjects: subjects.length,
        materials: materials.total || materials.documents?.length || 0
      });

      // Build hierarchy
      const hierarchy = categories.map(category => {
        // Find subjects for this category
        const categorySubjects = subjects.filter(
          subject => subject.categoryId === category.$id
        );

        // For each subject, find its materials
        const subjectsWithMaterials = categorySubjects.map(subject => {
          const subjectMaterials = (materials.documents || materials).filter(
            material => material.subjectId === subject.$id
          );

          return {
            ...subject,
            materials: subjectMaterials,
            materialsCount: subjectMaterials.length
          };
        });

        return {
          ...category,
          subjects: subjectsWithMaterials,
          subjectsCount: subjectsWithMaterials.length,
          materialsCount: subjectsWithMaterials.reduce(
            (sum, subject) => sum + subject.materialsCount, 
            0
          )
        };
      });

      console.log('✅ Hierarchy built successfully');
      return hierarchy;
    } catch (error) {
      console.error('❌ Error building hierarchy:', error);
      throw error;
    }
  },

  /**
   * Get category with its subjects and materials
   */
  async getCategoryHierarchy(categoryId) {
    try {
      console.log('📊 Fetching category hierarchy for:', categoryId);
      
      const [category, subjects] = await Promise.all([
        categoriesService.getById(categoryId),
        subjectsService.getByCategory(categoryId)
      ]);

      // Get materials for all subjects in this category
      const materialsPromises = subjects.map(subject =>
        materialsService.getBySubject(subject.$id)
      );
      
      const materialsArrays = await Promise.all(materialsPromises);

      // Combine subjects with their materials
      const subjectsWithMaterials = subjects.map((subject, index) => ({
        ...subject,
        materials: materialsArrays[index],
        materialsCount: materialsArrays[index].length
      }));

      return {
        ...category,
        subjects: subjectsWithMaterials,
        subjectsCount: subjectsWithMaterials.length,
        materialsCount: subjectsWithMaterials.reduce(
          (sum, subject) => sum + subject.materialsCount,
          0
        )
      };
    } catch (error) {
      console.error('❌ Error fetching category hierarchy:', error);
      throw error;
    }
  },

  /**
   * Get subject with its materials and parent category
   */
  async getSubjectHierarchy(subjectId) {
    try {
      console.log('📊 Fetching subject hierarchy for:', subjectId);
      
      const [subject, materials] = await Promise.all([
        subjectsService.getById(subjectId),
        materialsService.getBySubject(subjectId)
      ]);

      // Get parent category
      const category = await categoriesService.getById(subject.categoryId);

      return {
        ...subject,
        category: category,
        materials: materials,
        materialsCount: materials.length
      };
    } catch (error) {
      console.error('❌ Error fetching subject hierarchy:', error);
      throw error;
    }
  },

  /**
   * Get material with its parent subject and category
   */
  async getMaterialHierarchy(materialId) {
    try {
      console.log('📊 Fetching material hierarchy for:', materialId);
      
      const material = await materialsService.getById(materialId);
      
      // Get parent subject and category
      const [subject, category] = await Promise.all([
        subjectsService.getById(material.subjectId),
        categoriesService.getById(material.categoryId)
      ]);

      return {
        ...material,
        subject: subject,
        category: category
      };
    } catch (error) {
      console.error('❌ Error fetching material hierarchy:', error);
      throw error;
    }
  },

  /**
   * Get categories with subject counts
   */
  async getCategoriesWithCounts() {
    try {
      const [categories, subjects, materials] = await Promise.all([
        categoriesService.getAll(),
        subjectsService.getAll(),
        materialsService.getAll(1000)
      ]);

      return categories.map(category => {
        const categorySubjects = subjects.filter(
          s => s.categoryId === category.$id
        );
        
        const categoryMaterials = (materials.documents || materials).filter(
          m => m.categoryId === category.$id
        );

        return {
          ...category,
          subjectsCount: categorySubjects.length,
          materialsCount: categoryMaterials.length
        };
      });
    } catch (error) {
      console.error('❌ Error fetching categories with counts:', error);
      throw error;
    }
  },

  /**
   * Get subjects with material counts
   */
  async getSubjectsWithCounts(categoryId = null) {
    try {
      const subjects = categoryId 
        ? await subjectsService.getByCategory(categoryId)
        : await subjectsService.getAll();

      const materialsPromises = subjects.map(subject =>
        materialsService.getBySubject(subject.$id)
      );
      
      const materialsArrays = await Promise.all(materialsPromises);

      return subjects.map((subject, index) => ({
        ...subject,
        materialsCount: materialsArrays[index].length
      }));
    } catch (error) {
      console.error('❌ Error fetching subjects with counts:', error);
      throw error;
    }
  },

  /**
   * Search across hierarchy
   */
  async searchHierarchy(searchTerm) {
    try {
      console.log('🔍 Searching hierarchy for:', searchTerm);
      
      // Search in materials (most specific)
      const materials = await materialsService.search(searchTerm);

      // Get unique subject and category IDs from materials
      const subjectIds = [...new Set(materials.map(m => m.subjectId))];
      const categoryIds = [...new Set(materials.map(m => m.categoryId))];

      // Fetch related subjects and categories
      const [subjects, categories] = await Promise.all([
        Promise.all(subjectIds.map(id => subjectsService.getById(id).catch(() => null))),
        Promise.all(categoryIds.map(id => categoriesService.getById(id).catch(() => null)))
      ]);

      // Filter out nulls
      const validSubjects = subjects.filter(s => s !== null);
      const validCategories = categories.filter(c => c !== null);

      return {
        materials,
        subjects: validSubjects,
        categories: validCategories,
        totalResults: materials.length
      };
    } catch (error) {
      console.error('❌ Error searching hierarchy:', error);
      throw error;
    }
  },

  /**
   * Get breadcrumb path for a material
   */
  async getBreadcrumb(materialId) {
    try {
      const material = await materialsService.getById(materialId);
      const [subject, category] = await Promise.all([
        subjectsService.getById(material.subjectId),
        categoriesService.getById(material.categoryId)
      ]);

      return [
        { type: 'category', id: category.$id, name: category.nameEn, nameAr: category.nameAr },
        { type: 'subject', id: subject.$id, name: subject.nameEn, nameAr: subject.nameAr },
        { type: 'material', id: material.$id, name: material.title }
      ];
    } catch (error) {
      console.error('❌ Error getting breadcrumb:', error);
      throw error;
    }
  }
};

export default hierarchyService;
