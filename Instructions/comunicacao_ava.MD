Mapeamento Técnico de Interface Original

Documento: documentacao_interface.md
Objetivo: Engenharia reversa e mapeamento para reprodução de interface institucional (Módulo Comunicação)
Fonte Analisada: ComunicacaoAva_2.htm

1. Estrutura da Página

O documento baseia-se em uma arquitetura de página única (SPA-like), dividida entre sobreposições fixas, navegação global e a área de trabalho específica do módulo de comunicação. A hierarquia do DOM estrutura-se rigorosamente da seguinte forma:

Overlay de Carregamento (div#carregando): Container fixo (position: fixed, cobrindo 100% da tela) contendo um SVG customizado e texto com animação elíptica.

Menu Lateral Global (nav#sidenav.sidenavPrincipal):

Cabeçalho: Logo (#containerImgSidenav) e botão mobile de recolhimento.

Corpo (#containerSidenav): Lista de navegação principal. O item atual ativo é Comunicação (#menu_59, classe .menu-ativo).

Área Principal (div#main):

Navegação Superior (nav#navbar.navbarAva): Contém título contextual vazio, ícone de acessibilidade, sino de notificação e o perfil do usuário (#divNavbar) com dropdown próprio.

Container de Conteúdo (div#divAvaConteudoGeral): Área rolável da aplicação.

Título Geral: h1#tituloGeral com o texto "Comunicação".

Card Principal (div#divGeralComunicacao.card.p-3): Elemento central que encapsula todo o layout do módulo. Utiliza um sistema de grid (.row):

Coluna Esquerda (div.col-lg-2.border-end): Sidebar específica de comunicação (#barraLateralComunicacao). Contém lista de pastas (.comunicacaoSidenav) e seção de Marcadores.

Coluna Direita (div.col-lg-10.ps-0): Área ativa de mensagens.

Barra de Ferramentas (.barraOpcComunicacao): Ações em lote (checkbox geral, atualizar, marcar não lida, lixeira) e barra de pesquisa lateral.

Filtro de Entidades (#divFiltroTipoPessoa): Abas (.nav-pills), possuindo atualmente a aba "Uniube" ativa.

Lista de Mensagens (.divListaComunicacoes): Filtros de rádio (Todos, Não Visualizado, Visualizado) e a tabela flexível (.tabelaMsgsComunicacao) listando os itens.

Modais e Sobreposições (Overlays):

#abre_modal_marcador_co: Modal (.avaModalDialog.modalLarge) para criação/edição de marcadores. Contém inputs para descrição e cor (<input type="color">).

#a11y-fab-loader: Floating Action Button (FAB) de acessibilidade, fixo na lateral inferior direita.

2. Identidade Visual

Paleta de Cores Confirmadas (HEX / RGB / Variáveis)

Fundo Global Loader: rgb(49, 58, 70)

Fundo Botão Acessibilidade (FAB): rgb(0, 119, 182) (Preenchimento SVG: #ffffff)

Alerta / Perigo (Ícone Notificação/Mensagens): #ef4444

Sucesso (Checkmark Notificação): #3da45b

Cores de Mensagens (Tabela):

Mensagem Lida: O fundo é definido pela variável CSS não resolvida internamente var(--cor-fundo-comunica-lido).

Corpo do Texto Principal: Título assume var(--titulo-cor).

Botões de Paginação (.btnAltoContraste): Há indicação de botão ativo com background-color: #6d757f.

Marcador Default (Input de Cor): #000000.

Padrões de Tipografia

Famílias Documentadas: Inter, sans-serif (em componentes globais invisíveis) e "lato-regular" (explicitamente usado no texto animado de "Carregando").

Pesos (Font-weight):

Títulos de remetente na tabela de e-mails: 600

Assunto do e-mail: 500

Menu ativo (.fw-bold): Utiliza as definições padrão do Bootstrap para bold.

Tamanhos Base: Textos de cabeçalho na tabela usam 1.1rem, assuntos de mensagens usam 1rem.

Formas e Espaçamentos

Border-radius: 10px nos modais flutuantes/cards da acessibilidade, 0.25rem/0.375rem/0.5rem escalonados em botões, 50% em avatares e indicadores de marcadores.

Box-shadow: Sombras sutis mapeadas no modal de erro (0 6px 18px rgba(0,0,0,.25)) e no FAB de acessibilidade (rgba(0, 0, 0, 0.2) -2px 0px 8px).

3. Componentes

Menu de Pastas (.comunicacaoSidenav):

Itens (.pastaComunicacao) com ícones à esquerda e badges de notificação (.comunicacoQtdMsg) à direita. O estado selecionado possui a classe .sel e .fw-bold.

Linha de Mensagem (.elemento.linha-comunicacao):

Comportamento Visual: Estrutura baseada em Flexbox.

Status Não Lida: Ausência de fundo específico, presença de ícone indicador <i class="fas fa-circle desmarca-visualizacao"></i> flutuante à esquerda.

Status Lida: Atributo inline style="background-color:var(--cor-fundo-comunica-lido);" aplicado à linha pai, conteúdo interno com opacity: 0.7;, e ausência do ícone fa-circle.

Colunas Internas: Checkbox flexível, Categoria (ex: "Divulgação" com 29% width), Assunto truncado (36% width), Data alinhada à direita (20% width), e um Dropdown Menu oculto acionado por fa-ellipsis-v.

Filtros de Rádio Customizados (.checkLabel): Layout estilizado escondendo o rádio nativo e utilizando classes adjacentes para formatação (Todos, Não Visualizado, Visualizado).

Botões de Paginação: Sequência de botões .btnAltoContraste com setas (fa-chevron-left/right) e números.

4. Responsividade

A adaptação ao dispositivo é controlada pelas classes grid do Bootstrap e media queries explícitas no código:

Ponto de Quebra: max-width: 1140px (Confirmado via CSS inline no arquivo):

A classe .linha-comunicacao perde o comportamento row e assume flex-direction: column;.

Todos os filhos diretos perdem as larguras em porcentagem (29%, 36%, 20%) adotando width: inherit!important;.

Ponto de Quebra: max-width: 768px / 375px:

Padding de #divAvaConteudoGeral retrocede de 32px 64px para 32px 32px, e finalmente 32px 16px em telas muito estreitas.

Gestão de Grid: A divisão 2-colunas / 10-colunas do layout principal depende das classes .col-lg-2 e .col-lg-10. Abaixo de lg (992px do Bootstrap), essas seções empilham em 100% de largura (comportamento .col-12 padrão omitido).

5. Tecnologias

Mapeamento absoluto das bibliotecas e frameworks requisitados e instanciados no DOM:

Estrutura Principal: HTML5, CSS3, JavaScript Vanilla (Módulos ES6).

Framework UI: Bootstrap 5 (identificado pelas classes .ps-0, .border-end, .d-flex, .col-lg-*, bootstrap.bundle.min_74Qd.js).

Ícones: Múltiplas bibliotecas ativas simultaneamente:

FontAwesome: (.fas.fa-inbox, .far.fa-envelope, etc.)

Lucide Icons: (Requisitado no cabeçalho via lucide.min_74Qd.js).

Editor Rich Text: CKEditor (identificável pelos scripts ckeditor_74Qd.js e referência literal à API global CKEDITOR.instances).

Utilitários HTTP & JS: Axios para chamadas XHR assíncronas (axios.min_74Qd.js), DOMPurify (sanitização no script injetado).

Terceiros: Integração com Google Translate (tradutorGoogle_74Qd.js), Google Analytics (gtag).

6. Padrões de Desenvolvimento

Nomenclatura e Estilos: Forte adoção de classes utilitárias do Bootstrap mescladas com CSS embutido (style=""). Há classes customizadas no estilo CamelCase (.barraOpcComunicacao, .tabelaMsgsComunicacao) e classes semânticas OOCSS (.elemento, .linha-comunicacao).

Scripts e Manipulação de Eventos:

Eventos registrados diretamente na marcação (ex: onclick="listaMensagensRemetente(...)", onclick="alternarPastaComunicacao(...)").

Sobrescrita ativa do Prototype do Javascript (Node.prototype.addEventListener e HTMLFormElement.prototype.submit) visando captura e injeção de dados (Tracking / WebViews Mobile via PonteJs.postData).

Controle de Estado: O controle do Modal e Dropdowns mistura Bootstrap nativo (data-bs-toggle="dropdown") com funções customizadas do ecossistema AVA (showModal(this)).

7. Inventário de Recursos

Anotação: Todos os arquivos incluem a string de cache-busting _74Qd no final do nome.

Scripts Ausentes:

avaComponents_74Qd.js, index_74Qd.js, sw-client-helper_74Qd.js, a11y-init_74Qd.js

tradutorGoogle_74Qd.js, adaptaImagensPorTemaAva_74Qd.js, script_74Qd.js, scriptPos_74Qd.js (referenciado tacitamente em layouts similares)

Exclusivos deste módulo: ckeditor_74Qd.js, scriptGravacaoMediaAudio_74Qd.js, scriptGravacaoMediaVideo_74Qd.js, LAEditor_74Qd.js.

CSS Ausentes:

all.min_74Qd.css, bootstrap.min_74Qd.css, globalColors_74Qd.css, globalStyle_74Qd.css

Temas estritos: padraoDarkMode_74Qd.css, colorsDarkMode_74Qd.css

Exclusivos deste módulo: menu_74Qd.css, style_002_74Qd.css, style_74Qd.css.

Mídias e Imagens Referenciadas:

logo_branca_74Qd.png (Navegação Superior / Sidenav)

unie_icon_white_v2_74Qd.svg (Ícone Navbar)

brasao_uniube_74Qd.png (Ícone da aba "Uniube" - Dimensão imposta: 15px)

Dinâmicas/PHP: /include/criaFotoPerfil.php?ra=...

8. Requisitos de Fidelidade Visual

Regras inegociáveis para reprodução idêntica da interface mapeada:

Grid de Layout Assíncrono: A proporção da tela de mensagens deve respeitar o grid Bootstrap de colunas laterais em resoluções Desktop (col-lg-2 para sidebar de pastas, col-lg-10 para corpo de emails), removendo as bordas separadoras (.border-end) no comportamento mobile (quando quebram para 100%).

Transições de Linha de Comunicação: É vital a aplicação exata da media query de 1140px. Acima dessa largura, a .linha-comunicacao obedece flexibilidade em porcentagens (29%, 36%, 20%). Em 1140px ou menos, forçar flex-direction: column e forçar larguras para inherit!important.

Identificação Visual de Status (Lida/Não Lida): Mensagens não lidas não devem ter background opaco, mas exigem o ícone .fa-circle posicionado em relação absoluta ou flutuante à esquerda. Mensagens lidas precisam receber opacity de 0.7 na fonte e o fundo proveniente da variável --cor-fundo-comunica-lido.

Marcadores de Cor Categóricos: A reprodução dos marcadores exige a renderização de elementos circulares perfeitos (width: 10px; height: 10px; border-radius: 50%;) no começo do container do título da mensagem, coloridos via injeção CSS inline baseado no Hex code associado, mantendo a tag semântica de Categoria ("Divulgação") inalterada.

Sanidade do Loader Global (#carregando): A sequência temporal, offset progressivo e stroke color do SVG do loader pre-loading, combinados à tipografia 'Lato' com dots elípticos gerados em CSS, devem ser reconstruídos sem aproximações, copiando os keyframes originais mapeados.