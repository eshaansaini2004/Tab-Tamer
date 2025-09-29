#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

console.log('🧙‍♂️ Tab Tamer Setup Script\n');

// Check if node_modules exists
if (!fs.existsSync('node_modules')) {
    console.log('📦 Installing dependencies...');
    try {
        execSync('npm install', { stdio: 'inherit' });
        console.log('✅ Dependencies installed successfully!\n');
    } catch (error) {
        console.error('❌ Failed to install dependencies:', error.message);
        process.exit(1);
    }
} else {
    console.log('✅ Dependencies already installed\n');
}

// Create dist directory if it doesn't exist
if (!fs.existsSync('dist')) {
    fs.mkdirSync('dist');
    console.log('📁 Created dist directory\n');
}

// Build the extension
console.log('🔨 Building extension...');
try {
    execSync('npm run build', { stdio: 'inherit' });
    console.log('✅ Extension built successfully!\n');
} catch (error) {
    console.error('❌ Build failed:', error.message);
    process.exit(1);
}

console.log('🎉 Setup complete! Your Tab Tamer extension is ready to load.\n');
console.log('📋 Next steps:');
console.log('1. Open Chrome and go to chrome://extensions/');
console.log('2. Enable "Developer mode"');
console.log('3. Click "Load unpacked" and select the "dist" folder');
console.log('4. Click the Tab Tamer icon in your toolbar to start organizing tabs!\n');

console.log('🧪 To test content extraction:');
console.log('   npm test\n');

console.log('🔧 For development:');
console.log('   npm run dev\n');
