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
        <el-button>Docs</el-button>
        <el-button type="primary">API</el-button>
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
  gap: 4px;
}
</style>

