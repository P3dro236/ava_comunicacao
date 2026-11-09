/**
 * Central Inteligente de Comunicados Acadêmicos — AVA Uniube
 * Módulo: ui/layout-portal.js
 * Responsabilidade: Controles de infraestrutura do portal AVA (Sidenav, submenus, navbar retrátil, perfil, sino e botão voltar ao topo).
 */

import { exibirToast } from './toast.js';

export function registrarEventosLayoutPortal() {
    // Sidenav global (Fixar Menu e Mobile)
    const inpLock = document.getElementById('inpLock');
    const sidenav = document.getElementById('sidenav');
    if (inpLock && sidenav) {
        inpLock.addEventListener('change', function (e) {
            sidenav.classList.toggle('fix', e.target.checked);
        });
    }

    const btnSideMenuMob = document.getElementById('btnSideMenuMob');
    if (btnSideMenuMob && sidenav) {
        btnSideMenuMob.addEventListener('change', function (e) {
            sidenav.classList.toggle('fix', e.target.checked);
        });
    }

    // Submenus do Sidenav global
    document.querySelectorAll('[data-toggle-submenu]').forEach(function (trigger) {
        trigger.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = trigger.getAttribute('data-toggle-submenu');
            document.getElementById(targetId)?.classList.toggle('close');
        });
    });

    // Perfil e Notificações na Navbar
    const dropdownMenuPerfil = document.getElementById('dropdownMenuPerfil');
    const divNavbar = document.getElementById('divNavbar');
    const notificacaoIco = document.getElementById('notificacao_ico');
    const notificacaoCard = document.getElementById('notificacao_card');

    dropdownMenuPerfil?.addEventListener('click', function (e) {
        e.stopPropagation();
        divNavbar?.classList.toggle('expand');
        notificacaoCard?.classList.add('d-none');
    });

    notificacaoIco?.addEventListener('click', function (e) {
        e.stopPropagation();
        notificacaoCard?.classList.toggle('d-none');
        divNavbar?.classList.remove('expand');
    });

    document.addEventListener('click', function (e) {
        const legadoEl = e.target.closest('[data-legado-inerte="true"]');
        if (legadoEl) {
            e.preventDefault();
            e.stopPropagation();
            exibirToast('Opção demonstrativa do portal.', 'info');
            return;
        }

        divNavbar?.classList.remove('expand');
        notificacaoCard?.classList.add('d-none');
    });

    // Scroll e botão Voltar ao Topo
    const conteudoGeral = document.getElementById('divAvaConteudoGeral');
    const navbar = document.getElementById('navbar');
    const buttonToTop = document.getElementById('buttonToTop');

    conteudoGeral?.addEventListener('scroll', function (e) {
        const top = e.target.scrollTop;
        if (top >= 68) {
            navbar?.classList.add('retrair');
        } else if (top <= 10) {
            navbar?.classList.remove('retrair');
        }

        if (top >= 500) {
            buttonToTop?.classList.add('view');
        } else {
            buttonToTop?.classList.remove('view');
        }
    }, { passive: true });

    buttonToTop?.addEventListener('click', function () {
        document.getElementById('topPag')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
}

