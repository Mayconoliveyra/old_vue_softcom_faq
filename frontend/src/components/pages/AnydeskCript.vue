<template>
  <b-container fluid class="anydesk">
    <TituloCadastro
      icon="fa fa-link fa-lg"
      titulo="Criptografia AnyDesk"
      :btnAcao="false"
    />
    <b-row align-h="center" class="mr-1 ml-1">
      <b-col cols="12" md="5" class="container-any-cliente mt-3">
        <h5 class="w-100 text-danger mb-0">Área remota do cliente</h5>
        <small class="w-100 mb-3"
          >Preencha com o acesso AnyDesk do cliente.</small
        >
        <b-form-input
          type="text"
          autocomplete="off"
          maxlength="40"
          @click="senhaAnyDeskCliente = ''"
          @keypress="senhaAnyDeskCliente = ''"
          @keyup.enter="gerarSenhaAnydesk(anyDeskCliente)"
          v-model="anyDeskCliente"
        ></b-form-input>
        <b-button
          :disabled="!anyDeskCliente"
          variant="success"
          @click="gerarSenhaAnydesk(anyDeskCliente)"
          class="mt-4"
          >Gerar</b-button
        >
      </b-col>
      <b-col cols="12" md="6" class="container-any-critpt mt-3">
        <h5 class="w-100 text-warning mb-0 mt-1">Senha gerada</h5>
        <small class="w-100 mb-3">Senha AnyDesk do cliente.</small>
        <div class="container-senha-gerada">
          {{ senhaAnyDeskCliente }}
        </div>
        <b-button
          :disabled="!senhaAnyDeskCliente"
          @click="copiarSenhaCript(senhaAnyDeskCliente)"
          class="mb-1"
          size="sm"
          variant="outline-secondary"
        >
          <span v-show="!copiarSenha">
            Copiar
            <i class="fa fa-clone" aria-hidden="true"></i>
          </span>
          <span v-show="copiarSenha">Senha copiada com sucesso!</span>
        </b-button>
      </b-col>
    </b-row>

    <b-row
      class="mainContainerHistorico"
      v-show="dataHistoricoAnyDesk.length > 0"
    >
      <b-col cols="12">
        <h5>Histórico de acesso</h5>
        <hr class="m-0 mb-1" />
      </b-col>
      <b-col
        class="container-for"
        v-for="(item, key) in dataHistoricoAnyDesk"
        :key="key"
        cols="6"
        sm="4"
        md="3"
        xl="2"
      >
        <div class="mainItens">
          <div class="cabecalho">
            {{ item.data }}
            <i
              @click="removerHistorico(key)"
              class="fa fa-times excluirHistico"
              aria-hidden="true"
            ></i>
          </div>
          <div class="acesso-anydesk">
            <span v-if="item.anyDeskCliente.length == 9">
              {{
                `${item.anyDeskCliente.slice(0, 3)} ${item.anyDeskCliente.slice(
                  3,
                  6
                )} ${item.anyDeskCliente.slice(6, 9)} `
              }}
            </span>
            <span v-else>
              {{ item.anyDeskCliente }}
            </span>
          </div>
          <div class="senha-cripit">
            {{ item.senhaAnyDeskCliente }}
          </div>
        </div>
      </b-col>
    </b-row>
  </b-container>
</template>

<script>
const crypto = require("crypto");
import TituloCadastro from "./components/TituloCadastro";
import {
  chave_criptografia_anydesk,
  historicoAnydesk,
} from "./../../../global";

export default {
  name: "Anydesk",
  components: { TituloCadastro },
  data() {
    return {
      anyDeskCliente: "",
      anyDeskClienteTemp: "",
      senhaAnyDeskCliente: "",
      copiarSenha: false,
      dataHistoricoAnyDesk: [],
    };
  },
  methods: {
    gerarSenhaAnydesk(text) {
      /* localStorage.removeItem(historicoAnydesk); */

      let cipher = crypto.createCipher(
        chave_criptografia_anydesk.algoritmo,
        chave_criptografia_anydesk.segredo
      );
      /* text.replace(/ /g, "") REMOVE TODOS OS ESPAÇOS NO ID DO ANYDESK DO CLIENTE */
      let crypted = cipher.update(
        text.replace(/ /g, ""),
        chave_criptografia_anydesk.codificacao,
        chave_criptografia_anydesk.tipo
      );
      this.senhaAnyDeskCliente = crypted;

      //PEGA O HISTORICO JA ARMAZENADO NO STORAGE
      let json = JSON.parse(localStorage.getItem(historicoAnydesk));
      if (!json) json = []; /* Se tiver null seta como array */

      let modeloHisAcesso = {
        anyDeskCliente: this.anyDeskCliente.replace(/ /g, ""),
        senhaAnyDeskCliente: this.senhaAnyDeskCliente,
        data: new Date().toLocaleString(),
      };
      json.push(modeloHisAcesso); /* Adiciona o novo acesso gerado */

      /* Atualiza Storage com as alterações feitas */
      localStorage.setItem(historicoAnydesk, JSON.stringify(json));
      this.loadHistoricoAnyStorage();
    },
    copiarSenhaCript(senhaCript) {
      this.copiarSenha = true;
      //Cria um elemento input
      let inputTemp = document.createElement("input");
      inputTemp.value = senhaCript;
      //Anexa o elemento ao body
      document.body.appendChild(inputTemp);
      //seleciona todo o texto do elemento
      inputTemp.select();
      //executa o comando copy
      //aqui é feito o ato de copiar para a area de trabalho com base na seleção
      document.execCommand("copy");
      //remove o elemento
      document.body.removeChild(inputTemp);
      setTimeout(() => {
        this.copiarSenha = false;
      }, 1000);
    },
    removerHistorico(index) {
      this.dataHistoricoAnyDesk.splice(index, 1);
      localStorage.setItem(
        historicoAnydesk,
        JSON.stringify(this.dataHistoricoAnyDesk.reverse())
      );
      this.loadHistoricoAnyStorage();
    },
    loadHistoricoAnyStorage() {
      this.dataHistoricoAnyDesk = [];

      let historicoOri = JSON.parse(
        localStorage.getItem(historicoAnydesk)
      ).reverse();

      /* PERCORRE O HISTORICO DE ACESSO PEGANDO APENAS OS ACESSO QUE FOI GERADO NO DIA ATUAL */
      historicoOri.forEach((elem) => {
        if (
          elem.data.substring(10, 0) ==
          new Date().toLocaleString().substring(10, 0)
        ) {
          this.dataHistoricoAnyDesk.push(elem);
        }
      });
    },
  },
  created() {
    this.loadHistoricoAnyStorage();
  },
};
</script>


<style  scoped>
.mainContainerHistorico {
  margin-top: 120px;
  padding: 3px;
}
.container-for {
  padding: 5px;
}
.mainItens {
  border: 1px rgb(146, 31, 31) solid;
  border-radius: 2px;
  height: 100%;
  width: 100%;
}
.mainItens .cabecalho {
  text-align: center;
  background-color: rgb(237, 233, 233);
  font-size: 13px;
  font-weight: 600;
  padding: 2px;
  border-bottom: solid 1px rgb(174, 172, 172);
}
.mainItens .acesso-anydesk {
  padding: 3px;
  margin: 2px;
  border: solid 1px rgb(85, 85, 85);
  font-weight: 700;
  font-size: 14px;
  background-color: rgb(255, 172, 158);
  word-wrap: break-word;
  font-family: Tahoma;
  letter-spacing: 1px;
  text-align: center;
}
.mainItens .senha-cripit {
  min-height: 50px;
  text-align: center;
  word-wrap: break-word;
  font-size: 14px;
  padding: 3px;
  font-family: Tahoma;
}
.mainItens .excluirHistico {
  float: right;
  padding-right: 1px;
  cursor: pointer;
  color: rgb(196, 89, 89);
  font-size: 13px;
}

.anydesk {
  max-width: 97vw;
  height: 100%;
}
.anydesk-fixed {
  position: fixed;
}
.container-any-cliente {
  border: 1px rgb(220, 218, 218) solid;
  border-left: 7px rgb(255, 48, 2) solid;
  height: 190px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  margin-right: 5px;
  margin-left: 5px;
}
.container-any-cliente button {
  width: 220px;
  padding: 5px;
  background-color: rgb(50, 116, 238);
}

.container-any-critpt {
  display: flex;
  flex-direction: column;
  margin-right: 5px;
  margin-left: 5px;
  border: 1px rgb(220, 218, 218) solid;
  border-left: 7px rgb(255, 133, 2) solid;
  height: 190px;
}
.container-senha-gerada {
  flex: 1;
  text-align: center;
  word-wrap: break-word;
}
</style>
