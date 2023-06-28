<template>
  <div>
    <!-- PAGINADOR -->
    <b-row class="row-paginador mt-5">
      <b-form-group label-for="perPageSelect">
        <b-form-select
          id="perPageSelect"
          v-model="perPage"
          aling="left"
          size="sm"
          :options="pageOptions"
        ></b-form-select>
      </b-form-group>

      <b-pagination
        v-model="currentPage"
        :total-rows="totalRows"
        :per-page="perPage"
        align="end"
        size="sm"
      ></b-pagination>
    </b-row>
    <!-- TABELA -->
    <b-table
      small
      show-empty
      :items="dataCadastros"
      :fields="fields"
      :current-page="currentPage"
      :per-page="perPage"
      :filter="filter"
      :filterIncludedFields="filterOn"
      :filterIgnoredFields="filterIgnored"
      @filtered="onFiltered"
      @row-dblclicked="carregarTelaEdicao"
      tbody-tr-class="linhaTabela"
      emptyFilteredText="Não foi encontrado nenhum registro para os filtros informados!"
    >
    </b-table>
  </div>
</template>

<script>
export default {
  name: "TabelaExibicaoCadastro",
  data() {
    return {
      perPage: 50,
      pageOptions: [10, 30, 50, 100, 200, 400],
      currentPage: 1,
      filter: null,
    };
  },
  props: ["dataCadastros", "fields", "filterOn", "filterIgnored", "totalRows"],
  methods: {
    onFiltered(filteredItems) {
      this.totalRows = filteredItems.length;
      this.currentPage = 1;
    },
    carregarTelaEdicao(item) {
      this.$root.$emit("carregaRegistro", item, "save");
    },
  },
  created() {
    this.$root.$on("emitFilterTable", (filter) => {
      this.filter = filter;
    });
  },
};
</script>

<style>
.row-paginador {
  display: flex;
  justify-content: space-between;
  margin-left: 20px;
  margin-right: 20px;
}
.row-paginador > div {
  width: 115px;
}
.linhaTabela {
  /* background-color: blue; */
  font-size: 16px;
  color: rgb(0, 0, 0);
  border: 2px solid #dee2e6;
  -webkit-touch-callout: none; /* iPhone OS, Safari */
  -webkit-user-select: none; /* Chrome, Safari 3 */
  -khtml-user-select: none; /* Safari 2 */
  -moz-user-select: none; /* Firefox */
  -ms-user-select: none; /* IE10+ */
  user-select: none; /* Possível implementação no futuro */
  cursor: pointer;
}
.linhaTabela:hover {
  background-color: rgb(202, 202, 195);
}
</style>