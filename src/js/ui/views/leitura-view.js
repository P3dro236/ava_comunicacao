/**
 * Central Inteligente de Comunicados Acadêmicos — AVA Uniube
 * Módulo: ui/views/leitura-view.js
 * Responsabilidade: Renderização da mensagem aberta (#divComConteudoLerMsg), card de telemetria de fallback e fluxo de leitura.
 */

import { PERFIL_USUARIO } from '../../data/perfil-aluno.js';
import { CATEGORIAS, PRIORIDADES } from '../../data/taxonomias.js';
import { estadoUI } from '../../state/ui-state.js';
import { atualizarEstadoLeituraStorage, obterComunicadosStorage } from '../../storage/comunicados-repository.js';
import { obterEstadoOnboarding, salvarEstadoOnboarding } from '../../storage/onboarding-repository.js';
import { obterPreferenciasStorage } from '../../storage/preferencias-repository.js';
import { formatarDataHoraBR, formatarDataHoraLeitura } from '../../utils/formatters.js';
import { atualizarContadoresENotificacoes } from './contadores-view.js';

export function renderizarMensagemAberta(item) {
    const containerMsg = document.getElementById('divMensagemComunicacao');
    if (!containerMsg) return;

    const cat = CATEGORIAS[item.categoria];
    const prio = PRIORIDADES[item.prioridade] || PRIORIDADES.normal;
    const nomeOrigem = item.origem === 'uniube' ? 'Uniube (Institucional)' : `Curso (${PERFIL_USUARIO.curso})`;

    const badgePrioridadeLeitura = item.prioridade === 'critica'
        ? `<span class="indicador-prioridade-critica" title="Prioridade Máxima"><i class="fas fa-exclamation-triangle me-1" style="font-size: 0.65rem;"></i>Máxima</span>`
        : (item.prioridade === 'alta'
            ? `<span class="indicador-prioridade-alta" title="Prioridade Alta"><i class="fas fa-exclamation-circle me-1" style="font-size: 0.65rem;"></i>Alta</span>`
            : (item.prioridade === 'baixa'
                ? `<span class="indicador-prioridade-baixa" title="Prioridade Baixa"><i class="fas fa-arrow-down me-1" style="font-size: 0.65rem;"></i>Baixa</span>`
                : ''));

    containerMsg.innerHTML = `
        <div class="row mb-4">
            <div class="col-lg-12" id="divTituloComunicacao">
                <h4 class="d-inline-flex align-items-center flex-wrap gap-2">
                    <span>${item.titulo}</span>${badgePrioridadeLeitura}
                </h4>
            </div>
        </div>

        <div class="row mb-4 pt-3 pb-3" id="divGeralMsgComSeq_${item.sequencia}">
            <!-- Coluna de Avatar Circular 50x50px -->
            <div class="col-md-1 pe-0 me-2 w-auto">
                <div class="avatar-remetente-circular rounded-circle" aria-hidden="true">
                    ${item.iniciaisRemetente || 'UN'}
                </div>
            </div>

            <!-- Coluna Principal da Mensagem -->
            <div class="col-md-11">
                <!-- Cabeçalho de Remetente e Data/Ações (Idêntico às páginas originais de leitura) -->
                <div class="pb-3 d-flex justify-content-between">
                    <div>
                        <h6></h6>
                        <div class="d-inline">
                            <strong>${item.remetente}</strong>
                        </div>
                    </div>
                    <div class="d-flex">
                        <div class="me-3">
                            <span style="color:#5F6368">
                                ${formatarDataHoraLeitura(item.publicadoEm)}
                            </span>
                            <span id="opcsComSeq_${item.sequencia}" data-bs-toggle="dropdown" aria-expanded="false" style="color:#5F6368;padding-left:10px;padding-right:5px;cursor:pointer">
                                <i class="fas fa-ellipsis-v"></i>
                            </span>
                            <div class="dropdown-menu dropdown-menu-end" aria-labelledby="opcsComSeq_${item.sequencia}" style="width:15rem;background-color:#242a33;border:1px solid rgba(255,255,255,0.12)">
                                <div class="row ps-2 pe-2 m-0 align-items-center divOpcComLateral" data-legado-inerte="true">
                                    <div class="col-2"><i class="fas fa-reply"></i></div>
                                    <div class="col-10">Responder</div>
                                </div>
                                <div class="row ps-2 pe-2 m-0 align-items-center divOpcComLateral" data-legado-inerte="true">
                                    <div class="col-2"><i class="fas fa-share"></i></div>
                                    <div class="col-10">Encaminhar</div>
                                </div>
                                <div class="row ps-2 pe-2 m-0 align-items-center divOpcComLateral" data-acao="arquivar-aberta">
                                    <div class="col-2"><i class="fas fa-archive"></i></div>
                                    <div class="col-10">Arquivar esta mensagem</div>
                                </div>
                            </div>
                        </div>

                        <div class="me-3">
                            <i id="idIconCurtirMsg"
                               class="${item.curtido ? 'fas' : 'far'} fa-thumbs-up"
                               style="cursor:pointer"
                               title="Curtir"
                               data-acao="curtir-comunicado"
                               data-id="${item.id}"></i>
                        </div>
                    </div>
                </div>

                <!-- Linha de Destinatários e Dropdown de Metadados (.dropDownComunicacao) -->
                <div class="d-flex" style="margin-top:-1.25rem">
                    <div class="pt-1 pb-2 cor-texto-cinza divDestinatariosCom">
                        para ${item.publico}
                    </div>
                    <div class="btn-group ms-1">
                        <button type="button"
                                 class="btnComunicacaoMais btn dropdown-toggle p-0 m-0"
                                 id="dropdownMenuButton_${item.sequencia}"
                                 data-bs-toggle="dropdown"
                                 aria-expanded="false"
                                 title="Mostrar detalhes">
                        </button>
                        <div class="dropdown-menu dropdown-menu-end dropDownComunicacao" aria-labelledby="dropdownMenuButton_${item.sequencia}">
                            <div class="row p-2 g-1">
                                <div class="col-3 text-end cor-texto-cinza">de:</div>
                                <div class="col-9"><b>${item.remetente}</b></div>
                            </div>
                            <div class="row px-2 g-1">
                                <div class="col-3 text-end cor-texto-cinza">origem:</div>
                                <div class="col-9">${nomeOrigem}</div>
                            </div>
                            <div class="row px-2 g-1">
                                <div class="col-3 text-end cor-texto-cinza">para:</div>
                                <div class="col-9">${item.publico} (${PERFIL_USUARIO.nome})</div>
                            </div>
                            <div class="row px-2 g-1">
                                <div class="col-3 text-end cor-texto-cinza">categoria:</div>
                                <div class="col-9">${cat ? cat.nome : item.categoria}</div>
                            </div>
                            <div class="row px-2 g-1">
                                <div class="col-3 text-end cor-texto-cinza">prioridade:</div>
                                <div class="col-9">${prio.nome}</div>
                            </div>
                            <div class="row px-2 g-1">
                                <div class="col-3 text-end cor-texto-cinza">data:</div>
                                <div class="col-9">${formatarDataHoraBR(item.publicadoEm)}</div>
                            </div>
                            <div class="row p-2 g-1">
                                <div class="col-3 text-end cor-texto-cinza">assunto:</div>
                                <div class="col-9">${item.titulo}</div>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Corpo da Mensagem (#divConteudoMsgComSeq... -> #divDesc0) -->
                <div id="divConteudoMsgComSeq_${item.sequencia}" class="pt-2 pb-4 corpo-mensagem-aberta">
                    <div class="row">
                        <div class="col-md-12" id="divDesc0">
                            <span style="font-size:18px">${item.conteudo}</span>
                        </div>
                    </div>
                </div>

                <!-- Barra Inferior de Ações (.mb-4.responsivo) -->
                <div class="mb-4 responsivo" style="display:flex;gap:1rem;align-items:center;justify-content:center">
                    <div id="divBtnCurtirMsg">
                        <button type="button" id="btnCurtirMsg" class="btn buttonMain" data-acao="curtir-comunicado" data-id="${item.id}" title="Curtir mensagem">
                            <i class="${item.curtido ? 'fas' : 'far'} fa-thumbs-up"></i>
                        </button>
                    </div>
                    <div>
                        <button type="button" class="btn buttonMain" data-acao="arquivar-aberta">
                            <i class="fas fa-archive me-1"></i> Arquivar
                        </button>
                    </div>
                    <div>
                        <button type="button" class="btn buttonMain" data-legado-inerte="true">
                            <i class="fas fa-share"></i> Encaminhar
                        </button>
                    </div>
                </div>
            </div>
        </div>
    `;
}

export function abrirComunicado(idComunicado) {
    const itemAtualizado = atualizarEstadoLeituraStorage(idComunicado, true);
    if (!itemAtualizado) return;

    estadoUI.comunicadoAbertoId = idComunicado;

    // Gatilho de Onboarding Progressivo: dispara apenas após o aluno interagir com o 1º aviso de Prioridade Alta
    if (itemAtualizado.prioridade === 'alta') {
        const estadoOnb = obterEstadoOnboarding();
        if (!estadoOnb.interagiuPrioridadeAlta) {
            estadoOnb.interagiuPrioridadeAlta = true;
            estadoOnb.primeiroComunicadoAltaId = itemAtualizado.id;
            salvarEstadoOnboarding(estadoOnb);
        }
    }

    document.getElementById('divBarraOpcComunicacao')?.classList.add('d-none');
    document.getElementById('stickyCriticosContainer')?.classList.add('d-none');
    const divLista = document.getElementById('divComConteudoCE0');
    const divLeitura = document.getElementById('divComConteudoLerMsg');

    if (divLista) divLista.style.display = 'none';
    if (divLeitura) divLeitura.style.display = 'block';

    renderizarMensagemAberta(itemAtualizado);
    atualizarContadoresENotificacoes(obterComunicadosStorage(), obterPreferenciasStorage());
}

export function voltarParaListaComunicados(reRenderCallback) {
    estadoUI.comunicadoAbertoId = null;

    document.getElementById('divBarraOpcComunicacao')?.classList.remove('d-none');
    const divLista = document.getElementById('divComConteudoCE0');
    const divLeitura = document.getElementById('divComConteudoLerMsg');

    if (divLeitura) divLeitura.style.display = 'none';
    if (divLista) divLista.style.display = 'block';

    if (typeof reRenderCallback === 'function') {
        reRenderCallback();
    }
}

