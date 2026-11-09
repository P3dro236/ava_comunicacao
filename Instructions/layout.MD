1. Estrutura da Página

A arquitetura do DOM baseia-se em um layout de página única (SPA-like) com sobreposições fixas e áreas de rolagem independentes. A hierarquia principal é dividida da seguinte forma:

    Overlay de Carregamento (#carregando): Container fixo (position: fixed, z-index implícito alto) que encobre toda a viewport durante requisições, contendo um SVG customizado e texto animado.

    Menu Lateral (nav#sidenav): Barra de navegação com a classe estrutural .sidenav.

        Header do Menu: Contém o logotipo (#containerImgSidenav), o controle mobile (#sideMenuBtnMobile) e a âncora de fixação (#fixSideMenu).

        Corpo do Menu (#containerSidenav): Rolável independentemente, contém a lista de links (#sidenavItems) intercalados com <hr>. Utiliza submenus expansíveis (.subSideMenu dentro de .close).

        Rodapé do Menu (#lowerSidenav): Área inferior fixa para utilidades e configurações.

    Área de Conteúdo Principal (div#main):

        Cabeçalho (nav#navbar): Barra superior horizontal (.navbarAva). Contém:

            Título de contexto (#cabDescrCurso / #tituloGeralContainer).

            Ícones de utilidade: Acessibilidade (#divAcessibilidadeWeb), Notificações (#notificacao_ico).

            Menu de Perfil (#divNavbar): Dropdown interativo com avatar (#userPicturePerfil), nome e opções estendidas (#perfilOptions).

        Container de Conteúdo (#divAvaConteudoGeral): Área com rolagem independente (overflow-y gerido pelo navegador/JS), ancorada por data-bs-spy="scroll".

            No contexto InicioAva: Apresenta cards de dashboard organizados em CSS Grid (.card-grid-4, .sub-grid).

            No contexto Aulas: Contém o container de listagem (#cardsContainer -> .component-card-container).

            No contexto ComunicacaoAva: Estrutura dividida em colunas (.col-lg-2 para #barraLateralComunicacao e .col-lg-10 para a lista de mensagens #divComGeral).

    Sobreposições (Overlays / Modals):

        #invisible_overlay: Captura cliques fora de dropdowns.

        .avaModalDialog: Modais padronizados (ex: #abre_modal_marcador_co e #abre_modalFechaAba).

        #a11y-fab-loader: Floating Action Button fixo para acessibilidade.

2. Identidade Visual
Paleta de Cores (Códigos HEX / RGB)

    Fundos (Backgrounds):

        Fundo Loading: rgb(49, 58, 70)

        Cards base (Modo Escuro): rgb(33, 33, 33)

        Bordas de Cards (Modo Escuro): rgb(70, 70, 70)

        Fundo Componentes Interativos Hover: rgba(180, 200, 220, 0.08) / rgba(0, 0, 0, 0.05)

    Tipografia e Textos:

        Texto Principal Dark: rgb(220, 220, 220)

        Texto Secundário / Mutado: rgb(180, 190, 200, 0.6) / rgba(255, 255, 255, 0.8)

    Cores Semânticas (Bandeiras / Badges / Indicadores):

        Danger (Erro/Alerta): #ef4444 / rgb(244, 114, 114) (Bg: rgba(244, 114, 114, 0.1))

        Warning (Aviso): #f59e0b / rgb(255, 138, 101)

        Success (Sucesso): #3da45b / rgb(72, 187, 106)

        Brand Cyan (Badge 2026/2): rgb(38, 198, 218)

        Brand Light Blue (Teórica): rgb(180, 200, 220)

        Brand Blue (Presencial): rgb(100, 181, 246)

        Gradients:

            Barra de progresso: linear-gradient(90deg, rgb(180, 200, 220), rgb(100, 181, 246))

            Banner Novidades: linear-gradient(135deg, #0d2e5c 0%, #1a4380 50%, #20478b 100%)

Tipografia

    Famílias Confirmadas: Inter, sans-serif (amplamente aplicado via estilos inline), "lato-regular" (usado especificamente nos mostradores numéricos do dashboard e loader).

    Pesos (Weights): Variam primariamente entre 500 (textos de botões/labels) e 600/700 (títulos, indicadores numéricos).

    Tamanhos Base (Responsivos): Root font-size 100%. Uso extensivo de .rem. Textos secundários (labels) chegam a 0.625rem / 0.6875rem, títulos de cards 1rem, e destaques numéricos até 3.5rem.

Formas e Espaçamentos (Border & Shadow)

    Border-Radius: Padrão altamente arredondado.

        Cards Genéricos: 12px (0.75rem).

        Botões Pequenos / Badges: 0.25rem a 0.375rem.

    Box-Shadow: Sombras suaves em hover. Exemplo confirmado: box-shadow: 0 4px 12px rgba(220, 220, 220, 0.1); para elevação de cards.

    Filtros: Uso de backdrop-filter: blur(2px) confirmado nos modais de carregamento global.

3. Componentes

    Segmented Buttons (.segmented-button): Seletor de visualização (ex: Grid/List). Usa inputs de rádio escondidos interligados a labels .segmented-button-segment. Estado ativo aplica fundo rgb(33, 33, 33) e shadow 0 1px 3px rgba(0, 0, 0, 0.1).

    Component Cards (.component-card): Usados em Aulas.htm.

        Cabeçalho: .component-card-badges (tags) e título truncado (-webkit-line-clamp: 2).

        Corpo: Indicadores .component-indicator. Possuem estado hover (transform: translateX(0.125rem) e fundo rgba translúcido).

        Rodapé: Ações com .ava-dropdown ou .btn.

    Botões Base (.btn):

        .primary: Fundo gerido por CSS variable --btn-color (fallback 70, 95, 120). Hover aplica filter: brightness(1.1). Focus gera box-shadow simulando outline.

        .secondary: Fundo com opacidade 0.2 da cor principal.

    Badges (.badge): Possuem variações estruturais: .subtle (fundo 0.1 + borda 0.2), .soft (fundo 0.1 + borda transparente), .solid e .outlined. A cor é injetada inline via --badge-color.

    Dropdowns (.ava-dropdown): Menus de contexto. A transição de abertura utiliza opacity, visibility e transform: translateY(-0.25rem) scale(0.98) para scale(1).

    Tabela de Comunicação (.linha-comunicacao): Estrutura flexível em ComunicacaoAva.htm. Usa .elemento para cada linha, contendo checkbox (.checkMsgComunicacao), título/remetente, data e indicador de leitura (ícone de círculo fa-circle). Fundo escurece para mensagens lidas usando var(--cor-fundo-comunica-lido).

4. Responsividade

Os breakpoints são definidos rigidamente por Media Queries identificadas no CSS:

    @media (max-width: 1140px):

        A lista de mensagens (.linha-comunicacao) perde o layout em linha e adota flex-direction: column;, forçando as larguras internas a assumir width: inherit!important;.

    @media (max-width: 992px):

        O .banner-novidades-wrapper passa a flex-direction: column. A divisão entre áreas perde a borda direita e ganha borda inferior.

    @media (max-width: 768px):

        O preenchimento (padding) do container principal (#divAvaConteudoGeral) encolhe para 32px 32px.

        Cards de componentes (.component-card.inline) quebram de linha para coluna, e botões de rodapé forçam .btn { flex: 1 1 100%; }.

        Hint de scroll (.segmented-button-scroll-hint) é reduzido.

    @media (max-width: 576px) (Resolvido via JS):

        O menu superior muda o comportamento do Dropdown de perfil, ativando uma aba deslizante lateral (viewPerfil) em vez do dropdown absoluto.

    @media (max-width: 480px):

        Cards de avisos perdem margem interna (padding cai para 14px), tamanhos de fontes em títulos recuam de 1.15rem para 0.95rem.

    @media (max-width: 375px):

        O padding de #divAvaConteudoGeral sofre compressão extrema (32px 16px).

    Acessibilidade / Animações (@media (prefers-reduced-motion: reduce)):

        Animações de balões (.a11y-error-bubble), interações no botão FAB de acessibilidade e os transforms e transições interativas do .component-indicator.clickable são sumariamente desativadas (transition: none !important; animation: none !important;).

5. Tecnologias

Evidências rígidas extraídas dos <head> e do escopo JS:

    Linguagens e Estrutura: HTML5, CSS3, JavaScript (ES6+ com ES Modules <script type="module">).

    Framework CSS Principal: Bootstrap (v5+). Evidenciado por classes utilitárias nativas (d-flex, justify-content-between, mt-2, col-lg-2) e referência ao bootstrap.bundle.min...js.

    Ícones: FontAwesome (classes .fas, .far, .fab) e Lucide Icons (lucide.min...js).

    Bibliotecas de Interface & Funcionalidade Local:

        video.js (Reprodutor de mídia para os "reels").

        CKEditor (Identificado em ComunicacaoAva.htm como ckeditor...js, gerando <style>.cke{visibility:hidden;}</style>).

        DOMPurify (purify.min...js - para sanitização de strings e proteção XSS no tracker de passos).

        Axios (axios.min...js - requisições HTTP assíncronas para carregar widgets e listar tabelas).

        dom-to-image.min...js (Para geração/manipulação estática de snapshots em client-side).

    Dependências de Terceiros e APIs (Externas):

        Google Translate (conectores preconnect e tradutorGoogle...js).

        Google Analytics (gtag.js).

6. Padrões de Desenvolvimento

    Padrões de Classe (CSS): Mistura arquitetônica entre BEM (Block Element Modifier, ex: .component-card-header, .banner-novidades-icon-box) e OOCSS via Bootstrap (p-3, ms-auto, w-100).

    CSS em Variáveis Genéricas (Custom Properties): Fortemente orientado a Design Tokens injetados via inline style. Exemplo: <span style="--badge-color: 38, 198, 218">.

    Injeção de CSS Isolado: Inserção de estilos encapsulados e rastreáveis por hash /* CSS-HASH: 1247434a352f8731... */ ou /* STYLE-REGISTRY: [...] */, visando prevenir sobreposição de regras de componentes criados sob demanda.

    Organização do JavaScript:

        Event Handling Híbrido: Muito uso de onclick="" inline nos elementos HTML, ferindo a separação de conceitos estrita, mas facilitando amarração de endpoints (onclick="formEnviarPost('/ava/...')");

        Sobrescrita de Protótipos (Anti-pattern documentado): Sobrescrita consciente de Node.prototype.addEventListener e HTMLFormElement.prototype.submit para injetar tracking e intercepção de payloads (especialmente para WebView mobile Android.handlePostData).

        Lazy Loading de Componentes: Implementação de um MutationObserver (window.DOMObserver) que aguarda elementos entrarem no DOM para iniciar seus scripts.

7. Inventário de Recursos

Observação: As referências locais contêm hashes finais (ex: _sHVX, _Vbew) denotando invalidação de cache (cache-busting).

Arquivos de Scripts Ausentes (Referenciados, mas não embutidos nas fontes):

    avaComponents_*.js, index_*.js, sw-client-helper_*.js

    a11y-init_*.js (Gerenciador de Acessibilidade)

    adaptaImagensPorTemaAva_*.js

    UnieFix_*.js, UniePluginAutomatic_*.js, unieTutor_*.js (Ecossistema de IA/Tutorial)

    ajax-helper_*.js

    LAEditor_*.js, scriptGravacaoMediaAudio_*.js, scriptGravacaoMediaVideo_*.js (Apenas ComunicacaoAva.htm)

Arquivos de Estilos Ausentes:

    globalColors_*.css, globalStyle_*.css, padraoDarkMode_*.css, colorsDarkMode_*.css

    menu_*.css, componentes_*.css, unieTutorial_*.css, destaque_*.css, destaqueProfessores_*.css, boletim_*.css

Recursos de Mídia e Imagens Localizados:

    Logotipo: /logo_branca_*.png

    Brasão: /brasao_uniube_*.png

    Icone Uni-e: /unie_icon_white_v2_*.svg

    Imagem Placeholder Vazia: /freepik-event-calendar_*.png

    Geradores Dinâmicos (Endpoints PHP renderizando imagem):

        Avatar Usuário: /include/criaFotoPerfil.php?ra=...

        Avatar Mentor: /programas/mentorOnline/mentores_profiles/*.jpg

        Assinaturas: /programas/comunicacoes/comunicacao/mostraImgAssinatura.php?seq=...

    Mídia de Conteúdo (Reels): /videoGif_*.gif

8. Requisitos de Fidelidade Visual

Omitir qualquer um destes itens compromete a identificação imediata com a identidade da instituição.

    Loader Animado Exato (#carregando): É estritamente obrigatória a recriação do SVG com os path originas exatos (preenchimentos variando entre #E6E7E8, #D2D3D5 e #FFFFFF), somado à animação dashoffset sincronizada em 1.35s (@keyframes desenha). O texto "Carregando" necessita da animação sequencial em elipses (@keyframes pontos).

    Translucidez e Filtros de Fundo: Todo backdrop-filter e background gradient dos menus (ex: .containerImgSidenav em colapso com linear-gradient(359deg, #242a3300 0, #313a46 60%, #394452)) devem ser idênticos.

    Botão FAB de Acessibilidade: Reprodução exata das âncoras na posição inferior direita, incluindo expansão .a11y-error-bubble e o highlight blue #2563eb nos focos visíveis.

    Sistema de Badges Injetados Dinamicamente: O sistema consome RGB cru via variável de estilo em linha (ex: style="--badge-color: 180, 200, 220"). Toda a classe badge.subtle ou badge.soft baseia sua cor de texto, fundo (com transparência estipulada via RGBA) e borda neste valor injetado. Sem isso, as tags de disciplinas falharão visualmente.

    Interação "Button Nudge": Elementos .component-indicator.clickable dependem do deslocamento lateral de exatos 0.125rem no hover para feedback tátil da interface (não usar transformações genéricas maiores ou menores).

    Tipografia Numérica Condicional: Apesar do texto geral usar Inter, os big-numbers dos widgets do Dashboard devem obrigatoriamente forçar o uso da família "lato-regular", além de usar pesos de fonte específicos (font-weight: 600 ou 700) para casar com a densidade original da tela.

    Truncamento Escrito em Componentes (Clamping): Títulos de disciplinas e mensagens não devem vazar o grid; a preservação de .component-card-title e descrições do U-News necessitam imperativamente da regra -webkit-line-clamp: 2.