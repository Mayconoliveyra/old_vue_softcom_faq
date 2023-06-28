<template>
  <b-container
    fluid
    :class="{
      'todos-faqs pb-3 pt-2': !this.modalFaqHelpVisivel,
      'todos-faqs todos-faqs-fixed pb-3': this.modalFaqHelpVisivel,
    }"
  >
    <MainModalFaq></MainModalFaq>
    <Loading v-if="loadPage" />
    <div v-else>
      <div>
        <InputPesquisaCadastro :segundosConfFilter="500" class="mb-5" />
        <TabelaExibicaoCadastro
          :dataCadastros="dataFaqsAll"
          :totalRows="dataFaqsAll.length"
          :fields="fieldsFaqs"
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
  name: "TodosFaqs",
  components: {
    Loading,
    MainModalFaq,
    InputPesquisaCadastro,
    TabelaExibicaoCadastro,
  },
  data() {
    return {
      loadPage: true,
      dataFaqsAll: [],
      filtroFaqGrupo: [],
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
      fieldsFaqs: [
        {
          key: "grupo",
          label: "Grupo",
          sortable: true,
          sortDirection: "desc",
          thStyle: { width: "150px" },
        },
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
    loadFaqsAll() {
      const urlFaqsAll = `${baseApiUrl}/get_faqs_all`;
      axios
        .get(urlFaqsAll)
        .then((res) => {
          this.dataFaqsAll = res.data;
          this.loadPage = false;
        })
        .catch(showError);
    },
  },
  created() {
    this.loadFaqsAll();
    this.$store.commit("setAppLogin", false);
  },
  computed: mapState(["user", "modalFaqHelpVisivel"]),
};
</script>

<style>
.todos-faqs {
  height: 100%;
}
</style>
