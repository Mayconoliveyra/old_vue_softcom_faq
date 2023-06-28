<template>
  <div class="content">
    <router-view></router-view>
  </div>
</template>

<script>
export default {
  name: "Content",
};
</script>

<style>
.content {
  grid-area: content;
  background: rgb(255, 255, 255);
  height: 100%;
  max-width: 100vw;
}
</style>