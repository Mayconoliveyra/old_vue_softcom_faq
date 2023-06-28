<template>
  <b-container fluid class="admin-faq">
    <TituloCadastro
      icon="fa fa-newspaper-o fa-lg"
      titulo="ADM > Faq"
      :exibirBtnCadastro="true"
      @criarNovoCadastro="reset(), modeNavegar('save')"
      @cancelarCadastro="reset(), modeNavegar()"
      :mode="mode"
    />
    <div v-if="mode !== null">
      <b-form v-if="mode !== 'null'" class="m-2">
        <input type="hidden" id="faq-id" v-model="faq.registro" />
        <b-row>
          <b-col cols="6" md="2">
            <b-form-group label="Status" label-form="faq-status">
              <b-form-select
                id="faq-status"
                type="text"
                v-model="faq.status"
                required
                readonly
                :options="['Ativo', 'Inativo']"
              />
            </b-form-group>
          </b-col>
          <b-col cols="6" md="2">
            <b-form-group label="Faq" label-form="faq-faq-agenda">
              <b-form-input
                id="faq-faq-agenda"
                type="text"
                v-model="faq.registro"
                required
                :readonly="faq.registro && faq.grupo && faq.pergunta"
              />
            </b-form-group>
          </b-col>
          <b-col cols="12" md="8">
            <b-form-group label="Grupo" label-form="faq-grupo">
              <b-form-select
                size="md"
                v-model="faq.grupo"
                required
                :options="filtroFaqGrupo"
                :disabled="mode == 'remove'"
              ></b-form-select>
            </b-form-group>
          </b-col>
          <b-col cols="12">
            <b-form-group label-form="faq-auto-import" class="mt-2">
              <b-form-checkbox
                switch
                size="lg"
                value="1"
                unchecked-value="0"
                id="faq-auto-import"
                v-model="faq.auto_import"
                :disabled="mode == 'remove'"
                >Auto Import</b-form-checkbox
              >
            </b-form-group>
          </b-col>
          <b-col cols="12">
            <b-form-group label-form="faq-valido-n1" class="mt-0">
              <b-form-checkbox
                switch
                size="lg"
                value="1"
                unchecked-value="0"
                id="faq-valido-n1"
                v-model="faq.valido_n1"
                :disabled="mode == 'remove'"
                >Válido N1</b-form-checkbox
              >
            </b-form-group>
          </b-col>
          <b-col cols="12">
            <b-form-group label-form="faq-valido-n2" class="mt-0">
              <b-form-checkbox
                switch
                size="lg"
                value="1"
                unchecked-value="0"
                id="faq-valido-n2"
                v-model="faq.valido_n2"
                :disabled="mode == 'remove'"
                >Válido N2</b-form-checkbox
              >
            </b-form-group>
          </b-col>

          <b-col cols="12">
            <b-form-group label="Pergunta" label-form="faq-perguta">
              <b-form-textarea
                id="faq-perguta"
                v-model="faq.pergunta"
                rows="4"
                max-rows="6"
                required
                :readonly="mode == 'remove'"
              ></b-form-textarea>
            </b-form-group>
          </b-col>
        </b-row>
        <BtnAcaoCadastros :mode="mode" @salvarRegistro="save()" />
      </b-form>
    </div>
    <div v-show="mode == null">
      <InputPesquisaCadastro />
      <TabelaExibicaoCadastro
        :dataCadastros="dataFaq"
        :totalRows="dataFaq.length"
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
  name: "AdminFaq",
  components: {
    TituloCadastro,
    InputPesquisaCadastro,
    TabelaExibicaoCadastro,
    BtnAcaoCadastros,
  },
  data() {
    return {
      faq: {},
      dataFaq: [],
      filtroFaqGrupo: [],
      mode: null,
      filterOn: [],
      filterIgnored: [],
      fields: [
        {
          key: "registro",
          label: "Faq",
          sortable: true,
          class: "trFaq",
          sortDirection: "desc",
        },
        {
          key: "grupo",
          label: "Grupo",
          sortable: true,
          class: "trGrupo",
        },
        {
          key: "pergunta",
          label: "Descrição",
          sortable: true,
        },
        {
          key: "valido_n2",
          label: "N2",
          sortable: true,
          formatter: (valor) => {
            return valor ? "Sim" : "Não";
          },
        },
        {
          key: "auto_import",
          label: "AutoImport",
          sortable: true,
          class: "trAutoImport",
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
        this.faq = {
          status: "Ativo",
          auto_import: 0,
        };
      }
      this.mode = mode;
    },
    loadfaqs() {
      axios
        .get(`${baseApiUrl}/adm_faq`)
        .then((res) => {
          this.dataFaq = res.data;
        })
        .catch(showError);
    },
    loadfaq(faq, mode = "null") {
      if (faq.registro) {
        this.mode = mode;
        this.faq = faq;
      }
    },
    loadGruposFaq() {
      const urlFaqGrupo = `${baseApiUrl}/get_faqs_grupos`;
      axios
        .get(urlFaqGrupo)
        .then((res) => {
          res.data.map((faq) => {
            this.filtroFaqGrupo.push(faq.nome_grupo);
          });
        })
        .catch(showError);
    },
    save() {
      const id = this.faq.registro ? `/${this.faq.registro}` : "";
      const url = `${baseApiUrl}/adm_faq${id}`;
      const method = this.faq.registro ? "put" : "post";
      const modeloFaq = {
        registro: this.faq.registro,
        pergunta: this.faq.pergunta,
        grupo: this.faq.grupo,
        auto_import: this.faq.auto_import,
        valido_n1: this.faq.valido_n1,
        valido_n2: this.faq.valido_n2,
        status: this.faq.status,
      };
      axios[method](url, modeloFaq)
        .then(() => {
          this.$toasted.global.defaultSuccess();
          this.reset();
        })
        .catch(showError);
    },
    reset() {
      this.mode = null;
      this.faq = {};
      this.loadfaqs();
    },
  },
  created() {
    this.loadGruposFaq();
    this.loadfaqs();
    // AO CLICAR NO BOTÃO DE ALTERAR OU EXCLUIR NA "TabelaExibicaoCadastro", ESSA FUNÇÃO É EXECUTADA
    this.$root.$on("carregaRegistro", (registro, mode) => {
      this.loadfaq(registro, mode);
    });
  },
};
</script>

<style>
.admin-faq {
  height: 100%;
}
.trStatus {
  width: 80px;
  text-align: center;
}
.trFaq {
  width: 90px;
  text-align: center;
}
.trGrupo {
  width: 160px;
  white-space: nowrap;
  overflow: hidden !important;
  text-overflow: ellipsis;
}
.trAutoImport {
  width: 90px;
  text-align: center;
}
</style>