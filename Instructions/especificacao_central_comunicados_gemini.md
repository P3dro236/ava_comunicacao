# Especificação do projeto — Central Inteligente de Comunicados Acadêmicos

## 1. Instrução principal ao Gemini

Você deverá analisar os **dois arquivos Markdown de referência fornecidos junto com este documento** e utilizá-los para compreender como o portal acadêmico funciona, quais áreas e componentes existem e quais padrões visuais e estruturais devem ser preservados.

Seu trabalho é construir um **protótipo visual e interativo em HTML** para uma nova Central de Comunicados, incorporada ao contexto do portal existente. A solução funcional descrita neste documento deve estar representada na interface.

### Ordem obrigatória de trabalho

1. Leia integralmente os dois arquivos Markdown de referência.
2. Extraia deles a estrutura de navegação, os nomes das áreas, os fluxos de uso, os componentes e os padrões visuais confirmados.
3. Compare essas informações com esta especificação. Não presuma detalhes que não estejam documentados.
4. Inspecione também os arquivos HTML, CSS, JavaScript, imagens e demais recursos do portal que forem disponibilizados. Se houver código original, reutilize sua estrutura e seus componentes sempre que possível.
5. Antes de implementar, apresente um resumo curto do que identificou e indique quais arquivos e componentes pretende reutilizar.
6. Implemente o protótipo, teste as interações descritas e corrija os problemas encontrados.

**Não crie um portal novo e independente.** A Central deve parecer uma funcionalidade nativa do sistema acadêmico atual. Reproduza somente a parte necessária do portal para demonstrar a solução, preservando cabeçalho, navegação, identidade visual e contexto da página original conforme as referências.

Se os arquivos de referência não explicarem algum detalhe, não invente que ele existe no sistema atual. Adote uma solução visual coerente, registre a decisão como proposta e mantenha-a consistente com os padrões confirmados.

---

## 2. Relatório do problema

### 2.1. Situação observada

O portal possui pelo menos duas áreas de comunicados: **Uniube** e **Curso**.

A área Uniube reúne avisos institucionais, divulgações, palestras, eventos, defesas de tese, pesquisas e informações administrativas. A área Curso reúne mensagens relacionadas à rotina acadêmica, professores, aulas, avaliações, trabalhos, oportunidades e atividades complementares.

Na lista de comunicados observada entre setembro e novembro de 2026, há exemplos de:

- Defesas de tese divulgadas repetidamente, inclusive de áreas que podem não ter relação com o curso do aluno.
- Palestras, eventos e capacitações de diferentes áreas.
- Comunicados institucionais, como pesquisas de NPS, LGPD e notícias da instituição.
- Avisos de ausência de professores, cancelamento ou alteração de aulas e mudança de sala.
- Trabalhos, questionários, avaliações e prazos acadêmicos.
- Vagas de estágio, jovem aprendiz e oportunidades profissionais.

Foram identificadas cinco divulgações de defesa de tese entre 30/09/2026 e 15/10/2026, além de várias palestras e divulgações institucionais no mesmo período. O problema não é a existência desses comunicados, mas a falta de uma organização por relevância para cada aluno.

### 2.2. Problemas específicos

**Sobrecarga de comunicados:** mensagens de assuntos e áreas diferentes ocupam o mesmo espaço, competindo pela atenção do aluno.

**Baixa relevância individual:** um aluno pode receber repetidamente divulgações de defesas de tese, palestras ou eventos sem relação direta com sua formação ou seus interesses.

**Falta de hierarquia:** informações urgentes, como cancelamentos de aula, podem não se destacar suficientemente em meio às divulgações gerais.

**Dependência do momento de publicação:** há avisos enviados por SMS somente quando o comunicado é criado. Se o aluno não visualizar a mensagem naquele momento, pode não perceber a informação antes do compromisso. Um aviso de ausência de aula às 8h é um exemplo concreto desse risco.

### 2.3. Consequências

- O aluno pode deixar de perceber avisos importantes.
- Comunicados pouco relevantes reduzem a atenção dedicada à área.
- Cancelamentos e mudanças de última hora podem causar deslocamentos e perda de tempo.
- A instituição não dispõe, na experiência proposta, de uma forma clara de distinguir publicação, entrega e confirmação de leitura.

---

## 3. Objetivo da solução

Criar uma **Central Inteligente de Comunicados Acadêmicos** que organize as informações por categoria, prioridade, público e área de interesse; permita que o aluno personalize parte do que recebe; e apresente regras de distribuição por canais adequadas à urgência e ao momento do comunicado.

A solução deve reduzir o ruído sem esconder informações necessárias à vida acadêmica.

### Princípios obrigatórios

1. **Relevância:** mostrar primeiro os comunicados relacionados ao curso, à turma e aos interesses configurados pelo aluno.
2. **Hierarquia:** destacar avisos críticos e importantes visualmente e na ordenação.
3. **Segmentação:** permitir que quem publica selecione o curso, a turma, o público e, quando aplicável, a área de conhecimento.
4. **Personalização controlada:** permitir preferências para divulgações não essenciais, sem permitir que o aluno silencie avisos acadêmicos críticos no portal.
5. **Distribuição adequada:** combinar portal, e-mail, WhatsApp e SMS de acordo com a urgência, as preferências e as autorizações disponíveis.
6. **Fidelidade visual:** manter os padrões do portal documentados nos arquivos de referência.

---

## 4. Modelo de classificação dos comunicados

A classificação deve separar dimensões diferentes. **Categoria, prioridade, público e canal são atributos independentes.** Não use a categoria como se fosse a prioridade.

### 4.1. Categorias propostas

As categorias devem ser apresentadas de forma compreensível ao aluno. A lista abaixo é uma proposta inicial baseada nos comunicados observados; adapte nomes ou agrupamentos apenas quando os arquivos de referência justificarem.

**Comunicados institucionais (origem Uniube):**

- Defesas acadêmicas.
- Palestras e eventos.
- Cursos e capacitações.
- Avaliações institucionais.
- Privacidade e segurança.
- Notícias institucionais.
- Oportunidades e projetos.
- Comunicados gerais.

**Comunicados do curso (origem Curso):**

- Aulas: cancelamentos, ausências e alterações.
- Salas e infraestrutura.
- Trabalhos e atividades.
- Provas e avaliações.
- Prazos acadêmicos.
- Estágios e oportunidades profissionais.
- Palestras e eventos relacionados ao curso.
- Atividades complementares.
- Assuntos administrativos do curso.
- Comunicados gerais.

Não é necessário mostrar todas as categorias ao mesmo tempo. A interface pode agrupá-las visualmente, desde que o aluno consiga localizá-las e filtrá-las.

### 4.2. Prioridades

- **Crítica:** mudança que afeta imediatamente a rotina ou a segurança acadêmica, como cancelamento de aula no mesmo dia ou alteração urgente de atividade.
- **Alta:** informação com prazo próximo ou consequência acadêmica relevante, como alteração importante de calendário ou prazo iminente.
- **Normal:** atividades, palestras, oportunidades e informações que merecem atenção, mas não exigem ação imediata.
- **Baixa:** divulgação geral ou conteúdo complementar, sem urgência.

A prioridade deve ser definida por quem publica, seguindo critérios institucionais. Não classifique automaticamente toda mensagem com palavras como “atenção” como crítica.

### 4.3. Público e relevância

Cada comunicado deve poder ser associado a um ou mais públicos:

- Toda a instituição.
- Curso específico.
- Turma, período ou grupo específico, quando essa informação existir no sistema.
- Área de conhecimento ou assunto de interesse.

Para defesas de tese, palestras e eventos, incluir uma área de conhecimento ou tema. Isso permite reduzir divulgações sem relação com o curso ou os interesses do aluno.

**Regra para defesas de tese:** por padrão, priorizar no feed principal as defesas relacionadas ao curso ou às áreas escolhidas pelo aluno. As demais não devem ser apagadas: devem continuar acessíveis em uma visualização como “Todos os comunicados” ou “Explorar”, sem ocupar o mesmo destaque no feed personalizado.

Se a área de conhecimento não estiver informada, classificar como “Área não informada” e manter o comunicado acessível. Não ocultar silenciosamente uma publicação por falta de metadados.

---

## 5. Preferências do aluno

Criar uma página, painel ou modal de **Preferências de comunicação**, conforme os padrões de navegação do portal.

O aluno poderá:

- Ativar ou desativar categorias não essenciais, como defesas de tese, palestras, eventos e notícias institucionais.
- Selecionar áreas de conhecimento de interesse.
- Escolher canais disponíveis para cada tipo de aviso: portal, e-mail, WhatsApp e SMS.
- Consultar e alterar suas preferências posteriormente.

### Regras de segurança e prioridade

- Avisos críticos que afetam diretamente a rotina acadêmica devem continuar visíveis no portal, mesmo quando o aluno desativar categorias relacionadas.
- Preferências de canais externos devem respeitar a disponibilidade do contato, as autorizações aplicáveis e as políticas da instituição.
- Não simular que um SMS ou WhatsApp real foi enviado. No protótipo, mostrar apenas o canal configurado ou um estado demonstrativo.
- Não exigir que o aluno aceite todos os canais para utilizar o portal.

### Exemplo de preferências a representar

- Defesas de tese: somente áreas de interesse.
- Palestras e eventos: áreas de interesse ou todas as áreas.
- Notícias institucionais: ativado/desativado.
- Oportunidades profissionais: ativado/desativado.
- Cancelamentos e alterações de aula: sempre visíveis no portal; canais externos conforme configuração e política institucional.

---

## 6. Regras de distribuição e tempo

O sistema não deve depender exclusivamente de o aluno abrir o portal ou visualizar um SMS no exato momento em que a publicação é criada.

### 6.1. Canais

- **Portal:** registro central de todos os comunicados direcionados ao aluno.
- **WhatsApp:** canal possível para avisos urgentes ou categorias escolhidas, conforme autorização e integração institucional.
- **SMS:** canal possível para avisos urgentes, conforme cadastro, autorização e política institucional.
- **E-mail:** adequado para informações que podem ser consultadas posteriormente, como eventos, prazos e divulgações.

### 6.2. Regras de exemplo

| Situação | Comportamento proposto |
|---|---|
| Cancelamento de aula no mesmo dia | Destacar no topo do portal e priorizar os canais externos habilitados para urgência. |
| Alteração de sala próxima ao horário | Destacar no portal e notificar pelos canais habilitados. |
| Trabalho ou prazo acadêmico | Mostrar na categoria correspondente; permitir lembrete conforme data e preferências. |
| Defesa de tese de área não selecionada | Não ocupar o feed personalizado principal; continuar disponível em “Todos os comunicados”. |
| Palestra futura | Mostrar conforme categoria e interesses; permitir recebimento por e-mail, se configurado. |
| Comunicado institucional crítico | Destacar no portal independentemente das preferências de categorias. |

### 6.3. Agendamento e lembretes

A publicação deve poder indicar:

- Envio imediato ou agendado.
- Data e horário do acontecimento, quando houver.
- Data de expiração ou arquivamento.
- Possibilidade de lembrete antes do acontecimento.
- Atualização do comunicado quando houver alteração relevante.

Não estabeleça intervalos automáticos arbitrários. O administrador ou a política institucional deve definir quando um lembrete faz sentido.

### 6.4. Estados de acompanhamento

Distinguir, quando tecnicamente disponível:

- Publicado no portal.
- Notificação externa solicitada/enviada.
- Entregue pelo provedor, quando houver confirmação.
- Visualizado no portal.
- Leitura confirmada pelo aluno, quando houver ação explícita.

Não tratar “enviado” como sinônimo de “entregue” ou “lido”.

---

## 7. Estrutura da interface a implementar

A demonstração deve representar o portal existente com a nova Central de Comunicados na área de conteúdo. Não redesenhe o sistema inteiro.

### 7.1. Navegação e identidade visual

- Reutilizar cabeçalho, menu lateral/superior, identificação do usuário e demais elementos existentes que forem documentados.
- Manter logotipo, cores, fontes, ícones, tamanhos, bordas, sombras, espaçamentos e comportamento responsivo do portal.
- Reutilizar os componentes existentes sempre que possível.
- Não substituir o padrão institucional por um dashboard genérico.
- A nova Central deve parecer parte nativa do portal.

Os dois arquivos Markdown de referência e os recursos originais do portal são a fonte de verdade visual. Não inventar códigos de cores, fontes ou nomes de menus quando eles puderem ser extraídos das referências.

### 7.2. Tela principal — Central de Comunicados

A tela principal deve incluir:

1. **Título e contexto:** identificação clara da Central de Comunicados.
2. **Resumo de prioridade:** contagem ou destaque compacto para comunicados críticos e importantes não lidos, sem ocupar espaço excessivo.
3. **Abas ou filtros de origem:** preservar a distinção Uniube/Curso, caso ela faça parte da estrutura documentada. Oferecer também uma visão personalizada, se compatível com o portal.
4. **Filtros:** categoria, prioridade, status de leitura e área de conhecimento. Não mostrar filtros sem função.
5. **Busca:** localizar comunicados pelo título ou conteúdo.
6. **Lista de comunicados:** cartões ou linhas seguindo o padrão visual original.
7. **Acesso às preferências:** link ou controle para configurar categorias, interesses e canais.

### 7.3. Cartão de comunicado

Cada item da lista deve apresentar, conforme os dados disponíveis:

- Título.
- Categoria.
- Prioridade, com sinalização visual discreta e consistente.
- Data de publicação.
- Origem (Uniube ou Curso), quando aplicável.
- Curso/turma ou área relacionada, quando aplicável.
- Indicador de não lido.
- Resumo curto.
- Ação para abrir detalhes.

Os comunicados críticos devem ser visualmente reconhecíveis sem depender apenas da cor. Use também texto ou ícone acompanhado de rótulo.

### 7.4. Detalhes do comunicado

Ao abrir um item, mostrar:

- Conteúdo completo.
- Categoria e prioridade.
- Data da publicação e, quando aplicável, data do acontecimento.
- Público ao qual foi direcionado.
- Informações de atualização, se houver.
- Ação de confirmação de ciência para comunicados que exijam isso.

A confirmação de ciência deve ser uma ação explícita. Não presumir que abrir o comunicado significa que o aluno leu e compreendeu.

### 7.5. Tela ou painel de preferências

Representar:

- Categorias acompanhadas.
- Áreas de conhecimento selecionadas.
- Canais de recebimento.
- Explicação de que avisos acadêmicos críticos continuarão destacados no portal.
- Ação para salvar e feedback visual após salvar.

### 7.6. Visão de publicação pelo administrador — recomendada

Para demonstrar que a solução também depende de uma publicação bem classificada, criar uma segunda tela ou modal demonstrativo para o administrador, se o escopo permitir.

Campos sugeridos:

- Título e conteúdo.
- Categoria.
- Prioridade.
- Origem.
- Público: instituição, curso, turma ou grupo.
- Área de conhecimento/tema, quando aplicável.
- Data do acontecimento e expiração, quando aplicáveis.
- Canais habilitados.
- Envio imediato ou agendado.
- Opção de lembrete, quando aplicável.

Essa tela é uma demonstração conceitual; não precisa conectar a um sistema administrativo real.

---

## 8. Dados fictícios para o protótipo

Utilize comunicados fictícios, mas inspirados nos tipos observados. Não exponha nomes de pessoas reais da lista como se fossem dados operacionais. Exemplos:

| Título demonstrativo | Origem | Categoria | Prioridade | Público/área | Comportamento esperado |
|---|---|---|---|---|---|
| Aula de Banco de Dados I cancelada hoje | Curso | Aulas | Crítica | Turma de ADS | Aparece no topo e recebe destaque. |
| Alteração de sala da próxima aula | Curso | Salas e infraestrutura | Alta | Turma de ADS | Aparece para a turma afetada. |
| Entrega do Trabalho — Momento 2 | Curso | Trabalhos e atividades | Alta | Turma de ADS | Aparece na categoria acadêmica e pode ter lembrete. |
| Vaga de estágio em Tecnologia da Informação | Curso | Oportunidades profissionais | Normal | Alunos elegíveis | Aparece conforme público e preferências. |
| Defesa de tese em Tecnologia e Computação | Uniube | Defesas acadêmicas | Normal | Área de Tecnologia | Aparece para quem acompanha a área. |
| Defesa de tese em Ciências da Saúde | Uniube | Defesas acadêmicas | Normal | Área de Saúde | Não ocupa o feed personalizado de quem não acompanha essa área; permanece em “Todos”. |
| Palestra sobre Inteligência Artificial | Uniube | Palestras e eventos | Normal | Área de Tecnologia | Aparece para alunos com interesse relacionado. |
| Pesquisa institucional de avaliação do curso | Uniube | Avaliações institucionais | Normal | Curso selecionado | Aparece ao público definido. |

Inclua datas e horários fictícios coerentes para demonstrar ordenação, urgência, lembretes e expiração. Identifique claramente que são dados de demonstração.

---

## 9. Interações que precisam funcionar no protótipo

Não entregar apenas uma imagem estática. As interações abaixo devem funcionar no navegador com dados locais:

1. Alternar entre visão personalizada e todos os comunicados.
2. Filtrar por origem, categoria, prioridade e status de leitura.
3. Pesquisar por texto.
4. Abrir e fechar detalhes de um comunicado.
5. Marcar como lido e, quando aplicável, confirmar ciência.
6. Alterar categorias e áreas de interesse.
7. Alterar preferências de canais.
8. Salvar preferências e apresentar confirmação visual.
9. Simular a publicação de um comunicado pelo administrador, caso a tela de administração seja implementada.
10. Demonstrar a regra de que comunicados críticos continuam visíveis no portal.

A filtragem deve alterar a lista de verdade. Botões decorativos ou controles sem ação não são aceitos.

---

## 10. Requisitos técnicos

- Priorizar a tecnologia e a estrutura já utilizadas pelo portal, caso os arquivos fornecidos permitam identificá-las.
- Se não houver uma aplicação ou framework definido, usar HTML, CSS e JavaScript, mantendo a solução simples e executável localmente.
- Não introduzir frameworks ou bibliotecas sem necessidade.
- Separar estrutura, estilos e lógica em arquivos próprios quando isso for compatível com o projeto existente. Se o contexto exigir um único HTML, manter o código organizado em seções claras.
- Utilizar dados locais fictícios (por exemplo, um array JavaScript ou arquivo JSON local).
- Não criar backend, banco de dados ou integração externa real para esta demonstração.
- WhatsApp, SMS e e-mail devem ser representados como canais simulados/configurados; não afirmar que mensagens reais foram enviadas.
- Não inserir credenciais, chaves de API ou dados pessoais reais.
- Evitar dependência de internet para o funcionamento essencial do protótipo, sempre que possível.
- Garantir navegação por teclado, rótulos acessíveis e contraste adequado.
- Garantir responsividade, sem comprometer a leitura dos comunicados em telas menores.

### Estrutura de arquivos sugerida

Adapte ao projeto original; não force esta estrutura se já existir uma convenção documentada.

```text
central-comunicados/
├── index.html
├── css/
│   └── central-comunicados.css
├── js/
│   ├── dados-demo.js
│   └── central-comunicados.js
└── assets/
    └── (somente recursos necessários e disponíveis)
```

---

## 11. Critérios de aceitação

O protótipo estará adequado quando:

- [ ] A página mantiver a identidade visual e a navegação do portal documentadas nas referências.
- [ ] A Central parecer integrada ao sistema, e não um site independente.
- [ ] O aluno conseguir distinguir comunicados críticos, altos, normais e baixos.
- [ ] Os filtros e a busca alterarem a lista exibida.
- [ ] O aluno conseguir abrir comunicados e alterar seu estado de leitura.
- [ ] O aluno conseguir configurar categorias, áreas de interesse e canais demonstrativos.
- [ ] Defesas de tese de áreas não selecionadas não dominarem o feed personalizado, mas continuarem disponíveis na visão geral.
- [ ] Avisos de cancelamento de aula forem destacados claramente.
- [ ] As preferências não ocultarem avisos críticos no portal.
- [ ] Os canais externos forem apresentados como simulação, sem envio real.
- [ ] A interface funcionar em desktop e celular.
- [ ] Não existirem botões ou controles sem comportamento.
- [ ] Os dados forem identificados como fictícios.

### Cenários mínimos de teste

**Cenário A — defesa de tese não relacionada:** um aluno de ADS que não selecionou Ciências da Saúde não deve ver uma defesa dessa área em destaque no feed personalizado. Deve conseguir encontrá-la na visão “Todos os comunicados”.

**Cenário B — cancelamento de aula:** um cancelamento de aula para a turma do aluno deve aparecer entre os primeiros itens, com prioridade crítica e indicação clara. Deve permanecer visível mesmo que a categoria de divulgações gerais esteja desativada.

**Cenário C — trabalho acadêmico:** um aviso de entrega de trabalho deve aparecer para o curso/turma correspondente e ser localizável por categoria e busca.

**Cenário D — preferência de canal:** ao desativar WhatsApp nas preferências, a interface deve refletir essa escolha. Não deve alegar que uma mensagem externa foi enviada.

---

## 12. Entrega esperada do Gemini

Entregar:

1. Protótipo HTML funcional e seus arquivos de apoio.
2. Uma breve explicação de como abrir e testar localmente.
3. Uma lista dos componentes originais reutilizados.
4. Uma lista curta de decisões de design que precisaram ser propostas por falta de informação nas referências.
5. Uma verificação dos critérios de aceitação, indicando o que foi testado e qualquer limitação restante.

**Prioridade final:** fidelidade ao portal existente, clareza da hierarquia dos comunicados e funcionamento real das interações principais. Não sacrifique essas três prioridades para adicionar animações, efeitos decorativos ou funcionalidades fora do escopo.
