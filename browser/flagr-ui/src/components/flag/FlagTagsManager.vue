<template>
  <div class="tags-container-inner">
    <el-tag
      v-for="tag in tags"
      :key="tag.id"
      closable
      :type="warning"
      @close="onDeleteTag(tag)"
    >{{ tag.value }}</el-tag>
    <el-autocomplete
      class="tag-key-input"
      v-if="tagInputVisible"
      v-model="newTagValue"
      ref="saveTagInput"
      size="small"
      :trigger-on-focus="false"
      :fetch-suggestions="queryTags"
      @select="onCreateTag"
      @keyup.enter="onCreateTag"
      @keyup.esc="cancelCreateTag"
    ></el-autocomplete>
    <el-button
      v-else
      class="button-new-tag"
      size="small"
      @click="showTagInput"
    >+ New Tag</el-button>
  </div>
</template>

<script>
export default {
  name: "FlagTagsManager",
  props: {
    tags: {
      type: Array,
      required: true
    },
    allTags: {
      type: Array,
      required: true
    }
  },
  emits: ["create", "delete"],
  data() {
    return {
      tagInputVisible: false,
      newTagValue: ""
    };
  },
  methods: {
    queryTags(queryString, cb) {
      let results = this.allTags.filter(tag =>
        tag.value.toLowerCase().includes(queryString.toLowerCase())
      );
      cb(results);
    },
    showTagInput() {
      this.tagInputVisible = true;
      this.$nextTick(() => {
        this.$refs.saveTagInput.$refs.input.focus();
      });
    },
    onCreateTag() {
      if (this.newTagValue.trim()) {
        this.$emit("create", { value: this.newTagValue.trim() });
        this.newTagValue = "";
        this.tagInputVisible = false;
      }
    },
    onDeleteTag(tag) {
      this.$emit("delete", tag);
    },
    cancelCreateTag() {
      this.newTagValue = "";
      this.tagInputVisible = false;
    }
  }
};
</script>
