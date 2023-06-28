import axios from "axios"
import Vue from "vue"
import Vuex from "vuex"

Vue.use(Vuex)

export default new Vuex.Store({
        state: {
                isUserDropdownVisible: true,
                modalFaqHelpVisivel: false,
                user: {},
                appLogin: false
        },
        mutations: {
                setUser(state, user) {
                        state.user = user
                        if (user) {
                                axios.defaults.headers.common["Authorization"] = `bearer ${user.token}`
                        } else {
                                delete axios.defaults.headers.common["Authorization"]
                        }
                },
                setModalFaq(state, modalFaq) {
                        state.modalFaqHelpVisivel = modalFaq

                },
                setUserVisible(state, visible) {
                        state.isUserDropdownVisible = visible
                },
                setAppLogin(state, login) {
                        state.appLogin = login
                },
        }

})