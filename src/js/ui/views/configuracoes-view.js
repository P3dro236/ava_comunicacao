/**
 * Central Inteligente de Comunicados Acadêmicos — AVA Uniube
 * Módulo: ui/views/configuracoes-view.js
 * Responsabilidade: Renderização da Aba 2 (Configurações), coleta de preferências e auditoria de governança.
 */

import { PERFIL_USUARIO } from '../../data/perfil-aluno.js';
import { AREAS_CONHECIMENTO, CATEGORIAS } from '../../data/taxonomias.js';
import { obterPreferenciasStorage, salvarPreferenciasStorage } from '../../storage/preferencias-repository.js';
import { exibirToast } from '../toast.js';

export function renderizarAbaConfiguracoes(preferencias) {
    const container = document.getElementById('conteudoConfiguracoesCentral');
    if (!container) return;

    const categoriasCurso = Object.values(CATEGORIAS).filter(function (c) { return c.origem === 'curso' && !c.essencial; });
    const categoriasUniube = Object.values(CATEGORIAS).filter(function (c) { return c.origem === 'uniube' && !c.essencial; });
    const areas = Object.values(AREAS_CONHECIMENTO).filter(function (a) { return a.id !== PERFIL_USUARIO.area; });

    const canaisAtivos = preferencias.canaisAtivos || { portal: true, whatsapp: true, sms: false, email: true, pushApp: false };
    const areasOptInSalvas = Array.isArray(preferencias.areasOptInExplicito) ? preferencias.areasOptInExplicito : [];

    container.innerHTML = `
        <div class="d-flex flex-wrap justify-content-between align-items-center gap-2 pb-3 mb-2 border-bottom">
            <div>
                <h4 class="mb-1" style="font-weight: 600; color: var(--titulo-cor);">Configurações de Comunicados</h4>
                <span class="small" style="color: rgba(255, 255, 255, 0.78);">
                    Curso vinculado: <strong>${PERFIL_USUARIO.cursoNome}</strong> · Turma: <strong>${PERFIL_USUARIO.turma}</strong>
                </span>
            </div>
            <button type="button" class="btn buttonMain" data-acao="ir-aba-comunicados">
                <i class="fas fa-arrow-left me-1"></i> Voltar para Comunicados
            </button>
        </div>

        <form id="formConfiguracoesCentral">

            <!-- SEÇÃO 1: PREFERÊNCIAS DE COMUNICADOS (CATEGORIAS COMPLEMENTARES) -->
            <div class="secao-config-card">
                <h5 class="secao-config-titulo">1. Preferências de comunicados</h5>
                <p class="secao-config-desc">
                    Categorias essenciais de aula e avaliação são obrigatórias. Selecione abaixo as categorias complementares que deseja acompanhar.
                </p>

                <div class="row g-3">
                    <div class="col-lg-6">
                        <div class="small fw-semibold mb-2">Categorias do Curso (${PERFIL_USUARIO.curso})</div>
                        <div class="d-flex flex-column gap-2">
                            ${categoriasCurso.map(function (cat) {
                                const ativa = preferencias.categoriasAtivas[cat.id] !== false;
                                return `
                                    <label class="item-config-linha" style="cursor: pointer;">
                                        <div>
                                            <span class="small d-block">${cat.nome}</span>
                                        </div>
                                        <div class="form-check form-switch m-0">
                                            <input class="form-check-input cfg-categoria-check"
                                                   type="checkbox"
                                                   role="switch"
                                                   data-cat-id="${cat.id}"
                                                   ${ativa ? 'checked' : ''}>
                                        </div>
                                    </label>
                                `;
                            }).join('')}
                        </div>
                    </div>
                    <div class="col-lg-6">
                        <div class="small fw-semibold mb-2">Categorias Institucionais (Uniube)</div>
                        <div class="d-flex flex-column gap-2">
                            ${categoriasUniube.map(function (cat) {
                                const ativa = preferencias.categoriasAtivas[cat.id] !== false;
                                return `
                                    <label class="item-config-linha" style="cursor: pointer;">
                                        <div>
                                            <span class="small d-block">${cat.nome}</span>
                                        </div>
                                        <div class="form-check form-switch m-0">
                                            <input class="form-check-input cfg-categoria-check"
                                                   type="checkbox"
                                                   role="switch"
                                                   data-cat-id="${cat.id}"
                                                   ${ativa ? 'checked' : ''}>
                                        </div>
                                    </label>
                                `;
                            }).join('')}
                        </div>
                    </div>
                </div>
            </div>

            <!-- SEÇÃO 2: CANAIS DE NOTIFICAÇÃO -->
            <div class="secao-config-card">
                <h5 class="secao-config-titulo">2. Canais de notificação</h5>
                <p class="secao-config-desc">
                    Escolha por quais canais você deseja receber os avisos e notificações da instituição.
                </p>

                <div class="row g-2">
                    <div class="col-md-6 col-xl-3">
                        <label class="item-config-linha w-100" style="cursor: pointer;">
                            <div>
                                <span class="small fw-semibold d-block"><i class="fas fa-mobile-alt me-2" style="color:#64b5f6;"></i>Push App AVA</span>
                                <span style="font-size: 0.74rem; color: rgba(255, 255, 255, 0.7);">Notificações no aplicativo</span>
                            </div>
                            <div class="form-check form-switch m-0">
                                <input class="form-check-input cfg-canal-check" type="checkbox" role="switch" data-canal="pushApp" ${canaisAtivos.pushApp ? 'checked' : ''}>
                            </div>
                        </label>
                    </div>

                    <div class="col-md-6 col-xl-3">
                        <label class="item-config-linha w-100" style="cursor: pointer;">
                            <div>
                                <span class="small fw-semibold d-block"><i class="fab fa-whatsapp me-2" style="color:#67e3a7;"></i>WhatsApp</span>
                                <span style="font-size: 0.74rem; color: rgba(255, 255, 255, 0.7);">${PERFIL_USUARIO.contatosCadastrados.whatsapp.detalhe}</span>
                            </div>
                            <div class="form-check form-switch m-0">
                                <input class="form-check-input cfg-canal-check" type="checkbox" role="switch" data-canal="whatsapp" ${canaisAtivos.whatsapp !== false ? 'checked' : ''}>
                            </div>
                        </label>
                    </div>

                    <div class="col-md-6 col-xl-3">
                        <label class="item-config-linha w-100" style="cursor: pointer;">
                            <div>
                                <span class="small fw-semibold d-block"><i class="fas fa-sms me-2" style="color:#ffcc00;"></i>SMS</span>
                                <span style="font-size: 0.74rem; color: rgba(255, 255, 255, 0.7);">${PERFIL_USUARIO.contatosCadastrados.sms.detalhe}</span>
                            </div>
                            <div class="form-check form-switch m-0">
                                <input class="form-check-input cfg-canal-check" type="checkbox" role="switch" data-canal="sms" ${canaisAtivos.sms ? 'checked' : ''}>
                            </div>
                        </label>
                    </div>

                    <div class="col-md-6 col-xl-3">
                        <label class="item-config-linha w-100" style="cursor: pointer;">
                            <div>
                                <span class="small fw-semibold d-block"><i class="far fa-envelope me-2"></i>E-mail Institucional</span>
                                <span style="font-size: 0.74rem; color: rgba(255, 255, 255, 0.7);">${PERFIL_USUARIO.contatosCadastrados.email.detalhe}</span>
                            </div>
                            <div class="form-check form-switch m-0">
                                <input class="form-check-input cfg-canal-check" type="checkbox" role="switch" data-canal="email" ${canaisAtivos.email !== false ? 'checked' : ''}>
                            </div>
                        </label>
                    </div>
                </div>
            </div>

            <!-- SEÇÃO 3: OUTRAS ÁREAS DE CONHECIMENTO DE INTERESSE -->
            <div class="secao-config-card">
                <h5 class="secao-config-titulo">3. Outras áreas de conhecimento de interesse</h5>
                <p class="secao-config-desc">
                    Por padrão, o feed exibe comunicados do seu curso (<strong>${PERFIL_USUARIO.curso}</strong>) e turma. Selecione abaixo caso deseje acompanhar comunicados e oportunidades de outras áreas de conhecimento:
                </p>
                <div class="row g-2 mt-1">
                    ${areas.map(function (area) {
                        const marcada = areasOptInSalvas.includes(area.id) ? 'checked' : '';
                        return `
                            <div class="col-md-6">
                                <label class="item-config-linha w-100" style="cursor: pointer;">
                                    <span class="small fw-semibold">
                                        <i class="fas ${area.icone} me-2 opacity-75"></i>${area.nome}
                                    </span>
                                    <input type="checkbox"
                                           class="form-check-input m-0 cfg-area-check flex-shrink-0"
                                           value="${area.id}"
                                           ${marcada}>
                                </label>
                            </div>
                        `;
                    }).join('')}
                </div>
            </div>

            <!-- Ação de restauração de padrões com confirmação -->
            <div class="d-flex justify-content-start align-items-center pt-2 mb-3">
                <button type="button" class="btn btnAltoContraste" data-acao="abrir-confirmacao-restaurar">
                    <i class="fas fa-undo-alt me-1"></i>Restaurar padrões
                </button>
            </div>

        </form>
    `;
}

export function salvarConfiguracoesDoFormulario(silencioso = false, reRenderCallback = null) {
    const novasPrefs = obterPreferenciasStorage();

    // 1. Origens (Curso e Institucional sempre ativas por padrão)
    novasPrefs.origensAtivas = { curso: true, uniube: true };

    // 2. Opt-In Absoluto de outras áreas de conhecimento
    const areasOptInExplicito = [];
    document.querySelectorAll('.cfg-area-check').forEach(function (chk) {
        if (chk.checked && chk.value !== PERFIL_USUARIO.area && !areasOptInExplicito.includes(chk.value)) {
            areasOptInExplicito.push(chk.value);
        }
    });
    novasPrefs.areasOptInExplicito = areasOptInExplicito;
    novasPrefs.areasInteresse = [PERFIL_USUARIO.area].concat(areasOptInExplicito);

    // 3. Categorias
    document.querySelectorAll('.cfg-categoria-check').forEach(function (chk) {
        const catId = chk.getAttribute('data-cat-id');
        if (catId) {
            const isEssencial = CATEGORIAS[catId]?.essencial;
            novasPrefs.categoriasAtivas[catId] = isEssencial ? true : Boolean(chk.checked);
        }
    });

    // 4. Canais de notificação
    novasPrefs.canaisAtivos = { portal: true, whatsapp: true, sms: false, email: true, pushApp: false };
    document.querySelectorAll('.cfg-canal-check').forEach(function (chk) {
        const canal = chk.getAttribute('data-canal');
        if (canal) {
            novasPrefs.canaisAtivos[canal] = Boolean(chk.checked);
        }
    });

    salvarPreferenciasStorage(novasPrefs);
    if (!silencioso) {
        exibirToast('Configuração salva com sucesso.', 'sucesso');
    }
    if (typeof reRenderCallback === 'function') {
        reRenderCallback();
    }
}

