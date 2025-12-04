<template>
  <el-card class="flag-config-card">
    <template #header>
      <div class="el-card-header">
        <div class="flex-row">
          <div class="flex-row-left">
            <h2>Flag</h2>
          </div>
          <div class="flex-row-right" v-if="flag">
            <el-tooltip content="Enable/Disable Flag" placement="top" effect="light">
              <el-switch
                v-model="flag.enabled"
                active-color="#13ce66"
                inactive-color="#ff4949"
                @change="onToggleEnabled"
                :active-value="true"
                :inactive-value="false"
              ></el-switch>
            </el-tooltip>
          </div>
        </div>
      </div>
    </template>
    <el-card shadow="hover" :class="innerCardClass">
      <div class="flex-row id-row">
        <div class="flex-row-left">
          <el-tag
            type="primary"
            :disable-transitions="true"
          >Flag ID: {{ flag.id }}</el-tag>
        </div>
        <div class="flex-row-right">
          <el-button size="small" @click="onSave">Save Flag</el-button>
        </div>
      </div>
      <el-row class="flag-content" type="flex" align="middle">
        <el-col :span="17">
          <el-row>
            <el-col :span="24">
              <el-input size="small" placeholder="Key" v-model="flag.key">
                <template #prepend>Flag Key</template>
              </el-input>
            </el-col>
          </el-row>
        </el-col>
        <el-col style="text-align: right;" :span="5">
          <div>
            <el-switch
              size="small"
              v-model="flag.dataRecordsEnabled"
              active-color="#74E5E0"
              :active-value="true"
              :inactive-value="false"
            ></el-switch>
          </div>
        </el-col>
        <el-col :span="2">
          <div class="data-records-label">
            Data Records
            <el-tooltip
              content="Controls whether to log to data pipeline, e.g. Kafka, Kinesis, Pubsub"
              placement="top-end"
              effect="light"
            >
              <span class="el-icon-info" />
            </el-tooltip>
          </div>
        </el-col>
      </el-row>
      <el-row class="flag-content" type="flex" align="middle">
        <el-col :span="17">
          <el-row>
            <el-col :span="24">
              <el-input
                size="small"
                placeholder="Description"
                v-model="flag.description"
              >
                <template #prepend>Flag Description</template>
              </el-input>
            </el-col>
          </el-row>
        </el-col>
        <el-col style="text-align: right;" :span="5">
          <div>
            <el-select
              v-show="!!flag.dataRecordsEnabled"
              v-model="flag.entityType"
              size="small"
              filterable
              :allow-create="allowCreateEntityType"
              default-first-option
              placeholder="<null>"
            >
              <el-option
                v-for="item in entityTypes"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              ></el-option>
            </el-select>
          </div>
        </el-col>
        <el-col :span="2">
          <div v-show="!!flag.dataRecordsEnabled" class="data-records-label">
            Entity Type
            <el-tooltip
              content="Overrides the entityType in data records logging"
              placement="top-end"
              effect="light"
            >
              <span class="el-icon-info" />
            </el-tooltip>
          </div>
        </el-col>
      </el-row>
      <el-row style="margin: 10px;">
        <h5>
          <span style="margin-right: 10px;">Flag Notes</span>
          <el-button round size="small" @click="onToggleMdEditor">
            <span :class="editViewIcon"></span>
            {{ !showMdEditor ? "edit" : "view" }}
          </el-button>
        </h5>
      </el-row>
      <el-row>
        <markdown-editor
          :showEditor="showMdEditor"
          v-model:markdown="flag.notes"
          @save="onSave"
        ></markdown-editor>
      </el-row>
      <el-row style="margin: 10px;">
        <h5>
          <span style="margin-right: 10px;">Tags</span>
        </h5>
      </el-row>
      <el-row>
        <flag-tags-manager
          :tags="flag.tags"
          :allTags="allTags"
          @create="onCreateTag"
          @delete="onDeleteTag"
        ></flag-tags-manager>
      </el-row>
    </el-card>
  </el-card>
</template>

<script>
import MarkdownEditor from "../MarkdownEditor.vue";
import FlagTagsManager from "./FlagTagsManager.vue";

export default {
  name: "FlagConfigCard",
  components: {
    MarkdownEditor,
    FlagTagsManager
  },
  props: {
    flag: {
      type: Object,
      required: true
    },
    entityTypes: {
      type: Array,
      required: true
    },
    allowCreateEntityType: {
      type: Boolean,
      required: true
    },
    showMdEditor: {
      type: Boolean,
      required: true
    },
    allTags: {
      type: Array,
      required: true
    }
  },
  emits: ["save", "toggle-enabled", "toggle-md-editor", "create-tag", "delete-tag"],
  computed: {
    editViewIcon() {
      return {
        "el-icon-edit": !this.showMdEditor,
        "el-icon-view": this.showMdEditor
      };
    },
    innerCardClass() {
      if (!this.showMdEditor && !this.flag.notes) {
        return "flag-inner-config-card";
      }
      return "";
    }
  },
  methods: {
    onSave() {
      this.$emit("save");
    },
    onToggleEnabled(value) {
      this.$emit("toggle-enabled", value);
    },
    onToggleMdEditor() {
      this.$emit("toggle-md-editor");
    },
    onCreateTag(payload) {
      this.$emit("create-tag", payload);
    },
    onDeleteTag(tag) {
      this.$emit("delete-tag", tag);
    }
  }
};
</script>
