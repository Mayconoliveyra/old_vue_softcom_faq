<template>
  <div>
    <!-- PAGINADOR -->
    <b-row class="row-paginador mt-4">
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
        :total-rows="totalRowsTable"
        :per-page="perPage"
        align="end"
        size="sm"
      ></b-pagination>
    </b-row>
    <!-- TABELA -->
    <b-table
      bordered
      show-empty
      small
      table-class="styleTable"
      :items="dataCadastros"
      :fields="fields"
      :current-page="currentPage"
      :per-page="perPage"
      :filter="filter"
      :filterIncludedFields="filterOn"
      :filterIgnoredFields="filterIgnored"
      @filtered="onFiltered"
      emptyFilteredText="Não foi encontrado nenhum registro para os filtros informados!"
    >
      <template v-slot:cell(grupo_valido)="row">
        <div class="tbody-grupo-faq">
          {{ row.item.grupo_valido }}
        </div>
      </template>
      <template v-slot:cell(registro)="row">
        <div
          v-b-tooltip.hover.left
          title="Copiar"
          class="tbody-nrm-faq"
          @click="copiarFaq(row.item.registro)"
        >
          {{ row.item.registro }}
        </div>
      </template>
      <template v-slot:cell(pergunta)="row">
        <div
          class="tbody-pergunta-faq"
          @click="
            $store.commit('setModalFaq', true),
              $store.commit('setUserVisible', false),
              $root.$emit(
                'abrirModalFaqHelpTools',
                row.item.registro,
                row.item.pergunta
              )
          "
        >
          {{ row.item.pergunta.toUpperCase() }}
        </div>
      </template>
    </b-table>
  </div>
</template>

<script>
export default {
  name: "TabelaExibicaoCadastro",
  data() {
    return {
      perPage: 30,
      pageOptions: [10, 30, 50, 100, 200, 400],
      currentPage: 1,
      filter: null,
      totalRowsTable: 0,
    };
  },
  props: ["dataCadastros", "fields", "filterOn", "filterIgnored", "totalRows"],
  methods: {
    onFiltered(filteredItems) {
      this.totalRowsTable = filteredItems.length;
      this.currentPage = 1;
    },
    copiarFaq(faq) {
      //Cria um elemento input
      let inputTemp = document.createElement("input");
      inputTemp.value = faq;
      //Anexa o elemento ao body
      document.body.appendChild(inputTemp);
      //seleciona todo o texto do elemento
      inputTemp.select();
      //executa o comando copy
      //aqui é feito o ato de copiar para a area de trabalho com base na seleção
      document.execCommand("copy");
      //remove o elemento
      document.body.removeChild(inputTemp);
    },
  },
  watch: {
    totalRows() {
      this.totalRowsTable = this.totalRows;
    },
  },
  created() {
    this.totalRowsTable = this.totalRows;
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

.styleTable {
  font-size: 0.8rem;
}
.styleTable tr td {
  font-size: 0.8rem;
  padding: 3px 4px;
}

.tbody-grupo-faq {
  height: 37px;
  overflow: scroll;
  overflow-x: hidden;
}
.tbody-grupo-faq::-webkit-scrollbar {
  width: 0px;
  background: transparent;
}
.tbody-nrm-faq {
  display: flex;
  align-items: center;
  justify-content: center;
  border: solid 1px rgb(238, 234, 234);
  padding: 2px;
  cursor: pointer;
  width: 100%;
  height: 37px;
  font-size: 16px;
}
.tbody-pergunta-faq {
  cursor: pointer;
  height: 37px;
  overflow: scroll;
  overflow-x: hidden;
  text-overflow: ellipsis;
}
.tbody-pergunta-faq::-webkit-scrollbar {
  width: 1px;
  background: transparent;
}
.tbody-pergunta-faq::-webkit-scrollbar-thumb:vertical,
.tbody-pergunta-faq::-webkit-scrollbar-thumb:horizontal {
  background-color: #00b9fc;
  border-radius: 15px;
}
.tbody-pergunta-faq::-webkit-scrollbar {
  width: 5px;
}
</style>