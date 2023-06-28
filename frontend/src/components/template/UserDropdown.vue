<template>
  <div class="user-dropdown">
    <div class="user-button">
      <i class="fa fa-bars fa-2x" aria-hidden="true"></i>
    </div>
    <div class="user-dropdown-content">
      <router-link class="bg-warning" to="/admin" v-if="user.admin"
        >Painel Administrativo</router-link
      >
      <router-link
        v-show="false"
        class="btn btn-info"
        to="/gestao"
        v-if="user.admin"
        >Gestão</router-link
      >
      <router-link to="/jornada" v-if="user.admin">Jornada</router-link>
      <a href v-if="user.token" @click.prevent="sairConta">Sair</a>
    </div>
  </div>
</template>

<script>
import { usuarioChave } from "../../../global";
import { mapState } from "vuex";
export default {
  name: "UserDropdown",
  computed: mapState(["user"]),
  methods: {
    sairConta: function () {
      localStorage.removeItem(usuarioChave);
      this.$store.commit("setUser", {});
      this.$router.push({ path: "/autenticacao" });
    },
  },
};
</script>

<style>
.user-dropdown {
  display: flex;
  height: 40px;
  width: 45px;
}

.user-button {
  display: flex;
  color: rgb(255, 190, 50);
  padding: 5px 9px;
}

.user-dropdown:hover {
  background-color: rgba(0, 0, 0, 0.2);
}

.user-dropdown-content {
  position: absolute;
  right: 0px;
  background-color: rgba(148, 148, 148, 0.945);
  min-width: 240px;
  padding: 10px 10px 15px 10px;
  z-index: 1;

  display: flex;
  flex-direction: column;
  flex-wrap: wrap;
  visibility: hidden;
  opacity: 0;
  transition: visibility 0s, opacity 0.5s linear;
}

.user-dropdown:hover .user-dropdown-content {
  visibility: visible;
  opacity: 1;
  z-index: 999;
}

.user-dropdown-content a {
  text-decoration: none;
  color: rgb(255, 255, 255);
  padding: 5px;
  font-size: 14px;
  font-weight: 600;
  margin: 2px;
  text-align: center;
  border: solid 1px rgb(237, 233, 233);
}

.user-dropdown-content a:hover {
  text-decoration: none;
  color: rgb(72, 70, 70);
  background-color: #ededed;
}
</style>
