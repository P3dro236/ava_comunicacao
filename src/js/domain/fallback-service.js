/**
 * Central Inteligente de Comunicados Acadêmicos — AVA Uniube
 * Módulo: domain/fallback-service.js
 * Responsabilidade: Orquestração e telemetria do Protocolo de Fallback Multicanal (WhatsApp -> 5m -> SMS -> Push).
 */

/**
 * Simula e documenta a execução da esteira de Fallback Multicanal para comunicados de prioridade Alta e Crítica.
 */
export function executarEsteiraFallbackMulticanal(comunicado, cenarioSimulacao) {
    if (!comunicado || (comunicado.prioridade !== 'critica' && comunicado.prioridade !== 'alta')) {
        return {
            elegivelFallback: false,
            statusFinal: 'CANAL_PADRAO_PORTAL',
            resumo: 'Entrega padrão no feed do Portal AVA (prioridade Normal/Baixa).'
        };
    }

    const cenario = cenarioSimulacao || comunicado.cenarioFallback || 'WHATSAPP_OK';

    if (cenario === 'WHATSAPP_OK') {
        return {
            elegivelFallback: true,
            statusFinal: 'ENTREGUE_WHATSAPP_PRIMARIO',
            canalConfirmado: 'WhatsApp API',
            tempoTotalSegundos: 9,
            resumo: 'WhatsApp entregue e confirmado via Webhook em 9s (sem necessidade de fallback).',
            etapas: [
                { ordem: 1, canal: 'WhatsApp API', status: 'WEBHOOK_DELIVERED', detalhe: '200 OK — Entregue em 9s (< 5 min timeout)' }
            ]
        };
    }

    if (cenario === 'FALLBACK_SMS') {
        return {
            elegivelFallback: true,
            statusFinal: 'ENTREGUE_FALLBACK_SMS',
            canalConfirmado: 'SMS (após Timeout WhatsApp)',
            tempoTotalSegundos: 306,
            resumo: 'Timeout de 5 min no Webhook do WhatsApp -> Disparo automático de SMS confirmado em 6s.',
            etapas: [
                { ordem: 1, canal: 'WhatsApp API', status: 'WEBHOOK_TIMEOUT_5MIN', detalhe: 'Sem confirmação de entrega após 300s (5 minutos)' },
                { ordem: 2, canal: 'SMS Gateway', status: 'SMS_DELIVERED', detalhe: 'Fallback acionado em t+300s — SMS entregue em 6s' }
            ]
        };
    }

    // Cenário: FALLBACK_PUSH_ULTIMO_RECURSO
    return {
        elegivelFallback: true,
        statusFinal: 'ENTREGUE_ULTIMO_RECURSO_PUSH',
        canalConfirmado: 'Push Notification App (Último Recurso)',
        tempoTotalSegundos: 322,
        resumo: 'Timeout de 5 min no WhatsApp -> Falha de operadora no SMS -> Entregue via Push Notification no App.',
        etapas: [
            { ordem: 1, canal: 'WhatsApp API', status: 'WEBHOOK_TIMEOUT_5MIN', detalhe: 'Sem confirmação do webhook em 300s (5 min)' },
            { ordem: 2, canal: 'SMS Gateway', status: 'OPERADORA_FALHA', detalhe: 'Erro 503 na operadora móvel em t+318s' },
            { ordem: 3, canal: 'Push Notification App', status: 'PUSH_FCM_DELIVERED', detalhe: 'Último recurso disparado em t+319s — Recebido no App AVA' }
        ]
    };
}

