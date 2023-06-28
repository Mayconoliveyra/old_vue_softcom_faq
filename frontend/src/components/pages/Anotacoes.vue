<template>
  <div class="anotacoes-usuario">
    <TituloCadastro
      icon="fa fa-pencil-square-o fa-lg"
      titulo="Minhas anotações"
      :btnAcao="true"
      @criarNovoCadastro="reset();mode = 'save'"
      @cancelarCadastro="reset(), (mode = null)"
      :mode="mode"
    />
    <div v-if="mode == null">
      <b-row align-h="center" class="mt-0 mb-5 pb-4">
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
                @click="filterTemp='';loadAnotaoesAllUser();"
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
          :exibirBotoes="true"
        />
        <div class="text-center pt-2 pb-3" v-if="!dataAnotacoesAll.length > 0 ">
          <h5>Não foi encontrado nenhum registro para os filtros informados!</h5>
        </div>
      </div>
      <div class="carregar-mais-mercadorias">
        <button v-if="totalAnotacoes>dataAnotacoesAll.length" @click="loadMaisAnotacoes()">VER MAIS</button>
      </div>
    </div>
    <div v-if="mode == 'save' || mode == 'remove'">
      <b-form class="mt-0 p-1">
        <input id="id-anotacao" type="hidden" v-model="anotacao.codigo_anotacao" />
        <b-row>
          <b-col cols="12">
            <b-form-group label-size="sm" label="Sintoma*" label-form="anotacao-sintoma">
              <b-form-textarea
                id="anotacao-sintoma"
                v-model="anotacao.sintoma"
                :disabled="mode == 'remove'"
                rows="4"
              ></b-form-textarea>
            </b-form-group>
          </b-col>
          <b-col cols="3">
            <b-form-group label-size="sm" label="FAQ" label-form="anotacao-faqs">
              <b-form-tags
                id="anotacao-nmr-faq"
                v-model="anotacao.faqs"
                placeholder
                tag-pills
                tag-variant="warning"
                size="md"
                :disabled="mode == 'remove'"
              ></b-form-tags>
            </b-form-group>
          </b-col>
          <b-col cols="3">
            <b-form-group label-size="sm" label="Software" label-form="anotacao-software">
              <b-form-select size="md" v-model="anotacao.software" :disabled="mode == 'remove'">
                <option value="Selecione">Selecione</option>
                <option
                  v-for="(option, index) in dataSoftwares"
                  :value="option.nome"
                  :key="index"
                >{{ option.nome}}</option>
              </b-form-select>
            </b-form-group>
          </b-col>
          <b-col cols="3">
            <b-form-group label-size="sm" label="Categoria" label-form="anotacao-categoria">
              <b-form-select size="md" v-model="anotacao.categoria" :disabled="mode == 'remove'">
                <option value="Selecione">Selecione</option>
                <option
                  v-for="(option, index) in dataCategorias"
                  :value="option.nome"
                  :key="index"
                >{{ option.nome}}</option>
              </b-form-select>
            </b-form-group>
          </b-col>
          <b-col cols="3">
            <b-form-group label-size="sm" label="Dificuldade" label-form="anotacao-dificuldade">
              <b-form-select size="md" v-model="anotacao.dificuldade" :disabled="mode == 'remove'">
                <option value="Selecione">Selecione</option>
                <option
                  v-for="(option, index) in dataDificuldades"
                  :value="option.nome"
                  :key="index"
                >{{ option.nome}}</option>
              </b-form-select>
            </b-form-group>
          </b-col>

          <b-col cols="12">
            <b-form-group label-size="sm" label="Solução*" label-form="anotacao-solucao">
              <VueEditor
                :disabled="mode == 'remove'"
                id="anotacao-solucao"
                v-model="anotacao.solucao"
              />
            </b-form-group>
          </b-col>
          <b-col cols="12">
            <b-form-group label-form="usuario-compartilha">
              <b-form-checkbox
                switch
                size="md"
                value="1"
                unchecked-value="0"
                id="usuario-compartilha"
                v-model="anotacao.compartilhar"
                :disabled="mode == 'remove'"
              >Compartilhar</b-form-checkbox>
            </b-form-group>
          </b-col>
          <b-row
            :class="{
              'row-btn m-5 text-center': this.$mq !== 'sm',
              'row-btn-sm': this.$mq === 'sm',
            }"
          >
            <b-button @click="save()" variant="success" v-if="mode === 'save'">
              <i class="fa fa-check"></i> Salvar
            </b-button>
            <b-button @click="remove()" variant="danger" v-else>
              <i class="fa fa-trash-o"></i> Excluir
            </b-button>
            <b-button @click="reset()" variant="warning">
              <i class="fa fa-times"></i> Cancelar
            </b-button>
          </b-row>
        </b-row>
      </b-form>
    </div>
  </div>
</template>

<script>
import TituloCadastro from "./components/TituloCadastro";
import AnotacaoExibir from "./components/AnotacaoExibir";
import { baseApiUrl, showError } from "../../../global";
import { mapState } from "vuex";
import { VueEditor } from "vue2-editor";
import axios from "axios";
export default {
  name: "anotacoesUsuarioTodas",
  components: { VueEditor, TituloCadastro, AnotacaoExibir },
  data() {
    return {
      anotacao: {},
      dataAnotacoesAll: [],
      dataCategorias: [],
      dataSoftwares: [],
      dataDificuldades: [],
      mode: null,
      filterTemp: null,
      totalAnotacoes: 0,
      page: 1,
    };
  },
  methods: {
    loadAnotaoesAllUser() {
      const url = `${baseApiUrl}/anotacaoAllUserAnotacao/${this.user.codigo_usuario}?page=1`;
      axios
        .put(url, { filtro: this.filterTemp })
        .then((res) => {
          this.totalAnotacoes = res.data.total_registros.total_registros;
          this.dataAnotacoesAll = res.data.anotacoes;
          this.dataSoftwares = res.data.softwares;
          this.dataCategorias = res.data.categorias;
          this.dataDificuldades = res.data.dificuldades;
        })
        .catch(showError);
    },
    loadAnotacao(anotacao, mode = "null") {
      this.mode = mode;
      this.anotacao = anotacao;
      this.anotacao.faqs = JSON.parse(anotacao.faqs);
    },
    save() {
      this.anotacao.id_usuario = this.user.codigo_usuario;
      const id = this.anotacao.codigo_anotacao
        ? `/${this.anotacao.codigo_anotacao}`
        : "";
      const url = `${baseApiUrl}/anotacao${id}`;
      const method = this.anotacao.codigo_anotacao ? "put" : "post";

      axios[method](url, this.anotacao)
        .then(() => {
          this.$toasted.global.defaultSuccess();
          this.reset();
        })
        .catch(showError);
    },
    remove() {
      const url = `${baseApiUrl}/anotacao/${this.anotacao.codigo_anotacao}`;
      axios
        .delete(url)
        .then(() => {
          this.$toasted.global.defaultSuccess();
          this.reset();
        })
        .catch(showError);
    },
    reset() {
      this.anotacao = {};
      this.anotacao.categoria = "Selecione";
      this.anotacao.software = "Selecione";
      this.anotacao.dificuldade = "Selecione";
      this.anotacao.faqs = [""];
      this.mode = null;
      this.loadAnotaoesAllUser();
    },
    keyUpFilter() {
      clearTimeout(this.timeFilter);
      this.totalAnotacoes = 0;
      this.dataAnotacoesAll = [];
      this.page = 1;
      this.timeFilter = setTimeout(() => {
        const url = `${baseApiUrl}/anotacaoAllUserAnotacao/${this.user.codigo_usuario}?page=${this.page}`;
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
      const url = `${baseApiUrl}/anotacaoAllUserAnotacao/${this.user.codigo_usuario}?page=${this.page}`;
      axios
        .put(url, { filtro: this.filterTemp })
        .then((res) => {
          this.totalAnotacoes = res.data.total_registros.total_registros;
          this.dataAnotacoesAll = this.dataAnotacoesAll.concat(
            res.data.anotacoes
          );
          this.dataSoftwares = res.data.softwares;
          this.dataCategorias = res.data.categorias;
          this.dataDificuldades = res.data.dificuldades;
        })
        .catch(showError);
    },
  },
  created() {
    this.loadAnotaoesAllUser();
    this.$store.commit("setAppLogin", false);
    this.$root.$on("load_anotacao", (anotacao, mode) => {
      this.loadAnotacao(anotacao, mode);
    });
  },
  computed: mapState(["user"]),
};
</script>

<style scoped>
.anotacoes-usuario {
  height: 100%;
  width: 100%;
  overflow-x: hidden;
  padding: 2px 7px;
}
.anotacoes-usuario .row-btn {
  display: flex;
  justify-content: center;
  width: 100%;
}
.anotacoes-usuario .row-btn button {
  width: 23%;
}
.anotacoes-usuario .row-btn button:last-child {
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