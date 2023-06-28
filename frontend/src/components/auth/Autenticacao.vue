<template>
  <b-container class="autenticacao" fluid>
    <router-link to="/" @click="cadastrarLogarRecuperar = 'logar'" class="img_logo">
      <img src="@/assets/softcomlogo.png" alt="logo" />
    </router-link>
    <div :class="{
      container_cadastrar: this.$mq !== 'sm',
      'container_cadastrar-sm': this.$mq === 'sm',
    }">
      <div v-if="cadastrarLogarRecuperar == 'logar'">
        <div class="text-center">
          <h2>Fazer login</h2>
        </div>
        <b-form class="mt-3">
          <b-form-group label="E-mail" label-form="usuario-email">
            <b-form-input id="usuario-email" type="email" v-model="usuario.email" required />
          </b-form-group>
          <b-form-group label="Senha" label-form="usuario-senha">
            <b-form-input id="usuario-senha" type="password" v-model="usuario.senha" required />
            <p class="text-right font-weight-light">
              <b to @click="cadastrarLogarRecuperar = 'recuperar'">Esqueci a senha</b>
            </p>
          </b-form-group>
          <hr />Não tem uma conta?
          <b @click="cadastrarLogarRecuperar = 'cadastrar'">Cadastre-se</b>
          <hr />
          <b-button variant="primary" @click="entrar">Entrar</b-button>
        </b-form>
      </div>
      <div v-if="cadastrarLogarRecuperar == 'cadastrar'">
        <div class="text-center">
          <h2>Criar conta</h2>
        </div>
        <b-form class="mt-3">
          <b-form-group label="Seu nome na agenda" label-form="usuario-nome-agenda">
            <b-form-input id="usuario-nome-agenda" type="text" v-model="usuario.nome_agenda" required />
          </b-form-group>
          <b-form-group label="E-mail" label-form="usuario-email">
            <b-form-input id="usuario-email" type="email" v-model="usuario.email" required />
          </b-form-group>
          <b-form-group label="Senha" label-form="usuario-senha">
            <b-form-input id="usuario-senha" type="password" v-model="usuario.senha" required />
          </b-form-group>
          <b-form-group label="Confirma Senha" label-form="usuario-confirme-senha">
            <b-form-input id="usuario-confirme-senha" type="password" v-model="usuario.confirmaSenha" required />
          </b-form-group>
          <div class="text-center">
            <b-button variant="primary" @click="cadastrar">Cadastrar</b-button>
            <b-button @click="reset">Cancelar</b-button>
          </div>
        </b-form>
      </div>
      <div v-if="cadastrarLogarRecuperar == 'recuperar'">
        <div class="text-center">
          <h2>Recuperar Senha</h2>
        </div>
        <b-form class="mt-3">
          <b-form-group description="Insira o endereço de e-mail associado à sua conta." label="E-mail"
            label-form="usuario-email">
            <b-form-input id="usuario-email" type="email" v-model="usuario.email" required />
          </b-form-group>
          <hr />
          <div class="text-center">
            <b-button variant="primary" @click="recuperSenha()">Confirmar</b-button>
            <b-button @click="reset">Cancelar</b-button>
          </div>
        </b-form>
      </div>
      <div v-if="cadastrarLogarRecuperar == 'redefinir'">
        <div class="text-center">
          <h2>Redefinir Senha</h2>
        </div>
        <b-form class="mt-3">
          <b-form-group label="Digite uma senha" label-form="usuario-senha">
            <b-form-input id="usuario-senha" type="password" v-model="usuario.senha" required />
          </b-form-group>
          <b-form-group label="Confirmar senha" label-form="usuario-confirme-senha">
            <b-form-input id="usuario-confirme-senha" type="password" v-model="usuario.confirmaSenha" required />
          </b-form-group>
          <div class="text-center">
            <b-button variant="primary" @click="redefinirSenha()">Confirmar</b-button>
          </div>
        </b-form>
      </div>
      <div v-if="cadastrarLogarRecuperar == 'autenticar'">
        <div class="text-center">
          <h4>Verificar o endereço de e-mail</h4>
        </div>
        <div class="text-center mt-4 text-recuperar-senha">
          <p>Para verificar seu email, enviamos um email para {{ usuario.email }}</p>
        </div>
        <b-form class="mt-4">
          <div class="text-center">
            <b to @click="reenviarEmailAutentica()">Reenviar email</b>
          </div>
          <hr />
          <div class="text-center">
            <b-button @click="reset">Cancelar</b-button>
          </div>
        </b-form>
      </div>
    </div>
  </b-container>
</template>

<script>
import axios from "axios";
import { mapState } from "vuex";
import { baseApiUrl, showError, usuarioChave } from "../../../global";
export default {
  name: "Autenticacao",
  data() {
    return {
      usuario: {},
      cadastrarLogarRecuperar: "logar",
    };
  },
  methods: {
    cadastrar() {
      const usuarioModelo = {
        nome_agenda: this.usuario.nome_agenda,
        email: this.usuario.email,
        senha: this.usuario.senha,
        confirmaSenha: this.usuario.confirmaSenha,
      };

      axios
        .post(`${baseApiUrl}/conta`, usuarioModelo)
        .then(() => {
          this.reenviarEmailAutentica();
          this.entrar();
        })
        .catch(showError);
    },
    reenviarEmailAutentica() {
      const usuarioModelo = {
        email: this.usuario.email,
      };
      axios
        .post(`${baseApiUrl}/email_autenticacao`, usuarioModelo)
        .then(() => {
          this.$toasted.global.defaultSuccess();
        })
        .catch(showError);
    },
    autenticar() {
      const usuarioModelo = {
        email: this.$route.params.email,
      };
      axios
        .post(`${baseApiUrl}/autenticar_usuario`, usuarioModelo)
        .then(() => {
          this.$router.push({ path: "/autenticacao" });
          this.cadastrarLogarRecuperar = "logar";
          this.usuario = {};
          this.$toasted.global.usuarioAutenticado();
        })
        .catch(showError);
    },
    entrar() {
      const entrarModelo = {
        email: this.usuario.email,
        senha: this.usuario.senha,
      };
      axios
        .post(`${baseApiUrl}/entrar`, entrarModelo)
        .then((res) => {
          /* SE O USUARIO AINDA NAO FOI AUTENTICADO, SIGNIFICA QUE O CAMPO CODIGO_AUTENTICACAO TA NULO, ENTAOS ERA REDIRECIONADO PARA A TERA DE AUTENTICAÇÃO */
          if (!res.data.codigo_autenticacao) {
            this.cadastrarLogarRecuperar = "autenticar";
            localStorage.removeItem(usuarioChave);
            this.$store.commit("setUser", {});
            return;
          }
          this.$store.commit("setAppLogin", false);
          this.$store.commit("setUser", res.data);
          localStorage.setItem(usuarioChave, JSON.stringify(res.data));
          this.$router.push({ path: "/" });
        })
        .catch(showError);
    },
    recuperSenha() {
      const usuarioModelo = {
        email: this.usuario.email,
      };
      axios
        .post(`${baseApiUrl}/recuper_senha`, usuarioModelo)
        .then(() => {
          this.$toasted.global.recuperarSenha();
        })
        .catch(showError);
    },
    redefinirSenha() {
      const redefinirSenha = {
        email: this.$route.params.email,
        senhaRedifinidaAutomatica: this.$route.params.senha,
        novaSenha: this.usuario.senha,
        confirmaNovaSenha: this.usuario.confirmaSenha,
      };
      axios
        .post(`${baseApiUrl}/redefinir_nova_senha`, redefinirSenha)
        .then(() => {
          this.usuario = {};
          this.cadastrarLogarRecuperar = "logar";
          this.$toasted.global.redefinidoSenha();
        })
        .catch(showError);
    },
    reset() {
      this.usuario = {};
      this.cadastrarLogarRecuperar = "logar";
    },
  },
  computed: mapState(["user"]),
  created() {
    this.$store.commit("setAppLogin", true);

    if (this.$route.params.autenticar == "true") {
      this.autenticar();
    }
    if (
      this.$route.params.aleatorio ==
      "$2a$10$thTlRwJG.Ifh7w24yQ$2a$10$thTlRwJG.Ifh7w24yQofneBscUpxYYT.W0SzCPiPCrSr6Mex7RUmofneBscUpxYYT"
    ) {
      this.cadastrarLogarRecuperar = "redefinir";
    }
  },
};
</script>

<style>
.autenticacao {
  display: flex;
  align-items: center;
  flex-direction: column;
  background-color: #b0a3bf;
  flex: 1;
  width: 100%;
  height: 100%;
  padding: 20px;
}

.autenticacao .container_cadastrar {
  margin-top: 10px;
  border: solid 1px rgb(247, 247, 247);
  width: 410px;
  padding: 10px 20px 20px 20px;
  border-radius: 10px;
}

.autenticacao .container_cadastrar b {
  color: rgb(30, 82, 160);
}

.autenticacao .container_cadastrar b:hover {
  text-decoration: underline;
  cursor: pointer;
}

.autenticacao .container_cadastrar button {
  width: 90%;
  margin: 5px;
}

.autenticacao .container_cadastrar-sm {
  margin-top: 15px;
  border: solid 1px rgb(179, 177, 177);
  width: 100%;
  padding: 25px 20px;
  border-radius: 10px;
}

.autenticacao .container_cadastrar-sm b {
  color: rgb(30, 82, 160);
}

.autenticacao .container_cadastrar b:hover {
  text-decoration: underline;
  cursor: pointer;
}

.autenticacao .container_cadastrar-sm button {
  width: 100%;
  margin: 5px;
}

.img_logo {
  display: flex;
  align-content: center;
  justify-content: center;
  padding: 1px;
  cursor: pointer;
}

.img_logo img {
  width: 200px;
}

.text-recuperar-senha p {
  font-family: "Gill Sans", "Gill Sans MT", Calibri, "Trebuchet MS", sans-serif;
  font-size: 17px;
  color: rgb(0, 0, 0);
}
</style>