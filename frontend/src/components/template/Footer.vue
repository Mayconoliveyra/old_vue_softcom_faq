<template>
  <footer class="footer">
    Feito com <i class="fa fa-heart" aria-hidden="true"></i> por Maycon Oliveira
  </footer>
</template>

<script>
export default {
  name: "Footer",
};
</script>

<style>
.footer {
  grid-area: footer;
  font-family: "Teko", sans-serif;
  background-color: #ffffff;
  border-top: solid 1px rgb(206, 203, 203);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 18px;
  color: rgb(0, 0, 0);
  letter-spacing: 0.5px;
  opacity: 0.7;
}
.footer i {
  margin-right: 2px;
  margin-left: 2px;
  color: rgb(175, 0, 0);
  font-size: 16px;
}
</style>