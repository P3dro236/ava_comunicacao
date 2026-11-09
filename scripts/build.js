/**
 * Script de Build: Gera o arquivo único HTML autossuficiente na pasta dist/
 * Execução: node scripts/build.js
 */

const fs = require('fs');
const path = require('path');

const rootDir = path.resolve(__dirname, '..');
const srcDir = path.join(rootDir, 'src');
const distDir = path.join(rootDir, 'dist');

if (!fs.existsSync(distDir)) {
    fs.mkdirSync(distDir, { recursive: true });
}

// 1. Imagens para Base64
const logoPath = path.join(srcDir, 'img', 'logo-ava-uniube.png');
const iconPath = path.join(srcDir, 'icon', 'IconUniube.png');

const logoBase64 = fs.existsSync(logoPath) ? fs.readFileSync(logoPath).toString('base64') : '';
const iconBase64 = fs.existsSync(iconPath) ? fs.readFileSync(iconPath).toString('base64') : '';

const logoDataUri = `data:image/png;base64,${logoBase64}`;
const iconDataUri = `data:image/png;base64,${iconBase64}`;

// 2. CSS embutido
const cssPath = path.join(srcDir, 'css', 'central-comunicados.css');
const cssContent = fs.readFileSync(cssPath, 'utf-8');

// 3. Empacotamento sequencial do JavaScript (ordem topológica de dependências)
const orderedJsFiles = [
    path.join(srcDir, 'js', 'config', 'constants.js'),
    path.join(srcDir, 'js', 'data', 'perfil-aluno.js'),
    path.join(srcDir, 'js', 'data', 'taxonomias.js'),
    path.join(srcDir, 'js', 'data', 'mock-comunicados.js'),
    path.join(srcDir, 'js', 'storage', 'local-storage-wrapper.js'),
    path.join(srcDir, 'js', 'storage', 'onboarding-repository.js'),
    path.join(srcDir, 'js', 'storage', 'preferencias-repository.js'),
    path.join(srcDir, 'js', 'storage', 'comunicados-repository.js'),
    path.join(srcDir, 'js', 'domain', 'fallback-service.js'),
    path.join(srcDir, 'js', 'domain', 'governanca-service.js'),
    path.join(srcDir, 'js', 'utils', 'formatters.js'),
    path.join(srcDir, 'js', 'domain', 'feed-service.js'),
    path.join(srcDir, 'js', 'state', 'ui-state.js'),
    path.join(srcDir, 'js', 'ui', 'toast.js'),
    path.join(srcDir, 'js', 'ui', 'views', 'fluxo-view.js'),
    path.join(srcDir, 'js', 'ui', 'views', 'sticky-critico-view.js'),
    path.join(srcDir, 'js', 'ui', 'views', 'onboarding-view.js'),
    path.join(srcDir, 'js', 'ui', 'views', 'contadores-view.js'),
    path.join(srcDir, 'js', 'ui', 'views', 'configuracoes-view.js'),
    path.join(srcDir, 'js', 'ui', 'views', 'lista-view.js'),
    path.join(srcDir, 'js', 'ui', 'views', 'leitura-view.js'),
    path.join(srcDir, 'js', 'ui', 'layout-portal.js'),
    path.join(srcDir, 'js', 'ui', 'actions-router.js'),
    path.join(srcDir, 'js', 'main.js')
];

function processJsContent(filePath) {
    let content = fs.readFileSync(filePath, 'utf-8');
    const relativeName = path.relative(srcDir, filePath).replace(/\\/g, '/');
    // Remove imports
    content = content.replace(/import\s+[\s\S]*?from\s+['"][^'"]+['"];?\r?\n?/g, '');
    content = content.replace(/import\s+['"][^'"]+['"];?\r?\n?/g, '');
    // Remove exports
    content = content.replace(/export\s+(const|let|var|function|async\s+function)/g, '$1');
    return `\n/* ==================== MÓDULO: ${relativeName} ==================== */\n` + content;
}

let bundledJs = '(function () {\n"use strict";\n';
for (const file of orderedJsFiles) {
    bundledJs += processJsContent(file) + '\n';
}
bundledJs += '\n})();\n';

// 4. Montagem do HTML Unificado
const htmlPath = path.join(srcDir, 'index.html');
let htmlContent = fs.readFileSync(htmlPath, 'utf-8');

if (iconBase64) {
    htmlContent = htmlContent.replace(
        /<title>AVA Uniube<\/title>/,
        `<title>AVA Uniube — Central Inteligente de Comunicados Acadêmicos</title>\n    <link rel="icon" type="image/png" href="${iconDataUri}">`
    );
}

htmlContent = htmlContent.replace(
    /<link\s+rel="stylesheet"\s+type="text\/css"\s+href="css\/central-comunicados\.css">/,
    `<style>\n/* Folha de estilos institucional da Central Inteligente — AVA Uniube */\n${cssContent}\n</style>`
);

htmlContent = htmlContent.replace(
    /src="img\/logo-ava-uniube\.png"/,
    `src="${logoDataUri}"`
);

htmlContent = htmlContent.replace(
    /<script\s+type="module"\s+src="js\/main\.js"><\/script>/,
    `<script>\n/* Bundled Core — Central Inteligente de Comunicados Acadêmicos (AVA Uniube) */\n${bundledJs}\n</script>`
);

// 5. Salva em dist/index.html
const distIndexPath = path.join(distDir, 'index.html');
fs.writeFileSync(distIndexPath, htmlContent, 'utf-8');

console.log('✅ Arquivo único gerado com sucesso em:', distIndexPath);
console.log('📦 Tamanho final:', (fs.statSync(distIndexPath).size / 1024).toFixed(1), 'KB');

