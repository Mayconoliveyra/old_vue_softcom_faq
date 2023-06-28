<template>
  <b-container fluid class="admin-usuario">
    <TituloCadastro
      icon="fa fa-address-book-o fa-lg"
      titulo="ADM > Usuários"
      :exibirBtnCadastro="true"
      @criarNovoCadastro="reset(), modeNavegar('save')"
      @cancelarCadastro="reset(), modeNavegar()"
      :mode="mode"
    />
    <div v-if="mode !== null">
      <b-form v-if="mode !== 'null'" class="p-4">
        <input type="hidden" id="usuario-id" v-model="usuario.codigo_usuario" />
        <b-row>
          <b-col cols="6" md="2">
            <b-form-group label="Status" label-form="usuario-status">
              <b-form-select
                id="usuario-status"
                type="text"
                v-model="usuario.status"
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
              label-form="usuario-codigo"
            >
              <b-form-input
                id="usuario-codigo"
                class="text-center"
                type="text"
                v-model="usuario.codigo_usuario"
                required
                readonly
              />
            </b-form-group>
          </b-col>
          <b-col cols="12" md="8">
            <b-form-group label="Nome Agenda" label-form="usuario-nome-agenda">
              <b-form-input
                id="usuario-nome-agenda"
                type="text"
                v-model="usuario.nome_agenda"
                required
                :readonly="mode == 'remove'"
              />
            </b-form-group>
          </b-col>
          <b-col cols="2">
            <b-form-group
              label="ADM"
              class="text-center"
              label-form="usuario-adm"
            >
              <b-form-checkbox
                id="usuario-adm"
                class="text-certer"
                size="lg"
                v-model="usuario.admin"
                name="usuario-adm"
                value="1"
                :unchecked-value="0"
                :disabled="mode == 'remove'"
              ></b-form-checkbox>
            </b-form-group>
          </b-col>
          <b-col cols="10" md="10">
            <b-form-group label="E-mail" label-form="usuario-email">
              <b-form-input
                id="usuario-email"
                type="text"
                v-model="usuario.email"
                required
                :readonly="mode == 'remove'"
              />
            </b-form-group>
          </b-col>
          <b-col cols="3" md="2" v-if="mode == 'save'">
            <b-form-group
              label="Def. Senha"
              class="text-center"
              label-form="usuario-definir-senha"
            >
              <b-form-checkbox
                id="usuario-definir-senha"
                class="text-certer"
                size="lg"
                v-model="usuario.defSenha"
                name="usuario-def-senha"
                value="1"
                :unchecked-value="0"
                :disabled="mode == 'remove'"
              ></b-form-checkbox>
            </b-form-group>
          </b-col>
          <b-col cols="9" md="5" v-if="mode == 'save'">
            <b-form-group label="Senha" label-form="usuario-senha">
              <b-form-input
                id="usuario-senha"
                type="password"
                v-model="usuario.senha"
                required
                :readonly="mode == 'remove' || !this.usuario.defSenha"
              />
            </b-form-group>
          </b-col>
          <b-col cols="12" md="5" v-if="mode == 'save'">
            <b-form-group
              label="Confirma Senha"
              label-form="usuario-confirma-senha"
            >
              <b-form-input
                id="usuario-confirma-senha"
                type="password"
                v-model="usuario.senha"
                required
                :readonly="mode == 'remove' || !this.usuario.defSenha"
              />
            </b-form-group>
          </b-col>
        </b-row>
        <BtnAcaoCadastros :mode="mode" @salvarRegistro="save()" />
      </b-form>
    </div>
    <div v-show="mode == null">
      <InputPesquisaCadastro />
      <TabelaExibicaoCadastro
        :dataCadastros="dataUsuarios"
        :totalRows="dataUsuarios.length"
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
  name: "AdminUsuario",
  components: {
    TituloCadastro,
    InputPesquisaCadastro,
    TabelaExibicaoCadastro,
    BtnAcaoCadastros,
  },
  data() {
    return {
      usuario: {},
      dataUsuarios: [],
      mode: null,
      filterOn: [],
      filterIgnored: [],
      fields: [
        {
          key: "codigo_usuario",
          label: "Código",
          sortable: true,
          class: "text-center",
          sortDirection: "desc",
        },
        {
          key: "nome_agenda",
          label: "Nome",
          sortable: true,
        },
        {
          key: "email",
          label: "E-mail",
          sortable: true,
        },
        {
          key: "admin",
          label: "Administrador",
          sortable: true,
          class: "text-center",
          formatter: (value) => {
            return value ? "Sim" : "Não";
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
        this.usuario = {
          status: "Ativo",
        };
      }
      this.mode = mode;
    },
    loadUsuarios() {
      axios
        .get(`${baseApiUrl}/conta_adm`)
        .then((res) => {
          this.dataUsuarios = res.data;
          this.totalRowsUsuario = res.data.length;
        })
        .catch(showError);
    },
    loadUsuario(usuario, mode = "null") {
      if (usuario.codigo_usuario) {
        this.mode = mode;
        this.usuario = usuario;
      }
    },
    save() {
      const id = this.usuario.codigo_usuario
        ? `/${this.usuario.codigo_usuario}`
        : "";
      const url = `${baseApiUrl}/conta_adm${id}`;
      const method = this.usuario.codigo_usuario ? "put" : "post";

      const modeloUsuario = {
        status: this.usuario.status,
        codigo_usuario: this.usuario.codigo_usuario,
        nome_agenda: this.usuario.nome_agenda,
        email: this.usuario.email,
        admin: this.usuario.admin,
        senha: this.usuario.senha,
        confirmaSenha: this.usuario.senha,
        defSenha: this.usuario.defSenha,
      };

      axios[method](url, modeloUsuario)
        .then(() => {
          this.$toasted.global.defaultSuccess();
          this.reset();
        })
        .catch(showError);
    },
    reset() {
      this.mode = null;
      this.usuario = {};
      this.loadUsuarios();
    },
  },
  created() {
    this.loadUsuarios();
    // AO CLICAR NO BOTÃO DE ALTERAR OU EXCLUIR NA "TabelaExibicaoCadastro", ESSA FUNÇÃO É EXECUTADA
    this.$root.$on("carregaRegistro", (registro, mode) => {
      this.loadUsuario(registro, mode);
    });
  },
};
</script>

<style scoped>
.admin-usuario {
  height: 100%;
}
</style>