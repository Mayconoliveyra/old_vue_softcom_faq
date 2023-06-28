<template>
  <b-container fluid class="modal-main-faq" v-show="modalFaqHelpVisivel">
    <button @click="fecharModal()" class="btn_fechar_modal">Fechar (x)</button>
    <ModalFaqHelpTools />
  </b-container>
</template>

<script>
import ModalFaqHelpTools from "./modalTempletes/ModalFaqHelpTools.vue";
import { mapState } from "vuex";
export default {
  name: "MainModalFaq",
  components: { ModalFaqHelpTools },
  data() {
    return {
      nmrFaqSelecionado: Number,
      perguntaFaqSeleionado: String,
    };
  },
  methods: {
    fecharModal() {
      this.$store.commit("setModalFaq", false);
      this.$store.commit("setUserVisible", true);
    },
    loadFaqHelpTools(nmrFaqHelpTools) {
      document.getElementById(
        "modal_faq"
      ).innerHTML = `<object class="w-100 h-100" type="text/html" data="http://201.16.182.209:10000/helptools2/public/core/promover/detalhe/id/${nmrFaqHelpTools}"></object>`;
    },
  },
  created() {
    this.$store.commit("setAppLogin", false);
    this.$root.$on("abrirModalFaqHelpTools", (nmrFaqHelpTools, perguntaFaq) => {
      this.nmrFaqSelecionado = Number(nmrFaqHelpTools);
      this.perguntaFaqSeleionado = String(perguntaFaq);
      this.loadFaqHelpTools(nmrFaqHelpTools);
    });
  },
  computed: mapState(["modalFaqHelpVisivel", "user"]),
};
</script>
<style scoped>
.modal-main-faq {
  height: 100%;
  position: fixed;
  padding: 64px 5px 5px 5px;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  color: #ffffff;
  background: rgba(68, 67, 67, 0.741);
  z-index: 99999;
  opacity: 1;
  -webkit-transition: opacity 400ms ease-in;
  -moz-transition: opacity 400ms ease-in;
  transition: opacity 400ms ease-in;
}
.modal-main-faq .btn_fechar_modal {
  position: absolute;
  width: 107px;
  height: 0px;
  right: 0px;
  top: 27px;
  font-size: 20px;
  font-weight: 600;
  color: #ffffff;
  background: none;
  border: none;
  text-align: center;
}
.modal-main-faq .btn_fechar_modal:focus {
  outline: none;
}
</style>


