import Vue from "vue"

export const usuarioChave = "__chave_secreta_faqsoftcom"
export const historicoAnydesk = "__historico_anydesk"
/* export const baseApiUrl = "https://backend-softcomfaq.herokuapp.com" */
export const senhaAtualizacao = "1998"
export const baseApiUrl = "http://localhost:3030"

export const chave_criptografia_anydesk = {
    algoritmo: "aes-256-ctr",
    segredo: `s@fTC0M${new Date().toLocaleString().substring(10, 0)}#T3cN0L*og14`,
    tipo: "hex",
    codificacao: "utf8",
}
 
export function showError(e) {
    if (e && e.response && e.response.data) {
        Vue.toasted.global.defaultError({ msg: e.response.data })
    } else if (typeof e === 'string') {
        Vue.toasted.global.defaultError({ msg: e })
    } else {
        Vue.toasted.global.defaultError()
    }
}

export default { baseApiUrl, chave_criptografia_anydesk, showError, senhaAtualizacao }


 