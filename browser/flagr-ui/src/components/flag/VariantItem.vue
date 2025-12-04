<template>
  <el-card shadow="hover">
    <el-form label-position="left" label-width="100px">
      <div class="flex-row id-row">
        <el-tag type="primary" :disable-transitions="true">
          Variant ID:
          <b>{{ variant.id }}</b>
        </el-tag>
        <el-input
          class="variant-key-input"
          size="small"
          placeholder="Key"
          v-model="variant.key"
        >
          <template #prepend>Key</template>
        </el-input>
        <div class="flex-row-right save-remove-variant-row">
          <el-button
            size="small"
            @click="onSave"
          >Save Variant</el-button>
          <el-button @click="onDelete" size="small" :disabled="isInUse">
            <span class="el-icon-delete" />
          </el-button>
        </div>
      </div>
      <el-collapse class="flex-row">
        <el-collapse-item
          title="Variant attachment"
          class="variant-attachment-collapsable-title"
        >
          <p class="variant-attachment-title">You can add JSON in key/value pairs format.</p>
          <json-editor-vue
            v-model="variant.attachment"
            mode="text"
            :mainMenuBar="false"
            :navigationBar="false"
            @update:modelValue="variant.attachmentValid = true"
            class="variant-attachment-content"
          />
        </el-collapse-item>
      </el-collapse>
    </el-form>
  </el-card>
</template>

<script>
import JsonEditorVue from "json-editor-vue";

export default {
  name: "VariantItem",
  components: {
    JsonEditorVue
  },
  props: {
    variant: {
      type: Object,
      required: true
    },
    isInUse: {
      type: Boolean,
      required: true
    }
  },
  emits: ["save", "delete"],
  methods: {
    onSave() {
      this.$emit("save", this.variant);
    },
    onDelete() {
      this.$emit("delete", this.variant);
    }
  }
};
</script>
