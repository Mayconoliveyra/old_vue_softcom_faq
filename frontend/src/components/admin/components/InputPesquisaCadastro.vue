<template>
  <div>
    <!-- INPUT PESQUISA -->
    <b-row align-h="center">
      <b-col cols="12" md="8" xl="6">
        <b-input-group size="md">
          <b-form-input
            id="filterInput"
            type="text"
            autocomplete="off"
            placeholder="Buscar"
            label-align-sm="left"
            v-model="filterTemp"
            @keyup="keyUpFilter()"
          ></b-form-input>
          <b-input-group-append>
            <b-button
              type="button"
              :disabled="!filterTemp"
              @click="keyUpFilter(), (filterTemp = ''), (filterTemp = '')"
              >X</b-button
            >
          </b-input-group-append>
        </b-input-group>
      </b-col>
    </b-row>
  </div>
</template>

<script>
export default {
  name: "InputPesquisaCadastro",
  data() {
    return {
      filterTemp: null,
    };
  },
  methods: {
    keyUpFilter() {
      clearTimeout(this.timeFilter);
      this.timeFilter = setTimeout(() => {
        this.$root.$emit("emitFilterTable", this.filterTemp);
      }, 500);
    },
  },
};
</script>

<style>
</style>