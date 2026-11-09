/**
 * Central Inteligente de Comunicados Acadêmicos — AVA Uniube
 * Módulo: domain/feed-service.js
 * Responsabilidade: Regras de negócio do feed (Opt-In Absoluto, expiração, macro-chips, ordenação e filtragem).
 */

import { DATA_ATUAL_FICTICIA } from '../config/constants.js';
import { PERFIL_USUARIO } from '../data/perfil-aluno.js';
import { CATEGORIAS, MACRO_FILTROS_CHIPS } from '../data/taxonomias.js';
import { removerTagsHtml } from '../utils/formatters.js';
import { validarGovernancaEmissao } from './governanca-service.js';

/**
 * Verifica se o comunicado está expirado frente à data/hora de referência.
 */
export function isExpirado(item) {
    if (!item || !item.expiraEm) return false;
    return new Date(item.expiraEm).getTime() <= new Date(DATA_ATUAL_FICTICIA).getTime();
}

/**
 * Verifica se é um comunicado crítico ativo e não arquivado.
 */
export function isCriticoAtivo(item) {
    return Boolean(item && item.prioridade === 'critica' && !isExpirado(item) && !item.arquivado);
}

/**
 * Query determinística de Opt-In Absoluto:
 * Carrega estritamente comunicados do curso e turma matriculados do aluno.
 * Informações de outras áreas de conhecimento exigem ativação explícita no banco de dados (areasOptInExplicito).
 */
export function executarQueryFeedOptIn(item, preferencias) {
    if (item.arquivado) {
        return false;
    }

    // Expirados saem do feed principal relevante
    if (isExpirado(item)) {
        return false;
    }

    // Restrição de Curso e Turma Matriculados
    const cursoMatriculado = (
        item.publicoCurso === PERFIL_USUARIO.curso ||
        item.publicoCurso === 'TODOS'
    );
    if (!cursoMatriculado) {
        return false;
    }

    if (item.publicoTurma && item.publicoTurma !== PERFIL_USUARIO.turmaId && item.publicoTurma !== 'TODAS_TURMAS') {
        return false;
    }

    // Prioridade Crítica validada pela Governança nunca é suprimida
    if (item.prioridade === 'critica') {
        const validacaoGov = validarGovernancaEmissao(item, item.emissorRole || 'COORDENACAO_CURSO');
        if (validacaoGov.permitido) {
            return true;
        }
    }

    // Opt-In Absoluto de Áreas de Conhecimento:
    // Somente a área nativa do curso ('tecnologia_computacao') + áreas com Opt-In explícito gravado no banco
    const areasOptInBanco = Array.isArray(preferencias.areasOptInExplicito)
        ? preferencias.areasOptInExplicito
        : [];
    const areasAutorizadasQuery = [PERFIL_USUARIO.area].concat(areasOptInBanco);

    if (!Array.isArray(item.tagsArea) || item.tagsArea.length === 0) {
        return false;
    }

    const pertenceAreaAutorizada = item.tagsArea.some(function (tag) {
        return areasAutorizadasQuery.includes(tag);
    });
    if (!pertenceAreaAutorizada) {
        return false;
    }

    const defCat = CATEGORIAS[item.categoria];
    if (defCat && defCat.essencial) {
        return true;
    }

    return preferencias.categoriasAtivas[item.categoria] !== false;
}

/**
 * Verifica se a categoria do comunicado pertence ao macro-chip selecionado.
 */
export function pertenceAoMacroChip(item, chipId) {
    if (!chipId || chipId === 'todas') return true;
    const defChip = (MACRO_FILTROS_CHIPS || []).find(function (m) { return m.id === chipId; });
    if (!defChip || !Array.isArray(defChip.categorias) || defChip.categorias.length === 0) return true;
    return defChip.categorias.includes(item.categoria);
}

/**
 * Calcula o peso de ordenação:
 * 0 = Crítica ativa | 1 = Alta não lida | 2 = Alta lida | 3 = Demais / Expiradas
 */
export function obterPesoOrdenacao(item) {
    if (isExpirado(item)) {
        return 3;
    }
    if (item.prioridade === 'critica') {
        return 0;
    }
    if (item.prioridade === 'alta' && !item.lido) {
        return 1;
    }
    if (item.prioridade === 'alta' && item.lido) {
        return 2;
    }
    return 3;
}

/**
 * Filtra e ordena a lista de comunicados de acordo com as preferências e o estado de filtros da UI.
 */
export function obterComunicadosFiltrados(todosComunicados, preferencias, estadoUI) {
    const buscaNormalizada = (estadoUI.termoBusca || '').trim().toLowerCase();

    return todosComunicados
        .filter(function (item) {
            if (estadoUI.exibirArquivados) {
                if (!item.arquivado) return false;
            } else {
                if (item.arquivado) return false;
                if (estadoUI.escopoFeed === 'relevantes') {
                    if (!executarQueryFeedOptIn(item, preferencias)) return false;
                }
            }

            if (estadoUI.filtroOrigem !== 'todas' && item.origem !== estadoUI.filtroOrigem) {
                return false;
            }

            if (!pertenceAoMacroChip(item, estadoUI.macroChip)) {
                return false;
            }

            if (estadoUI.filtroPrioridade !== 'todas' && item.prioridade !== estadoUI.filtroPrioridade) {
                return false;
            }

            if (estadoUI.filtroLeitura === 'nao_lidos' && item.lido) {
                return false;
            }
            if (estadoUI.filtroLeitura === 'lidos' && !item.lido) {
                return false;
            }

            if (buscaNormalizada.length > 0) {
                const catNome = CATEGORIAS[item.categoria]?.nome || '';
                const texto = [
                    item.titulo,
                    item.resumo,
                    removerTagsHtml(item.conteudo),
                    item.remetente,
                    catNome
                ].join(' ').toLowerCase();

                if (!texto.includes(buscaNormalizada)) {
                    return false;
                }
            }

            return true;
        })
        .sort(function (a, b) {
            const pesoA = obterPesoOrdenacao(a);
            const pesoB = obterPesoOrdenacao(b);
            if (pesoA !== pesoB) {
                return pesoA - pesoB;
            }
            return new Date(b.publicadoEm).getTime() - new Date(a.publicadoEm).getTime();
        });
}

