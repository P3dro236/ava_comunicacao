/**
 * Central Inteligente de Comunicados Acadêmicos — AVA Uniube
 * Módulo: ui/actions-router.js
 * Responsabilidade: Orquestração da renderização principal e roteamento limpo de eventos e ações (data-acao).
 */

import { isCriticoAtivo, obterComunicadosFiltrados } from '../domain/feed-service.js';
import { estadoUI, resetarFiltrosUI } from '../state/ui-state.js';
import {
    alternarCurtidaStorage,
    arquivarComunicadosStorage,
    atualizarEstadoLeituraStorage,
    inicializarMockStorage,
    marcarLoteComoLidoStorage,
    obterComunicadoPorIdStorage,
    obterComunicadosStorage
} from '../storage/comunicados-repository.js';
import { obterEstadoOnboarding, salvarEstadoOnboarding } from '../storage/onboarding-repository.js';
import {
    obterPreferenciasStorage,
    restaurarPreferenciasPadraoStorage,
    salvarPreferenciasStorage
} from '../storage/preferencias-repository.js';
import { exibirToast } from './toast.js';
import {
    renderizarAbaConfiguracoes,
    salvarConfiguracoesDoFormulario
} from './views/configuracoes-view.js';
import {
    atualizarContadoresENotificacoes,
    atualizarVisibilidadeAcoesLote,
    sincronizarControlesNavegacao
} from './views/contadores-view.js';
import { renderizarAbaFluxoComunicacao } from './views/fluxo-view.js';
import {
    abrirComunicado,
    renderizarMensagemAberta,
    voltarParaListaComunicados
} from './views/leitura-view.js';
import { renderizarListaComunicados } from './views/lista-view.js';
import { renderizarBannerOnboardingProgressivo } from './views/onboarding-view.js';

export function renderizarAplicacao() {
    const todosComunicados = obterComunicadosStorage();
    const preferencias = obterPreferenciasStorage();

    atualizarContadoresENotificacoes(todosComunicados, preferencias);
    sincronizarControlesNavegacao();
    atualizarVisibilidadeAcoesLote();

    const abaComunicados = document.getElementById('abaPrincipalComunicados');
    const abaConfiguracoes = document.getElementById('abaPrincipalConfiguracoes');
    const abaFluxo = document.getElementById('abaPrincipalFluxo');

    if (estadoUI.abaCentral === 'configuracoes') {
        if (abaComunicados) abaComunicados.style.display = 'none';
        if (abaFluxo) abaFluxo.style.display = 'none';
        if (abaConfiguracoes) abaConfiguracoes.style.display = 'block';
        renderizarAbaConfiguracoes(preferencias);
        return;
    }

    if (estadoUI.abaCentral === 'fluxo') {
        if (abaComunicados) abaComunicados.style.display = 'none';
        if (abaConfiguracoes) abaConfiguracoes.style.display = 'none';
        if (abaFluxo) abaFluxo.style.display = 'block';
        renderizarAbaFluxoComunicacao();
        return;
    }

    if (abaConfiguracoes) abaConfiguracoes.style.display = 'none';
    if (abaFluxo) abaFluxo.style.display = 'none';
    if (abaComunicados) abaComunicados.style.display = 'block';

    // Se houver um comunicado aberto em leitura, mantém a visualização detalhada atualizada
    if (estadoUI.comunicadoAbertoId) {
        const itemAberto = todosComunicados.find(function (c) { return c.id === estadoUI.comunicadoAbertoId; });
        if (itemAberto) {
            document.getElementById('divBarraOpcComunicacao')?.classList.add('d-none');
            document.getElementById('divComConteudoCE0').style.display = 'none';
            document.getElementById('divComConteudoLerMsg').style.display = 'block';
            renderizarMensagemAberta(itemAberto);
            return;
        } else {
            estadoUI.comunicadoAbertoId = null;
        }
    }

    document.getElementById('divBarraOpcComunicacao')?.classList.remove('d-none');
    document.getElementById('divComConteudoLerMsg').style.display = 'none';
    document.getElementById('divComConteudoCE0').style.display = 'block';

    renderizarListaComunicados(todosComunicados, preferencias);
}

export function limparTodosFiltros() {
    resetarFiltrosUI();
    renderizarAplicacao();
}

// ==================== MAPA DE HANDLERS DE AÇÕES (SUBSTITUI MEGA-SWITCH) ====================

const MAPA_ACOES = {
    'abrir-comunicado': function (elAcao, id) {
        if (id) {
            estadoUI.abaCentral = 'comunicados';
            abrirComunicado(id);
        }
    },

    'voltar-para-lista': function () {
        voltarParaListaComunicados(renderizarAplicacao);
    },

    'marcar-nao-lida-aberta': function () {
        if (estadoUI.comunicadoAbertoId) {
            atualizarEstadoLeituraStorage(estadoUI.comunicadoAbertoId, false);
            voltarParaListaComunicados(renderizarAplicacao);
        }
    },

    'arquivar-aberta': function () {
        if (estadoUI.comunicadoAbertoId) {
            arquivarComunicadosStorage([estadoUI.comunicadoAbertoId], true);
            exibirToast('Comunicado arquivado (Inbox Zero).', 'sucesso');
        }
        voltarParaListaComunicados(renderizarAplicacao);
    },

    'inbox-zero-marcar-lidos': function () {
        const todos = obterComunicadosStorage();
        const prefs = obterPreferenciasStorage();
        const idsAlvo = estadoUI.selecionadosLote.size > 0
            ? Array.from(estadoUI.selecionadosLote)
            : obterComunicadosFiltrados(todos, prefs, estadoUI).map(function (c) { return c.id; });
        const marcados = marcarLoteComoLidoStorage(idsAlvo);
        estadoUI.selecionadosLote.clear();
        atualizarVisibilidadeAcoesLote();
        exibirToast(
            marcados > 0 ? `${marcados} comunicado(s) marcado(s) como lidos.` : 'Todos os comunicados visíveis já estão lidos.',
            'sucesso'
        );
        renderizarAplicacao();
    },

    'inbox-zero-arquivar': function () {
        const todos = obterComunicadosStorage();
        const prefs = obterPreferenciasStorage();
        let idsAlvo = [];
        if (estadoUI.selecionadosLote.size > 0) {
            idsAlvo = Array.from(estadoUI.selecionadosLote);
        } else {
            const visiveis = obterComunicadosFiltrados(todos, prefs, estadoUI);
            const lidosVisiveis = visiveis.filter(function (c) { return c.lido && !isCriticoAtivo(c); });
            idsAlvo = (lidosVisiveis.length > 0 ? lidosVisiveis : visiveis.filter(function (c) { return !isCriticoAtivo(c); }))
                .map(function (c) { return c.id; });
        }
        const qtdArq = arquivarComunicadosStorage(idsAlvo, true);
        estadoUI.selecionadosLote.clear();
        atualizarVisibilidadeAcoesLote();
        exibirToast(
            qtdArq > 0 ? `${qtdArq} comunicado(s) arquivado(s) — Inbox Zero atualizado!` : 'Nenhum comunicado elegível para arquivamento.',
            'sucesso'
        );
        renderizarAplicacao();
    },

    'alternar-exibir-arquivados': function () {
        estadoUI.exibirArquivados = !estadoUI.exibirArquivados;
        estadoUI.paginaAtual = 1;
        renderizarAplicacao();
    },

    'onboarding-ativar-secundarios': function () {
        const prefs = obterPreferenciasStorage();
        prefs.canaisAtivos = prefs.canaisAtivos || { portal: true, whatsapp: true, email: true };
        prefs.canaisAtivos.sms = true;
        prefs.canaisAtivos.pushApp = true;
        salvarPreferenciasStorage(prefs);

        const estOnb = obterEstadoOnboarding();
        estOnb.canaisSecundariosSugeridosAtivados = true;
        salvarEstadoOnboarding(estOnb);

        exibirToast('Canais secundários (SMS + Push App AVA) ativados na esteira de fallback!', 'sucesso');
        renderizarAplicacao();
    },

    'onboarding-dispensar': function () {
        const estOnb = obterEstadoOnboarding();
        estOnb.dispensadoPeloAluno = true;
        salvarEstadoOnboarding(estOnb);
        renderizarBannerOnboardingProgressivo();
    },

    'curtir-comunicado': function (elAcao, id) {
        if (!id) return;
        const atualizado = alternarCurtidaStorage(id);
        if (atualizado && estadoUI.comunicadoAbertoId === id) {
            renderizarMensagemAberta(atualizado);
        }
    },

    'ir-pagina': function (elAcao) {
        const pag = parseInt(elAcao.getAttribute('data-pagina') || '1', 10);
        if (!isNaN(pag)) {
            estadoUI.paginaAtual = pag;
            renderizarAplicacao();
        }
    },

    'limpar-filtros': function () {
        limparTodosFiltros();
    },

    'ir-aba-comunicados': function () {
        const houveAlteracao = estadoUI.configuracoesAlteradas;
        estadoUI.configuracoesAlteradas = false;
        estadoUI.abaCentral = 'comunicados';
        estadoUI.comunicadoAbertoId = null;
        renderizarAplicacao();
        if (houveAlteracao) {
            exibirToast('Configurações salvas com sucesso.', 'sucesso');
        }
    },

    'ir-aba-configuracoes': function () {
        estadoUI.abaCentral = 'configuracoes';
        estadoUI.comunicadoAbertoId = null;
        renderizarAplicacao();
    },

    'ir-aba-fluxo': function () {
        const houveAlteracao = estadoUI.configuracoesAlteradas && estadoUI.abaCentral === 'configuracoes';
        estadoUI.configuracoesAlteradas = false;
        estadoUI.abaCentral = 'fluxo';
        estadoUI.comunicadoAbertoId = null;
        renderizarAplicacao();
        if (houveAlteracao) {
            exibirToast('Configurações salvas com sucesso.', 'sucesso');
        }
    },

    'abrir-confirmacao-restaurar': function () {
        const modal = document.getElementById('modalConfirmarRestauracao');
        if (modal) {
            modal.classList.remove('d-none');
        }
    },

    'cancelar-restauracao-padrao': function () {
        const modal = document.getElementById('modalConfirmarRestauracao');
        if (modal) {
            modal.classList.add('d-none');
        }
    },

    'confirmar-restauracao-padrao': function () {
        const modal = document.getElementById('modalConfirmarRestauracao');
        if (modal) {
            modal.classList.add('d-none');
        }
        const padrao = restaurarPreferenciasPadraoStorage();
        renderizarAbaConfiguracoes(padrao);
        exibirToast('Configurações restauradas para os padrões com sucesso.', 'sucesso');
    },

    'restaurar-preferencias-padrao': function () {
        const modal = document.getElementById('modalConfirmarRestauracao');
        if (modal) {
            modal.classList.remove('d-none');
        }
    },

    'restaurar-demo-completa': function () {
        inicializarMockStorage(true);
        estadoUI.abaCentral = 'comunicados';
        estadoUI.comunicadoAbertoId = null;
        estadoUI.selecionadosLote.clear();
        limparTodosFiltros();
        exibirToast('Dados iniciais restaurados com sucesso.', 'sucesso');
    }
};

// ==================== REGISTRO DE EVENTOS DA CENTRAL ====================

export function registrarEventosCentral() {
    // Navegação entre as 2 abas principais: Comunicados e Configurações
    document.querySelectorAll('.pastaComunicacao[data-aba-central]').forEach(function (link) {
        link.addEventListener('click', function (e) {
            e.preventDefault();
            const aba = link.getAttribute('data-aba-central');
            if (!aba) return;
            const voltandoParaComunicados = (aba === 'comunicados' && estadoUI.abaCentral === 'configuracoes');
            const houveAlteracao = estadoUI.configuracoesAlteradas;

            estadoUI.abaCentral = aba;
            if (aba === 'comunicados') {
                estadoUI.comunicadoAbertoId = null;
                estadoUI.configuracoesAlteradas = false;
            }
            renderizarAplicacao();

            if (voltandoParaComunicados && houveAlteracao) {
                exibirToast('Configurações salvas com sucesso.', 'sucesso');
            }
        });
    });

    // Abas de Origem (Todos / Uniube / Curso)
    document.querySelectorAll('[data-filtro-origem]').forEach(function (aba) {
        aba.addEventListener('click', function (e) {
            e.preventDefault();
            const origem = aba.getAttribute('data-filtro-origem');
            if (!origem) return;
            estadoUI.filtroOrigem = origem;
            estadoUI.paginaAtual = 1;
            renderizarAplicacao();
        });
    });

    // Macro-filtros (Chips rápidos: Todos / Aulas & Provas / Eventos / Secretaria)
    document.querySelectorAll('[data-macro-chip]').forEach(function (chip) {
        chip.addEventListener('click', function () {
            const chipId = chip.getAttribute('data-macro-chip');
            if (!chipId) return;
            estadoUI.macroChip = chipId;
            estadoUI.paginaAtual = 1;
            renderizarAplicacao();
        });
    });

    // Alternador discreto de escopo (Para você / Todos da instituição)
    document.querySelectorAll('[data-escopo-feed]').forEach(function (btn) {
        btn.addEventListener('click', function () {
            const escopo = btn.getAttribute('data-escopo-feed');
            if (!escopo) return;
            estadoUI.escopoFeed = escopo;
            estadoUI.exibirArquivados = false;
            estadoUI.paginaAtual = 1;
            renderizarAplicacao();
        });
    });

    // Rádios de leitura (Todos / Não Visualizado / Visualizado)
    document.querySelectorAll('input[name="tipoMsgLida"]').forEach(function (radio) {
        radio.addEventListener('change', function (e) {
            estadoUI.filtroLeitura = e.target.value;
            estadoUI.paginaAtual = 1;
            renderizarAplicacao();
        });
    });

    // Select discreto de Prioridade
    document.getElementById('selectFiltroPrioridade')?.addEventListener('change', function (e) {
        estadoUI.filtroPrioridade = e.target.value;
        estadoUI.paginaAtual = 1;
        renderizarAplicacao();
    });

    // Busca por palavra-chave
    const inputBusca = document.getElementById('palavraChaveBusca');
    inputBusca?.addEventListener('input', function (e) {
        estadoUI.termoBusca = e.target.value;
        estadoUI.paginaAtual = 1;
        renderizarAplicacao();
    });

    document.getElementById('btnAcionarBusca')?.addEventListener('click', function () {
        inputBusca?.focus();
        renderizarAplicacao();
    });

    // Seleção em lote na barra de opções
    const checkMsgTodas = document.getElementById('checkMsgTodas');
    checkMsgTodas?.addEventListener('change', function (e) {
        const checkboxes = document.querySelectorAll('#containerLinhasComunicados .checkMsgComunicacao');
        checkboxes.forEach(function (chk) {
            chk.checked = e.target.checked;
            if (e.target.checked) {
                estadoUI.selecionadosLote.add(chk.value);
            } else {
                estadoUI.selecionadosLote.delete(chk.value);
            }
        });
        atualizarVisibilidadeAcoesLote();
    });

    document.getElementById('opcMarcLidaCom')?.addEventListener('click', function () {
        estadoUI.selecionadosLote.forEach(function (id) {
            atualizarEstadoLeituraStorage(id, true);
        });
        estadoUI.selecionadosLote.clear();
        atualizarVisibilidadeAcoesLote();
        exibirToast('Comunicados selecionados marcados como lidos.', 'sucesso');
        renderizarAplicacao();
    });

    document.getElementById('opcMarcNaoLidaCom')?.addEventListener('click', function () {
        estadoUI.selecionadosLote.forEach(function (id) {
            atualizarEstadoLeituraStorage(id, false);
        });
        estadoUI.selecionadosLote.clear();
        atualizarVisibilidadeAcoesLote();
        renderizarAplicacao();
    });

    document.getElementById('opcExcluirCom')?.addEventListener('click', function () {
        const ids = Array.from(estadoUI.selecionadosLote);
        const qtd = arquivarComunicadosStorage(ids, true);
        estadoUI.selecionadosLote.clear();
        atualizarVisibilidadeAcoesLote();
        exibirToast(`${qtd} comunicado(s) arquivado(s) com sucesso (Inbox Zero).`, 'sucesso');
        renderizarAplicacao();
    });

    document.getElementById('btnAtualizarLista')?.addEventListener('click', function () {
        renderizarAplicacao();
    });

    // Auto-save instantâneo na aba de configurações ao alterar qualquer switch/checkbox
    document.getElementById('conteudoConfiguracoesCentral')?.addEventListener('change', function (e) {
        if (
            e.target.matches('.cfg-categoria-check') ||
            e.target.matches('.cfg-canal-check') ||
            e.target.matches('.cfg-area-check')
        ) {
            estadoUI.configuracoesAlteradas = true;
            salvarConfiguracoesDoFormulario(true, null);
        }
    });

    // Delegação centralizada de eventos para ações dinâmicas
    document.addEventListener('click', function (e) {
        const acaoMenuLinha = e.target.closest('[data-acao="alternar-leitura-item"]');
        if (acaoMenuLinha) {
            e.preventDefault();
            e.stopPropagation();
            const idItem = acaoMenuLinha.getAttribute('data-id');
            if (idItem) {
                const item = obterComunicadoPorIdStorage(idItem);
                if (item) {
                    atualizarEstadoLeituraStorage(idItem, !item.lido);
                    renderizarAplicacao();
                }
            }
            return;
        }

        const acaoArquivoLinha = e.target.closest('[data-acao="alternar-arquivo-item"]');
        if (acaoArquivoLinha) {
            e.preventDefault();
            e.stopPropagation();
            const idItem = acaoArquivoLinha.getAttribute('data-id');
            if (idItem) {
                const item = obterComunicadoPorIdStorage(idItem);
                if (item) {
                    arquivarComunicadosStorage([idItem], !item.arquivado);
                    exibirToast(item.arquivado ? 'Comunicado restaurado ao feed.' : 'Comunicado arquivado (Inbox Zero).', 'sucesso');
                    renderizarAplicacao();
                }
            }
            return;
        }

        if (e.target.closest('[data-ignorar-abertura="true"]')) {
            const chk = e.target.closest('[data-acao="toggle-selecao-item"]');
            if (chk) {
                const id = chk.getAttribute('data-id');
                if (chk.checked) {
                    estadoUI.selecionadosLote.add(id);
                } else {
                    estadoUI.selecionadosLote.delete(id);
                }
                atualizarVisibilidadeAcoesLote();
            }
            return;
        }

        const elAcao = e.target.closest('[data-acao]');
        if (!elAcao) return;

        const acao = elAcao.getAttribute('data-acao');
        const id = elAcao.getAttribute('data-id');
        const handler = MAPA_ACOES[acao];

        if (typeof handler === 'function') {
            e.preventDefault();
            handler(elAcao, id);
        }
    });

    // Acessibilidade por teclado (Enter / Space) na lista de comunicados
    document.getElementById('containerLinhasComunicados')?.addEventListener('keydown', function (e) {
        if (e.key === 'Enter' || e.key === ' ') {
            const linha = e.target.closest('.elemento[data-id]');
            if (!linha || e.target.classList.contains('checkMsgComunicacao')) return;
            e.preventDefault();
            abrirComunicado(linha.getAttribute('data-id'));
        }
    });
}

