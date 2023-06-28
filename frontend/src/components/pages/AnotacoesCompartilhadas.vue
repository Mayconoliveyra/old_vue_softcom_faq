<template>
  <div class="anotacoes-compartilhadas">
    <div v-if="mode == null">
      <b-row align-h="center" class="mt-2 mb-5 pb-4">
        <b-col cols="12" md="8" xl="6">
          <b-input-group size="md">
            <b-form-input
              id="filterInputFaqs"
              type="text"
              placeholder="Pesquisar..."
              label-align-sm="left"
              @keyup="keyUpFilter()"
              v-model="filterTemp"
            ></b-form-input>
            <b-input-group-append>
              <b-button
                type="button"
                :disabled="!filterTemp"
                @click="filterTemp='';loadAnotacoesCompartilhadas();"
              >X</b-button>
            </b-input-group-append>
          </b-input-group>
        </b-col>
      </b-row>
      <div class="mt-5">
        <AnotacaoExibir
          :anotacao="anotacao"
          v-for="anotacao in dataAnotacoesAll"
          :key="anotacao.codigo_anotacao"
          :exibirBotoes="false"
        />
        <div class="text-center pt-2 pb-3" v-if="!dataAnotacoesAll.length > 0 ">
          <h5>Não foi encontrado nenhum registro para os filtros informados!</h5>
        </div>
      </div>
      <div class="carregar-mais-mercadorias">
        <button v-if="totalAnotacoes>dataAnotacoesAll.length" @click="loadMaisAnotacoes()">VER MAIS</button>
      </div>
    </div>
  </div>
</template>

<script>
import AnotacaoExibir from "./components/AnotacaoExibir";
import { baseApiUrl, showError } from "../../../global";
import { mapState } from "vuex";
import axios from "axios";
export default {
  name: "anotacoesCompartilhadas",
  components: { AnotacaoExibir },
  data() {
    return {
      anotacao: {},
      dataAnotacoesAll: [],
      filterTemp: null,
      totalAnotacoes: 0,
      page: 1,
    };
  },
  methods: {
    loadAnotacoesCompartilhadas() {
      const url = `${baseApiUrl}/anotacao_compartilhadasAll/?page=1`;
      axios
        .put(url, { filtro: this.filterTemp })
        .then((res) => {
          this.totalAnotacoes = res.data.total_registros.total_registros;
          this.dataAnotacoesAll = res.data.anotacoes;
        })
        .catch(showError);
    },
    keyUpFilter() {
      clearTimeout(this.timeFilter);
      this.totalAnotacoes = 0;
      this.dataAnotacoesAll = [];
      this.page = 1;
      this.timeFilter = setTimeout(() => {
        const url = `${baseApiUrl}/anotacao_compartilhadasAll/?page=${this.page}`;
        axios
          .put(url, { filtro: this.filterTemp })
          .then((res) => {
            this.totalAnotacoes = res.data.total_registros.total_registros;
            this.dataAnotacoesAll = res.data.anotacoes;
          })
          .catch(showError);
      }, 300);
    },
    loadMaisAnotacoes() {
      this.page++;
      const url = `${baseApiUrl}/anotacao_compartilhadasAll/?page=${this.page}`;
      axios
        .put(url, { filtro: this.filterTemp })
        .then((res) => {
          this.totalAnotacoes = res.data.total_registros.total_registros;
          this.dataAnotacoesAll = this.dataAnotacoesAll.concat(
            res.data.anotacoes
          );
        })
        .catch(showError);
    },
  },
  created() {
    this.loadAnotacoesCompartilhadas();
  },
  computed: mapState(["user"]),
};
</script>

<style scoped>
.anotacoes-compartilhadas {
  height: 100%;
  width: 100%;
  overflow-x: hidden;
  padding: 2px 7px;
}
.anotacoes-compartilhadas .row-btn {
  display: flex;
  justify-content: center;
  width: 100%;
}
.anotacoes-compartilhadas .row-btn button {
  width: 23%;
}
.anotacoes-compartilhadas .row-btn button:last-child {
  margin-left: 25px;
}
.carregar-mais-mercadorias {
  display: flex;
  align-items: center;
  justify-content: center;
  margin-top: 50px;
  margin-bottom: 30px;
}
.carregar-mais-mercadorias button {
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 14px;
  color: rgb(255, 101, 0);
  text-decoration: underline;
  font-weight: bold;
  cursor: pointer;
  background: none;
  border: none;
}
</style>