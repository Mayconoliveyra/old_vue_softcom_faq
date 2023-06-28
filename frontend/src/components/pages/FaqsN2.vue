<template>
  <b-container
    fluid
    :class="{
      'faq-n2 pb-3 pt-2': !this.modalFaqHelpVisivel,
      'faq-n2 faq-n2-fixed pb-3': this.modalFaqHelpVisivel,
    }"
  >
    <MainModalFaq></MainModalFaq>
    <Loading v-if="loadPage" />
    <div v-else>
      <div>
        <InputPesquisaCadastro :segundosConfFilter="0" class="mb-5" />
        <TabelaExibicaoCadastro
          :dataCadastros="dataFaqsValidos"
          :totalRows="dataFaqsValidos.length"
          :fields="fieldsFaqsValidos"
          :filterOn="filterOn"
          :filterIgnored="filterIgnored"
        />
      </div>
    </div>
  </b-container>
</template>

<script>
import MainModalFaq from "./MainModalFaq";
import { baseApiUrl, showError } from "../../../global";
import Loading from "../template/Loading.vue";
import InputPesquisaCadastro from "./components/InputPesquisaCadastro";
import TabelaExibicaoCadastro from "./components/TabelaExibicaoCadastro";
import { mapState } from "vuex";
import axios from "axios";
export default {
  name: "FaqsN2",
  components: {
    Loading,
    MainModalFaq,
    InputPesquisaCadastro,
    TabelaExibicaoCadastro,
  },
  data() {
    return {
      loadPage: true,
      dataFaqsValidos: [],
      filterOn: [],
      filterIgnored: [
        "registro",
        "pergunta",
        "grupo",
        "auto_import",
        "status",
        "valido_n2",
        "valido_n1",
      ],
      fieldsFaqsValidos: [
        {
          key: "registro",
          label: "Faq",
          sortable: true,
          class: "text-center",
          thStyle: { width: "100px" },
        },
        {
          key: "pergunta",
          label: "Pergunta/Solução",
        },
      ],
    };
  },
  methods: {
    onFiltered(filteredItems) {
      this.totalRows = filteredItems.length;
      this.currentPage = 1;
    },
    loadFaqsValidos() {
      const urlFaqsAll = `${baseApiUrl}/get_faqs_n2`;
      axios
        .get(urlFaqsAll)
        .then((res) => {
          this.dataFaqsValidos = res.data;
          this.loadPage = false;
        })
        .catch(showError);
    },
  },
  created() {
    this.loadFaqsValidos();
    this.$store.commit("setAppLogin", false);
  },
  computed: mapState(["user", "modalFaqHelpVisivel"]),
};
</script>


<style>
.faq-n2 {
  height: 100%;
}
</style>
