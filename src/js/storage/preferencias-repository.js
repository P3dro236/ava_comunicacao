/**
 * Central Inteligente de Comunicados Acadêmicos — AVA Uniube
 * Módulo: storage/preferencias-repository.js
 * Responsabilidade: Leitura, normalização e gravação das preferências do aluno no localStorage.
 */

import { STORAGE_KEYS } from '../config/constants.js';
import { PERFIL_USUARIO } from '../data/perfil-aluno.js';
import { CATEGORIAS, PREFERENCIAS_PADRAO } from '../data/taxonomias.js';
import { gravarJsonStorage, lerJsonStorage } from './local-storage-wrapper.js';

function normalizarPreferencias(prefsBrutas) {
    const base = JSON.parse(JSON.stringify(PREFERENCIAS_PADRAO));
    const parsed = Object.assign({}, base, prefsBrutas || {});

    // Categorias essenciais sempre ativas
    parsed.categoriasAtivas = Object.assign({}, base.categoriasAtivas, parsed.categoriasAtivas || {});
    Object.keys(CATEGORIAS).forEach(function (catId) {
        if (CATEGORIAS[catId].essencial) {
            parsed.categoriasAtivas[catId] = true;
        }
    });

    // Prioridades de recebimento (Crítica nunca pode ser desativada pelo aluno)
    parsed.prioridadesRecebimento = Object.assign({}, base.prioridadesRecebimento, parsed.prioridadesRecebimento || {});
    parsed.prioridadesRecebimento.critica = { acompanharNoFeed: true, canaisRapidos: true };

    // Canal Portal sempre ativo
    parsed.canaisAtivos = Object.assign({}, base.canaisAtivos, parsed.canaisAtivos || {});
    parsed.canaisAtivos.portal = true;

    // Opt-In Absoluto: áreas explícitas salvas pelo aluno
    if (!Array.isArray(parsed.areasOptInExplicito)) {
        parsed.areasOptInExplicito = [];
    }
    parsed.areasOptInExplicito = parsed.areasOptInExplicito.filter(function (a) {
        return a !== PERFIL_USUARIO.area;
    });
    parsed.areasInteresse = [PERFIL_USUARIO.area].concat(parsed.areasOptInExplicito);

    return parsed;
}

export function obterPreferenciasStorage() {
    const salvo = lerJsonStorage(STORAGE_KEYS.PREFERENCIAS, null);
    return normalizarPreferencias(salvo);
}

export function salvarPreferenciasStorage(prefs) {
    const normalizadas = normalizarPreferencias(prefs);
    gravarJsonStorage(STORAGE_KEYS.PREFERENCIAS, normalizadas);
    return normalizadas;
}

export function restaurarPreferenciasPadraoStorage() {
    const padrao = JSON.parse(JSON.stringify(PREFERENCIAS_PADRAO));
    return salvarPreferenciasStorage(padrao);
}

