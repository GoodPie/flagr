<template>
  <el-card>
    <template #header>
      <div class="el-card-header">
        <h2>Flag Settings</h2>
      </div>
    </template>
    <el-button @click="onDelete" type="danger" plain>
      <span class="el-icon-delete"></span>
      Delete Flag
    </el-button>
  </el-card>
</template>

<script>
export default {
  name: "FlagSettingsCard",
  emits: ["delete"],
  methods: {
    onDelete() {
      this.$emit("delete");
    }
  }
};
</script>
