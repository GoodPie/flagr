<script setup lang="js">
import PageHeader from "./components/navigation/PageHeader.vue";
</script>


<template>
  <el-container direction="vertical">
    <PageHeader/>
    <el-main>
      <router-view></router-view>
    </el-main>
  </el-container>
</template>

<style>
body {
  font-family: -apple-system, BlinkMacSystemFont, Segoe UI, Helvetica, Arial, sans-serif, Apple Color Emoji, Segoe UI Emoji;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}


</style>
