/**
 * Central Inteligente de Comunicados Acadêmicos — AVA Uniube
 * Módulo: ui/views/lista-view.js
 * Responsabilidade: Renderização da listagem de comunicados (.elemento & .linha-comunicacao), estados vazios e paginação nativa.
 */

import { CATEGORIAS } from '../../data/taxonomias.js';
import { isCriticoAtivo, isExpirado, obterComunicadosFiltrados } from '../../domain/feed-service.js';
import { estadoUI } from '../../state/ui-state.js';
import { escaparAtributoHtml, formatarDataHoraBR } from '../../utils/formatters.js';

export function renderizarPrioridadeNaLista(item) {
    if (isExpirado(item)) {
        return '';
    }
    if (item.prioridade === 'critica') {
        return `<span class="indicador-prioridade-critica ms-2" title="Prioridade Máxima">Máxima</span>`;
    }
    if (item.prioridade === 'alta') {
        return `<span class="indicador-prioridade-alta ms-2" title="Prioridade Alta">Alta</span>`;
    }
    return '';
}

export function renderizarLinhaComunicado(item) {
    const cat = CATEGORIAS[item.categoria];
    const nomeCategoria = cat ? cat.nomeCurto : 'Comunicados';
    const nomeOrigem = item.origem === 'uniube' ? 'Uniube' : 'Curso';
    const checkedLote = estadoUI.selecionadosLote.has(item.id) ? 'checked' : '';
    const classeCriticaAtiva = isCriticoAtivo(item) ? 'elemento-critico-ativo' : '';

    // Estilo nativo de linha lida: background-color:var(--cor-fundo-comunica-lido) (#242a33) e opacity:0.7
    const styleElemento = item.lido ? 'background-color:var(--cor-fundo-comunica-lido)' : '';
    const styleLinha = item.lido ? 'opacity:0.7' : '';

    return `
        <div id="trComunicacao_${item.id}"
             class="d-flex elemento py-2 ${classeCriticaAtiva}"
             style="${styleElemento}"
             tabindex="0"
             role="button"
             aria-label="${item.lido ? 'Visualizado' : 'Não visualizado'} - ${item.titulo}"
             data-acao="abrir-comunicado"
             data-id="${item.id}">

            <span class="ps-4 d-flex" data-ignorar-abertura="true">
                <input type="checkbox"
                       class="form-check-input classCheckMsg checkMsgComunicacao m-auto"
                       value="${item.id}"
                       name="checkMsgCom"
                       aria-label="Selecionar ${item.titulo}"
                       ${checkedLote}
                       data-acao="toggle-selecao-item"
                       data-id="${item.id}">
            </span>

            <div class="linha-comunicacao" style="${styleLinha}">
                <span class="py-0 my-auto" style="width:29%" title="${item.remetente} (${nomeCategoria} · ${nomeOrigem})">
                    <span style="flex:1;padding:0">
                        ${nomeCategoria} (${nomeOrigem}) ${renderizarPrioridadeNaLista(item)}
                    </span>
                </span>

                <span class="py-0 my-auto span-corpo d-flex titltMarc" style="flex:1;width:36%" title="${escaparAtributoHtml(item.titulo)}">
                    <span>- ${item.titulo}</span>
                </span>

                <span class="py-0 my-auto" style="text-align:end;width:5%">
                </span>

                ${item.curtido ? `
                    <span class="py-0 my-auto" style="text-align:end;width:4%" title="Mensagem curtida">
                        <i class="fas fa-thumbs-up"></i>
                    </span>
                ` : ''}

                <span class="py-0 my-auto span-data" style="text-align:end;width:20%">
                    &nbsp;&nbsp;${formatarDataHoraBR(item.publicadoEm)}
                </span>
            </div>

            <span class="ps-4 dropdown" data-ignorar-abertura="true">
                <i class="fas fa-ellipsis-v" data-bs-toggle="dropdown" aria-expanded="false" title="Opções"></i>
                <ul class="dropdown-menu dropdown-menu-end" style="background-color:#242a33;border:1px solid #526174;">
                    <li>
                        <a class="dropdown-item text-white small" href="#" data-acao="alternar-leitura-item" data-id="${item.id}">
                            <i class="far ${item.lido ? 'fa-envelope' : 'fa-envelope-open'} me-2"></i>${item.lido ? 'Marcar como não lida' : 'Marcar como visualizada'}
                        </a>
                    </li>
                    <li>
                        <a class="dropdown-item text-white small" href="#" data-acao="alternar-arquivo-item" data-id="${item.id}">
                            <i class="fas ${item.arquivado ? 'fa-inbox' : 'fa-archive'} me-2"></i>${item.arquivado ? 'Desarquivar para o feed' : 'Arquivar (Inbox Zero)'}
                        </a>
                    </li>
                </ul>
            </span>

            ${!item.lido ? `<i class="fas fa-circle desmarca-visualizacao" style="right:inherit;left:0.8rem;top:0.5rem" title="Não lida" aria-hidden="true"></i>` : ''}
        </div>
    `;
}

export function renderizarPaginacaoNativa(totalItens) {
    const paginacaoContainer = document.getElementById('containerPaginacaoLista');
    if (!paginacaoContainer) return;

    const totalPaginas = Math.max(1, Math.ceil(totalItens / estadoUI.itensPorPagina));
    if (estadoUI.paginaAtual > totalPaginas) {
        estadoUI.paginaAtual = totalPaginas;
    }

    if (totalPaginas <= 1) {
        paginacaoContainer.innerHTML = '';
        return;
    }

    let botoesNumericos = '';
    for (let p = 1; p <= totalPaginas; p++) {
        const estiloAtivo = p === estadoUI.paginaAtual ? 'background-color:#6d757f' : '';
        botoesNumericos += `
            <button type="button" class="btn btnAltoContraste" style="${estiloAtivo}" data-acao="ir-pagina" data-pagina="${p}">
                ${p}
            </button>
        `;
    }

    paginacaoContainer.innerHTML = `
        <span style="width:100%;text-align:center">
            <button type="button" class="btn btnAltoContraste" title="Primeira página" data-acao="ir-pagina" data-pagina="1">
                <i class="fas fa-chevron-left"></i>
            </button>
            ${botoesNumericos}
            <button type="button" class="btn btnAltoContraste" title="Última página" data-acao="ir-pagina" data-pagina="${totalPaginas}">
                <i class="fas fa-chevron-right"></i>
            </button>
        </span>
    `;
}

export function renderizarListaComunicados(todosComunicados, preferencias) {
    const listaContainer = document.getElementById('containerLinhasComunicados');
    const paginacaoContainer = document.getElementById('containerPaginacaoLista');
    if (!listaContainer) return;

    listaContainer.innerHTML = '';
    if (paginacaoContainer) paginacaoContainer.innerHTML = '';

    const filtrados = obterComunicadosFiltrados(todosComunicados, preferencias, estadoUI);
    const qtdArquivados = todosComunicados.filter(function (c) { return Boolean(c.arquivado); }).length;

    if (filtrados.length === 0) {
        listaContainer.innerHTML = `
            <div class="text-center py-5 px-3" style="color: rgba(255, 255, 255, 0.85);">
                <i class="fas fa-check-circle mb-2" style="font-size: 2rem; color: #67e3a7;"></i>
                <h6 class="fw-bold text-white mb-1">Inbox Zero alcançado!</h6>
                <p class="small mb-3">Nenhum comunicado pendente para os filtros selecionados.</p>
                <div class="d-flex justify-content-center gap-2">
                    <button type="button" class="btn btn-sm buttonMain" data-acao="limpar-filtros">
                        Limpar filtros
                    </button>
                    ${qtdArquivados > 0 ? `
                        <button type="button" class="btn btn-sm btnAltoContraste" data-acao="alternar-exibir-arquivados">
                            <i class="fas fa-box-open me-1"></i>${estadoUI.exibirArquivados ? 'Voltar ao feed ativo' : `Ver arquivados (${qtdArquivados})`}
                        </button>
                    ` : ''}
                </div>
            </div>
        `;
        return;
    }

    const totalPaginas = Math.max(1, Math.ceil(filtrados.length / estadoUI.itensPorPagina));
    if (estadoUI.paginaAtual > totalPaginas) {
        estadoUI.paginaAtual = totalPaginas;
    }

    const inicio = (estadoUI.paginaAtual - 1) * estadoUI.itensPorPagina;
    const fim = inicio + estadoUI.itensPorPagina;
    const itensPagina = filtrados.slice(inicio, fim);

    const barraRodapeArquivados = qtdArquivados > 0 ? `
        <div class="d-flex flex-wrap justify-content-between align-items-center gap-2 px-3 py-2 mt-2 rounded" style="background-color:#242a33;border:1px solid #526174;">
            <span class="small text-white-50">
                <i class="fas fa-archive me-1"></i>${estadoUI.exibirArquivados ? `Exibindo ${filtrados.length} comunicado(s) arquivado(s).` : `${qtdArquivados} comunicado(s) arquivado(s) via Inbox Zero.`}
            </span>
            <button type="button" class="btn btn-sm btnAltoContraste" data-acao="alternar-exibir-arquivados">
                ${estadoUI.exibirArquivados ? 'Voltar ao Feed Ativo' : 'Consultar Arquivados'}
            </button>
        </div>
    ` : '';

    listaContainer.innerHTML = itensPagina.map(function (item) {
        return renderizarLinhaComunicado(item);
    }).join('') + barraRodapeArquivados;

    renderizarPaginacaoNativa(filtrados.length);
}

