import { DatabaseService } from '../config/DatabaseService';
// استخدام الكلاينت الموجود بدلاً من إنشاء كلاينت جديد

class StatsServiceClass {
    constructor() {
        this.cache = {
            data: null,
            timestamp: 0,
            duration: 60 * 60 * 1000, // ساعة واحدة كاش (بدلاً من دقيقتين)
            lastSuccessfulData: null // آخر بيانات ناجحة
        };
    }

    async getTotalUsers() {
        try {
            // محاولة جلب البيانات الحقيقية من قاعدة البيانات
            console.log('Fetching REAL total users from database...');
            const totalUsers = await DatabaseService.getTotalUsersCount();
            console.log('REAL total users fetched:', totalUsers);
            
            // تأكد من أن الرقم منطقي
            if (totalUsers && totalUsers > 0) {
                return totalUsers;
            } else {
                console.warn('Invalid user count from database, using 0');
                return 0; // بدون أرقام وهمية
            }
        } catch (error) {
            console.error('Error getting real total users:', error);
            console.log('Using 0 - no fake numbers');
            return 0; // بدون أرقام وهمية
        }
    }

    async getTotalFiles() {
        try {
            console.log('Fetching REAL total files from database...');
            const totalFiles = await DatabaseService.getTotalFilesCount();
            console.log('REAL total files fetched:', totalFiles);
            
            // تأكد من أن الرقم منطقي
            if (totalFiles && totalFiles > 0) {
                return totalFiles;
            } else {
                console.warn('Invalid file count from database, using 0');
                return 0; // بدون أرقام وهمية
            }
        } catch (error) {
            console.error('Error getting real total files:', error);
            console.log('Using 0 - no fake numbers');
            return 0; // بدون أرقام وهمية
        }
    }

    async getFormattedStatsWithCache() {
        const now = Date.now();
        
        // التحقق من صلاحية الكاش
        if (this.cache.data && (now - this.cache.timestamp) < this.cache.duration) {
            return this.cache.data;
        }

        try {
            const [totalUsers, totalFiles] = await Promise.all([
                this.getTotalUsers(),
                this.getTotalFiles()
            ]);

            const stats = {
                users: { 
                    number: `${totalUsers}+`, 
                    label: 'مستخدم مسجل' 
                },
                files: { 
                    number: `${totalFiles}+`, 
                    label: 'ملف مرفوع' 
                },
                uptime: { 
                    number: '99.9%', 
                    label: 'وقت التشغيل' 
                },
                support: { 
                    number: '24/7', 
                    label: 'دعم فني' 
                }
            };

            // حفظ في الكاش والبيانات الناجحة الأخيرة
            this.cache.data = stats;
            this.cache.lastSuccessfulData = stats;
            this.cache.timestamp = now;

            console.log('Stats updated successfully:', stats);
            return stats;
        } catch (error) {
            console.error('Error loading stats:', error);
            
            // في حالة فشل التحديث، استخدم آخر بيانات ناجحة
            if (this.cache.lastSuccessfulData) {
                console.log('Using last successful data:', this.cache.lastSuccessfulData);
                this.cache.data = this.cache.lastSuccessfulData;
                this.cache.timestamp = now; // تجديد التوقيت لتجنب المحاولة المستمرة
                return this.cache.lastSuccessfulData;
            }
            
            // إحصائيات احتياطية فقط في المرة الأولى (بدون أرقام وهمية)
            const fallbackStats = {
                users: { number: '0', label: 'مستخدم مسجل' },
                files: { number: '0', label: 'ملف مرفوع' },
                uptime: { number: '99.9%', label: 'وقت التشغيل' },
                support: { number: '24/7', label: 'دعم فني' }
            };

            this.cache.data = fallbackStats;
            this.cache.lastSuccessfulData = fallbackStats;
            this.cache.timestamp = now;
            
            console.log('Using fallback stats:', fallbackStats);
            return fallbackStats;
        }
    }

    // مسح الكاش يدوياً (يحتفظ بآخر بيانات ناجحة)
    clearCache() {
        this.cache.data = null;
        this.cache.timestamp = 0;
        // نحتفظ بـ lastSuccessfulData للاستخدام في حالة فشل التحديث التالي
    }

    // مسح كامل للبيانات (بما فيها آخر بيانات ناجحة)
    resetAll() {
        this.cache.data = null;
        this.cache.timestamp = 0;
        this.cache.lastSuccessfulData = null;
    }

    // الحصول على آخر بيانات ناجحة
    getLastSuccessfulData() {
        return this.cache.lastSuccessfulData;
    }
}

export const StatsService = new StatsServiceClass();