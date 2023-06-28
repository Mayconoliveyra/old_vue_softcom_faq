<template>
  <div class="navbarFaq">
    <div class="routes">
      <router-link :class="{ ativo: this.$route.path == '/' }" to="/">
        Faqs Válidos
      </router-link>
      <router-link :class="{ ativo: this.$route.path == '/todos_faqs' }" to="/todos_faqs">Todos Faqs
      </router-link>
      <router-link :class="{ ativo: this.$route.path == '/n2' }" to="/n2">Faqs Válidos N2
      </router-link>
      <!--  <span v-if="this.$mq !== 'sm'"> -->
      <router-link :class="{ ativo: this.$route.path == '/anotacoes' }" to="/anotacoes">Anotações
      </router-link>
      <router-link :class="{ ativo: this.$route.path == '/anotacoes_compartilhadas' }" to="/anotacoes_compartilhadas">
        Anot. Compart.
      </router-link>
      <!--    </span> -->
      <router-link v-if="false" :class="{ ativo: this.$route.path == '/anydesk' }" to="/anydesk">AnyDesk
      </router-link>
    </div>
  </div>
</template>

<script>
export default {
  name: "navbar",
};
</script>

<style scoped>
.navbarFaq {
  width: 100%;
  display: flex;
  grid-area: navbar;
  background-color: rgb(220, 220, 224);
  border: solid 2px rgb(207, 206, 206);
  align-content: center;
  overflow-x: hidden;
  font-family: "Teko", sans-serif;
}

.navbarFaq a {
  position: relative;
  color: rgb(150, 141, 141);
  /* color: rgb(139, 138, 138); */
  float: left;
  text-decoration: none;
  white-space: nowrap;
  font-size: 23px;
  font-weight: normal;
  font-family: inherit;
  margin: 10px 0 0px 20px;
  padding-right: 10px;
  letter-spacing: 0.5px;
}

.navbarFaq .ativo {
  color: rgb(3, 3, 3);
}

.navbarFaq .routes {
  font-family: inherit;
  font-size: 12px;
  line-height: 1em;
  overflow: hidden;
  display: flex;
  overflow-x: scroll;
  /* border: solid 1px red; */
  height: 100%;
  width: 100%;
  text-align: center;
}

.routes::-webkit-scrollbar {
  height: 0px;
}
</style>