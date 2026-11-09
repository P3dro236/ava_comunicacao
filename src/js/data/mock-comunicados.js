/**
 * Central Inteligente de Comunicados Acadêmicos — AVA Uniube
 * Módulo: data/mock-comunicados.js
 * Responsabilidade: Massa inicial de 20 comunicados acadêmicos realistas.
 */

/**
 * Massa inicial de 20 comunicados acadêmicos realistas (sem textos de configuração no corpo).
 */
export const mockData = [
    // 1. CRÍTICA ATIVA — Cancelamento de aula hoje
    {
        id: 'com-101',
        sequencia: '1128901',
        titulo: 'Cancelamento da aula de Banco de Dados I hoje (05/11)',
        resumo: 'A aula presencial das 19h00 de hoje foi cancelada por motivo de saúde do docente. A reposição será agendada com a turma.',
        conteudo: `
            <p>Prezado(a) aluno(a),</p>
            <p>Informamos que a aula presencial da disciplina <strong>90047 - Banco de Dados I (Turma 22 - Noturno)</strong>, prevista para hoje, <strong>05/11/2026, às 19h00</strong>, está <strong>cancelada</strong> por motivo de indisposição de saúde do professor responsável.</p>
            <p>O conteúdo programático referente à <em>Normalização de Dados e Modelagem Relacional</em> será integralmente reposto em data a ser combinada com a turma na próxima semana, sem prejuízo ao calendário de avaliações.</p>
            <p>Solicitamos a confirmação de ciência neste comunicado para registro da coordenação.</p>
            <p>Atenciosamente,<br><strong>Coordenação do Curso de Análise e Desenvolvimento de Sistemas</strong></p>
        `,
        origem: 'curso',
        categoria: 'aulas',
        prioridade: 'critica',
        publico: 'Turma de ADS — 3º Período (Noturno)',
        publicoCurso: 'ADS',
        remetente: 'COORDENAÇÃO DO CURSO DE ADS',
        iniciaisRemetente: 'CA',
        tagsArea: ['tecnologia_computacao'],
        publicadoEm: '2026-11-05T15:50:00',
        dataEvento: '2026-11-05T19:00:00',
        expiraEm: '2026-11-05T23:59:00',
        lido: false,
        lidoEm: null,
        curtido: false,
        exigeCiencia: true,
        cienciaConfirmada: false,
        cienciaEm: null,
        atualizado: false,
        atualizadoEm: null,
        arquivado: false,
        publicoTurma: 'TURMA_ADS_2026_2_3N',
        emissorRole: 'COORDENACAO_CURSO',
        cenarioFallback: 'WHATSAPP_OK',
        grupoCanal: 'urgentes_aula'
    },

    // 2. CRÍTICA ATIVA — Mudança emergencial de laboratório hoje
    {
        id: 'com-102',
        sequencia: '1128840',
        titulo: 'Transferência emergencial dos Laboratórios de Informática (Bloco Y) hoje às 18h',
        resumo: 'Manutenção elétrica emergencial transfere as aulas práticas de hoje à noite para os laboratórios 102 e 104 do Bloco C.',
        conteudo: `
            <p>Prezado(a) estudante,</p>
            <p>Comunicamos que, devido a uma manutenção corretiva emergencial na rede elétrica do <strong>Bloco Y</strong>, os Laboratórios de Informática 301 a 304 estarão interditados hoje, <strong>05/11/2026, a partir das 18h00</strong>.</p>
            <p>As aulas práticas de <strong>Laboratório de Programação</strong> e <strong>Linguagem e Técnicas de Programação</strong> do turno noturno ocorrerão excepcionalmente nos <strong>Laboratórios 102 e 104 do Bloco C</strong>.</p>
            <p>Atenciosamente,<br><strong>Supervisão de Laboratórios de Informática (LIAE)</strong></p>
        `,
        origem: 'curso',
        categoria: 'salas_infraestrutura',
        prioridade: 'critica',
        publico: 'Curso de ADS — Turmas Presenciais Noturno',
        publicoCurso: 'ADS',
        remetente: 'SUPERVISÃO DE LABORATÓRIOS (LIAE)',
        iniciaisRemetente: 'SL',
        tagsArea: ['tecnologia_computacao'],
        publicadoEm: '2026-11-05T13:20:00',
        dataEvento: '2026-11-05T18:00:00',
        expiraEm: '2026-11-05T22:45:00',
        lido: false,
        lidoEm: null,
        curtido: false,
        exigeCiencia: true,
        cienciaConfirmada: false,
        cienciaEm: null,
        atualizado: true,
        atualizadoEm: '2026-11-05T16:05:00',
        arquivado: false,
        publicoTurma: 'TURMA_ADS_2026_2_3N',
        emissorRole: 'SUPERVISAO_LABORATORIOS_INFRA',
        cenarioFallback: 'FALLBACK_SMS',
        grupoCanal: 'urgentes_aula'
    },

    // 3. ALTA — Alteração de sala da próxima aula
    {
        id: 'com-103',
        sequencia: '1128412',
        titulo: 'Alteração de sala da próxima aula — Estatística Aplicada (06/11)',
        resumo: 'A aula de amanhã (06/11 às 19h00) será realizada na Sala 2C-14 (Bloco C) para atividade prática com planilhas.',
        conteudo: `
            <p>Olá, turma,</p>
            <p>Informamos que a aula da disciplina <strong>90591 - Estatística Aplicada</strong> de amanhã, <strong>06/11/2026, às 19h00</strong>, terá alteração de local.</p>
            <p><strong>Nova sala:</strong> Sala 2C-14 (2º andar do Bloco C).</p>
            <p>Recomendamos trazer calculadora científica ou notebook para o exercício prático de distribuição de probabilidades.</p>
            <p>Cordialmente,<br><strong>Secretaria Acadêmica dos Cursos de Tecnologia</strong></p>
        `,
        origem: 'curso',
        categoria: 'salas_infraestrutura',
        prioridade: 'alta',
        publico: 'Turma de ADS — 3º Período',
        publicoCurso: 'ADS',
        remetente: 'SECRETARIA ACADÊMICA DE TI',
        iniciaisRemetente: 'ST',
        tagsArea: ['tecnologia_computacao'],
        publicadoEm: '2026-11-05T14:10:00',
        dataEvento: '2026-11-06T19:00:00',
        expiraEm: '2026-11-07T00:00:00',
        lido: false,
        lidoEm: null,
        curtido: false,
        exigeCiencia: false,
        cienciaConfirmada: false,
        cienciaEm: null,
        atualizado: true,
        atualizadoEm: '2026-11-05T15:30:00',
        arquivado: false,
        publicoTurma: 'TURMA_ADS_2026_2_3N',
        emissorRole: 'COORDENACAO_CURSO',
        cenarioFallback: 'FALLBACK_PUSH_ULTIMO_RECURSO',
        grupoCanal: 'urgentes_aula'
    },

    // 4. ALTA — Entrega de Trabalho Momento 2
    {
        id: 'com-104',
        sequencia: '1127305',
        titulo: 'Prazo de entrega do Trabalho Prático — Momento 2 (Laboratório de Programação)',
        resumo: 'O envio dos arquivos da etapa prática encerra-se em 08/11/2026 às 23h59 no Disco Virtual da Sala Prática.',
        conteudo: `
            <p>Prezado(a) aluno(a),</p>
            <p>Lembramos que o prazo para submissão do <strong>Trabalho Prático — Momento 2</strong> da disciplina <strong>90599 - Laboratório de Programação</strong> encerra-se no dia <strong>08/11/2026, às 23h59</strong>.</p>
            <ul>
                <li>O envio deve ser realizado exclusivamente pela área de <em>Trabalhos</em> na Sala de Aula Virtual.</li>
                <li>Certifique-se de anexar o código-fonte compactado (<code>.zip</code>) e o script de criação das tabelas.</li>
            </ul>
            <p>Bons estudos!<br><strong>Prof. Responsável — Laboratório de Programação</strong></p>
        `,
        origem: 'curso',
        categoria: 'trabalhos_atividades',
        prioridade: 'alta',
        publico: 'Turma de ADS — Componente 90599',
        publicoCurso: 'ADS',
        remetente: 'DOCENTE — LABORATÓRIO DE PROGRAMAÇÃO',
        iniciaisRemetente: 'LP',
        tagsArea: ['tecnologia_computacao'],
        publicadoEm: '2026-11-04T18:00:00',
        dataEvento: '2026-11-08T23:59:00',
        expiraEm: '2026-11-09T23:59:00',
        lido: false,
        lidoEm: null,
        curtido: false,
        exigeCiencia: true,
        cienciaConfirmada: false,
        cienciaEm: null,
        atualizado: false,
        atualizadoEm: null,
        grupoCanal: 'prazos_atividades'
    },

    // 5. ALTA — Provas e avaliações
    {
        id: 'com-105',
        sequencia: '1125990',
        titulo: 'Cronograma das Avaliações Regimentais e Questões Objetivas — 2026/2',
        resumo: 'Confira o calendário de provas presenciais de novembro e o prazo das questões objetivas de Banco de Dados I.',
        conteudo: `
            <p>Caro(a) estudante,</p>
            <p>Já está disponível na Sala de Aula Virtual o cronograma detalhado das <strong>Avaliações Regimentais 2026/2</strong> para os componentes presenciais e híbridos do curso de Análise e Desenvolvimento de Sistemas.</p>
            <p>Destacamos também que as <strong>Questões Objetivas</strong> referentes ao módulo atual de <em>Banco de Dados I</em> devem ser respondidas até o dia <strong>16/11/2026</strong>.</p>
            <p>Atenciosamente,<br><strong>Coordenação Pedagógica — Cursos de Computação</strong></p>
        `,
        origem: 'curso',
        categoria: 'provas_avaliacoes',
        prioridade: 'alta',
        publico: 'Curso de ADS — Todas as turmas',
        publicoCurso: 'ADS',
        remetente: 'COORDENAÇÃO PEDAGÓGICA — COMPUTAÇÃO',
        iniciaisRemetente: 'CP',
        tagsArea: ['tecnologia_computacao'],
        publicadoEm: '2026-11-03T11:30:00',
        dataEvento: '2026-11-16T19:00:00',
        expiraEm: '2026-11-22T23:59:00',
        lido: false,
        lidoEm: null,
        curtido: false,
        exigeCiencia: true,
        cienciaConfirmada: false,
        cienciaEm: null,
        atualizado: false,
        atualizadoEm: null,
        grupoCanal: 'prazos_atividades'
    },

    // 6. ALTA (Já lido) — Prazos acadêmicos
    {
        id: 'com-106',
        sequencia: '1123104',
        titulo: 'Prazo final para envio das atividades de Estudos Autônomos 2026/2',
        resumo: 'A postagem das atividades de reposição e integralização encerra-se em 12/11/2026 às 23h59.',
        conteudo: `
            <p>Prezado(a) estudante,</p>
            <p>Lembramos que o envio dos arquivos referentes às atividades de <strong>Estudos Autônomos e Integralização</strong> do semestre 2026/2 deve ser concluído até o dia <strong>12/11/2026, às 23h59</strong>.</p>
            <p>Para verificar suas atividades vinculadas, acesse o menu <em>Meus Cursos &gt; Sala de Aula Virtual</em> do respectivo componente curricular.</p>
            <p>Atenciosamente,<br><strong>Secretaria Digital Uniube</strong></p>
        `,
        origem: 'curso',
        categoria: 'prazos_academicos',
        prioridade: 'alta',
        publico: 'Curso de ADS',
        publicoCurso: 'ADS',
        remetente: 'SECRETARIA DIGITAL UNIUBE',
        iniciaisRemetente: 'SD',
        tagsArea: ['tecnologia_computacao'],
        publicadoEm: '2026-11-01T09:15:00',
        dataEvento: '2026-11-12T23:59:00',
        expiraEm: '2026-11-13T23:59:00',
        lido: true,
        lidoEm: '2026-11-02T10:12:00',
        curtido: true,
        exigeCiencia: true,
        cienciaConfirmada: true,
        cienciaEm: '2026-11-02T10:13:00',
        atualizado: false,
        atualizadoEm: null,
        grupoCanal: 'prazos_atividades'
    },

    // 7. NORMAL — Oportunidade de estágio em TI (Fiel ao estilo de comunicacao_ava_3.htm)
    {
        id: 'com-107',
        sequencia: '1118420',
        titulo: 'Oportunidade de Estágio em Desenvolvimento de Software — Uniube Carreiras',
        resumo: 'Processo seletivo aberto para alunos de ADS a partir do 2º período. Atuação em desenvolvimento web e banco de dados.',
        conteudo: `
            <p>Olá, estudante de Análise e Desenvolvimento de Sistemas,</p>
            <p>O núcleo <strong>Uniube Carreiras</strong> divulga nova oportunidade de estágio na área de Tecnologia da Informação para atuação com desenvolvimento de aplicações web e suporte a bancos de dados SQL.</p>
            <p><strong>Requisitos da vaga:</strong></p>
            <ul>
                <li>Estar regularmente matriculado a partir do 2º período de ADS;</li>
                <li>Conhecimentos básicos em lógica de programação, JavaScript e bancos de dados relacionais;</li>
                <li>Disponibilidade para 30 horas semanais (formato híbrido).</li>
            </ul>
            <p>Os interessados podem consultar os detalhes da bolsa-auxílio e cadastrar o currículo diretamente no menu lateral <strong>Uniube Carreiras</strong> até <strong>15/11/2026</strong>.</p>
            <p>Atenciosamente,<br><strong>Equipe Uniube Carreiras</strong></p>
        `,
        origem: 'curso',
        categoria: 'estagios_oportunidades',
        prioridade: 'normal',
        publico: 'Alunos do Curso de ADS',
        publicoCurso: 'ADS',
        remetente: 'UNIUBE CARREIRAS',
        iniciaisRemetente: 'UC',
        tagsArea: ['tecnologia_computacao'],
        publicadoEm: '2026-10-30T14:20:00',
        dataEvento: '2026-11-15T18:00:00',
        expiraEm: '2026-11-16T00:00:00',
        lido: false,
        lidoEm: null,
        curtido: false,
        exigeCiencia: false,
        cienciaConfirmada: false,
        cienciaEm: null,
        atualizado: false,
        atualizadoEm: null,
        grupoCanal: 'eventos_divulgacoes'
    },

    // 8. NORMAL — Defesa de tese em Tecnologia e Computação (Compatível com o perfil)
    {
        id: 'com-108',
        sequencia: '1116092',
        titulo: 'Defesa Pública — Arquiteturas de Microsserviços Resilientes em Nuvem',
        resumo: 'Sessão pública da área de Tecnologia e Computação no dia 10/11 às 14h00. Participação contabiliza horas complementares.',
        conteudo: `
            <p>Convidamos os estudantes e docentes da área de <strong>Tecnologia e Computação</strong> para acompanhar a sessão pública de defesa acadêmica intitulada <em>"Arquiteturas de Microsserviços Resilientes com Observabilidade Distribuída"</em>.</p>
            <p><strong>Data e horário:</strong> 10/11/2026, às 14h00<br>
            <strong>Local:</strong> Transmissão ao vivo pela sala virtual e Auditório Turmalina (Campus Aeroporto).</p>
            <p>A participação de alunos de graduação em Computação confere certificado válido para atividades complementares.</p>
            <p>Atenciosamente,<br><strong>Pró-Reitoria de Pesquisa, Pós-Graduação e Extensão</strong></p>
        `,
        origem: 'uniube',
        categoria: 'defesas_academicas',
        prioridade: 'normal',
        publico: 'Área de Tecnologia e Computação',
        publicoCurso: 'TODOS',
        remetente: 'PRÓ-REITORIA DE PESQUISA E PÓS-GRADUAÇÃO',
        iniciaisRemetente: 'PP',
        tagsArea: ['tecnologia_computacao'],
        publicadoEm: '2026-10-29T10:12:00',
        dataEvento: '2026-11-10T14:00:00',
        expiraEm: '2026-11-11T00:00:00',
        lido: false,
        lidoEm: null,
        curtido: false,
        exigeCiencia: false,
        cienciaConfirmada: false,
        cienciaEm: null,
        atualizado: false,
        atualizadoEm: null,
        grupoCanal: 'eventos_divulgacoes'
    },

    // 9. NORMAL — Palestra sobre Inteligência Artificial na Escrita Científica (Referência real de ComunicacaoAva.htm)
    {
        id: 'com-109',
        sequencia: '1112894',
        titulo: 'Palestra: Uso da Inteligência Artificial na Engenharia de Software e Escrita Científica',
        resumo: 'Encontro aborda aplicações práticas e éticas de modelos generativos no desenvolvimento de sistemas e pesquisa.',
        conteudo: `
            <p>Prezado(a) estudante,</p>
            <p>Estão abertas as inscrições para a palestra <strong>"Uso da Inteligência Artificial na Engenharia de Software e Escrita Científica"</strong>, direcionada aos alunos dos cursos de Computação e Tecnologia da Informação.</p>
            <p><strong>Data:</strong> 11/11/2026, às 19h30<br>
            <strong>Certificação:</strong> 4 horas de atividades complementares mediante credenciamento no evento.</p>
            <p>Contamos com a sua presença!<br><strong>Diretoria de Inovação e Extensão Uniube</strong></p>
        `,
        origem: 'uniube',
        categoria: 'palestras_eventos',
        prioridade: 'normal',
        publico: 'Área de Tecnologia e Computação',
        publicoCurso: 'TODOS',
        remetente: 'DIRETORIA DE INOVAÇÃO E EXTENSÃO',
        iniciaisRemetente: 'DI',
        tagsArea: ['tecnologia_computacao'],
        publicadoEm: '2026-10-25T10:20:00',
        dataEvento: '2026-11-11T19:30:00',
        expiraEm: '2026-11-12T00:00:00',
        lido: false,
        lidoEm: null,
        curtido: false,
        exigeCiencia: false,
        cienciaConfirmada: false,
        cienciaEm: null,
        atualizado: false,
        atualizadoEm: null,
        grupoCanal: 'eventos_divulgacoes'
    },

    // 10. NORMAL — Avaliação Institucional NPS (Referência real de ComunicacaoAva.htm)
    {
        id: 'com-110',
        sequencia: '1106742',
        titulo: 'Participe da avaliação de NPS do seu curso (2026/2)',
        resumo: 'Contribua com a avaliação semestral sobre infraestrutura, laboratórios e atendimento do curso de ADS.',
        conteudo: `
            <p>Olá!</p>
            <p>Sua participação é fundamental para a melhoria contínua do curso de <strong>Análise e Desenvolvimento de Sistemas</strong>. Já está disponível o questionário semestral de avaliação institucional (NPS 2026/2).</p>
            <p>O preenchimento leva menos de 3 minutos e contempla a infraestrutura de laboratórios, recursos digitais do AVA e suporte acadêmico.</p>
            <p>Agradecemos sua colaboração,<br><strong>Comissão Própria de Avaliação (CPA Uniube)</strong></p>
        `,
        origem: 'uniube',
        categoria: 'avaliacoes_institucionais',
        prioridade: 'normal',
        publico: 'Estudantes de Graduação',
        publicoCurso: 'ADS',
        remetente: 'COMISSÃO PRÓPRIA DE AVALIAÇÃO (CPA)',
        iniciaisRemetente: 'CP',
        tagsArea: ['tecnologia_computacao'],
        publicadoEm: '2026-10-20T15:53:00',
        dataEvento: '2026-11-20T23:59:00',
        expiraEm: '2026-11-21T00:00:00',
        lido: false,
        lidoEm: null,
        curtido: false,
        exigeCiencia: false,
        cienciaConfirmada: false,
        cienciaEm: null,
        atualizado: false,
        atualizadoEm: null,
        grupoCanal: 'institucionais'
    },

    // 11. NORMAL — LGPD (Referência real de ComunicacaoAva.htm)
    {
        id: 'com-111',
        sequencia: '1105408',
        titulo: 'LGPD — Quem pode receber informações financeiras da sua matrícula?',
        resumo: 'Orientações sobre o cadastro de terceiros autorizados em conformidade com a Lei Geral de Proteção de Dados.',
        conteudo: `
            <p>Prezado(a) aluno(a),</p>
            <p>Em cumprimento à <strong>Lei Geral de Proteção de Dados Pessoais (Lei nº 13.709/2018 — LGPD)</strong>, a Universidade de Uberaba reforça que informações acadêmicas e financeiras são fornecidas exclusivamente ao titular da matrícula.</p>
            <p>Caso deseje autorizar pais, responsáveis ou terceiros a tratar de assuntos financeiros em seu nome, acesse no portal a opção <em>Financeiro &gt; Autorização para Compartilhamento de Informações</em> e realize o cadastro formal.</p>
            <p>Atenciosamente,<br><strong>Comitê de Privacidade e Proteção de Dados — Uniube</strong></p>
        `,
        origem: 'uniube',
        categoria: 'privacidade_seguranca',
        prioridade: 'normal',
        publico: 'Comunidade Acadêmica Uniube',
        publicoCurso: 'TODOS',
        remetente: 'ENCARREGADO DE DADOS (DPO UNIUBE)',
        iniciaisRemetente: 'DP',
        tagsArea: ['tecnologia_computacao'],
        publicadoEm: '2026-10-19T09:17:00',
        dataEvento: null,
        expiraEm: '2026-12-31T23:59:00',
        lido: true,
        lidoEm: '2026-10-20T11:00:00',
        curtido: false,
        exigeCiencia: false,
        cienciaConfirmada: false,
        cienciaEm: null,
        atualizado: false,
        atualizadoEm: null,
        grupoCanal: 'institucionais'
    },

    // 12. NORMAL — Atividades complementares e PIME (Referência real de comunicao_ava_1.htm)
    {
        id: 'com-112',
        sequencia: '1043528',
        titulo: 'Inscrições no PIME (Programa Institucional de Monitoria de Ensino) e Horas Complementares',
        resumo: 'Estão abertas as inscrições para monitoria nas disciplinas de programação e o protocolo de certificados de 2026/2.',
        conteudo: `
            <p>Caro(a) aluno(a) de Análise e Desenvolvimento de Sistemas,</p>
            <p>Comunicamos que estão abertas as inscrições para o <strong>PIME — Programa Institucional de Monitoria de Ensino</strong> nas disciplinas de lógica, algoritmos e banco de dados.</p>
            <p>Além da bolsa de incentivo, o exercício da monitoria é contabilizado como carga horária de atividades complementares. O edital completo e o formulário de inscrição encontram-se disponíveis na Sala de Aula Virtual da Coordenação.</p>
            <p>Cordialmente,<br><strong>Gestão dos Cursos Superiores de Tecnologia em Computação</strong></p>
        `,
        origem: 'curso',
        categoria: 'atividades_complementares',
        prioridade: 'normal',
        publico: 'Curso de ADS',
        publicoCurso: 'ADS',
        remetente: 'GESTÃO DOS CURSOS DE COMPUTAÇÃO',
        iniciaisRemetente: 'GC',
        tagsArea: ['tecnologia_computacao'],
        publicadoEm: '2026-10-16T11:00:00',
        dataEvento: '2026-11-25T23:59:00',
        expiraEm: '2026-11-26T00:00:00',
        lido: true,
        lidoEm: '2026-10-18T09:30:00',
        curtido: true,
        exigeCiencia: false,
        cienciaConfirmada: false,
        cienciaEm: null,
        atualizado: false,
        atualizadoEm: null,
        grupoCanal: 'prazos_atividades'
    },

    // 13. BAIXA — Horários da Coordenação e Licenças Microsoft / Autodesk
    {
        id: 'com-113',
        sequencia: '1039810',
        titulo: 'Horários de atendimento da Coordenação de ADS e renovação de licenças Microsoft Azure',
        resumo: 'Confira os horários de plantão presencial/remoto da coordenação e o passo a passo para ativar softwares acadêmicos.',
        conteudo: `
            <p>Prezado(a) estudante,</p>
            <p>Divulgamos os horários de atendimento da Coordenação do Curso de Análise e Desenvolvimento de Sistemas para o mês de novembro, disponíveis de segunda a sexta-feira das 18h00 às 21h30.</p>
            <p>Lembramos também que todos os alunos matriculados possuem acesso gratuito às ferramentas <strong>Microsoft Azure Dev Tools for Teaching</strong> e <strong>Autodesk Education</strong> diretamente pelos atalhos da página inicial do AVA.</p>
            <p>Atenciosamente,<br><strong>Coordenação do Curso de ADS</strong></p>
        `,
        origem: 'curso',
        categoria: 'assuntos_administrativos_curso',
        prioridade: 'baixa',
        publico: 'Curso de ADS',
        publicoCurso: 'ADS',
        remetente: 'COORDENAÇÃO DO CURSO DE ADS',
        iniciaisRemetente: 'CA',
        tagsArea: ['tecnologia_computacao'],
        publicadoEm: '2026-10-12T16:40:00',
        dataEvento: null,
        expiraEm: '2026-12-15T23:59:00',
        lido: true,
        lidoEm: '2026-10-14T18:00:00',
        curtido: false,
        exigeCiencia: false,
        cienciaConfirmada: false,
        cienciaEm: null,
        atualizado: false,
        atualizadoEm: null,
        grupoCanal: 'institucionais'
    },

    // =========================================================================================
    // COMUNICADOS DE OUTRAS ÁREAS OU ENCERRADOS (Exibidos ao consultar "Todos os comunicados")
    // =========================================================================================

    // 14. NORMAL — Defesa de Tese em Ciências da Saúde (Referência ComunicacaoAva.htm)
    {
        id: 'com-114',
        sequencia: '1101092',
        titulo: 'Defesa de Tese — Juliano Gonçalves de Aquino (Pós-Graduação em Odontologia)',
        resumo: 'Sessão pública de defesa de tese vinculada à área de Ciências da Saúde no dia 12/11 às 09h00.',
        conteudo: `
            <p>A Coordenação do Programa de Pós-Graduação em Odontologia convida a comunidade acadêmica da área de <strong>Ciências da Saúde</strong> para a sessão pública de defesa de tese de <strong>Juliano Gonçalves de Aquino</strong>.</p>
            <p><strong>Data:</strong> 12/11/2026, às 09h00<br>
            <strong>Modalidade:</strong> Híbrida (Sala 2D-08 e transmissão via plataforma institucional).</p>
            <p>Atenciosamente,<br><strong>Secretaria de Pós-Graduação Stricto Sensu</strong></p>
        `,
        origem: 'uniube',
        categoria: 'defesas_academicas',
        prioridade: 'normal',
        publico: 'Área de Ciências da Saúde',
        publicoCurso: 'TODOS',
        remetente: 'PÓS-GRADUAÇÃO EM ODONTOLOGIA',
        iniciaisRemetente: 'PO',
        tagsArea: ['ciencias_saude'],
        publicadoEm: '2026-10-15T10:12:00',
        dataEvento: '2026-11-12T09:00:00',
        expiraEm: '2026-11-13T00:00:00',
        lido: false,
        lidoEm: null,
        curtido: false,
        exigeCiencia: false,
        cienciaConfirmada: false,
        cienciaEm: null,
        atualizado: false,
        atualizadoEm: null,
        grupoCanal: 'eventos_divulgacoes'
    },

    // 15. NORMAL — Defesa de Tese em Educação (Referência ComunicacaoAva.htm)
    {
        id: 'com-115',
        sequencia: '1101056',
        titulo: 'Defesa de Tese — Marco Túlio de Sousa Nascimento (Programa de Pós-Graduação em Educação)',
        resumo: 'Banca pública de doutorado na área de Educação e Licenciaturas agendada para 14/11 às 14h00.',
        conteudo: `
            <p>O Programa de Pós-Graduação em Educação convida docentes e discentes da área de <strong>Educação e Licenciaturas</strong> para a defesa pública da tese de doutorado de <strong>Marco Túlio de Sousa Nascimento</strong>.</p>
            <p><strong>Data e horário:</strong> 14/11/2026, às 14h00.</p>
            <p>Atenciosamente,<br><strong>Programa de Pós-Graduação em Educação — Uniube</strong></p>
        `,
        origem: 'uniube',
        categoria: 'defesas_academicas',
        prioridade: 'normal',
        publico: 'Área de Educação e Licenciaturas',
        publicoCurso: 'TODOS',
        remetente: 'PÓS-GRADUAÇÃO EM EDUCAÇÃO',
        iniciaisRemetente: 'PE',
        tagsArea: ['educacao'],
        publicadoEm: '2026-10-15T09:22:00',
        dataEvento: '2026-11-14T14:00:00',
        expiraEm: '2026-11-15T00:00:00',
        lido: false,
        lidoEm: null,
        curtido: false,
        exigeCiencia: false,
        cienciaConfirmada: false,
        cienciaEm: null,
        atualizado: false,
        atualizadoEm: null,
        grupoCanal: 'eventos_divulgacoes'
    },

    // 16. NORMAL — Defesa de Tese em Ciências Agrárias (Referência ComunicacaoAva.htm)
    {
        id: 'com-116',
        sequencia: '1095719',
        titulo: 'Defesa de Tese — Aparecido Pereira Cardoso (Ciências Agrárias e Hospital Veterinário)',
        resumo: 'Apresentação de pesquisa vinculada aos programas de Agronomia e Medicina Veterinária.',
        conteudo: `
            <p>Convidamos os alunos e pesquisadores da área de <strong>Ciências Agrárias e Veterinária</strong> para assistir à defesa pública de trabalho acadêmico de <strong>Aparecido Pereira Cardoso</strong>, desenvolvida junto ao complexo Cidade do Agro e Hospital Veterinário de Uberaba (HVU).</p>
            <p><strong>Data:</strong> 18/11/2026, às 10h00.</p>
            <p>Atenciosamente,<br><strong>Coordenação de Pesquisa em Ciências Agrárias</strong></p>
        `,
        origem: 'uniube',
        categoria: 'defesas_academicas',
        prioridade: 'normal',
        publico: 'Área de Ciências Agrárias e Veterinária',
        publicoCurso: 'TODOS',
        remetente: 'PESQUISA EM CIÊNCIAS AGRÁRIAS',
        iniciaisRemetente: 'CA',
        tagsArea: ['ciencias_agrarias'],
        publicadoEm: '2026-10-08T10:22:00',
        dataEvento: '2026-11-18T10:00:00',
        expiraEm: '2026-11-19T00:00:00',
        lido: false,
        lidoEm: null,
        curtido: false,
        exigeCiencia: false,
        cienciaConfirmada: false,
        cienciaEm: null,
        atualizado: false,
        atualizadoEm: null,
        grupoCanal: 'eventos_divulgacoes'
    },

    // 17. NORMAL — Encontro GAAE Psicologia (Referência ComunicacaoAva.htm)
    {
        id: 'com-117',
        sequencia: '1120791',
        titulo: 'A Prática da Meditação para o Bem-estar Psicológico — Projeto GAAE',
        resumo: 'Atividade vivencial promovida pelo Grupo de Apoio e Acolhimento ao Estudante e curso de Psicologia.',
        conteudo: `
            <p>Olá, estudante,</p>
            <p>O <strong>GAAE — Grupo de Apoio e Acolhimento ao Estudante</strong> convida para o encontro temático <em>"A Prática da Meditação para o Bem-estar Psicológico"</em>, conduzido pela equipe de extensão da área de Humanidades e Psicologia.</p>
            <p><strong>Data:</strong> 06/11/2026, às 17h00, na Sala de Vivências do Bloco B.</p>
            <p>Atenciosamente,<br><strong>Equipe GAAE — Uniube</strong></p>
        `,
        origem: 'uniube',
        categoria: 'palestras_eventos',
        prioridade: 'normal',
        publico: 'Área de Humanidades e Psicologia',
        publicoCurso: 'TODOS',
        remetente: 'PROJETO GAAE — PSICOLOGIA',
        iniciaisRemetente: 'GA',
        tagsArea: ['humanidades_psicologia'],
        publicadoEm: '2026-11-05T11:41:00',
        dataEvento: '2026-11-06T17:00:00',
        expiraEm: '2026-11-07T00:00:00',
        lido: false,
        lidoEm: null,
        curtido: false,
        exigeCiencia: false,
        cienciaConfirmada: false,
        cienciaEm: null,
        atualizado: false,
        atualizadoEm: null,
        grupoCanal: 'eventos_divulgacoes'
    },

    // 18. BAIXA — Curso de extensão QGIS em Engenharias (Referência ComunicacaoAva.htm)
    {
        id: 'com-118',
        sequencia: '1089136',
        titulo: 'Curso de Extensão — Análise Espacial e Manipulação de Dados no QGIS',
        resumo: 'Capacitação técnica em geoprocessamento voltada para os cursos de Engenharias e Arquitetura.',
        conteudo: `
            <p>Informamos que estão abertas as inscrições para o curso de extensão <strong>"Análise Espacial e Manipulação de Dados no QGIS"</strong>, voltado aos estudantes de Engenharia Civil, Engenharia Ambiental e Arquitetura e Urbanismo.</p>
            <p>As inscrições podem ser realizadas na página de Extensão da Uniube até o dia 19/11/2026.</p>
            <p>Atenciosamente,<br><strong>Coordenação de Extensão em Engenharias</strong></p>
        `,
        origem: 'uniube',
        categoria: 'cursos_capacitacoes',
        prioridade: 'baixa',
        publico: 'Área de Engenharias e Arquitetura',
        publicoCurso: 'TODOS',
        remetente: 'EXTENSÃO EM ENGENHARIAS',
        iniciaisRemetente: 'EE',
        tagsArea: ['engenharias_arquitetura'],
        publicadoEm: '2026-10-01T10:39:00',
        dataEvento: '2026-11-20T14:00:00',
        expiraEm: '2026-11-21T00:00:00',
        lido: true,
        lidoEm: '2026-10-05T12:00:00',
        curtido: false,
        exigeCiencia: false,
        cienciaConfirmada: false,
        cienciaEm: null,
        atualizado: false,
        atualizadoEm: null,
        grupoCanal: 'eventos_divulgacoes'
    },

    // 19. BAIXA — Palestra da Aliança Francesa (Sem área específica informada)
    {
        id: 'com-119',
        sequencia: '1114059',
        titulo: 'Palestra da Aliança Francesa — Oportunidades de Mobilidade Acadêmica Internacional',
        resumo: 'Apresentação sobre programas de intercâmbio cultural e bolsas de estudo em instituições parceiras.',
        conteudo: `
            <p>A Assessoria de Relações Internacionais da Uniube convida a comunidade acadêmica para a <strong>Palestra da Aliança Francesa e Campus France</strong> sobre programas de estudo e intercâmbio universitário.</p>
            <p><strong>Data:</strong> 19/11/2026, às 18h00, no Anfiteatro do Bloco D.</p>
            <p>Atenciosamente,<br><strong>Assessoria de Relações Internacionais — Uniube</strong></p>
        `,
        origem: 'uniube',
        categoria: 'palestras_eventos',
        prioridade: 'baixa',
        publico: 'Comunidade Acadêmica Geral',
        publicoCurso: 'TODOS',
        remetente: 'RELAÇÕES INTERNACIONAIS UNIUBE',
        iniciaisRemetente: 'RI',
        tagsArea: [],
        publicadoEm: '2026-10-28T15:15:00',
        dataEvento: '2026-11-19T18:00:00',
        expiraEm: '2026-11-20T00:00:00',
        lido: false,
        lidoEm: null,
        curtido: false,
        exigeCiencia: false,
        cienciaConfirmada: false,
        cienciaEm: null,
        atualizado: false,
        atualizadoEm: null,
        grupoCanal: 'eventos_divulgacoes'
    },

    // 20. CRÍTICA EXPIRADA — Aviso de aula anterior já realizada (03/11)
    {
        id: 'com-120',
        sequencia: '1124010',
        titulo: 'Aula de Matemática Discreta I em formato remoto excepcional (03/11)',
        resumo: 'Comunicado referente à aula de 03/11/2026 às 19h00, já realizada.',
        conteudo: `
            <p>Prezado(a) aluno(a),</p>
            <p>Informamos que a aula da disciplina <strong>90602 - Matemática Discreta I</strong> do dia <strong>03/11/2026, às 19h00</strong>, foi ministrada em formato remoto síncrono pela sala virtual da disciplina.</p>
            <p>A gravação e a lista de exercícios correspondente já se encontram disponíveis na aba <em>Aulas</em> do componente curricular.</p>
            <p>Atenciosamente,<br><strong>Coordenação do Curso de ADS</strong></p>
        `,
        origem: 'curso',
        categoria: 'aulas',
        prioridade: 'critica',
        publico: 'Turma de ADS — 3º Período',
        publicoCurso: 'ADS',
        remetente: 'COORDENAÇÃO DO CURSO DE ADS',
        iniciaisRemetente: 'CA',
        tagsArea: ['tecnologia_computacao'],
        publicadoEm: '2026-11-03T14:00:00',
        dataEvento: '2026-11-03T19:00:00',
        expiraEm: '2026-11-03T23:00:00',
        lido: true,
        lidoEm: '2026-11-03T15:10:00',
        curtido: false,
        exigeCiencia: true,
        cienciaConfirmada: true,
        cienciaEm: '2026-11-03T15:11:00',
        atualizado: false,
        atualizadoEm: null,
        grupoCanal: 'urgentes_aula'
    }
];
