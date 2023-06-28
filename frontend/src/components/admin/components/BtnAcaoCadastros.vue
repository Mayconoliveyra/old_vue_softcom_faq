<template>
  <b-container fluid class="row-btn-cadastro">
    <hr />
    <b-button variant="success" @click="$emit('salvarRegistro')">
      Salvar<i class="ml-3 fa fa-check-circle fa-lg" aria-hidden="true"></i>
    </b-button>
  </b-container>
</template>

<script>
export default {
  name: "BtnAcaoCadastros",
  emits: ["salvarRegistro"],
};
</script>

<style scoped>
.row-btn-cadastro {
  width: 100%;
  margin-top: 15px;
  margin-bottom: 10px;
}
.row-btn-cadastro button {
  width: 100%;
  height: 40px;
}
</style>