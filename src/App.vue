<template>
  <div id="app">
    <router-view></router-view>
    <main-tab-bar></main-tab-bar>
  </div>
</template>


<script>
import MainTabBar from "components/content/mainTabbar/MainTabBar";

export default {
  data() {
    return {};
  },
  methods: {},
  components: {
    MainTabBar,
  },
};
</script>
<style>
@import "./assets/css/base.css";
</style>
