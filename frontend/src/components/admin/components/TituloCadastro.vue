<template>
  <b-container fluid class="titulo-cadastro">
    <span class="textTitle">
      <i v-if="icon" :class="icon"></i>
      {{ titulo }}
    </span>
    <b-button
      v-if="exibirBtnCadastro && mode != 'save'"
      variant="primary"
      size="md"
      @click="$emit('criarNovoCadastro')"
    >
      Novo Cadastro
      <i class="ml-2 fa fa-plus-circle fa-lg" aria-hidden="true"></i>
    </b-button>
    <b-button
      v-if="mode == 'save'"
      variant="secondary"
      size="md"
      @click="$emit('cancelarCadastro')"
    >
      Cancelar
      <i class="ml-2 fa fa-times-circle fa-lg" aria-hidden="true"></i>
    </b-button>
  </b-container>
</template>

<script>
export default {
  name: "TituloCadastro",
  props: ["icon", "titulo", "mode", "exibirBtnCadastro"],
  emits: ["criarNovoCadastro", "cancelarCadastro"],
};
</script>

<style scoped>
.titulo-cadastro {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  border: solid 1px rgba(0, 0, 0, 0.2);
  width: 100%;
  margin-top: 5px;
  margin-bottom: 15px;
  padding: 5px;
  border-radius: 6px;
  box-shadow: 0 0.5rem 0.5rem rgb(0 0 0 /12%),
    inset 0 -1px 10px rgb(0 0 0 / 20%);
}

.titulo-cadastro .textTitle {
  margin-bottom: 2px;
  font-size: 13px;
  padding-left: 7px;
  letter-spacing: 2px;
  color: rgb(0, 0, 0);
}
.titulo-cadastro button {
  padding: 1px 7px;
}
</style>