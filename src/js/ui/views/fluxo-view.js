/**
 * Central Inteligente de Comunicados Acadêmicos — AVA Uniube
 * Módulo: ui/views/fluxo-view.js
 * Responsabilidade: Renderização da página informativa "Fluxo de Comunicação".
 */

export function renderizarAbaFluxoComunicacao() {
    const container = document.getElementById('conteudoFluxoCentral');
    if (!container) return;

    container.innerHTML = `
        <div class="d-flex flex-wrap justify-content-between align-items-center gap-2 pb-3 mb-3 border-bottom">
            <div>
                <h4 class="mb-1" style="font-weight: 600; color: var(--titulo-cor);">Fluxo de Comunicação</h4>
                <span class="small" style="color: rgba(255, 255, 255, 0.78);">
                    Processo institucional de envio, entrega e visualização dos comunicados acadêmicos
                </span>
            </div>
            <button type="button" class="btn buttonMain" data-acao="ir-aba-comunicados">
                <i class="fas fa-arrow-left me-1"></i> Voltar para Comunicados
            </button>
        </div>

        <!-- ==================== PARTE 1 — INTRODUÇÃO ==================== -->
        <section class="secao-config-card" aria-labelledby="tituloApresentacaoFluxo">
            <h5 id="tituloApresentacaoFluxo" class="secao-config-titulo">Como funciona o envio dos comunicados?</h5>
            <p class="fluxo-texto-base mb-3">
                O sistema utiliza diferentes canais e estratégias para assegurar que os comunicados cheguem aos estudantes de forma ágil e estruturada. A <strong>modalidade de comunicação</strong> define a estratégia de entrega, os canais acionados e as regras de temporização, enquanto a <strong>prioridade</strong> reflete o nível de relevância do conteúdo.
            </p>

            <!-- Três informações resumidas e explícitas sobre temporizadores -->
            <div class="row g-2 mb-3">
                <div class="col-md-4">
                    <div class="fluxo-resumo-item h-100">
                        <span class="fluxo-resumo-destaque"><i class="fas fa-clock me-1"></i>3 horas (Modalidade Padrão):</span>
                        <span class="fluxo-resumo-texto">temporizador contado a partir da tentativa inicial do envio de Push, aguardando a abertura do comunicado em tela cheia antes de enviar WhatsApp.</span>
                    </div>
                </div>
                <div class="col-md-4">
                    <div class="fluxo-resumo-item h-100">
                        <span class="fluxo-resumo-destaque"><i class="fas fa-stopwatch me-1"></i>25 minutos (Modalidade Padrão):</span>
                        <span class="fluxo-resumo-texto">temporizador iniciado somente após o envio efetivo do WhatsApp, aguardando confirmação de visualização antes de disparar SMS.</span>
                    </div>
                </div>
                <div class="col-md-4">
                    <div class="fluxo-resumo-item h-100">
                        <span class="fluxo-resumo-destaque"><i class="fas fa-bolt me-1 text-danger"></i>25 minutos (Modalidade Crítica):</span>
                        <span class="fluxo-resumo-texto">temporizador iniciado a partir do envio simultâneo de Push e WhatsApp, aguardando visualização por qualquer um deles antes de acionar SMS.</span>
                    </div>
                </div>
            </div>

            <!-- Apresentação dos canais na ordem do fluxo: Push, WhatsApp, SMS, E-mail -->
            <div class="small fw-semibold mb-2" style="color: var(--titulo-cor);">Canais utilizados pelo sistema</div>
            <div class="row g-2">
                <div class="col-sm-6 col-lg-3">
                    <div class="fluxo-canal-item h-100">
                        <div class="d-flex align-items-center gap-2 mb-1">
                            <i class="fas fa-mobile-alt fluxo-icone-discreto" aria-hidden="true"></i>
                            <strong class="small text-white">Notificação push</strong>
                        </div>
                        <p class="fluxo-canal-desc mb-0">
                            Canal primário no aplicativo instalado no dispositivo cadastrado do estudante.
                        </p>
                    </div>
                </div>
                <div class="col-sm-6 col-lg-3">
                    <div class="fluxo-canal-item h-100">
                        <div class="d-flex align-items-center gap-2 mb-1">
                            <i class="fab fa-whatsapp fluxo-icone-discreto" aria-hidden="true"></i>
                            <strong class="small text-white">WhatsApp</strong>
                        </div>
                        <p class="fluxo-canal-desc mb-0">
                            Disparado simultaneamente no Crítico ou após 3 horas sem leitura no portal no Padrão.
                        </p>
                    </div>
                </div>
                <div class="col-sm-6 col-lg-3">
                    <div class="fluxo-canal-item h-100">
                        <div class="d-flex align-items-center gap-2 mb-1">
                            <i class="fas fa-sms fluxo-icone-discreto" aria-hidden="true"></i>
                            <strong class="small text-white">SMS</strong>
                        </div>
                        <p class="fluxo-canal-desc mb-0">
                            Canal de contingência, acionado caso as tentativas iniciais não sejam visualizadas dentro do prazo de 25 min.
                        </p>
                    </div>
                </div>
                <div class="col-sm-6 col-lg-3">
                    <div class="fluxo-canal-item h-100">
                        <div class="d-flex align-items-center gap-2 mb-1">
                            <i class="far fa-envelope fluxo-icone-discreto" aria-hidden="true"></i>
                            <strong class="small text-white">E-mail institucional</strong>
                        </div>
                        <p class="fluxo-canal-desc mb-0">
                            Disponível exclusivamente como opção do responsável pela publicação na Modalidade Informativa.
                        </p>
                    </div>
                </div>
            </div>
        </section>

        <!-- ==================== PARTE 2 — TRÊS CARDS HORIZONTAIS DE MODALIDADES ==================== -->
        <section class="secao-config-card" aria-labelledby="tituloModalidadesEnvio">
            <h5 id="tituloModalidadesEnvio" class="secao-config-titulo mb-2">Modalidades de envio dos comunicados</h5>
            <p class="fluxo-texto-base mb-3">
                Existem três modalidades de comunicação, definidas pela finalidade e pela urgência do comunicado.
            </p>

            <div class="d-flex flex-column gap-3 mb-3">
                <!-- Modalidade 1: Informativa (Card Horizontal) -->
                <div class="fluxo-modalidade-horizontal">
                    <div class="fluxo-modalidade-h-header">
                        <span class="badge bg-secondary mb-1">Modalidade 1</span>
                        <h6 class="fluxo-modalidade-titulo">Modalidade Informativa</h6>
                        <span class="badge bg-dark text-white-50 border border-secondary mt-1">Baixa urgência</span>
                    </div>
                    <div class="fluxo-modalidade-h-body">
                        <div class="fluxo-modalidade-exemplos mb-2">
                            <strong>Exemplos:</strong> vagas de estágio e emprego, palestras e eventos futuros, oportunidades acadêmicas, informativos institucionais e divulgação de atividades sem urgência imediata.
                        </div>
                        <div class="small fw-semibold text-white-50 mb-1">Funcionamento e Regras:</div>
                        <ol class="fluxo-modalidade-regras ps-3 mb-2">
                            <li>O comunicado é publicado e um Push é enviado imediatamente ao aluno.</li>
                            <li>O responsável pela publicação pode optar por enviar também um e-mail institucional (o e-mail é opcional somente nesta modalidade).</li>
                            <li>Não existe escalonamento automático para WhatsApp ou SMS.</li>
                            <li>Não existem temporizadores de 25 minutos ou 3 horas nessa modalidade.</li>
                            <li>Não há escalonamento automático.</li>
                        </ol>
                        <div class="fluxo-destaque-nota">
                            Um comunicado pode ser importante sem ser urgente.
                        </div>
                    </div>
                </div>

                <!-- Modalidade 2: Padrão (Card Horizontal) -->
                <div class="fluxo-modalidade-horizontal">
                    <div class="fluxo-modalidade-h-header">
                        <span class="badge bg-info text-dark mb-1">Modalidade 2</span>
                        <h6 class="fluxo-modalidade-titulo">Modalidade Padrão</h6>
                        <span class="badge bg-dark text-white-50 border border-info mt-1">Urgência normal ou alta</span>
                    </div>
                    <div class="fluxo-modalidade-h-body">
                        <div class="fluxo-modalidade-exemplos mb-2">
                            <strong>Exemplos:</strong> lembretes de avaliações, alterações de atividades acadêmicas, mudanças de cronograma e comunicados que exigem atenção, mas com tempo suficiente para aguardar a primeira tentativa.
                        </div>
                        <div class="small fw-semibold text-white-50 mb-1">Funcionamento e Temporizadores:</div>
                        <ol class="fluxo-modalidade-regras ps-3 mb-2">
                            <li><strong>Envio inicial do Push:</strong> assim que publicado, o Push é enviado ao aluno e inicia-se o temporizador principal de 3 horas.</li>
                            <li><strong>Temporizador de 3 horas (contado do Push):</strong> o sistema aguarda até 3 horas. Se o aluno não tiver aberto o comunicado em tela cheia no portal, envia-se o WhatsApp. Se já tiver aberto, não envia WhatsApp.</li>
                            <li><strong>Temporizador de 25 minutos (contado do WhatsApp):</strong> começa somente após o envio efetivo do WhatsApp. Aguarda-se 25 minutos para verificar visualização do WhatsApp; se não for visualizado ao final do período, envia-se SMS.</li>
                            <li><strong>Interrupção por leitura no portal:</strong> a abertura em tela cheia antes de qualquer envio futuro registra a leitura e cancela envios ainda não iniciados (envios já realizados não são desfeitos).</li>
                            <li><strong>Bloqueio de duplicidade:</strong> não envia mensagens duplicadas por nenhum canal.</li>
                        </ol>
                        <div class="fluxo-destaque-nota">
                            <strong>Regra fundamental dos temporizadores:</strong> os 3 horas são contados a partir da tentativa inicial do Push, e os 25 minutos são contados a partir do envio efetivo do WhatsApp. A falha do Push não elimina a regra de SMS após 25 minutos do WhatsApp.
                        </div>
                    </div>
                </div>

                <!-- Modalidade 3: Crítica (Card Horizontal) -->
                <div class="fluxo-modalidade-horizontal">
                    <div class="fluxo-modalidade-h-header">
                        <span class="badge bg-danger mb-1">Modalidade 3</span>
                        <h6 class="fluxo-modalidade-titulo">Modalidade Crítica</h6>
                        <span class="badge bg-dark text-white-50 border border-danger mt-1">Alta urgência</span>
                    </div>
                    <div class="fluxo-modalidade-h-body">
                        <div class="fluxo-modalidade-exemplos mb-2">
                            <strong>Exemplos:</strong> cancelamento de aula prestes a acontecer, alteração urgente de sala, suspensão de atividades com início próximo ou situações emergenciais que exigem comunicação imediata.
                        </div>
                        <div class="small fw-semibold text-white-50 mb-1">Funcionamento e Temporizador:</div>
                        <ol class="fluxo-modalidade-regras ps-3 mb-2">
                            <li><strong>Envio simultâneo:</strong> assim que publicado, o sistema envia Push e WhatsApp simultaneamente (não existe espera de 3 horas).</li>
                            <li><strong>Temporizador de 25 minutos (contado do envio simultâneo):</strong> inicia-se na tentativa inicial de Push e WhatsApp. Aguarda-se 25 minutos verificando se houve visualização por algum dos dois canais.</li>
                            <li><strong>Acionamento do SMS:</strong> se houver confirmação de visualização pelo Push ou pelo WhatsApp dentro dos 25 minutos, o SMS não é enviado. Se nenhum dos dois for visualizado, dispara-se o SMS.</li>
                            <li><strong>Interrupção por leitura no portal:</strong> se o aluno abrir em tela cheia no portal antes do SMS, cancela-se o envio futuro do SMS.</li>
                        </ol>
                        <div class="fluxo-destaque-nota">
                            <strong>Tratamento específico da modalidade crítica:</strong> Push e WhatsApp são enviados ao mesmo tempo e o SMS funciona como terceira tentativa caso nenhum dos dois seja visualizado em 25 minutos. Não se aplica o temporizador de 3 horas.
                        </div>
                    </div>
                </div>
            </div>

            <!-- Diferença entre Prioridade e Modalidade de Comunicação -->
            <div class="fluxo-bloco-alerta">
                <div class="d-flex align-items-start gap-2">
                    <i class="fas fa-balance-scale text-info mt-1" aria-hidden="true" style="font-size: 1.15rem;"></i>
                    <div>
                        <h6 class="text-white mb-1" style="font-weight: 600;">Diferença entre prioridade e modalidade de comunicação</h6>
                        <p class="fluxo-texto-base mb-1">
                            - <strong>Prioridade:</strong> representa a importância do comunicado (baixa, normal, alta ou crítica).<br>
                            - <strong>Modalidade de comunicação:</strong> determina quais canais serão utilizados, em que momento e sob quais condições de escalonamento.
                        </p>
                        <p class="small text-white-50 mb-0">
                            A prioridade não determina automaticamente a modalidade. Por exemplo, uma oportunidade de estágio pode ter prioridade alta pela relevância acadêmica, mas continuar utilizando a modalidade informativa. Não associe automaticamente prioridade alta à modalidade crítica e não apresente a modalidade crítica como sinônimo de prioridade crítica.
                        </p>
                    </div>
                </div>
            </div>
        </section>

        <!-- ==================== PARTE 3 — TRÊS FLUXOGRAMAS SEPARADOS (CARDS HORIZONTAIS) ==================== -->
        <section class="secao-config-card" aria-labelledby="tituloTresFluxogramas">
            <h5 id="tituloTresFluxogramas" class="secao-config-titulo mb-2">Fluxogramas por modalidade</h5>
            <p class="secao-config-desc mb-3">
                Representação visual da lógica de disparo, temporizadores e tomadas de decisão para cada modalidade de comunicação em cards horizontais de leitura sequencial.
            </p>

            <div class="d-flex flex-column gap-3">
                <!-- FLUXOGRAMA 1: INFORMATIVO (Card Horizontal) -->
                <div class="fluxo-painel-fluxograma-horizontal">
                    <div class="fluxo-painel-h-header">
                        <span class="badge bg-secondary mb-1">Fluxo 1</span>
                        <h6 class="fluxo-painel-titulo">Fluxograma 1 — Informativo</h6>
                        <span class="small text-white-50">Sem WhatsApp, SMS ou temporizadores automáticos</span>
                    </div>

                    <div class="fluxo-painel-h-body">
                        <div class="fluxo-etapas-linha-horizontal">
                            <div class="fluxo-passo-horizontal">
                                <div class="d-flex align-items-center gap-2 mb-1">
                                    <span class="fluxo-no-indice">1</span>
                                    <span class="fluxo-no-titulo">PUBLICAÇÃO</span>
                                </div>
                                <div class="fluxo-no-sub">Comunicado publicado no portal</div>
                            </div>

                            <div class="fluxo-seta-horizontal" aria-hidden="true">&rarr;</div>

                            <div class="fluxo-passo-horizontal">
                                <div class="d-flex align-items-center gap-2 mb-1">
                                    <span class="fluxo-no-indice">2</span>
                                    <span class="fluxo-no-titulo">ENVIO DE PUSH</span>
                                </div>
                                <div class="fluxo-no-sub">Disparo imediato ao dispositivo do estudante</div>
                            </div>

                            <div class="fluxo-seta-horizontal" aria-hidden="true">&rarr;</div>

                            <div class="fluxo-passo-horizontal">
                                <div class="d-flex align-items-center gap-2 mb-1">
                                    <span class="fluxo-no-indice">3</span>
                                    <span class="fluxo-no-titulo">E-MAIL (OPCIONAL)</span>
                                </div>
                                <div class="fluxo-caminhos-grid mt-1">
                                    <div class="fluxo-caminho fluxo-caminho-sim p-1">
                                        <span class="fluxo-caminho-tag">SIM</span>
                                        <span style="font-size:0.75rem">Envia e-mail</span>
                                    </div>
                                    <div class="fluxo-caminho fluxo-caminho-nao p-1">
                                        <span class="fluxo-caminho-tag">NÃO</span>
                                        <span style="font-size:0.75rem">Apenas push</span>
                                    </div>
                                </div>
                            </div>

                            <div class="fluxo-seta-horizontal" aria-hidden="true">&rarr;</div>

                            <div class="fluxo-passo-horizontal fluxo-no-sucesso">
                                <div class="d-flex align-items-center gap-2 mb-1">
                                    <span class="fluxo-no-indice"><i class="fas fa-check"></i></span>
                                    <span class="fluxo-no-titulo">FIM DO ENVIO</span>
                                </div>
                                <div class="fluxo-no-sub">Sem WhatsApp, SMS ou escalonamento</div>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- FLUXOGRAMA 2: PADRÃO (Card Horizontal) -->
                <div class="fluxo-painel-fluxograma-horizontal">
                    <div class="fluxo-painel-h-header">
                        <span class="badge bg-info text-dark mb-1">Fluxo 2</span>
                        <h6 class="fluxo-painel-titulo">Fluxograma 2 — Padrão</h6>
                        <span class="small text-white-50">3h do Push &rarr; WhatsApp &rarr; 25 min &rarr; SMS</span>
                    </div>

                    <div class="fluxo-painel-h-body">
                        <div class="fluxo-etapas-linha-horizontal">
                            <div class="fluxo-passo-horizontal">
                                <div class="d-flex align-items-center gap-2 mb-1">
                                    <span class="fluxo-no-indice">1</span>
                                    <span class="fluxo-no-titulo">PUSH INICIAL</span>
                                </div>
                                <div class="fluxo-no-sub">Publicação e disparo do Push; inicia contagem de 3h</div>
                            </div>

                            <div class="fluxo-seta-horizontal" aria-hidden="true">&rarr;</div>

                            <div class="fluxo-passo-horizontal">
                                <div class="d-flex align-items-center gap-2 mb-1">
                                    <span class="fluxo-no-indice">2</span>
                                    <span class="fluxo-no-titulo">3 HORAS</span>
                                </div>
                                <div class="fluxo-no-sub mb-1">Monitora abertura em tela cheia no portal</div>
                                <div class="fluxo-caminhos-grid">
                                    <div class="fluxo-caminho fluxo-caminho-sim p-1">
                                        <span class="fluxo-caminho-tag">SIM</span>
                                        <span style="font-size:0.73rem">Lido: não envia WhatsApp</span>
                                    </div>
                                    <div class="fluxo-caminho fluxo-caminho-nao p-1">
                                        <span class="fluxo-caminho-tag">NÃO</span>
                                        <span style="font-size:0.73rem">Envia WhatsApp</span>
                                    </div>
                                </div>
                            </div>

                            <div class="fluxo-seta-horizontal" aria-hidden="true">&rarr;</div>

                            <div class="fluxo-passo-horizontal">
                                <div class="d-flex align-items-center gap-2 mb-1">
                                    <span class="fluxo-no-indice">3</span>
                                    <span class="fluxo-no-titulo">25 MINUTOS</span>
                                </div>
                                <div class="fluxo-no-sub mb-1">Inicia após o envio efetivo do WhatsApp</div>
                                <div class="fluxo-caminhos-grid">
                                    <div class="fluxo-caminho fluxo-caminho-sim p-1">
                                        <span class="fluxo-caminho-tag">SIM</span>
                                        <span style="font-size:0.73rem">Visualizado: sem SMS</span>
                                    </div>
                                    <div class="fluxo-caminho fluxo-caminho-nao p-1">
                                        <span class="fluxo-caminho-tag">NÃO</span>
                                        <span style="font-size:0.73rem">Dispara SMS</span>
                                    </div>
                                </div>
                            </div>

                            <div class="fluxo-seta-horizontal" aria-hidden="true">&rarr;</div>

                            <div class="fluxo-passo-horizontal fluxo-no-sucesso">
                                <div class="d-flex align-items-center gap-2 mb-1">
                                    <span class="fluxo-no-indice"><i class="fas fa-check"></i></span>
                                    <span class="fluxo-no-titulo">LEITURA NO PORTAL</span>
                                </div>
                                <div class="fluxo-no-sub">Abertura em tela cheia interrompe envios pendentes</div>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- FLUXOGRAMA 3: CRÍTICO (Card Horizontal) -->
                <div class="fluxo-painel-fluxograma-horizontal">
                    <div class="fluxo-painel-h-header">
                        <span class="badge bg-danger mb-1">Fluxo 3</span>
                        <h6 class="fluxo-painel-titulo">Fluxograma 3 — Crítico</h6>
                        <span class="small text-white-50">Push + WhatsApp simultâneos; SMS em 25 min</span>
                    </div>

                    <div class="fluxo-painel-h-body">
                        <div class="fluxo-etapas-linha-horizontal">
                            <div class="fluxo-passo-horizontal" style="border-left: 3px solid #ef4444;">
                                <div class="d-flex align-items-center gap-2 mb-1">
                                    <span class="fluxo-no-indice">1</span>
                                    <span class="fluxo-no-titulo">ENVIO SIMULTÂNEO</span>
                                </div>
                                <div class="fluxo-no-sub mb-1">Push e WhatsApp no mesmo instante (sem 3h)</div>
                                <div class="d-flex gap-1">
                                    <span class="badge bg-primary flex-fill" style="font-size:0.68rem">Push</span>
                                    <span class="badge bg-success flex-fill" style="font-size:0.68rem">WhatsApp</span>
                                </div>
                            </div>

                            <div class="fluxo-seta-horizontal" aria-hidden="true">&rarr;</div>

                            <div class="fluxo-passo-horizontal">
                                <div class="d-flex align-items-center gap-2 mb-1">
                                    <span class="fluxo-no-indice">2</span>
                                    <span class="fluxo-no-titulo">25 MINUTOS</span>
                                </div>
                                <div class="fluxo-no-sub">Temporizador iniciado com o disparo duplo</div>
                            </div>

                            <div class="fluxo-seta-horizontal" aria-hidden="true">&rarr;</div>

                            <div class="fluxo-passo-horizontal">
                                <div class="d-flex align-items-center gap-2 mb-1">
                                    <span class="fluxo-no-indice">3</span>
                                    <span class="fluxo-no-titulo">VERIFICAÇÃO</span>
                                </div>
                                <div class="fluxo-no-sub mb-1">Houve visualização por Push ou WhatsApp?</div>
                                <div class="fluxo-caminhos-grid">
                                    <div class="fluxo-caminho fluxo-caminho-sim p-1">
                                        <span class="fluxo-caminho-tag">SIM</span>
                                        <span style="font-size:0.73rem">Visualizado: sem SMS</span>
                                    </div>
                                    <div class="fluxo-caminho fluxo-caminho-nao p-1">
                                        <span class="fluxo-caminho-tag">NÃO</span>
                                        <span style="font-size:0.73rem">Dispara SMS</span>
                                    </div>
                                </div>
                            </div>

                            <div class="fluxo-seta-horizontal" aria-hidden="true">&rarr;</div>

                            <div class="fluxo-passo-horizontal fluxo-no-sucesso">
                                <div class="d-flex align-items-center gap-2 mb-1">
                                    <span class="fluxo-no-indice"><i class="fas fa-check"></i></span>
                                    <span class="fluxo-no-titulo">ENCERRAMENTO</span>
                                </div>
                                <div class="fluxo-no-sub">Abertura em tela cheia cancela o SMS futuro</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>

        <!-- ==================== PARTE 4 — QUADRO COMPARATIVO ==================== -->
        <section class="secao-config-card" aria-labelledby="tituloQuadroComparativo">
            <h5 id="tituloQuadroComparativo" class="secao-config-titulo mb-2">Quadro comparativo das modalidades</h5>
            <p class="secao-config-desc mb-3">
                Síntese comparativa exata das características, canais, temporizadores e regras de escalonamento.
            </p>

            <div class="table-responsive">
                <table class="table table-bordered table-sm fluxo-tabela-comparativa mb-0" aria-label="Comparativo das modalidades de envio">
                    <thead>
                        <tr>
                            <th scope="col" style="width: 24%;">Característica</th>
                            <th scope="col" style="width: 25%;">Informativa</th>
                            <th scope="col" style="width: 25%;">Padrão</th>
                            <th scope="col" style="width: 26%;">Crítica</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <th scope="row"><i class="fas fa-mobile-alt me-2" style="color: #64b5f6;"></i>Push inicial</th>
                            <td>Imediato</td>
                            <td>Imediato</td>
                            <td>Imediato</td>
                        </tr>
                        <tr>
                            <th scope="row"><i class="fab fa-whatsapp me-2" style="color: #67e3a7;"></i>WhatsApp inicial</th>
                            <td>Não</td>
                            <td>Após 3 horas, se não houver leitura no portal</td>
                            <td>Simultâneo ao Push</td>
                        </tr>
                        <tr>
                            <th scope="row"><i class="fas fa-sms me-2" style="color: #ffcc00;"></i>SMS</th>
                            <td>Não</td>
                            <td>25 min após o WhatsApp, se não visualizado</td>
                            <td>Após 25 min do envio inicial, se Push e WhatsApp não forem visualizados</td>
                        </tr>
                        <tr>
                            <th scope="row"><i class="far fa-envelope me-2"></i>E-mail institucional</th>
                            <td>Opcional</td>
                            <td>Não definido</td>
                            <td>Não definido</td>
                        </tr>
                        <tr>
                            <th scope="row"><i class="fas fa-clock me-2"></i>Temporizador de 3 horas</th>
                            <td>Não</td>
                            <td>Sim</td>
                            <td>Não</td>
                        </tr>
                        <tr>
                            <th scope="row"><i class="fas fa-stopwatch me-2"></i>Temporizador de 25 minutos</th>
                            <td>Não</td>
                            <td>Após o envio do WhatsApp</td>
                            <td>Após o envio simultâneo de Push e WhatsApp</td>
                        </tr>
                        <tr>
                            <th scope="row"><i class="fas fa-sitemap me-2"></i>Escalonamento automático</th>
                            <td>Não</td>
                            <td>Sim</td>
                            <td>Sim</td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </section>

        <!-- ==================== PARTE 5 — DEFINIÇÕES DE ENTREGA, VISUALIZAÇÃO E LEITURA ==================== -->
        <section class="secao-config-card" aria-label="Definições de estados de comunicação">
            <h5 class="secao-config-titulo mb-2">Definições de envio, entrega, visualização e leitura</h5>
            <p class="fluxo-texto-base mb-3">
                Para evitar confusões operacionais, o sistema distingue expressamente cada um dos seguintes estados de comunicação:
            </p>
            <div class="row g-2 mb-3">
                <div class="col-md-6 col-lg-4">
                    <div class="fluxo-bloco-especial h-100">
                        <strong class="text-white d-block mb-1"><i class="fas fa-paper-plane me-1 text-info"></i>Envio:</strong>
                        <span class="small text-white-50">O sistema realizou uma tentativa de encaminhar a mensagem ao canal correspondente.</span>
                    </div>
                </div>
                <div class="col-md-6 col-lg-4">
                    <div class="fluxo-bloco-especial h-100">
                        <strong class="text-white d-block mb-1"><i class="fas fa-check me-1 text-success"></i>Entrega confirmada:</strong>
                        <span class="small text-white-50">O provedor do canal retornou uma confirmação de entrega no dispositivo, quando esse tipo de confirmação estiver disponível.</span>
                    </div>
                </div>
                <div class="col-md-6 col-lg-4">
                    <div class="fluxo-bloco-especial h-100">
                        <strong class="text-white d-block mb-1"><i class="fab fa-whatsapp me-1" style="color: #67e3a7;"></i>Visualização no WhatsApp:</strong>
                        <span class="small text-white-50">O canal retornou uma confirmação de que a mensagem foi visualizada pelo destinatário, quando disponível pelo provedor.</span>
                    </div>
                </div>
                <div class="col-md-6 col-lg-6">
                    <div class="fluxo-bloco-especial h-100">
                        <strong class="text-white d-block mb-1"><i class="fas fa-mobile-alt me-1 text-primary"></i>Abertura do Push:</strong>
                        <span class="small text-white-50">O aluno interagiu diretamente com a notificação e acessou o conteúdo por meio dela. Não se deve confundir a simples entrega da notificação com sua abertura.</span>
                    </div>
                </div>
                <div class="col-md-12 col-lg-6">
                    <div class="fluxo-bloco-especial h-100 border-primary">
                        <strong class="text-white d-block mb-1"><i class="fas fa-expand me-1 text-warning"></i>Abertura no portal (Confirmação de leitura):</strong>
                        <span class="small text-white-50">O estudante abriu o comunicado em tela cheia dentro do portal Uniube. Esse evento é o que registra efetivamente a visualização e leitura no AVA, interrompendo envios futuros pendentes.</span>
                    </div>
                </div>
            </div>
            <div class="fluxo-nota-prazos">
                <i class="fas fa-info-circle me-2 text-info"></i>
                <span class="small">
                    <strong>Ressalva técnica:</strong> Nem todos os canais oferecem o mesmo nível de confirmação. A disponibilidade e a confiabilidade dos estados dependem dos recursos e retornos disponibilizados por cada provedor. A simples prévia de notificação ou recebimento no aparelho não equivale à abertura do comunicado em tela cheia no portal.
                </span>
            </div>
        </section>

        <!-- ==================== PARTE 6 — REGRAS GERAIS DE FUNCIONAMENTO ==================== -->
        <section class="secao-config-card border-bottom-0 mb-2" aria-label="Regras gerais de funcionamento">
            <h5 class="secao-config-titulo mb-2">Regras gerais de funcionamento</h5>
            <p class="secao-config-desc mb-3">
                Princípios operacionais e diretrizes técnicas para o processamento de envios e escalonamentos:
            </p>
            <div class="row g-2">
                <div class="col-md-6">
                    <div class="fluxo-resumo-item h-100">
                        <span class="fluxo-resumo-destaque"><i class="fas fa-user-check me-2" style="color: var(--titulo-cor);"></i>Aplicação individual por aluno</span>
                        <span class="fluxo-resumo-texto">Todo o fluxo é aplicado individualmente para cada aluno destinatário. Uma falha de envio para determinado aluno não altera o fluxo dos demais.</span>
                    </div>
                </div>
                <div class="col-md-6">
                    <div class="fluxo-resumo-item h-100">
                        <span class="fluxo-resumo-destaque"><i class="fas fa-server me-2" style="color: var(--titulo-cor);"></i>Controle centralizado no backend</span>
                        <span class="fluxo-resumo-texto">Os temporizadores são controlados pelo servidor, independentemente de o navegador do estudante estar aberto ou fechado.</span>
                    </div>
                </div>
                <div class="col-md-6">
                    <div class="fluxo-resumo-item h-100">
                        <span class="fluxo-resumo-destaque"><i class="fas fa-database me-2" style="color: var(--titulo-cor);"></i>Estado de envio independente</span>
                        <span class="fluxo-resumo-texto">Cada comunicado possui seu próprio estado de envio por aluno e por canal, registrando separadamente falhas, tentativas e confirmações.</span>
                    </div>
                </div>
                <div class="col-md-6">
                    <div class="fluxo-resumo-item h-100">
                        <span class="fluxo-resumo-destaque"><i class="fas fa-ban me-2" style="color: var(--titulo-cor);"></i>Bloqueio de mensagens duplicadas</span>
                        <span class="fluxo-resumo-texto">Não são enviadas mensagens duplicadas pelo mesmo canal para o mesmo comunicado e aluno.</span>
                    </div>
                </div>
                <div class="col-md-6">
                    <div class="fluxo-resumo-item h-100">
                        <span class="fluxo-resumo-destaque"><i class="fas fa-hand-paper me-2" style="color: var(--titulo-cor);"></i>Interrupção inteligente de envios futuros</span>
                        <span class="fluxo-resumo-texto">A abertura do comunicado em tela cheia no portal interrompe os próximos envios ainda não iniciados. Envios já realizados não são desfeitos retroativamente.</span>
                    </div>
                </div>
                <div class="col-md-6">
                    <div class="fluxo-resumo-item h-100">
                        <span class="fluxo-resumo-destaque"><i class="fas fa-shield-alt me-2" style="color: var(--titulo-cor);"></i>Tratamento específico da modalidade crítica</span>
                        <span class="fluxo-resumo-texto">A modalidade crítica opera com disparo imediato simultâneo por Push e WhatsApp e temporizador próprio de 25 minutos, sem aplicar a espera de 3 horas da modalidade padrão.</span>
                    </div>
                </div>
            </div>
        </section>
    `;
}
