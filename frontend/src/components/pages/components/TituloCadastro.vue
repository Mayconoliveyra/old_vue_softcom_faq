<template>
  <div fluid class="titulo-cadastro">
    <span class="textTitle">
      <i v-if="icon" :class="icon"></i>
      {{ titulo }}
    </span>
    <div v-if="btnAcao">
      <b-button
        v-if="mode == null"
        variant="primary"
        size="sm"
        @click="$emit('criarNovoCadastro')"
      >
        Novo cadastro
        <i class="ml-1 fa fa-plus-circle fa-md" aria-hidden="true"></i>
      </b-button>
      <b-button
        v-else
        variant="secondary"
        size="sm"
        @click="$emit('cancelarCadastro')"
      >
        Cancelar ação
        <i class="ml-1 fa fa-times-circle fa-md" aria-hidden="true"></i>
      </b-button>
    </div>
  </div>
</template>

<script>
export default {
  name: "TituloCadastro",
  props: ["icon", "titulo", "mode", "btnAcao"],
  emits: ["criarNovoCadastro", "cancelarCadastro"],
};
</script>

<style scoped>
.titulo-cadastro {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  margin-top: 3px;
  margin-bottom: 5px;
  border-radius: 3px;
  background: rgb(250, 250, 250);
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