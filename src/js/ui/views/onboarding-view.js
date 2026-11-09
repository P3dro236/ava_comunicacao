/**
 * Central Inteligente de Comunicados Acadêmicos — AVA Uniube
 * Módulo: ui/views/onboarding-view.js
 * Responsabilidade: Renderização do Banner de Onboarding Progressivo de canais secundários (SMS + Push).
 */

import { obterEstadoOnboarding } from '../../storage/onboarding-repository.js';
import { obterPreferenciasStorage } from '../../storage/preferencias-repository.js';

export function renderizarBannerOnboardingProgressivo() {
    const container = document.getElementById('containerOnboardingProgressivo');
    if (!container) return;

    const estadoOnb = obterEstadoOnboarding();
    const prefs = obterPreferenciasStorage();
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

