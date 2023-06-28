import Vue from "vue"
import Toasted from "vue-toasted"

Vue.use(Toasted, {
    iconPack: "fontawesome",
    duration: 7000
})

Vue.toasted.register(
    "defaultSuccess",
    payload => !payload.msg ? "Operação realizada com sucesso!" : payload.msg,
    { type: "success" }
)

Vue.toasted.register(
    "cadastroSuccess",
    payload => !payload.msg ? "Seu cadastro foi realizado com sucesso!" : payload.msg,
    { type: "success" }
)
Vue.toasted.register(
    "recuperarSenha",
    payload => !payload.msg ? "[Sucesso] Sua senha foi redefinida com êxito, verifique seu email." : payload.msg,
    { type: "success" }
)
Vue.toasted.register(
    "redefinidoSenha",
    payload => !payload.msg ? "[Sucesso] Senha recuperada com sucesso!" : payload.msg,
    { type: "success" }
)
Vue.toasted.register(
    "usuarioAutenticado",
    payload => !payload.msg ? "Autenticação realizada com sucesso!" : payload.msg,
    { type: "success" }
)

Vue.toasted.register(
    "defaultError",
    payload => !payload.msg ? "Oops... Erro inesperado." : payload.msg,
    { type: "error" }
)

