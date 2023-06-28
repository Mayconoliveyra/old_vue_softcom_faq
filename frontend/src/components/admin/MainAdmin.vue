<template>
  <b-container fluid class="main-admin">
    <TituloCadastro icon="fa fa-cogs fa-lg" titulo="Painel Administrativo" :exibirBtnCadastro="false"
      @criarNovoCadastro="reset(), modeNavegar('save')" @cancelarCadastro="reset(), modeNavegar()" />
    <b-row class="mt-2">
      <b-col cols="12" sm="3">
        <b-button to="/admin_usuario" class="w-100 m-1">Usuário</b-button>
      </b-col>
      <b-col cols="12" sm="3">
        <b-button to="/admin_faq" class="w-100 m-1">Faq</b-button>
      </b-col>
      <b-col cols="12" sm="3">
        <b-button to="/admin_grupo_faq" class="w-100 m-1">Grupo Faq</b-button>
      </b-col>
      <b-col cols="12" sm="3">
        <b-button to="/admin_anotacoes" class="w-100 m-1">Anotações</b-button>
      </b-col>
      <b-col cols="12" sm="3" class="mt-2">
        <b-button to="/admin_jornada" class="w-100 m-1">Jornada</b-button>
      </b-col>
      <b-col cols="12" sm="3" class="mt-2">
        <b-button @click="atualizarFaq()" variant="warning" class="w-100 m-1">Atualizar FAQS</b-button>
      </b-col>
      <b-col cols="12" sm="3" class="mt-2">
        <b-button to="/admin_auditoria" class="w-100 m-1">Auditoria</b-button>
      </b-col>
    </b-row>
    <div class="iconPainelAdm">
      <i class="fa fa-cogs"></i>
    </div>
  </b-container>
</template>

<script>
import TituloCadastro from "./components/TituloCadastro";
import { baseApiUrl, showError, senhaAtualizacao } from "../../../global";
import axios from "axios";

export default {
  name: "MainAdmin",
  components: { TituloCadastro },
  methods: {
    atualizarFaq() {
      let senhaAtualizar = prompt("Digite a senha:");
      if (senhaAtualizar === senhaAtualizacao) {
        const url = `${baseApiUrl}/atualizar_faqs`;
        axios
          .get(url, {})
          .then(() => {
            this.$toasted.global.defaultSuccess();
          })
          .catch(showError);
      } else {
        alert("Senha incorreta!");
      }
    },
  },
};
</script>

<style scoped>
.main-admin {
  display: flex;
  flex-direction: column;
  height: 100%;
}

.main-admin .iconPainelAdm {
  width: 100%;
  flex: 1;
  font-size: 15rem;
  display: flex;
  align-items: center;
  justify-content: center;
  color: rgb(240, 240, 240);
}
</style>