/**
 * Central Inteligente de Comunicados Acadêmicos — AVA Uniube
 * Módulo: ui/toast.js
 * Responsabilidade: Exibição de notificações discretas (Toast) na paleta Slate-Blue (#313a46).
 */

export function exibirToast(mensagem, tipo = 'info') {
    const container = document.getElementById('toastContainerAva');
    if (!container) return;

    const corBorda = tipo === 'sucesso' ? '#23bc7b' : (tipo === 'erro' ? '#ef4444' : '#00b4d8');
    const toastEl = document.createElement('div');
    toastEl.className = 'toast show align-items-center text-white border-0 mb-2';
    toastEl.setAttribute('role', 'status');
    toastEl.style.cssText = `background-color: #313a46; border-left: 4px solid ${corBorda} !important; border: 1px solid #526174; box-shadow: 0 8px 20px rgba(0,0,0,0.35);`;

    toastEl.innerHTML = `
        <div class="d-flex align-items-center p-2 px-3">
            <div class="toast-body p-0 small" style="color: #ffffff;">${mensagem}</div>
            <button type="button" class="btn-close btn-close-white ms-auto" aria-label="Fechar"></button>
        </div>
    `;

    toastEl.querySelector('.btn-close')?.addEventListener('click', function () {
        toastEl.remove();
    });

    container.appendChild(toastEl);
    setTimeout(function () {
        if (toastEl.parentNode) {
            toastEl.remove();
        }
    }, 3600);
}

