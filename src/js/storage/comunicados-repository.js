/**
 * Central Inteligente de Comunicados Acadêmicos — AVA Uniube
 * Módulo: storage/comunicados-repository.js
 * Responsabilidade: Inicialização de seed data, leitura, gravação e mutações de comunicados no localStorage.
 */

import { DATA_ATUAL_FICTICIA, STORAGE_KEYS, VERSAO_SCHEMA_STORAGE } from '../config/constants.js';
import { mockData } from '../data/mock-comunicados.js';
import { PREFERENCIAS_PADRAO } from '../data/taxonomias.js';
import { gravarJsonStorage, gravarStringStorage, lerJsonStorage, lerStringStorage } from './local-storage-wrapper.js';
import { resetarEstadoOnboarding } from './onboarding-repository.js';

/**
 * Inicializa o localStorage com os 20 objetos de comunicados e preferências padrão.
 */
export function inicializarMockStorage(forcarReset = false) {
    const versaoSalva = lerStringStorage(STORAGE_KEYS.VERSAO);
    const dadosSalvos = lerStringStorage(STORAGE_KEYS.COMUNICADOS);

    if (forcarReset || !dadosSalvos || versaoSalva !== VERSAO_SCHEMA_STORAGE) {
        const normalizados = mockData.map(function (item) {
            return Object.assign({ arquivado: false }, item);
        });
        gravarJsonStorage(STORAGE_KEYS.COMUNICADOS, normalizados);
        gravarJsonStorage(STORAGE_KEYS.PREFERENCIAS, PREFERENCIAS_PADRAO);
        gravarStringStorage(STORAGE_KEYS.VERSAO, VERSAO_SCHEMA_STORAGE);
        if (forcarReset) {
            resetarEstadoOnboarding();
        }
    } else if (!lerStringStorage(STORAGE_KEYS.PREFERENCIAS)) {
        gravarJsonStorage(STORAGE_KEYS.PREFERENCIAS, PREFERENCIAS_PADRAO);
    }
}

export function obterComunicadosStorage() {
    const lista = lerJsonStorage(STORAGE_KEYS.COMUNICADOS, null);
    if (!Array.isArray(lista)) {
        inicializarMockStorage(true);
        return JSON.parse(JSON.stringify(mockData));
    }
    return lista;
}

export function salvarComunicadosStorage(lista) {
    return gravarJsonStorage(STORAGE_KEYS.COMUNICADOS, lista);
}

export function obterComunicadoPorIdStorage(idComunicado) {
    const lista = obterComunicadosStorage();
    return lista.find(function (c) { return c.id === idComunicado; }) || null;
}

export function atualizarEstadoLeituraStorage(idComunicado, novoStatusLido) {
    const lista = obterComunicadosStorage();
    const item = lista.find(function (c) { return c.id === idComunicado; });
    if (!item) return null;

    item.lido = Boolean(novoStatusLido);
    item.lidoEm = item.lido ? DATA_ATUAL_FICTICIA : null;
    if (item.lido && item.exigeCiencia) {
        item.cienciaConfirmada = true;
        if (!item.cienciaEm) {
            item.cienciaEm = DATA_ATUAL_FICTICIA;
        }
    }
    salvarComunicadosStorage(lista);
    return item;
}

export function arquivarComunicadosStorage(idsArray, arquivarStatus) {
    const setIds = new Set(idsArray);
    const lista = obterComunicadosStorage();
    let alterados = 0;

    lista.forEach(function (item) {
        if (setIds.has(item.id)) {
            item.arquivado = Boolean(arquivarStatus);
            alterados++;
        }
    });

    if (alterados > 0) {
        salvarComunicadosStorage(lista);
    }
    return alterados;
}

export function marcarLoteComoLidoStorage(idsArray) {
    const setIds = new Set(idsArray);
    const lista = obterComunicadosStorage();
    let alterados = 0;

    lista.forEach(function (item) {
        if (setIds.has(item.id) && !item.lido) {
            item.lido = true;
            item.lidoEm = DATA_ATUAL_FICTICIA;
            if (item.exigeCiencia) {
                item.cienciaConfirmada = true;
                if (!item.cienciaEm) {
                    item.cienciaEm = DATA_ATUAL_FICTICIA;
                }
            }
            alterados++;
        }
    });

    if (alterados > 0) {
        salvarComunicadosStorage(lista);
    }
    return alterados;
}

export function alternarCurtidaStorage(idComunicado) {
    const lista = obterComunicadosStorage();
    const item = lista.find(function (c) { return c.id === idComunicado; });
    if (!item) return null;

    item.curtido = !item.curtido;
    salvarComunicadosStorage(lista);
    return item;
}

export function confirmarCienciaStorage(idComunicado) {
    const lista = obterComunicadosStorage();
    const item = lista.find(function (c) { return c.id === idComunicado; });
    if (!item) return null;

    item.lido = true;
    if (!item.lidoEm) {
        item.lidoEm = DATA_ATUAL_FICTICIA;
    }
    item.cienciaConfirmada = true;
    item.cienciaEm = DATA_ATUAL_FICTICIA;
    salvarComunicadosStorage(lista);
    return item;
}

export function atualizarCenarioFallbackStorage(idComunicado, novoCenario) {
    const lista = obterComunicadosStorage();
    const item = lista.find(function (c) { return c.id === idComunicado; });
    if (!item || !novoCenario) return null;

    item.cenarioFallback = novoCenario;
    salvarComunicadosStorage(lista);
    return item;
}

