Mapeamento Técnico de Interface Original

Documento: documentacao_interface_leitura.md
Objetivo: Engenharia reversa e mapeamento para reprodução de interface institucional (Módulo Comunicação - Estado de Leitura de Mensagem)
Fontes Analisadas: comunicacao_ava_3.htm, comunicacao_ava_2.htm, comunicao_ava_1.htm

1. Estrutura da Página

A estrutura global (Loader, Sidebar, Navbar) permanece inalterada em relação à listagem, porém a área de conteúdo dinâmico (#divComGeral) alterna sua visibilidade: o container de listagem (#divComConteudoCE0) recebe display: none;, enquanto o container de leitura (#divComConteudoLerMsg) assume o protagonismo no DOM. A hierarquia interna do leitor é a seguinte:

Barra de Opções de Leitura (.barraOpcComunicacao):

Header interno com botões de ação em linha: Voltar (fa-arrow-left), Marcar como não lida (fa-envelope) e Excluir (fa-trash).

Corpo da Mensagem (#divMensagemComunicacao): Possui margem esquerda fixa (margin-left: 12px;).

Cabeçalho do Assunto: Container div#divTituloComunicacao renderizando um <h4> com o título do e-mail.

Container da Conversa (#divMsgComSeq...): Define o layout flexível do e-mail específico.

Coluna de Avatar (.col-md-1): Contém a foto do remetente arredondada (.rounded-circle) com largura fixa de 50px.

Coluna de Metadados e Conteúdo (.col-md-11):

Linha Superior: Nome do remetente em <strong>, data/hora (com cor mutada) e menu de contexto .dropdown-menu (Responder, Encaminhar, Excluir). Apresenta também o indicador de curtidas (fa-thumbs-up), se houver.

Linha de Destinatários (.divDestinatariosCom): Lista resumida dos receptores e um botão expansível (.btnComunicacaoMais) que abre o dropdown de detalhes completos (De, Para, Data, Assunto).

Área de Renderização HTML (#divConteudoMsgComSeq...): Div que injeta o HTML rico do e-mail formatado via WYSIWYG (CKEditor). Restringe a largura máxima de imagens via CSS.

Rodapé de Ações (#divBtnResponder...): Painel inferior .responsivo que agrupa botões em Flexbox para resposta rápida (Curtir, Responder, Encaminhar).

Formulário Oculto (#formNovaMensagemComunicacao): Inputs tipo hidden contendo os IDs (seqComunicacao, codComunicacao) necessários para injetar respostas.

2. Identidade Visual

Paleta de Cores com Códigos HEX e RGB

Fundo e Textos Globais: Mantém-se o padrão institucional escuro mapeado anteriormente nos painéis gerais.

Metadados (Data/Hora e Rótulos secundários): Uso hardcoded da cor cinza escuro #5F6368 (aplicado inline) para informações de data, rótulos "De/Para/Assunto" e ícones de dropdown.

Ícones de Ação e Sucesso: O ícone de curtida (Like) ativo no header da mensagem herda as cores institucionais ativas, e o botão buttonMain possui suas próprias propriedades baseadas no Design Token da aplicação (fundo rgb(70, 95, 120) na versão primária mapeada).

Tipografia Base: A leitura dos e-mails permite formatação livre (Rich Text), mas o contorno sistêmico usa fontes sans-serif (Inter predominante) com marcações estritas em negrito (<strong>) para nomes de remetentes.

Propriedades de Formas e Espaçamentos

Avatares: border-radius: 50% (via .rounded-circle) cravados em width: 50px.

Dropdown Menu de Detalhes: Dropdown consideravelmente amplo, controlado via variáveis relativas: width: min(32rem, calc(100vw - 2rem)) e max-width: calc(100vw - 2rem).

Paddings Estruturais: Abundância de classes utilitárias de espaçamento (pt-3, pb-3, pe-0, ms-1), configurando um layout muito arejado.

3. Componentes

Dropdown de Detalhes do E-mail (.dropDownComunicacao): Componente crucial. Um grid interno (.row) divide rótulos alinhados à direita (.col-3.text-end.cor-texto-cinza) e valores descritivos (.col-9). É acionado pelo botão .btnComunicacaoMais adjacente ao resumo de destinatários.

Caixa de Renderização HTML (#divMensagemComunicacao img): Há uma trava de segurança via tag <style> no escopo interno que força todas as imagens injetadas nos e-mails a obedecerem height: auto!important; e max-width: -webkit-fill-available;, impedindo que e-mails mal formatados quebrem o grid do leitor.

Botão Responsivo (.buttonMain): Reutilização de componente mapeado na listagem, aplicado agora ao rodapé de leitura com labels "Responder" e "Encaminhar".

Indicador de Reação (Curtida): Ícone .fa-thumbs-up encapsulado em um <span> cuja tag title recebe dinamicamente a string com os RAs e nomes dos usuários que curtiram a mensagem (ex: Curtida por: 5178891 - FELIPE...).

4. Responsividade

A adaptação foca estritamente na legibilidade do texto do e-mail e nos botões de ação inferiors. O arquivo apresenta um bloco <style> injetado com media queries vitais:

Breakpoint @media (max-width: 1010px):

Aplica-se à classe .responsivo do container inferior de botões (#divBtnResponder...), forçando flex-direction: column; para empilhar os botões de Curtir, Responder e Encaminhar.

Breakpoint @media (max-width: 576px):

Altera agressivamente o Dropdown de Detalhes (.dropDownComunicacao), removendo margens negativas de linhas (.row).

Desfaz o layout 3/9 colunas, forçando as divisões .col-3 e .col-9 a assumirem flex: 0 0 100%; e max-width: 100%;, além de sobrescrever o alinhamento para text-align: left !important;. O padding do componente é recuado para 0.75rem.

5. Tecnologias

Ferramentas Principais: Bootstrap 5 (classes utilitárias de grid col-* e espaçamento p-*), FontAwesome (Ícones de mensagem).

Editor Wysiwyg (Desativado passivamente): Constata-se a injeção do <style>.cke{visibility:hidden;}</style>. O CKEditor (ckeditor_Y5M7.js) existe na memória para quando o usuário clicar em "Responder", momento em que ele montará a caixa de texto substituindo a view de leitura.

Recursos Nativos: O CSS se utiliza amplamente de funções matemáticas (min(), calc()) e suporte a -webkit-fill-available para restrição segura da caixa delimitadora das mensagens embutidas.

6. Padrões de Desenvolvimento

Composição em Linha e Overrides: Forte presença de estilização injetada em linha ou declarada em blocos <style> acima do componente específico (anti-pattern perante separação CSS/HTML estrita, porém padrão no código-fonte avaliado para isolar o leitor de e-mails das classes globais).

Armazenamento de Metadados no DOM: Utilização de atributos customizados fora do padrão W3C (nome="Nome", dt_envio="...", matricula="...", perfil="...", ingresso="...") na tag <span> dos remententes e destinatários, utilizados pelos scripts (Axios/JS) para capturar os dados sem requisições adicionais ao backend no momento da resposta.

7. Inventário de Recursos

Avatares Redimensionados: Arquivos criaFotoPerfil_...jpg. Exige renderização no tamanho 50x50 utilizando rounded-circle.

Dependências de Script do Módulo: Carregamento contextual dos recursos de mídia (scriptGravacaoMediaAudio_...js, scriptGravacaoMediaVideo_...js), pressupondo que a interface suporte envio de respostas contendo gravações injetadas no CKEditor.

8. Requisitos de Fidelidade Visual

A reprodução do módulo deve respeitar as seguintes amarras visuais para manter consistência absoluta:

Limitação do Corpo da Mensagem: O bloco de regras CSS para #divMensagemComunicacao img é obrigatório. Sem o max-width: -webkit-fill-available;, imagens anexadas estourarão a interface lateralmente e quebrarão a responsividade da área logada.

Dropdown Estruturado de Detalhes: O comportamento em duas colunas (3-9 ratio) da caixa expansível de detalhes do e-mail (alinhando rótulos como "de:", "para:" à direita e valores à esquerda) deve quebrar para 100% de largura empilhada exatamente em 576px.

Cor e Contraste Omitidos: Rótulos auxiliares de cabeçalho (data:, assunto:) requerem rigorosa aplicação do código #5F6368.

Botões de Resposta Empilhados: A mudança de estado da barra inferior de ação via .responsivo deve acontecer ao atingir 1010px, empilhando os botões antes que eles se sobreponham ao texto por falta de espaço em tablets.