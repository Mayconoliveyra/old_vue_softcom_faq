// RESPONSAVEL POR VERIFICAR SE O TOKEN NÃO FOI EXPIRADO. SE DER O ERRO 4001 SIGNIFICA QUE ESTA EXPIRADO, ENTÃO O METODO ENVIA PARA TELA DE LOGIN
import axios from 'axios'

const success = res => res
const error = err => {
    if (401 === err.response.status) {
        window.location = '/'
    } else {
        return Promise.reject(err)
    }
}

axios.interceptors.response.use(success, error)