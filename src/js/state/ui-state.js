/**
 * Central Inteligente de Comunicados Acadêmicos — AVA Uniube
 * Módulo: state/ui-state.js
 * Responsabilidade: Gerenciamento centralizado do estado da interface (filtros, paginação, abas e seleção em lote).
 */

import { ITENS_POR_PAGINA_PADRAO } from '../config/constants.js';

export const estadoUI = {
    abaCentral: 'comunicados',      // 'comunicados' | 'configuracoes'
    escopoFeed: 'relevantes',       // 'relevantes' (Opt-In Absoluto) | 'todos' (acervo completo)
    filtroOrigem: 'todas',          // 'todas' | 'uniube' | 'curso'
    macroChip: 'todas',             // 'todas' | 'aulas_provas' | 'eventos' | 'secretaria'
    filtroPrioridade: 'todas',      // 'todas' | 'critica' | 'alta' | 'normal' | 'baixa'
    filtroLeitura: 'todos',         // 'todos' | 'nao_lidos' | 'lidos'
    exibirArquivados: false,        // Inbox Zero: alterna visualização de arquivados
    termoBusca: '',
    paginaAtual: 1,
    itensPorPagina: ITENS_POR_PAGINA_PADRAO,
    comunicadoAbertoId: null,       // null = exibe lista (#divComConteudoCE0); string = exibe leitura (#divComConteudoLerMsg)
    selecionadosLote: new Set(),
    configuracoesAlteradas: false   // rastreia se houve alteração na aba de configurações para feedback ao retornar
};

export function resetarFiltrosUI() {
    estadoUI.filtroOrigem = 'todas';
    estadoUI.macroChip = 'todas';
    estadoUI.filtroPrioridade = 'todas';
    estadoUI.filtroLeitura = 'todos';
    estadoUI.exibirArquivados = false;
    estadoUI.termoBusca = '';
    estadoUI.paginaAtual = 1;
}

export function possuiFiltroAtivo() {
    return (
        estadoUI.filtroOrigem !== 'todas' ||
        estadoUI.macroChip !== 'todas' ||
        estadoUI.filtroPrioridade !== 'todas' ||
        estadoUI.filtroLeitura !== 'todos' ||
        estadoUI.exibirArquivados ||
        estadoUI.termoBusca.trim().length > 0
    );
}

