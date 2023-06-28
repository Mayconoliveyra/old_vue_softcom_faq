<template>
  <div class="anotacao-exibir">
    <div class="cabecalho">
      <div class="cabecalho-1 bloq-selec-text" @click="exibirSolucao= !exibirSolucao">
        <div>
          <b>Código:</b>
          {{anotacao.codigo_anotacao}}
        </div>
        <div v-if="anotacao.compartilhar">
          <b>Compartilhado:</b> Sim
        </div>
        <div v-else>
          <b>Compartilhado:</b> Não
        </div>
        <div>
          <b>Software:</b>
          {{anotacao.software}}
        </div>
        <div>
          <b>Categoria:</b>
          {{anotacao.categoria}}
        </div>
        <div>
          <b>Dificuldade:</b>
          {{anotacao.dificuldade}}
        </div>
        <div>
          <b>Faqs:</b>
          {{anotacao.faqs}}
        </div>
      </div>

      <div v-if="exibirBotoes" class="btn-anotacoes-alterar-remover">
        <b-button @click="$root.$emit('load_anotacao',anotacao,'remove')" variant="danger">Excluir</b-button>
        <b-button @click="$root.$emit('load_anotacao',anotacao,'save')" variant="warning">Alterar</b-button>
      </div>
    </div>
    <div v-if="!exibirSolucao" class="sintoma">{{anotacao.sintoma}}</div>
    <div v-else class="sintoma-solucao">
      <div class="mt-1">
        <b>Sintoma</b>
        <div>{{anotacao.sintoma}}</div>
      </div>
      <div class="mt-2">
        <b>Solucão</b>
        <div class="vue-edit-class" v-html="anotacao.solucao"></div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "AnotacaoExibir",
  props: ["anotacao", "exibirBotoes"],
  data() {
    return {
      exibirSolucao: false,
    };
  },
};
</script>

<style >
.anotacao-exibir {
  border: solid 1px rgb(209, 209, 209);
  border-radius: 2px;
  margin: 6px 5px;
  padding: 3px;
  margin-bottom: 10px;
  font-family: Calibri, Helvetica, sans-serif !important ;
  font-size: 14px !important ;
}
.cabecalho {
  background-color: rgb(228, 234, 234);
  padding: 3px;
  display: flex;
}
.cabecalho-1 {
  display: flex;
  flex: 1;
  cursor: pointer;
}
.cabecalho-1 > div {
  flex: 1;
}
.sintoma {
  height: 52px;
  padding: 5px;
  overflow: hidden;
}
.sintoma-solucao {
  padding: 5px;
}
.vue-edit-class p {
  margin: 0px !important ;
}
.btn-anotacoes-alterar-remover {
  display: flex;
  justify-content: flex-end;
}
.btn-anotacoes-alterar-remover button {
  padding: 1px 15px;
  margin-left: 12px;
  color: rgb(0, 0, 0);
  font-size: 12px;
}
</style>