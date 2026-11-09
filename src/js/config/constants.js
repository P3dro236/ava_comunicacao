/**
 * Central Inteligente de Comunicados Acadêmicos — AVA Uniube
 * Módulo: config/constants.js
 * Responsabilidade: Chaves de armazenamento local, versão do schema e constantes globais.
 */

export const STORAGE_KEYS = Object.freeze({
    COMUNICADOS: 'uniube_mock_comunicados',
    PREFERENCIAS: 'uniube_mock_preferencias',
    ONBOARDING: 'uniube_onboarding_progressivo_v3',
    VERSAO: 'uniube_mock_versao_v3'
});

export const VERSAO_SCHEMA_STORAGE = '3.2';

// Data/hora de referência do protótipo (05/11/2026 às 16:30)
export const DATA_ATUAL_FICTICIA = '2026-11-05T16:30:00';

export const ITENS_POR_PAGINA_PADRAO = 10;

