/**
 * Central Inteligente de Comunicados Acadêmicos — AVA Uniube
 * Módulo: utils/formatters.js
 * Responsabilidade: Utilitários puros de formatação de datas, horas e textos.
 */

function extrairPartesData(isoStr) {
    if (!isoStr) return null;
    const d = new Date(isoStr);
    if (isNaN(d.getTime())) return null;

    return {
        dia: String(d.getDate()).padStart(2, '0'),
        mes: String(d.getMonth() + 1).padStart(2, '0'),
        ano: d.getFullYear(),
        hora: String(d.getHours()).padStart(2, '0'),
        min: String(d.getMinutes()).padStart(2, '0'),
        seg: String(d.getSeconds()).padStart(2, '0')
    };
}

/**
 * Formata uma string ISO para o padrão DD/MM/AAAA HH:mm
 */
export function formatarDataHoraBR(isoStr) {
    if (!isoStr) return '';
    const partes = extrairPartesData(isoStr);
    if (!partes) return isoStr;
    return `${partes.dia}/${partes.mes}/${partes.ano} ${partes.hora}:${partes.min}`;
}

/**
 * Formata uma string ISO para o padrão DD/MM/AAAA HH:mm:ss (usado no cabeçalho de leitura)
 */
export function formatarDataHoraLeitura(isoStr) {
    if (!isoStr) return '';
    const partes = extrairPartesData(isoStr);
    if (!partes) return isoStr;
    return `${partes.dia}/${partes.mes}/${partes.ano} ${partes.hora}:${partes.min}:${partes.seg}`;
}

/**
 * Remove tags HTML de uma string para indexação de busca textual
 */
export function removerTagsHtml(htmlStr = '') {
    return String(htmlStr).replace(/<[^>]+>/g, ' ');
}

/**
 * Escapa aspas duplas para uso seguro em atributos HTML
 */
export function escaparAtributoHtml(str = '') {
    return String(str).replace(/"/g, '&quot;');
}

