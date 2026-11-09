/**
 * Central Inteligente de Comunicados Acadêmicos — AVA Uniube
 * Módulo: storage/local-storage-wrapper.js
 * Responsabilidade: Abstração segura para leitura, escrita e remoção no localStorage com tratamento de exceções.
 */

export function lerJsonStorage(chave, fallback = null) {
    try {
        const raw = localStorage.getItem(chave);
        if (!raw) {
            return fallback !== null ? JSON.parse(JSON.stringify(fallback)) : null;
        }
        return JSON.parse(raw);
    } catch (err) {
        console.error(`Erro ao ler chave "${chave}" do localStorage:`, err);
        return fallback !== null ? JSON.parse(JSON.stringify(fallback)) : null;
    }
}

export function gravarJsonStorage(chave, valor) {
    try {
        localStorage.setItem(chave, JSON.stringify(valor));
        return true;
    } catch (err) {
        console.error(`Erro ao gravar chave "${chave}" no localStorage:`, err);
        return false;
    }
}

export function lerStringStorage(chave) {
    try {
        return localStorage.getItem(chave);
    } catch (err) {
        return null;
    }
}

export function gravarStringStorage(chave, valor) {
    try {
        localStorage.setItem(chave, String(valor));
        return true;
    } catch (err) {
        return false;
    }
}

export function removerChaveStorage(chave) {
    try {
        localStorage.removeItem(chave);
        return true;
    } catch (err) {
        return false;
    }
}

