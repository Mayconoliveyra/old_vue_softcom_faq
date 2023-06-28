<template>
  <b-container fluid class="jornada">
    <div class="logo-jornada">
      <img src="../../assets/Jornada.png" alt="jornada-conhecimento" />
      <div class="botao-config">
        <div class="config-botao-icone">
          <img src="../../assets/BotaoConfig.png" alt="config" />
        </div>
        <div class="botao-config-content">
          <b-button @click="loadJornada('servicedesk')">Service Desk</b-button>
          <b-button @click="loadJornada('servicedesk_retaguarda')"
            >Service Desk | Retaguarda</b-button
          >
          <b-button @click="loadJornada('servicedesk_estagiario_callcenter')"
            >Service Desk | Estagiários | Call Center</b-button
          >
          <router-link to="/">Sair</router-link>
        </div>
      </div>
    </div>
    <div class="reta-evolucao">
      <!-- Percorre o array do array que tem cada possição de array que o funcionario se encontra -->
      <!-- ex: se ele tem 1 insignia, ele ta no array de posição 1, sem tem 2 posição 2... -->
      <!-- [[],[],[{"codigo_funcionario":39,"nome_suporte":"Matheus","somatorioNewPlayer":"13.3333","qtd_insignia":2}],[{"codigo_funcionario":42,"nome_suporte":"Jomar","somatorioNewPlayer":"20.0000","qtd_insignia":3}],[{"codigo_funcionario":43,"nome_suporte":"Marilia","somatorioNewPlayer":"26.6667","qtd_insignia":4},{"codigo_funcionario":67,"nome_suporte":"Alencar","somatorioNewPlayer":"26.6667","qtd_insignia":4}],[],[{"codigo_funcionario":34,"nome_suporte":"Silva","somatorioNewPlayer":"40.0000","qtd_insignia":6},{"codigo_funcionario":69,"nome_suporte":"Joelton","somatorioNewPlayer":"40.0000","qtd_insignia":6},{"codigo_funcionario":70,"nome_suporte":"Ramon","somatorioNewPlayer":"40.0000","qtd_insignia":6}],[{"codigo_funcionario":58,"nome_suporte":"Wells","somatorioNewPlayer":"46.6667","qtd_insignia":7}],[{"codigo_funcionario":12,"nome_suporte":"Wesley","somatorioNewPlayer":"53.3333","qtd_insignia":8},{"codigo_funcionario":28,"nome_suporte":"Whandel","somatorioNewPlayer":"53.3333","qtd_insignia":8},{"codigo_funcionario":37,"nome_suporte":"Moraes","somatorioNewPlayer":"53.3333","qtd_insignia":8}],[{"codigo_funcionario":54,"nome_suporte":"Maycon","somatorioNewPlayer":"60.0000","qtd_insignia":9},{"codigo_funcionario":57,"nome_suporte":"Vanessa","somatorioNewPlayer":"60.0000","qtd_insignia":9},{"codigo_funcionario":60,"nome_suporte":"Guilherme","somatorioNewPlayer":"60.0000","qtd_insignia":9},{"codigo_funcionario":61,"nome_suporte":"Hercilio","somatorioNewPlayer":"60.0000","qtd_insignia":9},{"codigo_funcionario":62,"nome_suporte":"Brito","somatorioNewPlayer":"60.0000","qtd_insignia":9},{"codigo_funcionario":65,"nome_suporte":"Kilberty","somatorioNewPlayer":"60.0000","qtd_insignia":9},{"codigo_funcionario":66,"nome_suporte":"Romario","somatorioNewPlayer":"60.0000","qtd_insignia":9}],[{"codigo_funcionario":52,"nome_suporte":"Igor","somatorioNewPlayer":"66.6667","qtd_insignia":10}],[{"codigo_funcionario":25,"nome_suporte":"Oliveira","somatorioNewPlayer":"73.3333","qtd_insignia":11}],[],[],[],[]] -->
      <div
        v-for="(funcionarioArrayArray, k) in dataFuncionarioArrayArray"
        :key="k"
      >
        <!-- Percorre os subArray, dentro desses array vai ter o objeto de cada funcionario(ex: nome, somatorioFaqm, qtdInsigia)  -->
        <!-- ex: [{"codigo_funcionario":43,"nome_suporte":"Marilia","somatorioNewPlayer":"26.6667","qtd_insignia":4},{"codigo_funcionario":67,"nome_suporte":"Alencar","somatorioNewPlayer":"26.6667","qtd_insignia":4}] -->
        <!-- No ex acima tem o array com os funcionarios que tem apenas 4 insignia completas  -->
        <div
          class="container-funcionario"
          :style="`left:${definePosicaoImage(
            funcionarioArrayArray[0].somatorioNewPlayer
          )}%`"
          v-for="(funcionario1, y) in funcionarioArrayArray"
          :key="y"
        >
          <!--"y" ea possição do funcionario dentro do array onde ele se encontra-->
          <!-- ex: se eu pego o array da possição 4, que tem 6 funcionarios com 6 insignias-->
          <!-- logo, "y=4" retornaria o funcionario de possição 4 dentro do array de funcionarios com 6 insignias-->
          <!-- ARRAY COM MENOS DE 5 FUNCIONARIO -->
          <div
            v-if="
              funcionarioArrayArray.length > 0 &&
              funcionarioArrayArray.length < 5 &&
              y == trocarIndex(indexFuncMenor5, funcionarioArrayArray.length)
            "
          >
            <div
              class="emblema"
              v-show="
                funcionario1.new_player ||
                funcionario1.pro_player ||
                funcionario1.hacker ||
                funcionario1.overpower
              "
            >
              <img
                v-show="funcionario1.new_player"
                :src="require('../../assets/new.png')"
                alt="emblema-new"
              />
              <img
                v-show="funcionario1.pro_player"
                :src="require('../../assets/pro.png')"
                alt="emblema-pro"
              />
              <img
                v-show="funcionario1.hacker"
                :src="require('../../assets/hacker.png')"
                alt="emblema-hacker"
              />
              <img
                v-show="funcionario1.overpower"
                :src="require('../../assets/overpower.png')"
                alt="emblema-overpower"
              />
            </div>
            <div class="nome-funcionario">
              <p>
                {{
                  funcionario1.nome_suporte
                    .split(" ")[0]
                    .toUpperCase()
                    .replace(/[ÀÁÂÃÄÅ]/g, "A")
                    .replace(/[àáâãäå]/g, "a")
                    .replace(/[ÈÉÊË]/g, "E")
                }}
              </p>
            </div>
            <div class="personagem">
              <img
                :src="
                  require(`../../assets/${funcionario1.personagem_gif}.gif`)
                "
                :alt="funcionario1.nome_suporte"
              />
            </div>
            <div
              class="aura-pro-player"
              v-show="funcionario1.pro_player"
              style="opacity: 65%"
            >
              <img
                src="../../assets/aura_proplayer.gif"
                alt="aura-pro-player"
              />
            </div>
          </div>
          <!-- ARRAY COM MENOS DE 10 FUNCIONARIO -->
          <div
            v-if="
              funcionarioArrayArray.length >= 5 &&
              funcionarioArrayArray.length < 10 &&
              y == trocarIndex(indexFuncMaior5, funcionarioArrayArray.length)
            "
          >
            <div
              class="emblema"
              v-show="
                funcionario1.new_player ||
                funcionario1.pro_player ||
                funcionario1.hacker ||
                funcionario1.overpower
              "
            >
              <img
                v-show="funcionario1.new_player"
                :src="require('../../assets/new.png')"
                alt="emblema-new"
              />
              <img
                v-show="funcionario1.pro_player"
                :src="require('../../assets/pro.png')"
                alt="emblema-pro"
              />
              <img
                v-show="funcionario1.hacker"
                :src="require('../../assets/hacker.png')"
                alt="emblema-hacker"
              />
              <img
                v-show="funcionario1.overpower"
                :src="require('../../assets/overpower.png')"
                alt="emblema-overpower"
              />
            </div>
            <div class="nome-funcionario">
              <p>
                {{
                  funcionario1.nome_suporte
                    .split(" ")[0]
                    .toUpperCase()
                    .replace(/[ÀÁÂÃÄÅ]/g, "A")
                    .replace(/[àáâãäå]/g, "a")
                    .replace(/[ÈÉÊË]/g, "E")
                }}
              </p>
            </div>
            <div class="personagem">
              <img
                :src="
                  require(`../../assets/${funcionario1.personagem_gif}.gif`)
                "
                :alt="funcionario1.nome_suporte"
              />
            </div>
            <div
              class="aura-pro-player"
              v-show="funcionario1.pro_player"
              style="opacity: 65%"
            >
              <img
                src="../../assets/aura_proplayer.gif"
                alt="aura-pro-player"
              />
            </div>
          </div>
          <!-- ARRAY COM MAIS DE 10 FUNCIONARIO -->
          <div
            v-if="
              funcionarioArrayArray.length >= 10 &&
              y == trocarIndex(indexFuncMaior10, funcionarioArrayArray.length)
            "
          >
            <div
              class="emblema"
              v-show="
                funcionario1.new_player ||
                funcionario1.pro_player ||
                funcionario1.hacker ||
                funcionario1.overpower
              "
            >
              <img
                v-show="funcionario1.new_player"
                :src="require('../../assets/new.png')"
                alt="emblema-new"
              />
              <img
                v-show="funcionario1.pro_player"
                :src="require('../../assets/pro.png')"
                alt="emblema-pro"
              />
              <img
                v-show="funcionario1.hacker"
                :src="require('../../assets/hacker.png')"
                alt="emblema-hacker"
              />
              <img
                v-show="funcionario1.overpower"
                :src="require('../../assets/overpower.png')"
                alt="emblema-overpower"
              />
            </div>
            <div class="nome-funcionario">
              <p>
                {{
                  funcionario1.nome_suporte
                    .split(" ")[0]
                    .toUpperCase()
                    .replace(/[ÀÁÂÃÄÅ]/g, "A")
                    .replace(/[àáâãäå]/g, "a")
                    .replace(/[ÈÉÊË]/g, "E")
                }}
              </p>
            </div>
            <div class="personagem">
              <img
                :src="
                  require(`../../assets/${funcionario1.personagem_gif}.gif`)
                "
                :alt="funcionario1.nome_suporte"
              />
            </div>
            <div
              class="aura-pro-player"
              v-show="funcionario1.pro_player"
              style="opacity: 65%"
            >
              <img
                src="../../assets/aura_proplayer.gif"
                alt="aura-pro-player"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  </b-container>
</template>

<script>
import axios from "axios";
import { baseApiUrl, showError } from "@/../global";

export default {
  name: "Jornada",
  data() {
    return {
      dataFuncionario: [],
      indexFuncMenor5: 1,
      indexFuncMaior5: 1,
      indexFuncMaior10: 1,
      dataFuncionarioArrayArray: [
        [],
        [],
        [],
        [],
        [],
        [],
        [],
        [],
        [],
        [],
        [],
        [],
        [],
        [],
        [],
        [],
        [],
        [],
        [],
        [],
        [],
        [],
        [],
        [],
        [],
      ],
    };
  },
  methods: {
    loadJornada(setor) {
      /* Redefine os array como vazio */
      this.dataFuncionario = [];
      this.dataFuncionarioArrayArray = [
        [],
        [],
        [],
        [],
        [],
        [],
        [],
        [],
        [],
        [],
        [],
        [],
        [],
        [],
        [],
        [],
        [],
        [],
        [],
        [],
        [],
        [],
        [],
        [],
        [],
      ];
      let url = "";

      if (setor == "servicedesk") {
        url = `${baseApiUrl}/jornada_servicedesk`;
      } else if (setor == "servicedesk_retaguarda") {
        url = `${baseApiUrl}/jornada_servicedesk_retaguarda`;
      } else if (setor == "servicedesk_estagiario_callcenter") {
        url = `${baseApiUrl}/jornada_servicedesk_estagiario_callcenter`;
      }

      axios
        .get(url)
        .then((res) => {
          this.dataFuncionario = res.data[0];
          for (let i = 0; this.dataFuncionario.length > i; i++) {
            /* FUNCIONARIO COM 0 INSIGNIA NAO SERA MOSTRADO */
            /*  if (this.dataFuncionario[i].qtd_insignia == 0) {
              this.dataFuncionarioArrayArray[0].push(this.dataFuncionario[i]);
            } */
            if (this.dataFuncionario[i].qtd_insignia == 1) {
              this.dataFuncionarioArrayArray[1].push(this.dataFuncionario[i]);
            }
            if (this.dataFuncionario[i].qtd_insignia == 2) {
              this.dataFuncionarioArrayArray[2].push(this.dataFuncionario[i]);
            }
            if (this.dataFuncionario[i].qtd_insignia == 3) {
              this.dataFuncionarioArrayArray[3].push(this.dataFuncionario[i]);
            }
            if (this.dataFuncionario[i].qtd_insignia == 4) {
              this.dataFuncionarioArrayArray[4].push(this.dataFuncionario[i]);
            }
            if (this.dataFuncionario[i].qtd_insignia == 5) {
              this.dataFuncionarioArrayArray[5].push(this.dataFuncionario[i]);
            }
            if (this.dataFuncionario[i].qtd_insignia == 6) {
              this.dataFuncionarioArrayArray[6].push(this.dataFuncionario[i]);
            }
            if (this.dataFuncionario[i].qtd_insignia == 7) {
              this.dataFuncionarioArrayArray[7].push(this.dataFuncionario[i]);
            }
            if (this.dataFuncionario[i].qtd_insignia == 8) {
              this.dataFuncionarioArrayArray[8].push(this.dataFuncionario[i]);
            }
            if (this.dataFuncionario[i].qtd_insignia == 9) {
              this.dataFuncionarioArrayArray[9].push(this.dataFuncionario[i]);
            }
            if (this.dataFuncionario[i].qtd_insignia == 10) {
              this.dataFuncionarioArrayArray[10].push(this.dataFuncionario[i]);
            }
            if (this.dataFuncionario[i].qtd_insignia == 11) {
              this.dataFuncionarioArrayArray[11].push(this.dataFuncionario[i]);
            }
            if (this.dataFuncionario[i].qtd_insignia == 12) {
              this.dataFuncionarioArrayArray[12].push(this.dataFuncionario[i]);
            }
            if (this.dataFuncionario[i].qtd_insignia == 13) {
              this.dataFuncionarioArrayArray[13].push(this.dataFuncionario[i]);
            }
            if (this.dataFuncionario[i].qtd_insignia == 14) {
              this.dataFuncionarioArrayArray[14].push(this.dataFuncionario[i]);
            }
            if (this.dataFuncionario[i].qtd_insignia == 15) {
              this.dataFuncionarioArrayArray[15].push(this.dataFuncionario[i]);
            }
            if (this.dataFuncionario[i].qtd_insignia == 16) {
              this.dataFuncionarioArrayArray[16].push(this.dataFuncionario[i]);
            }
            if (this.dataFuncionario[i].qtd_insignia == 17) {
              this.dataFuncionarioArrayArray[17].push(this.dataFuncionario[i]);
            }
            if (this.dataFuncionario[i].qtd_insignia == 18) {
              this.dataFuncionarioArrayArray[18].push(this.dataFuncionario[i]);
            }
            if (this.dataFuncionario[i].qtd_insignia == 19) {
              this.dataFuncionarioArrayArray[19].push(this.dataFuncionario[i]);
            }
            if (this.dataFuncionario[i].qtd_insignia == 20) {
              this.dataFuncionarioArrayArray[20].push(this.dataFuncionario[i]);
            }
            if (this.dataFuncionario[i].qtd_insignia == 21) {
              this.dataFuncionarioArrayArray[21].push(this.dataFuncionario[i]);
            }
            if (this.dataFuncionario[i].qtd_insignia == 22) {
              this.dataFuncionarioArrayArray[22].push(this.dataFuncionario[i]);
            }
            if (this.dataFuncionario[i].qtd_insignia == 23) {
              this.dataFuncionarioArrayArray[23].push(this.dataFuncionario[i]);
            }
            if (this.dataFuncionario[i].qtd_insignia == 24) {
              this.dataFuncionarioArrayArray[24].push(this.dataFuncionario[i]);
            }
          }
        })
        .catch(showError);
    },
    trocarFuncionarioMenor5(length) {
      setInterval(() => {
        if (this.indexFuncMenor5 < length) {
          this.indexFuncMenor5 = this.indexFuncMenor5 + 1;
        } else {
          this.indexFuncMenor5 = 0;
        }
      }, 2000);
    },
    trocarFuncionarioMaior5(length) {
      setInterval(() => {
        if (this.indexFuncMaior5 < length) {
          this.indexFuncMaior5 = this.indexFuncMaior5 + 1;
        } else {
          this.indexFuncMaior5 = 0;
        }
      }, 2000);
    },
    trocarFuncionarioMaio10(length) {
      setInterval(() => {
        if (this.indexFuncMaior10 < length) {
          this.indexFuncMaior10 = this.indexFuncMaior10 + 1;
        } else {
          this.indexFuncMaior10 = 0;
        }
      }, 2000);
    },
    trocarIndex(indexAtual, length) {
      if (indexAtual < length) {
        return indexAtual;
      } else {
        return 0;
      }
    },
    definePosicaoImage(somatorioInsigia) {
      if (somatorioInsigia > 0 && somatorioInsigia < 99) {
        return somatorioInsigia - 4.1;
      } else {
        return 93;
      }
    },
  },
  created() {
    this.loadJornada("servicedesk");
    this.trocarFuncionarioMenor5(4);
    this.trocarFuncionarioMaior5(9);
    this.trocarFuncionarioMaio10(20);
  },
};
</script>


<style scoped>
.jornada {
  height: 100%;
  width: 100%;
  display: flex;
  flex-direction: column;
  padding: 0px;
  background: url("../../assets/Cenario.gif") no-repeat bottom center scroll;
  -webkit-touch-callout: none; /* iPhone OS, Safari */
  -webkit-user-select: none; /* Chrome, Safari 3 */
  -khtml-user-select: none; /* Safari 2 */
  -moz-user-select: none; /* Firefox */
  -ms-user-select: none; /* IE10+ */
  user-select: none; /* Possível implementação no futuro */
  cursor: default;
}
.logo-jornada {
  display: flex;
}
.logo-jornada > img {
  width: 400px;
  margin-top: 4vh;
  margin-left: 7vh;
}
.reta-evolucao {
  flex: 1;
  display: flex;
  align-items: flex-end;
  margin-bottom: 333px;
}

/* Container funcionario */
.container-funcionario {
  width: 55px;
  position: absolute;
  height: 127px;
  display: flex;
  justify-content: center;
  align-items: flex-end;
}

/* Personagem */
.personagem {
  display: flex;
  align-items: flex-end;
  justify-content: center;
}
.personagem img {
  width: 45px;
  height: 55px;
  z-index: 999;
}

/* Nome funcionario */
.nome-funcionario {
  z-index: 999;
}
.nome-funcionario p {
  color: rgba(0, 0, 0, 0.952);
  font-family: "Bebas Neue", cursive;
  font-weight: 900;

  letter-spacing: 1px;
  font-size: 19px;
  text-align: center;
  white-space: nowrap;
  padding-bottom: 5px;
}

/* Emblema */
.emblema {
  width: 100%;
  text-align: center;
  white-space: nowrap;
}
.emblema img {
  width: 23px;
}

/*Barra de vida e energia */
.barras {
  margin: 0px;
  padding: 0px;
  z-index: 99;
}
.barras .vida {
  border: solid 2px rgb(50, 162, 72);
  margin: 0px;
  padding: 0px;
}
.barras .energia {
  border: solid 2px rgb(39, 45, 238);
  margin-top: 2px;
  margin-bottom: 3px;
  padding: 0px;
}

/* Aura */
.aura-pro-player {
  position: absolute;
  top: 40px;
  width: 110px;
  left: -21px;
  z-index: 0;
  height: 90px;
  overflow: hidden;
}
.aura-pro-player img {
  width: 100%;
}

/* Botão de configuração */
.botao-config {
  flex: 1;
  height: 50px;
  justify-content: flex-end;
  display: flex;
}
.botao-config img {
  width: 35px;
}
.config-botao-icone {
  display: flex;
  color: rgb(255, 190, 50);
  padding: 5px 12px;
}
.botao-config:hover {
  cursor: pointer;
}
.botao-config-content {
  position: absolute;
  right: 0px;
  background-color: rgba(89, 88, 88, 0.945);
  min-width: 230px;
  padding: 10px 10px 15px 10px;
  z-index: 1;

  display: flex;
  flex-direction: column;
  flex-wrap: wrap;
  visibility: hidden;
  opacity: 0;
  transition: visibility 0s, opacity 0.5s linear;
}
.botao-config:hover .botao-config-content {
  visibility: visible;
  opacity: 1;
  z-index: 999;
}
.botao-config-content button,
a {
  text-decoration: none;
  color: rgb(255, 255, 255);
  padding: 5px;
  font-size: 13px;
  font-weight: 600;
  margin: 2px;
  text-align: center;
  border: solid 1px rgb(237, 233, 233);
}
.botao-config-content a:hover {
  text-decoration: none;
  color: rgb(72, 70, 70);
  background-color: #ededed;
}
</style>
