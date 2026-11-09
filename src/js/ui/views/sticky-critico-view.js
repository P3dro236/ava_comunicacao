/**
 * Central Inteligente de Comunicados Acadêmicos — AVA Uniube
 * Módulo: ui/views/sticky-critico-view.js
 * Responsabilidade: Hierarquia Visual de Urgência (Card Sticky no topo com borda vermelha para Prioridade Crítica ativa).
 */

export function renderizarStickyCritico(criticosNaoLidos, comunicadoAbertoId) {
    const stickyContainer = document.getElementById('stickyCriticosContainer');
    if (!stickyContainer) return;

    if (criticosNaoLidos.length > 0 && !comunicadoAbertoId) {
        const primeiroCritico = criticosNaoLidos[0];
        stickyContainer.classList.remove('d-none');
        stickyContainer.innerHTML = `
            <div class="alerta-critico-topo" role="alert">
                <div class="d-flex align-items-center flex-wrap gap-2">
                    <span class="indicador-prioridade-critica">
                        Máxima
                    </span>
                    <span class="fw-bold text-white">${primeiroCritico.titulo}</span>
                    ${criticosNaoLidos.length > 1 ? `<span class="small text-white-50">(+${criticosNaoLidos.length - 1} alerta com prioridade máxima)</span>` : ''}
                </div>
                <button type="button" class="btn btn-sm buttonMain flex-shrink-0" style="border-color: #ef4444;" data-acao="abrir-comunicado" data-id="${primeiroCritico.id}">
                    <i class="fas fa-eye me-1"></i>Ler agora
                </button>
            </div>
        `;
    } else {
        stickyContainer.innerHTML = '';
        stickyContainer.classList.add('d-none');
    }
}

