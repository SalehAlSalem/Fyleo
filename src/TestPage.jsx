import React from 'react';

const TestPage = () => {
  return (
    <div style={{ 
      padding: '50px', 
      textAlign: 'center',
      background: 'linear-gradient(135deg, #ff6b35 0%, #8b5cf6 50%, #3b82f6 100%)',
      minHeight: '100vh',
      color: 'white'
    }}>
      <h1 style={{ fontSize: '3rem', marginBottom: '2rem' }}>
        🚀 الموقع يعمل!
      </h1>
      <p style={{ fontSize: '1.5rem' }}>
        إذا كنت ترى هذه الرسالة، فإن React يعمل بشكل صحيح
      </p>
      <div style={{ marginTop: '2rem', padding: '1rem', background: 'rgba(255,255,255,0.2)', borderRadius: '10px' }}>
        📊 سيتم تحميل الإحصائيات الحقيقية قريباً...
      </div>
    </div>
  );
};

export default TestPage;