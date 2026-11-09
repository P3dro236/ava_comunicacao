/**
 * Central Inteligente de Comunicados Acadêmicos — AVA Uniube
 * Arquivo: js/central-comunicados.js
 * Fidelidade ao layout original:
 *  - Lista de comunicados (#divComConteudoCE0) idêntica à página principal de Comunicação do AVA Uniube
 *  - Visualização de comunicado aberto (#divComConteudoLerMsg) idêntica às páginas de leitura do AVA Uniube
 *  - Navegação separada em duas abas principais: Comunicados e Configurações
 */

(function (window, document) {
    'use strict';

    const DataAPI = window.UniubeComunicadosData;

    const estadoUI = {
        abaCentral: 'comunicados',      // 'comunicados' | 'configuracoes'
        escopoFeed: 'relevantes',       // 'relevantes' (Opt-In Absoluto: curso/turma + áreas opt-in) | 'todos' (acervo completo)
        filtroOrigem: 'todas',          // 'todas' | 'uniube' | 'curso'
        macroChip: 'todas',             // 'todas' | 'aulas_provas' | 'eventos' | 'secretaria'
        filtroPrioridade: 'todas',      // 'todas' | 'critica' | 'alta' | 'normal' | 'baixa'
        filtroLeitura: 'todos',         // 'todos' | 'nao_lidos' | 'lidos'
        exibirArquivados: false,        // Inbox Zero: alterna visualização de arquivados
        termoBusca: '',
        paginaAtual: 1,                 // paginação nativa (10 itens por página)
        itensPorPagina: 10,
        comunicadoAbertoId: null,       // null = exibe lista (#divComConteudoCE0); string = exibe leitura (#divComConteudoLerMsg)
        selecionadosLote: new Set()
    };

    // ==================== FORMATAÇÃO DE DATAS ====================

    function formatarDataHoraBR(isoStr) {
        if (!isoStr) return '';
        const d = new Date(isoStr);
        if (isNaN(d.getTime())) return isoStr;
        const dia = String(d.getDate()).padStart(2, '0');
        const mes = String(d.getMonth() + 1).padStart(2, '0');
        const ano = d.getFullYear();
        const hora = String(d.getHours()).padStart(2, '0');
        const min = String(d.getMinutes()).padStart(2, '0');
        return `${dia}/${mes}/${ano} ${hora}:${min}`;
    }

    function formatarDataHoraLeitura(isoStr) {
        if (!isoStr) return '';
        const d = new Date(isoStr);
        if (isNaN(d.getTime())) return isoStr;
        const dia = String(d.getDate()).padStart(2, '0');
        const mes = String(d.getMonth() + 1).padStart(2, '0');
        const ano = d.getFullYear();
        const hora = String(d.getHours()).padStart(2, '0');
        const min = String(d.getMinutes()).padStart(2, '0');
        const seg = String(d.getSeconds()).padStart(2, '0');
        return `${dia}/${mes}/${ano} ${hora}:${min}:${seg}`;
    }

    // ==================== REGRAS DE NEGÓCIO: OPT-IN ABSOLUTO E CLASSIFICAÇÃO ====================

    function isExpirado(item) {
        if (!item.expiraEm) return false;
        return new Date(item.expiraEm).getTime() <= new Date(DataAPI.DATA_ATUAL_FICTICIA).getTime();
    }

    function isCriticoAtivo(item) {
        return item.prioridade === 'critica' && !isExpirado(item) && !item.arquivado;
    }

    /**
     * Query de Opt-In Absoluto:
     * Carrega estritamente os comunicados referentes ao curso e turma matriculados do aluno.
     * O recebimento de outras áreas de conhecimento exige ativação explícita no banco (areasOptInExplicito).
     */
    function pertenceAoFeedRelevante(item, preferencias) {
        return DataAPI.executarQueryFeedOptIn(item, preferencias);
    }

    function pertenceAoMacroChip(item, chipId) {
        if (!chipId || chipId === 'todas') return true;
        const defChip = (DataAPI.MACRO_FILTROS_CHIPS || []).find(function (m) { return m.id === chipId; });
        if (!defChip || !Array.isArray(defChip.categorias) || defChip.categorias.length === 0) return true;
        return defChip.categorias.includes(item.categoria);
    }

    function obterPesoOrdenacao(item) {
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

    // ==================== PERSISTÊNCIA NO LOCALSTORAGE & INBOX ZERO ====================

    function atualizarEstadoLeituraStorage(idComunicado, novoStatusLido) {
        const lista = DataAPI.obterComunicadosStorage();
        const item = lista.find(function (c) { return c.id === idComunicado; });
        if (!item) return null;

        item.lido = Boolean(novoStatusLido);
        item.lidoEm = item.lido ? DataAPI.DATA_ATUAL_FICTICIA : null;
        DataAPI.salvarComunicadosStorage(lista);
        return item;
    }

    function arquivarComunicadosStorage(idsArray, arquivarStatus) {
        const setIds = new Set(idsArray);
        const lista = DataAPI.obterComunicadosStorage();
        let alterados = 0;

        lista.forEach(function (item) {
            if (setIds.has(item.id)) {
                item.arquivado = Boolean(arquivarStatus);
                alterados++;
            }
        });

        if (alterados > 0) {
            DataAPI.salvarComunicadosStorage(lista);
        }
        return alterados;
    }

    function marcarLoteComoLidoStorage(idsArray) {
        const setIds = new Set(idsArray);
        const lista = DataAPI.obterComunicadosStorage();
        let alterados = 0;

        lista.forEach(function (item) {
            if (setIds.has(item.id) && !item.lido) {
                item.lido = true;
                item.lidoEm = DataAPI.DATA_ATUAL_FICTICIA;
                alterados++;
            }
        });

        if (alterados > 0) {
            DataAPI.salvarComunicadosStorage(lista);
        }
        return alterados;
    }

    function alternarCurtidaStorage(idComunicado) {
        const lista = DataAPI.obterComunicadosStorage();
        const item = lista.find(function (c) { return c.id === idComunicado; });
        if (!item) return null;

        item.curtido = !item.curtido;
        DataAPI.salvarComunicadosStorage(lista);
        return item;
    }

    function confirmarCienciaStorage(idComunicado) {
        const lista = DataAPI.obterComunicadosStorage();
        const item = lista.find(function (c) { return c.id === idComunicado; });
        if (!item) return null;

        item.lido = true;
        if (!item.lidoEm) {
            item.lidoEm = DataAPI.DATA_ATUAL_FICTICIA;
        }
        item.cienciaConfirmada = true;
        item.cienciaEm = DataAPI.DATA_ATUAL_FICTICIA;
        DataAPI.salvarComunicadosStorage(lista);
        return item;
    }

    // ==================== FILTRAGEM E ORDENAÇÃO ====================

    function obterComunicadosFiltrados(todosComunicados, preferencias) {
        const buscaNormalizada = estadoUI.termoBusca.trim().toLowerCase();

        return todosComunicados
            .filter(function (item) {
                if (estadoUI.exibirArquivados) {
                    if (!item.arquivado) return false;
                } else {
                    if (item.arquivado) return false;
                    if (estadoUI.escopoFeed === 'relevantes') {
                        if (!pertenceAoFeedRelevante(item, preferencias)) return false;
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
                    const catNome = DataAPI.CATEGORIAS[item.categoria]?.nome || '';
                    const texto = [
                        item.titulo,
                        item.resumo,
                        item.conteudo.replace(/<[^>]+>/g, ' '),
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

    // ==================== HIERARQUIA VISUAL DE URGÊNCIA, ONBOARDING E CONTADORES ====================

    function renderizarBannerOnboardingProgressivo() {
        const container = document.getElementById('containerOnboardingProgressivo');
        if (!container) return;

        const estadoOnb = DataAPI.obterEstadoOnboarding();
        const prefs = DataAPI.obterPreferenciasStorage();
        const jaAtivouSecundarios = Boolean(prefs.canaisAtivos?.sms && prefs.canaisAtivos?.pushApp);

        // Só exibe se o aluno JÁ interagiu com o 1º aviso de Prioridade Alta e ainda não concluiu/dispensou
        if (estadoOnb.interagiuPrioridadeAlta && !estadoOnb.canaisSecundariosSugeridosAtivados && !estadoOnb.dispensadoPeloAluno && !jaAtivouSecundarios) {
            container.classList.remove('d-none');
            container.innerHTML = `
                <div class="card-onboarding-progressivo" role="region" aria-label="Sugestão de canais secundários">
                    <div class="d-flex align-items-start gap-2">
                        <i class="fas fa-bell text-warning mt-1" style="font-size: 1.1rem;"></i>
                        <div>
                            <div class="small fw-bold text-white">
                                Onboarding Progressivo — Você interagiu com um comunicado de Prioridade Alta!
                            </div>
                            <div class="small" style="color: rgba(255, 255, 255, 0.82);">
                                Para não perder prazos de provas, entregas de trabalhos ou mudanças de sala caso o WhatsApp esteja indisponível, ative os canais secundários da esteira de fallback (<strong>SMS</strong> e <strong>Push no App AVA</strong>).
                            </div>
                        </div>
                    </div>
                    <div class="d-flex align-items-center gap-2 flex-shrink-0">
                        <button type="button" class="btn btn-sm buttonMain" data-acao="onboarding-ativar-secundarios">
                            <i class="fas fa-bolt me-1"></i>Ativar SMS + Push agora
                        </button>
                        <button type="button" class="btn btn-sm btnAltoContraste" data-acao="onboarding-dispensar">
                            Agora não
                        </button>
                    </div>
                </div>
            `;
        } else {
            container.innerHTML = '';
            container.classList.add('d-none');
        }
    }

    function atualizarContadoresENotificacoes(todosComunicados, preferencias) {
        const relevantes = todosComunicados.filter(function (c) {
            return pertenceAoFeedRelevante(c, preferencias);
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
                                <span class="indicador-prioridade-critica"><i class="fas fa-exclamation-triangle"></i> Crítica</span>
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

        // Hierarquia Visual de Urgência: Sticky no topo com borda vermelha e ícone de alerta para Críticos ativos
        const stickyContainer = document.getElementById('stickyCriticosContainer');
        if (stickyContainer) {
            if (criticosNaoLidos.length > 0 && !estadoUI.comunicadoAbertoId) {
                const primeiroCritico = criticosNaoLidos[0];
                const infoFallback = DataAPI.executarEsteiraFallbackMulticanal(primeiroCritico);
                stickyContainer.classList.remove('d-none');
                stickyContainer.innerHTML = `
                    <div class="alerta-critico-topo" role="alert">
                        <div class="d-flex align-items-center flex-wrap gap-2">
                            <i class="fas fa-exclamation-triangle icone-urgencia-pulsante" aria-hidden="true"></i>
                            <span class="indicador-prioridade-critica">
                                Prioridade Crítica — Urgente
                            </span>
                            <span class="fw-bold text-white">${primeiroCritico.titulo}</span>
                            <span class="small" style="color: #67e3a7;">
                                <i class="fas fa-check-double me-1"></i>${infoFallback.canalConfirmado}
                            </span>
                            ${criticosNaoLidos.length > 1 ? `<span class="small text-white-50">(+${criticosNaoLidos.length - 1} alerta crítico ativo)</span>` : ''}
                        </div>
                        <button type="button" class="btn btn-sm buttonMain flex-shrink-0" style="border-color: #ef4444;" data-acao="abrir-comunicado" data-id="${primeiroCritico.id}">
                            <i class="fas fa-eye me-1"></i>Ler agora
                        </button>
                    </div>
                `;
            } else {
                stickyContainer.innerHTML = '';
                stickyContainer.classList.add('d-none');
            }
        }

        renderizarBannerOnboardingProgressivo();
    }

    // ==================== RENDERIZAÇÃO DA LISTA (Fiel ao DOM de .elemento e .linha-comunicacao) ====================

    function renderizarPrioridadeNaLista(item) {
        if (isExpirado(item)) {
            return '';
        }
        if (item.prioridade === 'critica') {
            return `<span class="indicador-prioridade-critica ms-2" title="Prioridade Crítica">
                <i class="fas fa-exclamation-triangle" aria-hidden="true"></i> Crítica
            </span>`;
        }
        if (item.prioridade === 'alta') {
            return `<span class="indicador-prioridade-alta ms-2" title="Prioridade Alta">Alta</span>`;
        }
        return '';
    }

    function renderizarLinhaComunicado(item) {
        const cat = DataAPI.CATEGORIAS[item.categoria];
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

                    <span class="py-0 my-auto span-corpo d-flex titltMarc" style="flex:1;width:36%" title="${item.titulo.replace(/"/g, '&quot;')}">
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

    function renderizarPaginacaoNativa(totalItens) {
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

    // ==================== VISUALIZAÇÃO DETALHADA DO COMUNICADO (#divComConteudoLerMsg) ====================

    function renderizarCardEsteiraFallback(item) {
        if (item.prioridade !== 'critica' && item.prioridade !== 'alta') {
            return '';
        }

        const telemetria = DataAPI.executarEsteiraFallbackMulticanal(item);
        const cenarioAtual = item.cenarioFallback || 'WHATSAPP_OK';

        return `
            <div class="card-fallback-telemetria" role="region" aria-label="Protocolo de Fallback Multicanal">
                <div class="d-flex flex-wrap justify-content-between align-items-center gap-2 mb-2">
                    <div>
                        <span class="small fw-bold text-white">
                            <i class="fas fa-sitemap me-1" style="color: #67e3a7;"></i>
                            Protocolo de Fallback Multicanal (${item.prioridade === 'critica' ? 'Prioridade Crítica' : 'Prioridade Alta'})
                        </span>
                        <div class="small" style="color: rgba(255, 255, 255, 0.78);">
                            ${telemetria.resumo}
                        </div>
                    </div>
                    <div class="d-flex flex-wrap gap-1" title="Simular cenário de entrega na esteira">
                        <button type="button"
                                class="btn btn-sm ${cenarioAtual === 'WHATSAPP_OK' ? 'buttonMain' : 'btnAltoContraste'}"
                                style="font-size: 0.72rem; padding: 0.18rem 0.5rem;"
                                data-acao="simular-fallback"
                                data-id="${item.id}"
                                data-cenario="WHATSAPP_OK">
                            1. WhatsApp OK (9s)
                        </button>
                        <button type="button"
                                class="btn btn-sm ${cenarioAtual === 'FALLBACK_SMS' ? 'buttonMain' : 'btnAltoContraste'}"
                                style="font-size: 0.72rem; padding: 0.18rem 0.5rem;"
                                data-acao="simular-fallback"
                                data-id="${item.id}"
                                data-cenario="FALLBACK_SMS">
                            2. Timeout 5min &rarr; SMS
                        </button>
                        <button type="button"
                                class="btn btn-sm ${cenarioAtual === 'FALLBACK_PUSH_ULTIMO_RECURSO' ? 'buttonMain' : 'btnAltoContraste'}"
                                style="font-size: 0.72rem; padding: 0.18rem 0.5rem;"
                                data-acao="simular-fallback"
                                data-id="${item.id}"
                                data-cenario="FALLBACK_PUSH_ULTIMO_RECURSO">
                            3. Falha SMS &rarr; Push App
                        </button>
                    </div>
                </div>
                <div class="d-flex flex-wrap align-items-center gap-2 mt-2">
                    ${telemetria.etapas.map(function (et) {
                        const corIcone = et.status.includes('DELIVERED') ? '#67e3a7' : '#f59e0b';
                        const icone = et.status.includes('DELIVERED') ? 'fa-check-circle' : 'fa-clock';
                        return `
                            <span class="etapa-fallback-pill">
                                <i class="fas ${icone}" style="color: ${corIcone};"></i>
                                <span><strong>Etapa ${et.ordem} (${et.canal}):</strong> ${et.detalhe}</span>
                            </span>
                        `;
                    }).join('<i class="fas fa-arrow-right small opacity-50"></i>')}
                </div>
            </div>
        `;
    }

    function renderizarMensagemAberta(item) {
        const containerMsg = document.getElementById('divMensagemComunicacao');
        if (!containerMsg) return;

        const cat = DataAPI.CATEGORIAS[item.categoria];
        const prio = DataAPI.PRIORIDADES[item.prioridade] || DataAPI.PRIORIDADES.normal;
        const nomeOrigem = item.origem === 'uniube' ? 'Uniube (Institucional)' : `Curso (${DataAPI.PERFIL_USUARIO.curso})`;

        const badgePrioridadeLeitura = item.prioridade === 'critica'
            ? `<span class="indicador-prioridade-critica ms-2"><i class="fas fa-exclamation-triangle"></i> Prioridade Crítica</span>`
            : (item.prioridade === 'alta'
                ? `<span class="indicador-prioridade-alta ms-2">Prioridade Alta</span>`
                : '');

        containerMsg.innerHTML = `
            <div class="row mb-4">
                <div class="col-lg-12" id="divTituloComunicacao">
                    <h4>${item.titulo}</h4>
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
                                ${badgePrioridadeLeitura}
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
                                    <div class="col-9">${item.publico} (${DataAPI.PERFIL_USUARIO.nome})</div>
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

                    ${renderizarCardEsteiraFallback(item)}

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
                        ${item.exigeCiencia ? `
                            <div>
                                <button type="button"
                                        class="btn buttonMain ${item.cienciaConfirmada ? 'btn-ciencia-ativa' : ''}"
                                        data-acao="confirmar-ciencia"
                                        data-id="${item.id}"
                                        ${item.cienciaConfirmada ? 'disabled' : ''}>
                                    <i class="fas ${item.cienciaConfirmada ? 'fa-check-double' : 'fa-file-signature'} me-1"></i>
                                    ${item.cienciaConfirmada ? 'Ciência confirmada' : 'Confirmar ciência'}
                                </button>
                            </div>
                        ` : ''}
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

    function abrirComunicado(idComunicado) {
        const itemAtualizado = atualizarEstadoLeituraStorage(idComunicado, true);
        if (!itemAtualizado) return;

        estadoUI.comunicadoAbertoId = idComunicado;

        // Gatilho de Onboarding Progressivo: dispara apenas após o aluno interagir com o 1º aviso de Prioridade Alta
        if (itemAtualizado.prioridade === 'alta') {
            const estadoOnb = DataAPI.obterEstadoOnboarding();
            if (!estadoOnb.interagiuPrioridadeAlta) {
                estadoOnb.interagiuPrioridadeAlta = true;
                estadoOnb.primeiroComunicadoAltaId = itemAtualizado.id;
                DataAPI.salvarEstadoOnboarding(estadoOnb);
            }
        }

        document.getElementById('divBarraOpcComunicacao')?.classList.add('d-none');
        document.getElementById('stickyCriticosContainer')?.classList.add('d-none');
        const divLista = document.getElementById('divComConteudoCE0');
        const divLeitura = document.getElementById('divComConteudoLerMsg');

        if (divLista) divLista.style.display = 'none';
        if (divLeitura) divLeitura.style.display = 'block';

        renderizarMensagemAberta(itemAtualizado);
        atualizarContadoresENotificacoes(DataAPI.obterComunicadosStorage(), DataAPI.obterPreferenciasStorage());
    }

    function voltarParaListaComunicados() {
        estadoUI.comunicadoAbertoId = null;

        document.getElementById('divBarraOpcComunicacao')?.classList.remove('d-none');
        const divLista = document.getElementById('divComConteudoCE0');
        const divLeitura = document.getElementById('divComConteudoLerMsg');

        if (divLeitura) divLeitura.style.display = 'none';
        if (divLista) divLista.style.display = 'block';

        renderizarAplicacao();
    }

    // ==================== ABA 2 — CONFIGURAÇÕES (Sugestões Inteligentes + Opt-In + Governança) ====================

    function renderizarAbaConfiguracoes(preferencias) {
        const container = document.getElementById('conteudoConfiguracoesCentral');
        if (!container) return;

        const categoriasCurso = Object.values(DataAPI.CATEGORIAS).filter(function (c) { return c.origem === 'curso' && !c.essencial; });
        const categoriasUniube = Object.values(DataAPI.CATEGORIAS).filter(function (c) { return c.origem === 'uniube' && !c.essencial; });
        const areas = Object.values(DataAPI.AREAS_CONHECIMENTO).filter(function (a) { return a.id !== DataAPI.PERFIL_USUARIO.area; });
        const prioridadesLista = Object.values(DataAPI.PRIORIDADES).filter(function (p) { return !p.obrigatoria; });

        const canaisAtivos = preferencias.canaisAtivos || { portal: true, whatsapp: true, sms: false, email: true, pushApp: false };
        const prioConfig = preferencias.prioridadesRecebimento || DataAPI.PREFERENCIAS_PADRAO.prioridadesRecebimento;
        const areasOptInSalvas = Array.isArray(preferencias.areasOptInExplicito) ? preferencias.areasOptInExplicito : [];

        container.innerHTML = `
            <div class="d-flex flex-wrap justify-content-between align-items-center gap-2 pb-3 mb-2 border-bottom">
                <div>
                    <h4 class="mb-1" style="font-weight: 600; color: var(--titulo-cor);">Configurações de Comunicados</h4>
                    <span class="small" style="color: rgba(255, 255, 255, 0.78);">
                        Curso vinculado: <strong>${DataAPI.PERFIL_USUARIO.cursoNome}</strong> · Turma: <strong>${DataAPI.PERFIL_USUARIO.turma}</strong>
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
                            <div class="small fw-semibold mb-2">Categorias do Curso (${DataAPI.PERFIL_USUARIO.curso})</div>
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

                <!-- SEÇÃO 2: CANAIS DE NOTIFICAÇÃO E ESTEIRA DE FALLBACK -->
                <div class="secao-config-card">
                    <h5 class="secao-config-titulo">2. Canais de notificação e Esteira de Fallback</h5>
                    <p class="secao-config-desc">
                        Para avisos de <strong>Prioridade Crítica e Alta</strong>, o disparo primário ocorre via <strong>WhatsApp API</strong> (timeout de 5 min no webhook) &rarr; fallback via <strong>SMS</strong> &rarr; <strong>Push Notification no App</strong> como último recurso.
                    </p>

                    <div class="row g-2">
                        <div class="col-md-6 col-xl-3">
                            <label class="item-config-linha w-100" style="cursor: pointer;">
                                <div>
                                    <span class="small fw-semibold d-block"><i class="fab fa-whatsapp me-2" style="color:#67e3a7;"></i>1º WhatsApp API</span>
                                    <span style="font-size: 0.74rem; color: rgba(255, 255, 255, 0.7);">${DataAPI.PERFIL_USUARIO.contatosCadastrados.whatsapp.detalhe}</span>
                                </div>
                                <div class="form-check form-switch m-0">
                                    <input class="form-check-input cfg-canal-check" type="checkbox" role="switch" data-canal="whatsapp" ${canaisAtivos.whatsapp !== false ? 'checked' : ''}>
                                </div>
                            </label>
                        </div>

                        <div class="col-md-6 col-xl-3">
                            <label class="item-config-linha w-100" style="cursor: pointer;">
                                <div>
                                    <span class="small fw-semibold d-block"><i class="fas fa-sms me-2" style="color:#ffcc00;"></i>2º SMS (Fallback 5m)</span>
                                    <span style="font-size: 0.74rem; color: rgba(255, 255, 255, 0.7);">${DataAPI.PERFIL_USUARIO.contatosCadastrados.sms.detalhe}</span>
                                </div>
                                <div class="form-check form-switch m-0">
                                    <input class="form-check-input cfg-canal-check" type="checkbox" role="switch" data-canal="sms" ${canaisAtivos.sms ? 'checked' : ''}>
                                </div>
                            </label>
                        </div>

                        <div class="col-md-6 col-xl-3">
                            <label class="item-config-linha w-100" style="cursor: pointer;">
                                <div>
                                    <span class="small fw-semibold d-block"><i class="fas fa-mobile-alt me-2" style="color:#64b5f6;"></i>3º Push App AVA</span>
                                    <span style="font-size: 0.74rem; color: rgba(255, 255, 255, 0.7);">Último recurso multicanal</span>
                                </div>
                                <div class="form-check form-switch m-0">
                                    <input class="form-check-input cfg-canal-check" type="checkbox" role="switch" data-canal="pushApp" ${canaisAtivos.pushApp ? 'checked' : ''}>
                                </div>
                            </label>
                        </div>

                        <div class="col-md-6 col-xl-3">
                            <label class="item-config-linha w-100" style="cursor: pointer;">
                                <div>
                                    <span class="small fw-semibold d-block"><i class="far fa-envelope me-2"></i>E-mail Institucional</span>
                                    <span style="font-size: 0.74rem; color: rgba(255, 255, 255, 0.7);">${DataAPI.PERFIL_USUARIO.contatosCadastrados.email.detalhe}</span>
                                </div>
                                <div class="form-check form-switch m-0">
                                    <input class="form-check-input cfg-canal-check" type="checkbox" role="switch" data-canal="email" ${canaisAtivos.email !== false ? 'checked' : ''}>
                                </div>
                            </label>
                        </div>
                    </div>
                </div>

                <!-- SEÇÃO 3: PREFERÊNCIAS DE PRIORIDADE -->
                <div class="secao-config-card">
                    <h5 class="secao-config-titulo">3. Preferências de prioridade</h5>
                    <p class="secao-config-desc">
                        Configure o recebimento conforme o nível de prioridade do comunicado (avisos críticos são obrigatórios; prioridades Normal e Baixa vêm desabilitadas por padrão, ficando a seu critério ativá-las).
                    </p>

                    <div class="d-flex flex-column gap-2">
                        ${prioridadesLista.map(function (p) {
                            const cfgPrio = prioConfig[p.id] || DataAPI.PREFERENCIAS_PADRAO.prioridadesRecebimento[p.id] || { acompanharNoFeed: false, canaisRapidos: false };
                            const ativa = Boolean(cfgPrio.acompanharNoFeed);
                            return `
                                <label class="item-config-linha" style="cursor: pointer;">
                                    <div>
                                        <div class="d-flex align-items-center gap-2">
                                            <span class="small fw-semibold">Prioridade ${p.nome}</span>
                                            ${p.id === 'alta' ? '<span class="indicador-prioridade-alta">Alta</span>' : ''}
                                        </div>
                                        <span style="font-size: 0.76rem; color: rgba(255, 255, 255, 0.7);">
                                            ${p.descricao}
                                        </span>
                                    </div>
                                    <div class="form-check form-switch m-0">
                                        <input class="form-check-input cfg-prioridade-check"
                                               type="checkbox"
                                               role="switch"
                                               data-prioridade="${p.id}"
                                               ${ativa ? 'checked' : ''}>
                                    </div>
                                </label>
                            `;
                        }).join('')}
                    </div>
                </div>

                <!-- SEÇÃO 4: OUTRAS ÁREAS DE CONHECIMENTO DE INTERESSE -->
                <div class="secao-config-card">
                    <h5 class="secao-config-titulo">4. Outras áreas de conhecimento de interesse</h5>
                    <p class="secao-config-desc">
                        Por padrão, o feed exibe comunicados do seu curso (<strong>${DataAPI.PERFIL_USUARIO.curso}</strong>) e turma. Selecione abaixo caso deseje acompanhar comunicados e oportunidades de outras áreas de conhecimento:
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

                <!-- SEÇÃO 5: VALIDADOR DE GOVERNANÇA DE EMISSÃO (AUDITORIA DE REGRAS DE NEGÓCIO) -->
                <div class="secao-config-card">
                    <h5 class="secao-config-titulo">5. Governança de Emissão (Validador de Regras Administrativas)</h5>
                    <p class="secao-config-desc">
                        Teste a trava de backend que bloqueia a atribuição da tag <strong>Prioridade Crítica</strong> para emissores não autorizados e para categorias fora da rotina diária (como Eventos e Avisos Administrativos).
                    </p>
                    <div class="row g-2 align-items-end">
                        <div class="col-md-4">
                            <label class="form-label small text-white mb-1">Perfil do Emissor</label>
                            <select id="simGovEmissor" class="form-select form-select-sm filtro-discreto-ava w-100">
                                <option value="COORDENACAO_CURSO">Coordenação de Curso (Autorizado)</option>
                                <option value="SUPERVISAO_LABORATORIOS_INFRA">Supervisão de Laboratórios (Autorizado)</option>
                                <option value="ATLETICA_ESTUDANTIL">Atlética / Centro Acadêmico (Não Autorizado)</option>
                                <option value="SECRETARIA_EVENTOS">Comissão de Eventos (Não Autorizado)</option>
                            </select>
                        </div>
                        <div class="col-md-4">
                            <label class="form-label small text-white mb-1">Categoria do Comunicado</label>
                            <select id="simGovCategoria" class="form-select form-select-sm filtro-discreto-ava w-100">
                                <option value="aulas">Aulas: cancelamentos e alterações (Rotina diária)</option>
                                <option value="salas_infraestrutura">Salas e infraestrutura (Rotina diária)</option>
                                <option value="palestras_eventos">Palestras e Eventos (Bloqueada p/ Crítica)</option>
                                <option value="assuntos_administrativos_curso">Avisos Administrativos (Bloqueada p/ Crítica)</option>
                            </select>
                        </div>
                        <div class="col-md-4">
                            <button type="button" class="btn btn-sm buttonMain w-100" data-acao="testar-governanca-emissao">
                                <i class="fas fa-shield-alt me-1"></i>Validar Emissão Crítica
                            </button>
                        </div>
                    </div>
                    <div id="resultadoSimulacaoGovernanca" class="mt-2 d-none"></div>
                </div>

                <!-- Ações de salvamento -->
                <div class="d-flex flex-wrap justify-content-between align-items-center gap-2 pt-2 mb-3">
                    <button type="button" class="btn btnAltoContraste" data-acao="restaurar-preferencias-padrao">
                        Restaurar padrão (Opt-In estrito)
                    </button>
                    <button type="button" class="btn buttonMain" data-acao="salvar-configuracoes">
                        <i class="fas fa-check me-1"></i> Salvar configurações e Opt-In
                    </button>
                </div>

            </form>
        `;
    }

    function salvarConfiguracoesDoFormulario() {
        const novasPrefs = DataAPI.obterPreferenciasStorage();

        // 1. Origens (Curso e Institucional sempre ativas por padrão)
        novasPrefs.origensAtivas = { curso: true, uniube: true };

        // 2. Opt-In Absoluto de outras áreas de conhecimento
        const areasOptInExplicito = [];
        document.querySelectorAll('.cfg-area-check').forEach(function (chk) {
            if (chk.checked && chk.value !== DataAPI.PERFIL_USUARIO.area && !areasOptInExplicito.includes(chk.value)) {
                areasOptInExplicito.push(chk.value);
            }
        });
        novasPrefs.areasOptInExplicito = areasOptInExplicito;
        novasPrefs.areasInteresse = [DataAPI.PERFIL_USUARIO.area].concat(areasOptInExplicito);

        // 3. Categorias
        document.querySelectorAll('.cfg-categoria-check').forEach(function (chk) {
            const catId = chk.getAttribute('data-cat-id');
            if (catId) {
                const isEssencial = DataAPI.CATEGORIAS[catId]?.essencial;
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

        // 5. Preferências de prioridade (Crítica sempre ativa)
        novasPrefs.prioridadesRecebimento = novasPrefs.prioridadesRecebimento || {};
        document.querySelectorAll('.cfg-prioridade-check').forEach(function (chk) {
            const prioId = chk.getAttribute('data-prioridade');
            if (prioId) {
                const obrigatoria = DataAPI.PRIORIDADES[prioId]?.obrigatoria;
                novasPrefs.prioridadesRecebimento[prioId] = {
                    acompanharNoFeed: obrigatoria ? true : Boolean(chk.checked),
                    canaisRapidos: prioId === 'critica' || prioId === 'alta'
                };
            }
        });
        novasPrefs.prioridadesRecebimento.critica = { acompanharNoFeed: true, canaisRapidos: true };

        DataAPI.salvarPreferenciasStorage(novasPrefs);
        exibirToast(`Configurações salvas! Opt-In ativo para ${areasOptInExplicito.length} área(s) complementar(es).`, 'sucesso');
        renderizarAplicacao();
    }

    // ==================== SINCRONIZAÇÃO DE INTERFACE E RENDERIZAÇÃO PRINCIPAL ====================

    function sincronizarControlesNavegacao() {
        // Navegação lateral da Central (Comunicados vs Configurações)
        document.querySelectorAll('.pastaComunicacao[data-aba-central]').forEach(function (link) {
            const aba = link.getAttribute('data-aba-central');
            const ativa = aba === estadoUI.abaCentral;
            link.classList.toggle('sel', ativa);
            link.classList.toggle('fw-bold', ativa);
        });

        // Abas de origem (Todos / Uniube / Curso)
        document.querySelectorAll('[data-filtro-origem]').forEach(function (aba) {
            const o = aba.getAttribute('data-filtro-origem');
            const ativa = o === estadoUI.filtroOrigem;
            aba.classList.toggle('active', ativa);
            aba.setAttribute('aria-selected', ativa ? 'true' : 'false');
        });

        // Macro-filtros (Chips rápidos: Todos, Aulas & Provas, Eventos, Secretaria)
        document.querySelectorAll('[data-macro-chip]').forEach(function (chip) {
            const idChip = chip.getAttribute('data-macro-chip');
            const ativo = idChip === estadoUI.macroChip;
            chip.classList.toggle('active', ativo);
            chip.setAttribute('aria-pressed', ativo ? 'true' : 'false');
        });

        // Escopo do feed (Para você / Todos da instituição)
        document.querySelectorAll('[data-escopo-feed]').forEach(function (btn) {
            const esc = btn.getAttribute('data-escopo-feed');
            btn.classList.toggle('active', esc === estadoUI.escopoFeed && !estadoUI.exibirArquivados);
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

        const temFiltroAtivo = (
            estadoUI.filtroOrigem !== 'todas' ||
            estadoUI.macroChip !== 'todas' ||
            estadoUI.filtroPrioridade !== 'todas' ||
            estadoUI.filtroLeitura !== 'todos' ||
            estadoUI.exibirArquivados ||
            estadoUI.termoBusca.trim().length > 0
        );
        btnLimpar?.classList.toggle('d-none', !temFiltroAtivo);
    }

    function atualizarVisibilidadeAcoesLote() {
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

    function renderizarAplicacao() {
        const todosComunicados = DataAPI.obterComunicadosStorage();
        const preferencias = DataAPI.obterPreferenciasStorage();

        atualizarContadoresENotificacoes(todosComunicados, preferencias);
        sincronizarControlesNavegacao();
        atualizarVisibilidadeAcoesLote();

        const abaComunicados = document.getElementById('abaPrincipalComunicados');
        const abaConfiguracoes = document.getElementById('abaPrincipalConfiguracoes');

        if (estadoUI.abaCentral === 'configuracoes') {
            if (abaComunicados) abaComunicados.style.display = 'none';
            if (abaConfiguracoes) abaConfiguracoes.style.display = 'block';
            renderizarAbaConfiguracoes(preferencias);
            return;
        }

        if (abaConfiguracoes) abaConfiguracoes.style.display = 'none';
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

        const listaContainer = document.getElementById('containerLinhasComunicados');
        const paginacaoContainer = document.getElementById('containerPaginacaoLista');
        if (!listaContainer) return;

        listaContainer.innerHTML = '';
        if (paginacaoContainer) paginacaoContainer.innerHTML = '';

        const filtrados = obterComunicadosFiltrados(todosComunicados, preferencias);
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
            <div class="d-flex justify-content-between align-items-center px-3 py-2 mt-2 rounded" style="background-color:#242a33;border:1px solid #526174;">
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

    function limparTodosFiltros() {
        estadoUI.filtroOrigem = 'todas';
        estadoUI.macroChip = 'todas';
        estadoUI.filtroPrioridade = 'todas';
        estadoUI.filtroLeitura = 'todos';
        estadoUI.exibirArquivados = false;
        estadoUI.termoBusca = '';
        estadoUI.paginaAtual = 1;
        renderizarAplicacao();
    }


    // ==================== TOAST DISCRETO (Paleta Slate-Blue #313a46) ====================

    function exibirToast(mensagem, tipo) {
        const container = document.getElementById('toastContainerAva');
        if (!container) return;

        const corBorda = tipo === 'sucesso' ? '#23bc7b' : (tipo === 'erro' ? '#ef4444' : '#00b4d8');
        const toastEl = document.createElement('div');
        toastEl.className = 'toast show align-items-center text-white border-0 mb-2';
        toastEl.setAttribute('role', 'status');
        toastEl.style.cssText = `background-color: #313a46; border-left: 4px solid ${corBorda} !important; border: 1px solid #526174; box-shadow: 0 8px 20px rgba(0,0,0,0.35);`;

        toastEl.innerHTML = `
            <div class="d-flex align-items-center p-2 px-3">
                <div class="toast-body p-0 small" style="color: #ffffff;">${mensagem}</div>
                <button type="button" class="btn-close btn-close-white ms-auto" aria-label="Fechar"></button>
            </div>
        `;

        toastEl.querySelector('.btn-close')?.addEventListener('click', function () {
            toastEl.remove();
        });

        container.appendChild(toastEl);
        setTimeout(function () {
            if (toastEl.parentNode) {
                toastEl.remove();
            }
        }, 3600);
    }

    // ==================== EVENTOS ====================

    function registrarEventos() {
        // Links do menu global fora do escopo
        document.querySelectorAll('[data-legado-inerte="true"]').forEach(function (el) {
            el.addEventListener('click', function (e) {
                e.preventDefault();
                e.stopPropagation();
                exibirToast('Opção demonstrativa do portal.', 'info');
            });
        });

        // Sidenav global (Fixar Menu e Mobile)
        const inpLock = document.getElementById('inpLock');
        const sidenav = document.getElementById('sidenav');
        if (inpLock && sidenav) {
            inpLock.addEventListener('change', function (e) {
                sidenav.classList.toggle('fix', e.target.checked);
            });
        }

        const btnSideMenuMob = document.getElementById('btnSideMenuMob');
        if (btnSideMenuMob && sidenav) {
            btnSideMenuMob.addEventListener('change', function (e) {
                sidenav.classList.toggle('fix', e.target.checked);
            });
        }

        // Submenus do Sidenav global
        document.querySelectorAll('[data-toggle-submenu]').forEach(function (trigger) {
            trigger.addEventListener('click', function (e) {
                e.preventDefault();
                const targetId = trigger.getAttribute('data-toggle-submenu');
                document.getElementById(targetId)?.classList.toggle('close');
            });
        });

        // Perfil e Notificações na Navbar
        const dropdownMenuPerfil = document.getElementById('dropdownMenuPerfil');
        const divNavbar = document.getElementById('divNavbar');
        const notificacaoIco = document.getElementById('notificacao_ico');
        const notificacaoCard = document.getElementById('notificacao_card');

        dropdownMenuPerfil?.addEventListener('click', function (e) {
            e.stopPropagation();
            divNavbar?.classList.toggle('expand');
            notificacaoCard?.classList.add('d-none');
        });

        notificacaoIco?.addEventListener('click', function (e) {
            e.stopPropagation();
            notificacaoCard?.classList.toggle('d-none');
            divNavbar?.classList.remove('expand');
        });

        document.addEventListener('click', function () {
            divNavbar?.classList.remove('expand');
            notificacaoCard?.classList.add('d-none');
        });

        // Navegação entre as 2 abas principais: Comunicados e Configurações
        document.querySelectorAll('.pastaComunicacao[data-aba-central]').forEach(function (link) {
            link.addEventListener('click', function (e) {
                e.preventDefault();
                const aba = link.getAttribute('data-aba-central');
                if (!aba) return;
                estadoUI.abaCentral = aba;
                if (aba === 'comunicados') {
                    estadoUI.comunicadoAbertoId = null;
                }
                renderizarAplicacao();
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

        // Delegação de eventos para ações dinâmicas
        document.addEventListener('click', function (e) {
            const acaoMenuLinha = e.target.closest('[data-acao="alternar-leitura-item"]');
            if (acaoMenuLinha) {
                e.preventDefault();
                e.stopPropagation();
                const idItem = acaoMenuLinha.getAttribute('data-id');
                if (idItem) {
                    const lista = DataAPI.obterComunicadosStorage();
                    const item = lista.find(function (c) { return c.id === idItem; });
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
                    const lista = DataAPI.obterComunicadosStorage();
                    const item = lista.find(function (c) { return c.id === idItem; });
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

            switch (acao) {
                case 'abrir-comunicado':
                    e.preventDefault();
                    if (id) {
                        estadoUI.abaCentral = 'comunicados';
                        abrirComunicado(id);
                    }
                    break;

                case 'voltar-para-lista':
                    e.preventDefault();
                    voltarParaListaComunicados();
                    break;

                case 'marcar-nao-lida-aberta':
                    e.preventDefault();
                    if (estadoUI.comunicadoAbertoId) {
                        atualizarEstadoLeituraStorage(estadoUI.comunicadoAbertoId, false);
                        voltarParaListaComunicados();
                    }
                    break;

                case 'arquivar-aberta':
                    e.preventDefault();
                    if (estadoUI.comunicadoAbertoId) {
                        arquivarComunicadosStorage([estadoUI.comunicadoAbertoId], true);
                        exibirToast('Comunicado arquivado (Inbox Zero).', 'sucesso');
                    }
                    voltarParaListaComunicados();
                    break;

                case 'inbox-zero-marcar-lidos':
                    e.preventDefault();
                    {
                        const todos = DataAPI.obterComunicadosStorage();
                        const prefs = DataAPI.obterPreferenciasStorage();
                        const idsAlvo = estadoUI.selecionadosLote.size > 0
                            ? Array.from(estadoUI.selecionadosLote)
                            : obterComunicadosFiltrados(todos, prefs).map(function (c) { return c.id; });
                        const marcados = marcarLoteComoLidoStorage(idsAlvo);
                        estadoUI.selecionadosLote.clear();
                        atualizarVisibilidadeAcoesLote();
                        exibirToast(marcados > 0 ? `${marcados} comunicado(s) marcado(s) como lidos.` : 'Todos os comunicados visíveis já estão lidos.', 'sucesso');
                        renderizarAplicacao();
                    }
                    break;

                case 'inbox-zero-arquivar':
                    e.preventDefault();
                    {
                        const todos = DataAPI.obterComunicadosStorage();
                        const prefs = DataAPI.obterPreferenciasStorage();
                        let idsAlvo = [];
                        if (estadoUI.selecionadosLote.size > 0) {
                            idsAlvo = Array.from(estadoUI.selecionadosLote);
                        } else {
                            const visiveis = obterComunicadosFiltrados(todos, prefs);
                            const lidosVisiveis = visiveis.filter(function (c) { return c.lido && !isCriticoAtivo(c); });
                            idsAlvo = (lidosVisiveis.length > 0 ? lidosVisiveis : visiveis.filter(function (c) { return !isCriticoAtivo(c); }))
                                .map(function (c) { return c.id; });
                        }
                        const qtdArq = arquivarComunicadosStorage(idsAlvo, true);
                        estadoUI.selecionadosLote.clear();
                        atualizarVisibilidadeAcoesLote();
                        exibirToast(qtdArq > 0 ? `${qtdArq} comunicado(s) arquivado(s) — Inbox Zero atualizado!` : 'Nenhum comunicado elegível para arquivamento.', 'sucesso');
                        renderizarAplicacao();
                    }
                    break;

                case 'alternar-exibir-arquivados':
                    e.preventDefault();
                    estadoUI.exibirArquivados = !estadoUI.exibirArquivados;
                    estadoUI.paginaAtual = 1;
                    renderizarAplicacao();
                    break;

                case 'onboarding-ativar-secundarios':
                    e.preventDefault();
                    {
                        const prefs = DataAPI.obterPreferenciasStorage();
                        prefs.canaisAtivos = prefs.canaisAtivos || { portal: true, whatsapp: true, email: true };
                        prefs.canaisAtivos.sms = true;
                        prefs.canaisAtivos.pushApp = true;
                        DataAPI.salvarPreferenciasStorage(prefs);

                        const estOnb = DataAPI.obterEstadoOnboarding();
                        estOnb.canaisSecundariosSugeridosAtivados = true;
                        DataAPI.salvarEstadoOnboarding(estOnb);

                        exibirToast('Canais secundários (SMS + Push App AVA) ativados na esteira de fallback!', 'sucesso');
                        renderizarAplicacao();
                    }
                    break;

                case 'onboarding-dispensar':
                    e.preventDefault();
                    {
                        const estOnb = DataAPI.obterEstadoOnboarding();
                        estOnb.dispensadoPeloAluno = true;
                        DataAPI.salvarEstadoOnboarding(estOnb);
                        renderizarBannerOnboardingProgressivo();
                    }
                    break;

                case 'simular-fallback':
                    e.preventDefault();
                    if (id) {
                        const novoCenario = elAcao.getAttribute('data-cenario');
                        const lista = DataAPI.obterComunicadosStorage();
                        const item = lista.find(function (c) { return c.id === id; });
                        if (item && novoCenario) {
                            item.cenarioFallback = novoCenario;
                            DataAPI.salvarComunicadosStorage(lista);
                            renderizarMensagemAberta(item);
                            atualizarContadoresENotificacoes(lista, DataAPI.obterPreferenciasStorage());
                        }
                    }
                    break;


                case 'testar-governanca-emissao':
                    e.preventDefault();
                    {
                        const selEmissor = document.getElementById('simGovEmissor');
                        const selCat = document.getElementById('simGovCategoria');
                        const boxRes = document.getElementById('resultadoSimulacaoGovernanca');
                        if (selEmissor && selCat && boxRes) {
                            const resultado = DataAPI.validarGovernancaEmissao(
                                { prioridade: 'critica', categoria: selCat.value },
                                selEmissor.value
                            );
                            const cor = resultado.permitido ? '#67e3a7' : '#ef4444';
                            const icone = resultado.permitido ? 'fa-check-circle' : 'fa-ban';
                            boxRes.classList.remove('d-none');
                            boxRes.innerHTML = `
                                <div class="p-2 px-3 rounded small" style="background-color:#242a33;border:1px solid ${cor};border-left:4px solid ${cor};">
                                    <i class="fas ${icone} me-1" style="color:${cor};"></i>
                                    <strong>[${resultado.codigo}]</strong> ${resultado.mensagem}
                                    <span class="ms-2 badge bg-secondary">Prioridade Aplicada: ${resultado.prioridadeFinal.toUpperCase()}</span>
                                </div>
                            `;
                        }
                    }
                    break;


                case 'curtir-comunicado':
                    e.preventDefault();
                    if (id) {
                        const atualizado = alternarCurtidaStorage(id);
                        if (atualizado && estadoUI.comunicadoAbertoId === id) {
                            renderizarMensagemAberta(atualizado);
                        }
                    }
                    break;

                case 'confirmar-ciencia':
                    e.preventDefault();
                    if (id) {
                        const atualizado = confirmarCienciaStorage(id);
                        if (atualizado) {
                            renderizarMensagemAberta(atualizado);
                            atualizarContadoresENotificacoes(DataAPI.obterComunicadosStorage(), DataAPI.obterPreferenciasStorage());
                            exibirToast('Ciência confirmada com sucesso.', 'sucesso');
                        }
                    }
                    break;

                case 'ir-pagina':
                    e.preventDefault();
                    const pag = parseInt(elAcao.getAttribute('data-pagina') || '1', 10);
                    if (!isNaN(pag)) {
                        estadoUI.paginaAtual = pag;
                        renderizarAplicacao();
                    }
                    break;

                case 'limpar-filtros':
                    e.preventDefault();
                    limparTodosFiltros();
                    break;

                case 'ir-aba-comunicados':
                    e.preventDefault();
                    estadoUI.abaCentral = 'comunicados';
                    estadoUI.comunicadoAbertoId = null;
                    renderizarAplicacao();
                    break;

                case 'ir-aba-configuracoes':
                    e.preventDefault();
                    estadoUI.abaCentral = 'configuracoes';
                    estadoUI.comunicadoAbertoId = null;
                    renderizarAplicacao();
                    break;

                case 'salvar-configuracoes':
                    e.preventDefault();
                    salvarConfiguracoesDoFormulario();
                    break;

                case 'restaurar-preferencias-padrao':
                    e.preventDefault();
                    DataAPI.salvarPreferenciasStorage(JSON.parse(JSON.stringify(DataAPI.PREFERENCIAS_PADRAO)));
                    renderizarAbaConfiguracoes(DataAPI.obterPreferenciasStorage());
                    exibirToast('Preferências restauradas para o padrão (Opt-In estrito).', 'info');
                    break;

                case 'restaurar-demo-completa':
                    e.preventDefault();
                    DataAPI.inicializarMockStorage(true);
                    estadoUI.abaCentral = 'comunicados';
                    estadoUI.comunicadoAbertoId = null;
                    estadoUI.selecionadosLote.clear();
                    limparTodosFiltros();
                    exibirToast('Dados iniciais restaurados com sucesso.', 'sucesso');
                    break;
            }
        });

        // Teclado (Enter / Space) na lista de comunicados
        document.getElementById('containerLinhasComunicados')?.addEventListener('keydown', function (e) {
            if (e.key === 'Enter' || e.key === ' ') {
                const linha = e.target.closest('.elemento[data-id]');
                if (!linha || e.target.classList.contains('checkMsgComunicacao')) return;
                e.preventDefault();
                abrirComunicado(linha.getAttribute('data-id'));
            }
        });

        // Scroll e botão Voltar ao Topo
        const conteudoGeral = document.getElementById('divAvaConteudoGeral');
        const navbar = document.getElementById('navbar');
        const buttonToTop = document.getElementById('buttonToTop');

        conteudoGeral?.addEventListener('scroll', function (e) {
            const top = e.target.scrollTop;
            if (top >= 68) {
                navbar?.classList.add('retrair');
            } else if (top <= 10) {
                navbar?.classList.remove('retrair');
            }

            if (top >= 500) {
                buttonToTop?.classList.add('view');
            } else {
                buttonToTop?.classList.remove('view');
            }
        }, { passive: true });

        buttonToTop?.addEventListener('click', function () {
            document.getElementById('topPag')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
        });
    }

    document.addEventListener('DOMContentLoaded', function () {
        registrarEventos();
        renderizarAplicacao();
    });
})(window, document);
