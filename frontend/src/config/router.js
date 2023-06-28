import Vue from "vue"
import VueRouter from "vue-router"
import TodosFaqs from "../components/pages/TodosFaqs"
import FaqsValidos from "../components/pages/FaqsValidos"
import FaqsN2 from "../components/pages/FaqsN2"
import AnalisePlanilhas from "../components/pages/AnalisePlanilhas"
import Autenticacao from "../components/auth/Autenticacao"
import Anotacoes from "../components/pages/Anotacoes"
import AnydeskCript from "../components/pages/AnydeskCript"
import AnotacoesCompartilhadas from "../components/pages/AnotacoesCompartilhadas"
import Jornada from "../components/pages/Jornada"
import MainAdmin from "../components/admin/MainAdmin"
import AdminUsuario from "../components/admin/pages/AdminUsuario"
import AdminFaq from "../components/admin/pages/AdminFaq"
import AdminGrupoFaq from "../components/admin/pages/AdminGrupoFaq"
import AdminAuditoria from "../components/admin/pages/AdminAuditoria"
import AdminAnotacoes from "../components/admin/pages/AdminAnotacoes"
import AdminJornada from "../components/admin/pages/AdminJornada"
import { usuarioChave, baseApiUrl, showError } from "../../global"
import axios from "axios"
Vue.use(VueRouter)

const routes = [
    {
        name: "faqsvalidos",
        path: "/",
        component: FaqsValidos
    },
    {
        name: "faqsN2",
        path: "/n2",
        component: FaqsN2
    },
    {
        name: "analise",
        path: "/analise",
        component: AnalisePlanilhas,
        meta: { requiresAutenticado: true }
    },
    {
        name: "todosfaqs",
        path: "/todos_faqs",
        component: TodosFaqs
    },
    {
        name: "anydesk",
        path: "/anydesk",
        component: AnydeskCript
    },
    {
        name: "autenticacao",
        path: "/autenticacao",
        component: Autenticacao
    },
    {
        name: "autenticacao_id",
        path: "/autenticacao/:aleatorio/:email/:senha/:autenticar",
        parames: true,
        component: Autenticacao
    },
    {
        name: "anotacoes",
        path: "/anotacoes",
        component: Anotacoes,
        meta: { requiresAutenticado: true }
    },
    {
        name: "anotacoes_compartilhadas",
        path: "/anotacoes_compartilhadas",
        component: AnotacoesCompartilhadas
    },
    {
        name: "jornada",
        path: "/jornada",
        component: Jornada,
        meta: { requiresAutenticado: true }
    },
    {
        name: "admin",
        path: "/admin",
        component: MainAdmin,
        meta: { requiresAdmin: true }
    },
    {
        name: "admin_usuario",
        path: "/admin_usuario",
        component: AdminUsuario,
        meta: { requiresAdmin: true }
    },
    {
        name: "admin_faq",
        path: "/admin_faq",
        component: AdminFaq,
        meta: { requiresAdmin: true }
    },
    {
        name: "admin_grupo_faq",
        path: "/admin_grupo_faq",
        component: AdminGrupoFaq,
        meta: { requiresAdmin: true }
    },
    {
        name: "admin_auditoria",
        path: "/admin_auditoria",
        component: AdminAuditoria,
        meta: { requiresAdmin: true }
    },
    {
        name: "admin_anotacoes",
        path: "/admin_anotacoes",
        component: AdminAnotacoes,
        meta: { requiresAdmin: true }
    },
    {
        name: "admin_jornada",
        path: "/admin_jornada",
        component: AdminJornada,
        meta: { requiresAdmin: true }
    }
]

const router = new VueRouter({
    mode: "history",
    routes,
})

// REGRAS DE ROUTER (RESTRIÇÕES)
//essa funcão recebe varios paramentros: to= para onde eu vou, from= de onde estou vindo, next= para onde vou
router.beforeEach(async (to, from, next) => {
    const json = localStorage.getItem(usuarioChave)

    // VALIDA SE O USUARIO ESTÁ LOGADO.
    if (to.matched.some(record => record.meta.requiresAutenticado)) {
        const url = `${baseApiUrl}/validarToken`
        await axios.post(url, JSON.parse(json))
            .then(res => {
                res.data ? next() : next({ path: "/autenticacao" })
            }
            )
            .catch(showError)
    } else {
        next()
    }

    // VALIDA SE O USUARIO LOGADO É ADMINISTRADOR. 
    if (to.matched.some(record => record.meta.requiresAdmin)) {
        const url = `${baseApiUrl}/validarUsuarioAdm`
        await axios.post(url, JSON.parse(json))
            .then(res => {
                res.data ? next() : next({ path: "/autenticacao" })
            }
            )
            .catch(showError)
    } else {
        next()
    }

})


export default router