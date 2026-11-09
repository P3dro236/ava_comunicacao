/**
 * Central Inteligente de Comunicados Acadêmicos — AVA Uniube
 * Módulo: domain/governanca-service.js
 * Responsabilidade: Validação de regras administrativas de governança de emissão (Prioridade Crítica).
 */

import { REGRAS_GOVERNANCA_EMISSAO } from '../data/taxonomias.js';

/**
 * Validador determinístico de Governança de Emissão:
 * Bloqueia a atribuição da tag "Prioridade Crítica" para emissores não autorizados
 * e para categorias não relacionadas à rotina diária (como Eventos e Avisos Administrativos).
 */
export function validarGovernancaEmissao(payloadComunicado, emissorRole) {
    const prioridadeSolicitada = payloadComunicado?.prioridade || 'normal';
    const categoriaId = payloadComunicado?.categoria || '';

    if (prioridadeSolicitada !== 'critica') {
        return {
            permitido: true,
            prioridadeFinal: prioridadeSolicitada,
            codigo: 'OK_PRIORIDADE_REGULAR',
            mensagem: 'Emissão autorizada dentro das políticas de governança.'
        };
    }

    const emissorAutorizado = REGRAS_GOVERNANCA_EMISSAO.perfisAutorizadosCritica.some(function (p) {
        return p.role === emissorRole;
    });

    if (!emissorAutorizado) {
        return {
            permitido: false,
            prioridadeFinal: 'normal',
            codigo: 'ERR_EMISSOR_NAO_AUTORIZADO_CRITICA',
            mensagem: `Bloqueio de Governança: O perfil emissor "${emissorRole}" não possui permissão para emitir comunicados de Prioridade Crítica.`
        };
    }

    const categoriaRotinaDiaria = REGRAS_GOVERNANCA_EMISSAO.categoriasPermitidasCritica.includes(categoriaId);
    if (!categoriaRotinaDiaria) {
        return {
            permitido: false,
            prioridadeFinal: 'normal',
            codigo: 'ERR_CATEGORIA_VEDADA_PARA_CRITICA',
            mensagem: `Bloqueio de Governança: A categoria "${categoriaId}" não pertence à rotina diária de aulas/infraestrutura e não pode receber Prioridade Crítica.`
        };
    }

    return {
        permitido: true,
        prioridadeFinal: 'critica',
        codigo: 'OK_CRITICA_AUTORIZADA',
        mensagem: 'Emissão de Prioridade Crítica validada (Emissor autorizado + Categoria de rotina diária).'
    };
}

