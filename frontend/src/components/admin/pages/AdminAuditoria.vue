<template>
  <b-container fluid class="admin-auditoria">
    <TituloCadastro
      icon="fa fa-list fa-lg"
      titulo="ADM > Auditoria"
      :exibirBtnCadastro="false"
      @criarNovoCadastro="reset(), modeNavegar('save')"
      @cancelarCadastro="reset(), modeNavegar()"
      :mode="mode"
    />
    <div v-if="mode == null">
      <b-row align-h="center" class="mt-2 pb-4">
        <b-col cols="12" lg="7">
          <b-input-group size="md">
            <b-form-input
              id="filterInputAuditoria"
              type="text"
              placeholder="Pesquisar..."
              label-align-sm="left"
              v-model="filterAuditoria"
            ></b-form-input>
            <b-input-group-append>
              <b-button
                type="button"
                :disabled="!filterAuditoria"
                @click="filterAuditoria = ''"
                >X</b-button
              >
            </b-input-group-append>
          </b-input-group>
        </b-col>
      </b-row>
      <b-row class="paginador mt-3">
        <b-form-group label-for="perPageSelect">
          <b-form-select
            id="perPageSelect"
            v-model="perPageAuditoria"
            aling="left"
            size="sm"
            :options="pageOptionsAuditoria"
          ></b-form-select>
        </b-form-group>

        <b-pagination
          v-model="currentPageAuditoria"
          :total-rows="totalRowsAuditoria"
          :per-page="perPageAuditoria"
          align="end"
          size="sm"
        ></b-pagination>
      </b-row>

      <b-table
        bordered
        show-empty
        small
        stacked="md"
        responsive="sm"
        :items="dataAuditoria"
        :fields="fieldsAuditoria"
        :current-page="currentPageAuditoria"
        :per-page="perPageAuditoria"
        :filter="filterAuditoria"
        :filterIncludedFields="filterOnAuditoria"
        @filtered="onFilteredAuditoria"
      >
        <template v-slot:cell(usuario)="row">
          <div>
            {{ JSON.parse(row.item.usuario).nome_agenda }}
          </div>
        </template>
        <template v-slot:cell(metodo)="row">
          <div
            class="tbody-corpo-tbody"
            v-b-tooltip.hover.top
            title="Detalhar"
            @click="row.toggleDetails"
          >
            <div
              class="text-warning"
              v-if="JSON.parse(row.item.url).method == 'PUT'"
            >
              Alterar
            </div>
            <div
              class="text-success"
              v-if="JSON.parse(row.item.url).method == 'POST'"
            >
              Cadastrar
            </div>
            <div
              class="text-success"
              v-if="JSON.parse(row.item.url).method == 'GET'"
            >
              Cadastrar
            </div>
            <div
              class="text-danger"
              v-if="JSON.parse(row.item.url).method == 'DELETE'"
            >
              Deletar
            </div>
          </div>
        </template>
        <template v-slot:cell(url_requisicao)="row">
          <div>
            {{ JSON.parse(row.item.url).url }}
          </div>
        </template>
        <template v-slot:row-details="row">
          <b-row class="w-100 m-0 p-0">
            <b-col sm="12" class="m-0 p-0">
              <b-container fluid class="table-responsive mb-2 p-0">
                <table class="table table-striped table-dark">
                  <thead>
                    <tr>
                      <th>URL</th>
                      <th scope="col">Data</th>
                      <th scope="col">Usuário (Header) (Body)</th>
                      <th scope="col">Corpo da requisicão (Body)</th>
                    </tr>
                    <tr></tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>{{ JSON.parse(row.item.url) }}</td>
                      <td>{{ row.item.data }}</td>
                      <td>{{ JSON.parse(row.item.usuario) }}</td>
                      <td>{{ JSON.parse(row.item.body) }}</td>
                    </tr>
                  </tbody>
                </table>
                <div
                  class="div-antacoes-outras"
                  v-html="row.item.outras_informacoes"
                ></div>
              </b-container>
            </b-col>
          </b-row>
        </template>
      </b-table>
    </div>
  </b-container>
</template>

<script>
import { baseApiUrl, showError } from "../../../../global";
import axios from "axios";
import TituloCadastro from "../components/TituloCadastro";
export default {
  name: "AdminAuditoria",
  components: { TituloCadastro },
  data() {
    return {
      auditoria: {},
      dataAuditoria: [],
      mode: null,
      totalRowsAuditoria: 1,
      currentPageAuditoria: 1,
      perPageAuditoria: 50,
      pageOptionsAuditoria: [10, 30, 50, 500],
      filterAuditoria: null,
      filterOnAuditoria: [],
      fieldsAuditoria: [
        {
          key: "codigo_auditoria",
          label: "Código",
          sortable: true,
        },
        {
          key: "usuario",
          label: "Usuário",
          sortable: true,
        },
        {
          key: "metodo",
          label: "Método",
        },
        {
          key: "url_requisicao",
          label: "URL",
        },
        {
          key: "data",
          label: "Data",
        },
      ],
    };
  },
  methods: {
    loadAuditorias() {
      axios
        .get(`${baseApiUrl}/auditoria`)
        .then((res) => {
          this.dataAuditoria = res.data;
          this.totalRowsAuditoria = res.data.length;
        })
        .catch(showError);
    },
    reset() {
      this.mode = null;
      this.auditoria = {};
      this.loadAuditorias();
    },
    onFilteredAuditoria(filteredItems) {
      this.totalRowsAuditoria = filteredItems.length;
      this.currentPageAuditoria = 1;
    },
  },
  created() {
    this.loadAuditorias();
  },
};
</script>

<style>
.admin-auditoria {
  height: 100%;
}

.admin-auditoria .paginador {
  display: flex;
  justify-content: space-between;
  margin-left: 20px;
  margin-right: 20px;
}
.admin-auditoria .paginador > div {
  width: 110px;
}
.admin-auditoria .tbody-corpo-tbody {
  cursor: pointer;
}
.div-antacoes-outras {
  border: solid 2px #454d55;
  padding: 1px 3px;
  background-color: rgb(252, 252, 252);
}
.div-antacoes-outras p {
  margin: 2px;
}
</style>