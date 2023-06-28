<template>
  <b-container fluid class="analise-planilhas pb-3 pt-2">
    <b-row align-h="center">
      <b-col cols="12" md="9" lg="7" class="mb-4 mt-2">
        <b-form-file
          type="file"
          accept=".xlsx"
          ref="inputFile"
          :file-name-formatter="formatNameArquivosInput"
          placeholder="Selecione um arquivo XML..."
          @change="lerArquivoExel"
        ></b-form-file>
      </b-col>
    </b-row>

    <b-row align-h="center" class="mt-5">
      <b-col class="border text-center" cols="3"
        >Duplicadas(Sistema/Contador)</b-col
      >
      <b-col class="border text-center" cols="3"
        >Não Existe(Sistema/Contador)</b-col
      >
    </b-row>
    <b-row
      align-h="center"
      class="mt-0"
      v-for="(produto, k) in dataExcel"
      :key="'prod-' + k"
    >
      <b-col
        v-if="
          duplicadosNotaSistemaContador[k] || naoEncontradoSistemaContador[k]
        "
        class="border text-center"
        cols="3"
      >
        <div
          class="notasDuplicadas"
          v-html="duplicadosNotaSistemaContador[k]"
        ></div>
      </b-col>

      <b-col
        v-if="
          duplicadosNotaSistemaContador[k] || naoEncontradoSistemaContador[k]
        "
        class="border text-center"
        cols="3"
      >
        <div
          class="notasDuplicadas"
          v-html="naoEncontradoSistemaContador[k]"
        ></div>
      </b-col>
    </b-row>
  </b-container>
</template>

<script>
import readXlsxFile from "read-excel-file";
export default {
  name: "AnalisePlanilhas",
  data() {
    return {
      dataExcel: [],
      nmrNotaSistema: [],
      nmrNotaContador: [],
      duplicadosNotaSistemaContador: [],
      naoEncontradoSistemaContador: [],
    };
  },
  methods: {
    formatNameArquivosInput(files) {
      return files.length === 1
        ? files[0].name
        : `${files.length} arquivos selecionados.`;
    },
    lerArquivoExel(file) {
      this.dataExcel = [];
      this.nmrNotaSistema = [];
      this.nmrNotaContador = [];
      this.duplicadosNotaSistemaContador = [];
      this.naoEncontradoSistemaContador = [];

      readXlsxFile(file.target.files[0]).then((data) => {
        this.dataExcel = data;
        if (this.dataExcel[0][0] == "s_nmr")
          return alert(
            `[Estrutura inválida] O arquivo deve ter a seguinte estrutura:
           
                        | s_nmr | s_valor | c_nmr | c_valor | 
           
            s_nmr = Número do documento no sistema
            s_valor = Valor do documento no sistema
            c_nmr = Número do documento na área do contador
            c_valor = Valor do documento na área do contador
            `
          );
        console.log(this.dataExcel[0][0]);

        for (let i = 1; this.dataExcel.length > i; i++) {
          if (this.dataExcel[i][0]) {
            this.nmrNotaSistema.push(this.dataExcel[i][0]);
          }
          if (this.dataExcel[i][1]) {
            this.nmrNotaContador.push(this.dataExcel[i][1]);
          }
        }

        /* RETORNAR OS NUMEROS DE NOTAS DUPLICADOS NO SISTEMA */
        this.nmrNotaSistema.filter((elemento, i) => {
          if (this.nmrNotaSistema.indexOf(elemento) !== i) {
            this.duplicadosNotaSistemaContador.push(
              elemento + "<p>(Sistema)</p>"
            );
          }
        });
        /* RETORNAR OS NUMEROS DE NOTAS DUPLICADOS NA AREA DO CONTADOR */
        this.nmrNotaContador.filter((elemento, i) => {
          if (this.nmrNotaContador.indexOf(elemento) !== i) {
            this.duplicadosNotaSistemaContador.push(
              elemento + "<p>(Contador)</p>"
            );
          }
        });

        /* RETORNAR O NUMEROS DAS NOTAS QUE EXISTE NA AREA DO CONTADOR, MAS NAO EXISTE NO SISTEMA */
        for (let y = 0; this.nmrNotaContador.length > y; y++) {
          if (!this.nmrNotaSistema.includes(this.nmrNotaContador[y])) {
            this.naoEncontradoSistemaContador.push(
              this.nmrNotaContador[y] + "<p>(Sistema)</p>"
            );
          }
        }
        /* RETORNAR O NUMEROS DAS NOTAS QUE EXISTE NO SISTEMA, MAS NAO EXISTE NA AREA DO CONTADOR */
        for (let y = 0; this.nmrNotaSistema.length > y; y++) {
          if (!this.nmrNotaContador.includes(this.nmrNotaSistema[y])) {
            this.naoEncontradoSistemaContador.push(
              this.nmrNotaSistema[y] + "<p>(Contador)</p>"
            );
          }
        }

        this.$refs.inputFile.reset();
      });
    },
  },
  created() {
    this.$store.commit("setAppLogin", false);
  },
};
</script>

<style>
.analise-planilhas {
  height: 100%;
}
.notasDuplicadas {
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: 3px;
  font-size: 18px;
  height: 50px;
  font-weight: 600;
}
.notasDuplicadas p {
  font-size: 13px;
  margin: 0px;
  padding: 0px;
  font-weight: 400;
}
</style>
