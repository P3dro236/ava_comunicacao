/**
 * Central Inteligente de Comunicados Acadêmicos — AVA Uniube
 * Módulo: main.js
 * Responsabilidade: Ponto de entrada (Bootstrap) da aplicação em ES Modules.
 */

import { inicializarMockStorage } from './storage/comunicados-repository.js';
import { registrarEventosCentral, renderizarAplicacao } from './ui/actions-router.js';
import { registrarEventosLayoutPortal } from './ui/layout-portal.js';

function inicializarAplicacao() {
    inicializarMockStorage(false);
    registrarEventosLayoutPortal();
    registrarEventosCentral();
    renderizarAplicacao();
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', inicializarAplicacao);
} else {
    inicializarAplicacao();
}

