/**
 * Central Inteligente de Comunicados Acadêmicos — AVA Uniube
 * Módulo: storage/onboarding-repository.js
 * Responsabilidade: Persistência do estado de Onboarding Progressivo de canais secundários.
 */

import { STORAGE_KEYS } from '../config/constants.js';
import { gravarJsonStorage, lerJsonStorage, removerChaveStorage } from './local-storage-wrapper.js';

const ESTADO_ONBOARDING_PADRAO = {
    interagiuPrioridadeAlta: false,
    primeiroComunicadoAltaId: null,
    canaisSecundariosSugeridosAtivados: false,
    dispensadoPeloAluno: false
};

export function obterEstadoOnboarding() {
    const salvo = lerJsonStorage(STORAGE_KEYS.ONBOARDING, null);
    if (!salvo) {
        return Object.assign({}, ESTADO_ONBOARDING_PADRAO);
    }
    return Object.assign({}, ESTADO_ONBOARDING_PADRAO, salvo);
}

export function salvarEstadoOnboarding(estado) {
    return gravarJsonStorage(STORAGE_KEYS.ONBOARDING, estado);
}

export function resetarEstadoOnboarding() {
    return removerChaveStorage(STORAGE_KEYS.ONBOARDING);
}

