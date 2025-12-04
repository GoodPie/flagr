<script setup lang="js">
const version = __APP_VERSION__ || "1.0.0";
</script>

<template>
  <el-container class="page-header">
    <template #default>
      <div>
      <span class="text-large font-600 mr-3">
        Flagr
      </span>
        <el-tag>{{ version }}</el-tag>
      </div>

      <div class="navigation-buttons">
        <el-link href="https://openflagr.github.io/flagr">Docs</el-link>
        <el-link type="primary" href="https://openflagr.github.io/flagr/api_docs">API</el-link>
      </div>
    </template>
  </el-container>

</template>


<style scoped>
.page-header {
  padding: 16px 24px;
  display: flex;

  flex-direction: row;
  justify-content: space-between;
  align-items: center;
}

.navigation-buttons {
  display: flex;
  flex-direction: row;
  gap: 12px;
}
</style>

