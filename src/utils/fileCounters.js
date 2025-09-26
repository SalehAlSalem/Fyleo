import { doc, updateDoc, increment } from 'firebase/firestore';
import { db } from '../../Firebase/ClientApp.js';

export const incrementViewCount = async (fileId) => {
  if (!fileId) return;
  try {
    await updateDoc(doc(db, 'files', fileId), { views: increment(1) });
  } catch (e) {
    console.warn('تعذر تحديث المشاهدات:', e.message);
  }
};

export const incrementDownloadCount = async (fileId) => {
  if (!fileId) return;
  try {
    await updateDoc(doc(db, 'files', fileId), { downloads: increment(1) });
  } catch (e) {
    console.warn('تعذر تحديث التحميلات:', e.message);
  }
};

// مخصص للتوافق المستقبلي لو تم استدعاء دالة قديمة
export default { incrementViewCount, incrementDownloadCount };