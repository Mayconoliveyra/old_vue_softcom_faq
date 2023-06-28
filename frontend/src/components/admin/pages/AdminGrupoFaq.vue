<template>
  <b-container fluid class="admin-grupo-faq">
    <TituloCadastro
      icon="fa fa-address-book-o fa-lg"
      titulo="ADM > Grupos Faq"
      :exibirBtnCadastro="true"
      @criarNovoCadastro="reset(), modeNavegar('save')"
      @cancelarCadastro="reset(), modeNavegar()"
      :mode="mode"
    />
    <div v-if="mode !== null">
      <b-form v-if="mode !== 'null'" class="m-2">
        <input type="hidden" id="grupo-id" v-model="grupo.codigo_grupo" />
        <b-row>
          <b-col cols="6" md="2">
            <b-form-group label="Status" label-form="grupo-status">
              <b-form-select
                id="grupo-status"
                type="text"
                v-model="grupo.status"
                required
                readonly
                :options="['Ativo', 'Inativo']"
              />
            </b-form-group>
          </b-col>
          <b-col cols="6" md="2">
            <b-form-group
              label="Código"
              class="text-center"
              label-form="grupo-id"
            >
              <b-form-input
                id="grupo-id"
                class="text-center"
                type="text"
                v-model="grupo.codigo_grupo"
                required
                readonly
              />
            </b-form-group>
          </b-col>
          <b-col cols="8">
            <b-form-group label="Nome" label-form="grupo-nome">
              <b-form-input
                id="grupo-nome"
                type="text"
                v-model="grupo.nome_grupo"
                required
                :readonly="mode == 'remove'"
              />
            </b-form-group>
          </b-col>
          <b-col cols="2">
            <b-form-group label-form="faq-valido" class="mt-4">
              <b-form-checkbox
                switch
                size="lg"
                value="1"
                unchecked-value="0"
                id="faq-valido"
                v-model="grupo.grupo_valido"
                :disabled="mode == 'remove'"
                >Válido</b-form-checkbox
              >
            </b-form-group>
          </b-col>
        </b-row>
        <BtnAcaoCadastros :mode="mode" @salvarRegistro="save()" />
      </b-form>
    </div>
    <div v-show="mode == null">
      <InputPesquisaCadastro />
      <TabelaExibicaoCadastro
        :dataCadastros="dataGrupos"
        :totalRows="dataGrupos.length"
        :fields="fields"
        :filterOn="filterOn"
        :filterIgnored="filterIgnored"
      />
    </div>
  </b-container>
</template>

<script>
import { baseApiUrl, showError } from "../../../../global";
import axios from "axios";
import TituloCadastro from "../components/TituloCadastro";
import InputPesquisaCadastro from "../components/InputPesquisaCadastro";
import TabelaExibicaoCadastro from "../components/TabelaExibicaoCadastro";
import BtnAcaoCadastros from "../components/BtnAcaoCadastros";
export default {
  name: "AdminGrupo",
  components: {
    TituloCadastro,
    InputPesquisaCadastro,
    TabelaExibicaoCadastro,
    BtnAcaoCadastros,
  },
  data() {
    return {
      grupo: {},
      dataGrupos: [],
      mode: null,
      filterOn: [],
      filterIgnored: [],
      fields: [
        {
          key: "codigo_grupo",
          label: "Código",
          class: "text-center",
          sortable: true,
          sortDirection: "desc",
        },
        {
          key: "nome_grupo",
          label: "Nome",
          sortable: true,
        },
        {
          key: "grupo_valido",
          label: "Válido",
          sortable: true,
          class: "text-center",
          formatter: (valor) => {
            return valor ? "Sim" : "Não";
          },
        },
        {
          key: "status",
          label: "Status",
          class: "trStatus",
          sortable: true,
        },
      ],
    };
  },
  methods: {
    modeNavegar(mode = null) {
      // SE O MODO FOR SALVAR, SETA OS CAMPOS PADRÃO NO FORMULARIO
      if (mode == "save") {
        this.grupo = {
          status: "Ativo",
        };
      }
      this.mode = mode;
    },
    loadGrupos() {
      axios
        .get(`${baseApiUrl}/adm_grupo_faq`)
        .then((res) => {
          this.dataGrupos = res.data;
        })
        .catch(showError);
    },
    loadgrupo(grupo, mode = "null") {
      if (grupo.codigo_grupo) {
        this.mode = mode;
        this.grupo = grupo;
      }
    },
    save() {
      const id = this.grupo.codigo_grupo ? `/${this.grupo.codigo_grupo}` : "";
      const url = `${baseApiUrl}/adm_grupo_faq${id}`;
      const method = this.grupo.codigo_grupo ? "put" : "post";

      const modelogrupo = {
        nome_grupo: this.grupo.nome_grupo,
        grupo_valido: this.grupo.grupo_valido,
        status: this.grupo.status,
      };

      axios[method](url, modelogrupo)
        .then(() => {
          this.$toasted.global.defaultSuccess();
          this.reset();
        })
        .catch(showError);
    },
    reset() {
      this.mode = null;
      this.grupo = {};
      this.loadGrupos();
    },
  },
  created() {
    this.loadGrupos();
    // AO CLICAR NO BOTÃO DE ALTERAR OU EXCLUIR NA "TabelaExibicaoCadastro", ESSA FUNÇÃO É EXECUTADA
    this.$root.$on("carregaRegistro", (registro, mode) => {
      this.loadgrupo(registro, mode);
    });
  },
};
</script>

<style scoped>
.admin-grupo-faq {
  height: 100%;
}
</style>