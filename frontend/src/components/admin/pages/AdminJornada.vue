<template>
  <b-container fluid class="admin-jornada">
    <TituloCadastro
      icon="fa fa-trophy fa-lg"
      titulo="ADM > Jornada"
      :exibirBtnCadastro="false"
      @criarNovoCadastro="reset(), modeNavegar('save')"
      @cancelarCadastro="reset(), modeNavegar()"
      :mode="mode"
    />
    <div v-if="mode !== null">
      <b-form v-if="mode !== 'null'" class="p-4">
        <input
          type="hidden"
          id="funcionario-id"
          v-model="funcionario.codigo_funcionario"
        />
        <b-row>
          <b-col cols="6" md="2">
            <b-form-group label="Status" label-form="funcionario-status">
              <b-form-select
                id="funcionario-status"
                type="text"
                v-model="funcionario.status"
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
              label-form="funcionario-codigo"
            >
              <b-form-input
                id="funcionario-codigo"
                class="text-center"
                type="text"
                v-model="funcionario.codigo_funcionario"
                required
                readonly
              />
            </b-form-group>
          </b-col>
          <b-col cols="12" md="8">
            <b-form-group
              label="Nome Agenda"
              label-form="funcionario-nome-agenda"
            >
              <b-form-input
                id="funcionario-nome-agenda"
                type="text"
                v-model="funcionario.nome_suporte"
                required
                readonly
              />
            </b-form-group>
          </b-col>
          <b-col cols="3">
            <b-form-group label="Setor" label-form="funcionario-setor">
              <b-form-input
                id="funcionario-setor"
                type="text"
                v-model="funcionario.setor"
                required
                readonly
              />
            </b-form-group>
          </b-col>
          <b-col cols="3">
            <b-form-group label="Sub-setor" label-form="funcionario-sub-setor">
              <b-form-input
                id="funcionario-sub-setor"
                type="text"
                v-model="funcionario.subsetor"
                required
                readonly
              />
            </b-form-group>
          </b-col>
          <b-col cols="2">
            <b-form-group label="Insignias" label-form="funcionario-insignias">
              <b-form-input
                id="funcionario-insignias"
                type="text"
                v-model="funcionario.qtd_insignia"
                required
                readonly
              />
            </b-form-group>
          </b-col>
          <b-col cols="3">
            <b-form-group
              label="Personagem"
              label-form="funcionario-personagem"
            >
              <b-form-select
                id="funcionario-personagem"
                type="text"
                v-model="funcionario.personagem_gif"
                required
                readonly
                :options="dataPersonagens"
              />
            </b-form-group>
          </b-col>
          <b-col cols="1" class="img-personagem">
            <img
              :src="
                require(`../../../assets/${funcionario.personagem_gif}.gif`)
              "
              :alt="funcionario.nome_suporte"
            />
          </b-col>
        </b-row>

        <BtnAcaoCadastros :mode="mode" @salvarRegistro="save()" />
      </b-form>
    </div>
    <div v-show="mode == null">
      <InputPesquisaCadastro />
      <TabelaExibicaoCadastro
        :dataCadastros="dataFuncionarios"
        :totalRows="dataFuncionarios.length"
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
  name: "AdminJornada",
  components: {
    TituloCadastro,
    InputPesquisaCadastro,
    TabelaExibicaoCadastro,
    BtnAcaoCadastros,
  },
  data() {
    return {
      funcionario: {},
      dataFuncionarios: [],
      dataPersonagens: [
        "001",
        "002",
        "003",
        "004",
        "005",
        "006",
        "007",
        "008",
        "009",
        "010",
        "011",
        "012",
        "013",
        "014",
        "015",
        "016",
        "Ekko",
        "Fiddlestick",
        "Jayce",
      ],
      mode: null,
      filterOn: [],
      filterIgnored: [],
      fields: [
        {
          key: "codigo_funcionario",
          label: "Código",
          class: "text-center",
          sortable: true,
          sortDirection: "desc",
        },
        {
          key: "nome_suporte",
          label: "Nome",
          sortable: true,
        },
        {
          key: "setor",
          label: "Setor",
          sortable: true,
        },
        {
          key: "subsetor",
          label: "Sub-setor",
          sortable: true,
        },
        {
          key: "qtd_insignia",
          label: "Insígnias",
          class: "text-center",
          sortable: true,
        },
        {
          key: "personagem_gif",
          label: "Personagem",
          class: "text-center",
          sortable: true,
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
      this.mode = mode;
    },
    loadFuncionarios() {
      axios
        .get(`${baseApiUrl}/jornada_funcionarios`)
        .then((res) => {
          this.dataFuncionarios = res.data[0];
          this.totalRows = res.data.length;
        })
        .catch(showError);
    },
    loadFuncionario(funcionario, mode = "null") {
      if (funcionario.codigo_funcionario) {
        this.mode = mode;
        this.funcionario = funcionario;
      }
    },
    save() {
      const id = this.funcionario.codigo_funcionario;
      const url = `${baseApiUrl}/jornada_funcionarios/${id}`;

      const modelofuncionario = {
        codigo_funcionario: this.funcionario.codigo_funcionario,
        status: this.funcionario.status,
        personagem_gif: this.funcionario.personagem_gif,
      };

      axios
        .put(url, modelofuncionario)
        .then(() => {
          this.$toasted.global.defaultSuccess();
          this.reset();
        })
        .catch(showError);
    },
    reset() {
      this.mode = null;
      this.funcionario = {};
      this.loadFuncionarios();
    },
  },
  created() {
    this.loadFuncionarios();
    // AO CLICAR NO BOTÃO DE ALTERAR OU EXCLUIR NA "TabelaExibicaoCadastro", ESSA FUNÇÃO É EXECUTADA
    this.$root.$on("carregaRegistro", (registro, mode) => {
      this.loadFuncionario(registro, mode);
    });
  },
};
</script>

<style>
.admin-jornada {
  height: 100%;
}
.img-personagem {
  margin: 0px;
  padding: 0px;
}
.img-personagem img {
  width: 50px;
  margin-top: 7px;
  margin-left: 5px;
}
.trStatus {
  width: 80px;
  text-align: center;
}
</style>