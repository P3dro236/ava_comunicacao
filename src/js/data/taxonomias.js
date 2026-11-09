/**
 * Central Inteligente de Comunicados Acadêmicos — AVA Uniube
 * Módulo: data/taxonomias.js
 * Responsabilidade: Dicionários institucionais (Macro-chips, Governança, Esteira, Áreas, Prioridades, Categorias, Preferências Padrão).
 */

// ==================== MACRO-FILTROS (CHIPS) ====================
export const MACRO_FILTROS_CHIPS = [
    {
        id: 'todas',
        label: 'Todos',
        icone: 'fa-layer-group',
        categorias: []
    },
    {
        id: 'aulas_provas',
        label: 'Aulas & Provas',
        icone: 'fa-chalkboard-teacher',
        categorias: [
            'aulas',
            'salas_infraestrutura',
            'trabalhos_atividades',
            'provas_avaliacoes',
            'prazos_academicos',
            'atividades_complementares'
        ]
    },
    {
        id: 'eventos',
        label: 'Eventos',
        icone: 'fa-calendar-check',
        categorias: [
            'palestras_eventos_curso',
            'palestras_eventos',
            'defesas_academicas',
            'cursos_capacitacoes',
            'estagios_oportunidades',
            'oportunidades_projetos'
        ]
    },
    {
        id: 'secretaria',
        label: 'Secretaria',
        icone: 'fa-university',
        categorias: [
            'assuntos_administrativos_curso',
            'comunicados_gerais_curso',
            'avaliacoes_institucionais',
            'privacidade_seguranca',
            'noticias_institucionais',
            'comunicados_gerais_uniube'
        ]
    }
];

// ==================== GOVERNANÇA DE EMISSÃO (RESTRIÇÕES ADMINISTRATIVAS) ====================
export const REGRAS_GOVERNANCA_EMISSAO = {
    perfisAutorizadosCritica: [
        { role: 'COORDENACAO_CURSO', nome: 'Coordenação de Curso' },
        { role: 'SUPERVISAO_LABORATORIOS_INFRA', nome: 'Supervisão de Laboratórios e Infraestrutura' },
        { role: 'DIRETORIA_ACADEMICA', nome: 'Diretoria Acadêmica' },
        { role: 'REITORIA', nome: 'Reitoria / Pró-Reitoria de Ensino' }
    ],
    categoriasPermitidasCritica: [
        'aulas',
        'salas_infraestrutura'
    ],
    categoriasBloqueadasExemplo: [
        'palestras_eventos',
        'palestras_eventos_curso',
        'assuntos_administrativos_curso',
        'comunicados_gerais_uniube',
        'defesas_academicas',
        'cursos_capacitacoes',
        'estagios_oportunidades',
        'avaliacoes_institucionais',
        'noticias_institucionais'
    ]
};

// ==================== PROTOCOLO DE FALLBACK MULTICANAL ====================
export const SCHEMA_MENSAGERIA_FALLBACK = {
    timeoutWebhookMs: 5 * 60 * 1000, // 300.000 ms (5 minutos)
    timeoutWebhookSegundos: 300,
    esteiraCanais: [
        { ordem: 1, canal: 'WHATSAPP_API', nome: 'WhatsApp Business API', slaTimeoutSegundos: 300 },
        { ordem: 2, canal: 'SMS_GATEWAY', nome: 'SMS Shortcode Operadora', slaTimeoutSegundos: 60 },
        { ordem: 3, canal: 'APP_PUSH_FCM', nome: 'Push Notification App AVA (Último Recurso)', slaTimeoutSegundos: 15 }
    ]
};

// ==================== TAXONOMIA DE ÁREAS DE CONHECIMENTO ====================
export const AREAS_CONHECIMENTO = {
    tecnologia_computacao: {
        id: 'tecnologia_computacao',
        nome: 'Tecnologia e Computação',
        icone: 'fa-laptop-code'
    },
    ciencias_saude: {
        id: 'ciencias_saude',
        nome: 'Ciências da Saúde',
        icone: 'fa-heartbeat'
    },
    educacao: {
        id: 'educacao',
        nome: 'Educação e Licenciaturas',
        icone: 'fa-chalkboard-teacher'
    },
    ciencias_agrarias: {
        id: 'ciencias_agrarias',
        nome: 'Ciências Agrárias e Veterinária',
        icone: 'fa-seedling'
    },
    gestao_negocios: {
        id: 'gestao_negocios',
        nome: 'Gestão, Direito e Negócios',
        icone: 'fa-briefcase'
    },
    engenharias_arquitetura: {
        id: 'engenharias_arquitetura',
        nome: 'Engenharias e Arquitetura',
        icone: 'fa-drafting-compass'
    },
    humanidades_psicologia: {
        id: 'humanidades_psicologia',
        nome: 'Humanidades e Psicologia',
        icone: 'fa-brain'
    }
};

// ==================== TAXONOMIA DE 4 NÍVEIS DE PRIORIDADE ====================
export const PRIORIDADES = {
    critica: {
        id: 'critica',
        nome: 'Máxima',
        ordem: 1,
        hex: '#ef4444',
        rgb: '239, 68, 68',
        varianteBadge: 'subtle',
        icone: '',
        obrigatoria: true,
        descricao: 'Avisos urgentes como cancelamentos de aula no dia ou alterações imediatas de funcionamento.'
    },
    alta: {
        id: 'alta',
        nome: 'Alta',
        ordem: 2,
        hex: '#f59e0b',
        rgb: '245, 158, 11',
        varianteBadge: 'subtle',
        icone: 'fas fa-exclamation-circle',
        obrigatoria: false,
        descricao: 'Prazos acadêmicos próximos, entregas de trabalhos, provas e mudanças programadas de sala.'
    },
    normal: {
        id: 'normal',
        nome: 'Normal',
        ordem: 3,
        hex: '#64b5f6',
        rgb: '100, 181, 246',
        varianteBadge: 'subtle',
        icone: 'fas fa-info-circle',
        obrigatoria: false,
        descricao: 'Comunicados regulares do curso, oportunidades de estágio, defesas acadêmicas e eventos.'
    },
    baixa: {
        id: 'baixa',
        nome: 'Baixa',
        ordem: 4,
        hex: '#b4bec8',
        rgb: '180, 190, 200',
        varianteBadge: 'outlined',
        icone: 'fas fa-angle-down',
        obrigatoria: false,
        descricao: 'Informativos gerais, divulgações complementares e notícias institucionais.'
    }
};

// ==================== TAXONOMIA DE CATEGORIAS BASE ====================
export const CATEGORIAS = {
    // Origem: Curso (6 essenciais + 4 opcionais)
    aulas: {
        id: 'aulas',
        nome: 'Aulas: cancelamentos, ausências e alterações',
        nomeCurto: 'Aulas',
        origem: 'curso',
        essencial: true,
        grupoCanal: 'urgentes_aula',
        icone: 'fa-chalkboard'
    },
    salas_infraestrutura: {
        id: 'salas_infraestrutura',
        nome: 'Salas e infraestrutura',
        nomeCurto: 'Salas e infraestrutura',
        origem: 'curso',
        essencial: true,
        grupoCanal: 'urgentes_aula',
        icone: 'fa-door-open'
    },
    trabalhos_atividades: {
        id: 'trabalhos_atividades',
        nome: 'Trabalhos e atividades',
        nomeCurto: 'Trabalhos e atividades',
        origem: 'curso',
        essencial: true,
        grupoCanal: 'prazos_atividades',
        icone: 'fa-tasks'
    },
    provas_avaliacoes: {
        id: 'provas_avaliacoes',
        nome: 'Provas e avaliações',
        nomeCurto: 'Provas e avaliações',
        origem: 'curso',
        essencial: true,
        grupoCanal: 'prazos_atividades',
        icone: 'fa-file-alt'
    },
    prazos_academicos: {
        id: 'prazos_academicos',
        nome: 'Prazos acadêmicos',
        nomeCurto: 'Prazos acadêmicos',
        origem: 'curso',
        essencial: true,
        grupoCanal: 'prazos_atividades',
        icone: 'fa-hourglass-half'
    },
    assuntos_administrativos_curso: {
        id: 'assuntos_administrativos_curso',
        nome: 'Assuntos administrativos do curso',
        nomeCurto: 'Administração do curso',
        origem: 'curso',
        essencial: true,
        grupoCanal: 'institucionais',
        icone: 'fa-university'
    },
    estagios_oportunidades: {
        id: 'estagios_oportunidades',
        nome: 'Estágios e oportunidades profissionais',
        nomeCurto: 'Estágios e oportunidades',
        origem: 'curso',
        essencial: false,
        grupoCanal: 'eventos_divulgacoes',
        icone: 'fa-user-tie'
    },
    palestras_eventos_curso: {
        id: 'palestras_eventos_curso',
        nome: 'Palestras e eventos relacionados ao curso',
        nomeCurto: 'Eventos do curso',
        origem: 'curso',
        essencial: false,
        grupoCanal: 'eventos_divulgacoes',
        icone: 'fa-calendar-alt'
    },
    atividades_complementares: {
        id: 'atividades_complementares',
        nome: 'Atividades complementares',
        nomeCurto: 'Atividades complementares',
        origem: 'curso',
        essencial: false,
        grupoCanal: 'prazos_atividades',
        icone: 'fa-award'
    },
    comunicados_gerais_curso: {
        id: 'comunicados_gerais_curso',
        nome: 'Comunicados gerais do curso',
        nomeCurto: 'Comunicados do curso',
        origem: 'curso',
        essencial: true,
        grupoCanal: 'institucionais',
        icone: 'fa-bullhorn'
    },

    // Origem: Uniube (Institucionais)
    defesas_academicas: {
        id: 'defesas_academicas',
        nome: 'Defesas acadêmicas',
        nomeCurto: 'Defesas acadêmicas',
        origem: 'uniube',
        essencial: false,
        grupoCanal: 'eventos_divulgacoes',
        icone: 'fa-user-graduate'
    },
    palestras_eventos: {
        id: 'palestras_eventos',
        nome: 'Palestras e eventos',
        nomeCurto: 'Palestras e eventos',
        origem: 'uniube',
        essencial: false,
        grupoCanal: 'eventos_divulgacoes',
        icone: 'fa-microphone-alt'
    },
    cursos_capacitacoes: {
        id: 'cursos_capacitacoes',
        nome: 'Cursos e capacitações',
        nomeCurto: 'Cursos e capacitações',
        origem: 'uniube',
        essencial: false,
        grupoCanal: 'eventos_divulgacoes',
        icone: 'fa-laptop'
    },
    avaliacoes_institucionais: {
        id: 'avaliacoes_institucionais',
        nome: 'Avaliações institucionais',
        nomeCurto: 'Avaliações institucionais',
        origem: 'uniube',
        essencial: true,
        grupoCanal: 'institucionais',
        icone: 'fa-poll'
    },
    privacidade_seguranca: {
        id: 'privacidade_seguranca',
        nome: 'Privacidade e segurança',
        nomeCurto: 'Privacidade e LGPD',
        origem: 'uniube',
        essencial: false,
        grupoCanal: 'institucionais',
        icone: 'fa-shield-alt'
    },
    noticias_institucionais: {
        id: 'noticias_institucionais',
        nome: 'Notícias institucionais',
        nomeCurto: 'Notícias institucionais',
        origem: 'uniube',
        essencial: false,
        grupoCanal: 'institucionais',
        icone: 'fa-newspaper'
    },
    oportunidades_projetos: {
        id: 'oportunidades_projetos',
        nome: 'Oportunidades e projetos',
        nomeCurto: 'Oportunidades e projetos',
        origem: 'uniube',
        essencial: false,
        grupoCanal: 'eventos_divulgacoes',
        icone: 'fa-lightbulb'
    },
    comunicados_gerais_uniube: {
        id: 'comunicados_gerais_uniube',
        nome: 'Comunicados gerais (Uniube)',
        nomeCurto: 'Divulgação institucional',
        origem: 'uniube',
        essencial: true,
        grupoCanal: 'institucionais',
        icone: 'fa-info'
    }
};

// ==================== GRUPOS DE CANAIS ====================
export const GRUPOS_CANAIS = [
    {
        id: 'urgentes_aula',
        nome: 'Avisos urgentes de aula e infraestrutura',
        descricao: 'Cancelamentos de aula no mesmo dia, ausências de docentes e alterações imediatas de sala ou laboratório.'
    },
    {
        id: 'prazos_atividades',
        nome: 'Prazos acadêmicos, trabalhos e avaliações',
        descricao: 'Entregas de trabalhos práticos, provas regimentais, estudos autônomos e atividades complementares.'
    },
    {
        id: 'eventos_divulgacoes',
        nome: 'Defesas acadêmicas, palestras e estágios',
        descricao: 'Bancas públicas, eventos científicos, cursos de extensão e vagas de estágio da sua área.'
    },
    {
        id: 'institucionais',
        nome: 'Comunicados institucionais e administrativos',
        descricao: 'Avaliações institucionais (NPS), orientações de privacidade (LGPD) e avisos gerais da universidade.'
    }
];

// ==================== PREFERÊNCIAS PADRÃO DO ALUNO ====================
export const PREFERENCIAS_PADRAO = {
    areasInteresse: ['tecnologia_computacao'],
    areasOptInExplicito: [],
    origensAtivas: {
        curso: true,
        uniube: true
    },
    categoriasAtivas: {
        aulas: true,
        salas_infraestrutura: true,
        trabalhos_atividades: true,
        provas_avaliacoes: true,
        prazos_academicos: true,
        assuntos_administrativos_curso: true,
        estagios_oportunidades: true,
        palestras_eventos_curso: true,
        atividades_complementares: true,
        comunicados_gerais_curso: true,
        defesas_academicas: true,
        palestras_eventos: true,
        cursos_capacitacoes: true,
        avaliacoes_institucionais: true,
        privacidade_seguranca: true,
        noticias_institucionais: true,
        oportunidades_projetos: true,
        comunicados_gerais_uniube: true
    },
    canaisAtivos: {
        portal: true,
        whatsapp: true,
        sms: false,
        email: true,
        pushApp: false
    },
    canaisPorGrupo: {
        urgentes_aula: { portal: true, email: true, whatsapp: true, sms: true },
        prazos_atividades: { portal: true, email: true, whatsapp: true, sms: false },
        eventos_divulgacoes: { portal: true, email: true, whatsapp: false, sms: false },
        institucionais: { portal: true, email: true, whatsapp: false, sms: false }
    },
    prioridadesRecebimento: {
        critica: { acompanharNoFeed: true, canaisRapidos: true },
        alta: { acompanharNoFeed: true, canaisRapidos: true },
        normal: { acompanharNoFeed: false, canaisRapidos: false },
        baixa: { acompanharNoFeed: false, canaisRapidos: false }
    }
};

