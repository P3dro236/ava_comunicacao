/**
 * Central Inteligente de Comunicados Acadêmicos — AVA Uniube
 * Módulo: data/perfil-aluno.js
 * Responsabilidade: Dados institucionais do aluno autenticado no portal.
 */

export const PERFIL_USUARIO = {
    nome: 'LUCAS GABRIEL FERREIRA',
    ra: '5184293',
    email: 'lucas.ferreira@edu.uniube.br',
    telefoneCelular: '(34) 99765-4321',
    curso: 'ADS',
    cursoNome: 'ANÁLISE E DESENVOLVIMENTO DE SISTEMAS',
    turma: 'Turma ADS — 3º Período (Noturno)',
    turmaId: 'TURMA_ADS_2026_2_3N',
    area: 'tecnologia_computacao',
    contatosCadastrados: {
        portal: { disponivel: true, detalhe: 'Ativo no Ambiente Online do Aluno (AVA)' },
        whatsapp: { disponivel: true, detalhe: '(34) 99765-4321' },
        sms: { disponivel: true, detalhe: '(34) 99765-4321' },
        email: { disponivel: true, detalhe: 'lucas.ferreira@edu.uniube.br' },
        pushApp: { disponivel: true, detalhe: 'App AVA Mobile (Android/iOS — Token FCM ativo)' }
    }
};

