/**
 * Central Inteligente de Comunicados Acadêmicos — AVA Uniube
 * Módulo: ui/views/contadores-view.js
 * Responsabilidade: Sincronização de contadores não lidos, sino de notificações, controles de filtro e barra de ações em lote.
 */

import { executarQueryFeedOptIn, isCriticoAtivo } from '../../domain/feed-service.js';
import { estadoUI, possuiFiltroAtivo } from '../../state/ui-state.js';
import { formatarDataHoraBR } from '../../utils/formatters.js';

export function atualizarContadoresENotificacoes(todosComunicados, preferencias) {
    const relevantes = todosComunicados.filter(function (c) {
        return executarQueryFeedOptIn(c, preferencias);
    });
    const naoLidosCount = relevantes.filter(function (c) { return !c.lido; }).length;

    const elQtdNaoLidas = document.getElementById('divQtdMCNaoLidas');
    if (elQtdNaoLidas) {
        elQtdNaoLidas.textContent = String(naoLidosCount);
    }

    // Atualiza sino de notificações com críticos ativos não lidos
    const criticosAtivos = todosComunicados.filter(function (c) { return isCriticoAtivo(c); });
    const criticosNaoLidos = criticosAtivos.filter(function (c) { return !c.lido; });
    const badgeSino = document.getElementById('badgeSinoCriticos');
    const corpoSino = document.getElementById('corpoCardNotificacaoSino');

    if (badgeSino) {
        if (criticosNaoLidos.length > 0) {
            badgeSino.textContent = String(criticosNaoLidos.length);
            badgeSino.style.display = 'inline-flex';
        } else {
            badgeSino.style.display = 'none';
        }
    }

    if (corpoSino) {
        if (criticosAtivos.length > 0) {
            corpoSino.innerHTML = criticosAtivos.map(function (c) {
                return `
                    <div class="py-2 border-bottom" style="cursor: pointer;" data-acao="abrir-comunicado" data-id="${c.id}">
                        <div class="d-flex align-items-center gap-2 mb-1">
                            <span class="indicador-prioridade-critica">Máxima</span>
                            <small class="text-white-50">${formatarDataHoraBR(c.publicadoEm)}</small>
                        </div>
                        <div class="small fw-semibold">${c.titulo}</div>
                    </div>
                `;
            }).join('');
        } else {
            corpoSino.innerHTML = `
                <div class="d-flex align-items-center gap-2">
                    <i style="font-size: 0.95rem; color: #23bc7b;" class="fas fa-check" aria-hidden="true"></i>
                    <span class="span-corpo small">Todas notificações lidas ou nenhuma notificação encontrada.</span>
                </div>
            `;
        }
    }
}

export function sincronizarControlesNavegacao() {
    // Navegação lateral da Central (Comunicados vs Configurações vs Fluxo de Comunicação)
    document.querySelectorAll('.pastaComunicacao[data-aba-central]').forEach(function (link) {
        const aba = link.getAttribute('data-aba-central');
        const ativa = aba === estadoUI.abaCentral;
        link.classList.toggle('sel', ativa);
        link.classList.toggle('fw-bold', ativa);
    });

    // Sincroniza destaque no menu lateral esquerdo global (#sidenav)
    const menuCom = document.getElementById('menu_59');
    const menuFluxo = document.getElementById('menu_fluxo');
    if (menuCom && menuFluxo) {
        const isFluxo = estadoUI.abaCentral === 'fluxo';
        menuCom.classList.toggle('menu-ativo', !isFluxo);
        menuFluxo.classList.toggle('menu-ativo', isFluxo);
    }

    // Macro-filtros (Chips rápidos: Todos, Aulas & Provas, Eventos, Secretaria)
    document.querySelectorAll('[data-macro-chip]').forEach(function (chip) {
        const idChip = chip.getAttribute('data-macro-chip');
        const ativo = idChip === estadoUI.macroChip;
        chip.classList.toggle('active', ativo);
        chip.setAttribute('aria-pressed', ativo ? 'true' : 'false');
    });

    // Rádios de leitura
    document.querySelectorAll('input[name="tipoMsgLida"]').forEach(function (radio) {
        radio.checked = (radio.value === estadoUI.filtroLeitura);
    });

    // Selects e Busca
    const selPrioridade = document.getElementById('selectFiltroPrioridade');
    const inputBusca = document.getElementById('palavraChaveBusca');
    const btnLimpar = document.getElementById('btnLimparFiltrosDiscreto');

    if (selPrioridade) selPrioridade.value = estadoUI.filtroPrioridade;
    if (inputBusca && inputBusca.value !== estadoUI.termoBusca) {
        inputBusca.value = estadoUI.termoBusca;
    }

    btnLimpar?.classList.toggle('d-none', !possuiFiltroAtivo());
}

export function atualizarVisibilidadeAcoesLote() {
    const qtdSel = estadoUI.selecionadosLote.size;
    const temSelecao = qtdSel > 0;
    document.getElementById('opcMarcLidaCom')?.classList.toggle('d-none', !temSelecao);
    document.getElementById('opcMarcNaoLidaCom')?.classList.toggle('d-none', !temSelecao);
    document.getElementById('opcExcluirCom')?.classList.toggle('d-none', !temSelecao);

    const lblLer = document.getElementById('labelBtnInboxLerTodos');
    const lblArq = document.getElementById('labelBtnInboxArquivar');
    if (lblLer) {
        lblLer.textContent = temSelecao ? `Marcar lidos (${qtdSel})` : 'Marcar todos como lidos';
    }
    if (lblArq) {
        lblArq.textContent = temSelecao ? `Arquivar (${qtdSel})` : 'Arquivar lidos';
    }

    const chkTodos = document.getElementById('checkMsgTodas');
    if (chkTodos && !temSelecao) {
        chkTodos.checked = false;
    }
}

