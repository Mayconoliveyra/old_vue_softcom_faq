<template>
  <div class="header">
    <router-link to="/" class="logo">
      <img src="@/assets/softcomlogo.png" alt="logo" />
    </router-link>
    <div class="usuario_logado" v-if="this.$mq !== 'sm'">
      <div v-if="user.token && this.$store.state.isUserDropdownVisible">
        {{ user.nome_agenda }}
      </div>
      <div class="fazer-login" v-else>
        <router-link to="/autenticacao" v-if="!user.token">Login</router-link>
      </div>
    </div>
    <UserDropdown
      v-if="this.$store.state.isUserDropdownVisible && user.token"
    />
  </div>
</template>

<script>
import UserDropdown from "./UserDropdown";
import { mapState } from "vuex";
export default {
  name: "Header",
  components: { UserDropdown },
  computed: mapState(["user"]),
};
</script>

<style scoped>
.header .fazer-login a {
  color: rgb(3, 3, 3);
  font-size: 35px;
  font-weight: 600;
  font-family: "Teko", sans-serif;
  padding-right: 6px;
}
.header .fazer-login a:hover {
  color: aliceblue;
}
.header {
  display: flex;
  grid-area: header;
  /* background-color: #8a8491; */
  background-color: #9586a7;
  /* background-color: rgb(174, 165, 143); */
  border: solid 1px rgb(252, 252, 252);
  padding: 0px;
}
.header .logo {
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
  /*   border: solid 1px red; */
}

.usuario_logado div {
  margin-top: -3px;
  margin-right: 2px;
  color: rgb(3, 3, 3);
  font-size: 30px;
  font-family: "Teko", sans-serif;
  letter-spacing: 1px;
}
</style>