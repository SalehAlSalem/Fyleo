import React from 'react';

const StorageDiagnostics = () => {
  const ghToken = import.meta.env.VITE_GITHUB_TOKEN;
  const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
  const supabaseAnon = import.meta.env.VITE_SUPABASE_ANON_KEY;
  const supabaseBucket = import.meta.env.VITE_SUPABASE_BUCKET;

  const isPlaceholder = (val) => !val || /placeholder|^ghp_PLACEHOLDER/i.test(val);
  const githubReady = ghToken && !isPlaceholder(ghToken);
  const supabaseReady = supabaseUrl && supabaseAnon && !isPlaceholder(supabaseUrl) && !isPlaceholder(supabaseAnon);
  const bucketReady = !!supabaseBucket;

  const simulationMode = !githubReady && !supabaseReady;

  const items = [
    { label: 'GitHub Token', ok: githubReady, hint: githubReady ? 'OK' : 'مفقود أو Placeholder' },
    { label: 'Supabase URL', ok: !!supabaseUrl && !isPlaceholder(supabaseUrl), hint: supabaseUrl ? (isPlaceholder(supabaseUrl) ? 'Placeholder' : 'OK') : 'مفقود' },
    { label: 'Supabase Anon Key', ok: !!supabaseAnon && !isPlaceholder(supabaseAnon), hint: supabaseAnon ? (isPlaceholder(supabaseAnon) ? 'Placeholder' : 'OK') : 'مفقود' },
    { label: 'Supabase Bucket', ok: bucketReady, hint: bucketReady ? supabaseBucket : 'مفقود' },
  ];

  return (
    <div className="w-full max-w-3xl mx-auto my-6 p-5 rounded-xl border bg-white dark:bg-neutral-800 shadow">
      <h2 className="text-lg font-bold mb-3">🛠️ تشخيص التخزين الهجين</h2>
      {simulationMode && (
        <div className="mb-4 p-3 rounded bg-yellow-100 text-yellow-800 text-sm font-medium">
          ⚠️ النظام يعمل حالياً في وضع المحاكاة (Simulation Mode). لن تُحفظ الملفات فعلياً في GitHub أو Supabase حتى تضيف المتغيرات.
        </div>
      )}
      <ul className="space-y-2 text-sm">
        {items.map(it => (
          <li key={it.label} className="flex justify-between items-center gap-4 py-1 border-b last:border-b-0 border-neutral-200 dark:border-neutral-700">
            <span>{it.label}</span>
            <span className={`px-2 py-0.5 rounded text-xs font-semibold ${it.ok ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-700'}`}>{it.ok ? '✅' : '❌'} {it.hint}</span>
          </li>
        ))}
      </ul>
      <div className="mt-4 text-xs text-neutral-500 leading-relaxed">
        <p>تأكد من إضافة القيم في بيئة Vercel وملف <code>.env.local</code>. لا تشارك المفاتيح في أي محادثة.</p>
      </div>
    </div>
  );
};

export default StorageDiagnostics;