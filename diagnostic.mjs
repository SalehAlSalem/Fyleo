#!/usr/bin/env node

/**
 * 🔍 Fyleo System Diagnostic Tool
 * يفحص جميع أجزاء النظام ويحدد المشاكل
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

console.log('🚀 بدء فحص نظام Fyleo...\n');

// 1. فحص الملفات الأساسية
console.log('📁 فحص الملفات الأساسية:');
const requiredFiles = [
    'package.json',
    'vite.config.js',
    'index.html',
    'src/App.jsx',
    'src/main.jsx',
    'Firebase/ClientApp.mjs',
    'vercel.json',
    '.github/workflows/deploy.yml'
];

let fileIssues = [];
for (const file of requiredFiles) {
    if (fs.existsSync(path.join(__dirname, file))) {
        console.log(`  ✅ ${file}`);
    } else {
        console.log(`  ❌ ${file} - مفقود`);
        fileIssues.push(file);
    }
}

// 2. فحص متغيرات البيئة
console.log('\n🔐 فحص متغيرات البيئة:');
const envFile = path.join(__dirname, '.env');
if (fs.existsSync(envFile)) {
    console.log('  ✅ ملف .env موجود');
    const envContent = fs.readFileSync(envFile, 'utf-8');
    const requiredVars = [
        'VITE_FIREBASE_API_KEY',
        'VITE_FIREBASE_AUTH_DOMAIN',
        'VITE_FIREBASE_PROJECT_ID',
        'VITE_FIREBASE_STORAGE_BUCKET',
        'VITE_FIREBASE_MESSAGING_SENDER_ID',
        'VITE_FIREBASE_APP_ID'
    ];
    
    for (const varName of requiredVars) {
        if (envContent.includes(varName)) {
            console.log(`    ✅ ${varName}`);
        } else {
            console.log(`    ❌ ${varName} - مفقود`);
        }
    }
} else {
    console.log('  ❌ ملف .env مفقود');
}

// 3. فحص إعدادات Firebase
console.log('\n🔥 فحص إعدادات Firebase:');
try {
    const firebaseConfig = fs.readFileSync(path.join(__dirname, 'Firebase/ClientApp.mjs'), 'utf-8');
    if (firebaseConfig.includes('apiKey')) {
        console.log('  ✅ إعدادات Firebase موجودة');
    } else {
        console.log('  ❌ إعدادات Firebase غير صحيحة');
    }
} catch (error) {
    console.log('  ❌ خطأ في قراءة إعدادات Firebase');
}

// 4. فحص مكونات React
console.log('\n⚛️ فحص مكونات React:');
const components = [
    'src/components/Dashboard/uploadform.jsx',
    'src/components/NavBar/index.jsx',
    'src/components/Dashboard/index.jsx'
];

for (const component of components) {
    if (fs.existsSync(path.join(__dirname, component))) {
        console.log(`  ✅ ${component.split('/').pop()}`);
    } else {
        console.log(`  ❌ ${component.split('/').pop()} - مفقود`);
    }
}

// 5. فحص package.json
console.log('\n📦 فحص dependencies:');
try {
    const packageJson = JSON.parse(fs.readFileSync(path.join(__dirname, 'package.json'), 'utf-8'));
    const requiredDeps = [
        'react',
        'react-dom',
        'firebase',
        'react-router-dom',
        'tailwindcss'
    ];
    
    for (const dep of requiredDeps) {
        if (packageJson.dependencies && packageJson.dependencies[dep]) {
            console.log(`  ✅ ${dep} - ${packageJson.dependencies[dep]}`);
        } else {
            console.log(`  ❌ ${dep} - مفقود`);
        }
    }
} catch (error) {
    console.log('  ❌ خطأ في قراءة package.json');
}

// 6. ملخص الفحص
console.log('\n📊 ملخص الفحص:');
if (fileIssues.length === 0) {
    console.log('  🎉 جميع الملفات الأساسية موجودة');
} else {
    console.log(`  ⚠️ ${fileIssues.length} ملف مفقود`);
}

console.log('\n🔧 التوصيات:');
console.log('  1. تأكد من رفع جميع متغيرات البيئة على Vercel');
console.log('  2. تأكد من صحة إعدادات Firebase');
console.log('  3. اختبر الموقع محلياً قبل النشر');
console.log('  4. راجع سجلات GitHub Actions للأخطاء');

console.log('\n✨ انتهى الفحص!');