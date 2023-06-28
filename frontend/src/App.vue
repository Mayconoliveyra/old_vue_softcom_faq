<template>
  <div>
    <div v-if="!appLogin && this.$route.name != 'jornada'" class="app">
      <Header />
      <NavBar />
      <Loading v-if="validaToken" />
      <Content v-else />
      <Footer />
    </div>
    <div v-else class="app-login">
      <Loading v-if="validaToken" />
      <Content v-else />
    </div>
  </div>
</template>

<script>
import axios from "axios";
import { baseApiUrl, usuarioChave } from "../global";
import { mapState } from "vuex";
import Header from "./components/template/Header";
import NavBar from "./components/template/NavBar";
import Content from "./components/template/Content";
import Footer from "./components/template/Footer";
import Loading from "./components/template/Loading";

export default {
  name: "App",
  components: {
    Header,
    NavBar,
    Content,
    Footer,
    Loading,
  },
  data: function () {
    return {
      validaToken: true,
    };
  },

  methods: {
    async validadorToken() {
      this.validaToken = true;
      const json = localStorage.getItem(usuarioChave); //PEGA O TOKEN QUE ESTA ARMAZENADO NA PAGINA
      const userData = JSON.parse(json);
      if (userData) {
        this.setHistoricoVisita(userData.nome_agenda);
      } else {
        this.setHistoricoVisita();
      }

      this.$store.commit("setUser", {});
      // SE O TOKEN TIVER VAZIO  PAUSA A FUNÇÃO, POIS, NÃO E NECESSARIO VALIDAR NADA.
      if (!userData) {
        this.validaToken = false;
        return;
      }

      const res = await axios.post(`${baseApiUrl}/validarToken`, userData); //VERIFICA SE O TOKEN AINDA É VALIDO

      if (res.data) {
        this.$store.commit("setUser", userData);
      } else {
        localStorage.removeItem(usuarioChave);
        this.$store.commit("setUser", {});
      }
      this.validaToken = false;
    },
    setHistoricoVisita(nome_usuario) {
      axios.post(`${baseApiUrl}/historico_visita`, {
        nome_usuario: nome_usuario,
      });
    },
  },
  async created() {
    this.validadorToken();
    this.$store.commit("setAppLogin", false);
  },
  computed: mapState(["user", "appLogin"]),
};
</script>

<style>
* {
  font-family: sans-serif, Arial;
  margin: 0px;
  padding: 0px;
  box-sizing: border-box;
}

.app {
  min-height: 100vh;
  width: 100%;
  display: grid;
  grid-template-rows: 60px 33px 1fr 50px;
  grid-template-columns: 1fr;
  grid-template-areas:
    "header"
    "navbar"
    "content"
    "footer";
}

.app-login {
  min-height: 100vh;
  width: 100%;
  display: grid;
  grid-template-rows: 1fr;
  grid-template-columns: 1fr;
  grid-template-areas: "content";
}
.bloq-selec-text {
  -webkit-touch-callout: none; /* iPhone OS, Safari */
  -webkit-user-select: none; /* Chrome, Safari 3 */
  -khtml-user-select: none; /* Safari 2 */
  -moz-user-select: none; /* Firefox */
  -ms-user-select: none; /* IE10+ */
}
button:active {
  outline-style: none !important;
  box-shadow: 0 0 0 0 !important;
  outline: 0 !important;
}
button:focus {
  outline-style: none !important;
  box-shadow: 0 0 0 0 !important;
  outline: 0 !important;
}
</style>
