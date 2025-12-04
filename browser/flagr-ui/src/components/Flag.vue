<template>
  <el-row>
    <el-col :span="20" :offset="2">
      <div class="container flag-container">
        <el-dialog title="Delete feature flag" v-model="dialogDeleteFlagVisible">
          <span>Are you sure you want to delete this feature flag?</span>
          <template #footer>
            <span class="dialog-footer">
              <el-button @click="dialogDeleteFlagVisible = false">Cancel</el-button>
              <el-button type="primary" @click.prevent="deleteFlag">Confirm</el-button>
            </span>
          </template>
        </el-dialog>

        <el-dialog title="Edit distribution" v-model="dialogEditDistributionOpen">
          <DistributionEditor
            v-if="loaded && flag && selectedSegment"
            :variants="flag.variants"
            :distributions="selectedSegment.distributions"
            @save="handleSaveDistribution"
          />
        </el-dialog>

        <el-dialog title="Create segment" v-model="dialogCreateSegmentOpen">
          <div>
            <p>
              <el-input placeholder="Segment description" v-model="newSegment.description"></el-input>
            </p>
            <p>
              <el-slider v-model="newSegment.rolloutPercent" show-input></el-slider>
            </p>
            <el-button
              class="width--full"
              :disabled="!newSegment.description"
              @click.prevent="createSegment"
            >Create Segment</el-button>
          </div>
        </el-dialog>

        <el-breadcrumb separator="/">
          <el-breadcrumb-item :to="{ name: 'home' }">Home page</el-breadcrumb-item>
          <el-breadcrumb-item>Flag ID: {{ $route.params.flagId }}</el-breadcrumb-item>
        </el-breadcrumb>

        <div v-if="loaded && flag">
          <el-tabs @tab-click="handleHistoryTabClick">
            <el-tab-pane label="Config">
              <FlagConfigCard
                :flag="flag"
                :entityTypes="entityTypes"
                :allowCreateEntityType="allowCreateEntityType"
                :showMdEditor="showMdEditor"
                :allTags="allTags"
                @save="putFlag(flag)"
                @toggle-enabled="setFlagEnabled"
                @toggle-md-editor="toggleShowMdEditor"
                @create-tag="handleCreateTag"
                @delete-tag="deleteTag"
              />

              <VariantsCard
                :variants="flag.variants"
                :segments="flag.segments"
                @create="handleCreateVariant"
                @update="putVariant"
                @delete="deleteVariant"
              />

              <SegmentsCard
                :segments="flag.segments"
                :variants="flag.variants"
                :operatorOptions="operatorOptions"
                @create="dialogCreateSegmentOpen = true"
                @update="putSegment"
                @delete="deleteSegment"
                @reorder="handleSegmentsReorder"
                @edit-distribution="editDistribution"
                @create-constraint="handleCreateConstraint"
                @update-constraint="handleUpdateConstraint"
                @delete-constraint="handleDeleteConstraint"
              />
              <debug-console :flag="this.flag"></debug-console>
              <FlagSettingsCard @delete="dialogDeleteFlagVisible = true" />
              <spinner v-if="!loaded"></spinner>
            </el-tab-pane>

            <el-tab-pane label="History">
              <flag-history v-if="historyLoaded" :flag-id="parseInt($route.params.flagId, 10)"></flag-history>
            </el-tab-pane>
          </el-tabs>
        </div>
      </div>
    </el-col>
  </el-row>
</template>

<script>
import clone from "lodash.clone";
import Axios from "axios";

import constants from "../constants";
import helpers from "../helpers/helpers";
import Spinner from "./Spinner.vue";
import DebugConsole from "./DebugConsole.vue";
import FlagHistory from "./FlagHistory.vue";
import operatorsJson from "../operators.json";

// Flag child components
import FlagConfigCard from "./flag/FlagConfigCard.vue";
import VariantsCard from "./flag/VariantsCard.vue";
import SegmentsCard from "./flag/SegmentsCard.vue";
import DistributionEditor from "./flag/DistributionEditor.vue";
import FlagSettingsCard from "./flag/FlagSettingsCard.vue";

const operators = operatorsJson.operators;

const OPERATOR_VALUE_TO_LABEL_MAP = operators.reduce((acc, el) => {
  acc[el.value] = el.label;
  return acc;
}, {});

const { sum, pluck, handleErr } = helpers;

const { API_URL, FLAGR_UI_POSSIBLE_ENTITY_TYPES } = constants;

const DEFAULT_SEGMENT = {
  description: "",
  rolloutPercent: 50
};

const DEFAULT_CONSTRAINT = {
  operator: "EQ",
  property: "",
  value: ""
};


function processSegment(segment) {
  segment.newConstraint = clone(DEFAULT_CONSTRAINT);
}

function processVariant(variant) {
  if (typeof variant.attachment === "string") {
    variant.attachment = JSON.parse(variant.attachment);
  }
}

export default {
  name: "flag",
  components: {
    spinner: Spinner,
    debugConsole: DebugConsole,
    flagHistory: FlagHistory,
    FlagConfigCard,
    VariantsCard,
    SegmentsCard,
    DistributionEditor,
    FlagSettingsCard
  },
  provide() {
    return {
      flagId: () => this.flagId,
      handleErr: handleErr.bind(this)
    };
  },
  data() {
    return {
      loaded: false,
      dialogDeleteFlagVisible: false,
      dialogEditDistributionOpen: false,
      dialogCreateSegmentOpen: false,
      entityTypes: [],
      allTags: [],
      allowCreateEntityType: true,
      flag: {
        createdBy: "",
        dataRecordsEnabled: false,
        entityType: "",
        description: "",
        enabled: false,
        id: 0,
        key: "",
        tags: [],
        segments: [],
        updatedAt: "",
        variants: [],
        notes: ""
      },
      newSegment: clone(DEFAULT_SEGMENT),
      selectedSegment: null,
      operatorOptions: operators,
      showMdEditor: false,
      historyLoaded: false
    };
  },
  computed: {
    flagId() {
      return this.$route.params.flagId;
    }
  },
  methods: {
    deleteFlag() {
      const flagId = this.flagId;
      Axios.delete(`${API_URL}/flags/${this.flagId}`).then(() => {
        this.$router.replace({ name: "home" });
        this.$message.success(`You deleted flag ${flagId}`);
      }, handleErr.bind(this));
    },
    putFlag(flag) {
      Axios.put(`${API_URL}/flags/${this.flagId}`, {
        description: flag.description,
        dataRecordsEnabled: flag.dataRecordsEnabled,
        key: flag.key || "",
        entityType: flag.entityType || "",
        notes: flag.notes || ""
      }).then(() => {
        this.$message.success(`Flag updated`);
      }, handleErr.bind(this));
    },
    setFlagEnabled(checked) {
      Axios.put(`${API_URL}/flags/${this.flagId}/enabled`, {
        enabled: checked
      }).then(() => {
        const checkedStr = checked ? "on" : "off";
        this.$message.success(`You turned ${checkedStr} this feature flag`);
      }, handleErr.bind(this));
    },
    editDistribution(segment) {
      this.selectedSegment = segment;
      this.dialogEditDistributionOpen = true;
    },
    handleSaveDistribution(distributions) {
      Axios.put(
        `${API_URL}/flags/${this.flagId}/segments/${this.selectedSegment.id}/distributions`,
        { distributions }
      ).then(response => {
        let newDistributions = response.data;
        this.selectedSegment.distributions = newDistributions;
        this.dialogEditDistributionOpen = false;
        this.$message.success("distributions updated");
      }, handleErr.bind(this));
    },
    handleCreateVariant(payload) {
      Axios.post(
        `${API_URL}/flags/${this.flagId}/variants`,
        payload
      ).then(response => {
        let variant = response.data;
        this.flag.variants.push(variant);
        this.$message.success("new variant created");
      }, handleErr.bind(this));
    },
    deleteVariant(variant) {
      const isVariantInUse = this.flag.segments.some(segment =>
        segment.distributions.some(
          distribution => distribution.variantID === variant.id
        )
      );

      if (isVariantInUse) {
        alert(
          "This variant is being used by a segment distribution. Please remove the segment or edit the distribution in order to remove this variant."
        );
        return;
      }

      if (
        !confirm(
          `Are you sure you want to delete variant #${variant.id} [${variant.key}]`
        )
      ) {
        return;
      }

      Axios.delete(
        `${API_URL}/flags/${this.flagId}/variants/${variant.id}`
      ).then(() => {
        this.$message.success("variant deleted");
        this.fetchFlag();
      }, handleErr.bind(this));
    },
    putVariant(variant) {
      if (variant.attachmentValid === false) {
        this.$message.error("variant attachment is not valid");
        return;
      }
      Axios.put(
        `${API_URL}/flags/${this.flagId}/variants/${variant.id}`,
        variant
      ).then(() => {
        this.$message.success("variant updated");
      }, handleErr.bind(this));
    },
    handleCreateTag(payload) {
      Axios.post(`${API_URL}/flags/${this.flagId}/tags`, payload).then(
        response => {
          let tag = response.data;
          if (!this.flag.tags.map(t => t.value).includes(tag.value)) {
            this.flag.tags.push(tag);
            this.$message.success("new tag created");
          }
          this.loadAllTags();
        },
        handleErr.bind(this)
      );
    },
    loadAllTags() {
      Axios.get(`${API_URL}/tags`).then(response => {
        let result = response.data;
        this.allTags = result;
      }, handleErr.bind(this));
    },
    deleteTag(tag) {
      if (!confirm(`Are you sure you want to delete tag #${tag.value}`)) {
        return;
      }

      Axios.delete(`${API_URL}/flags/${this.flagId}/tags/${tag.id}`).then(
        () => {
          this.$message.success("tag deleted");
          this.fetchFlag();
          this.loadAllTags();
        },
        handleErr.bind(this)
      );
    },
    putSegment(segment) {
      Axios.put(`${API_URL}/flags/${this.flagId}/segments/${segment.id}`, {
        description: segment.description,
        rolloutPercent: parseInt(segment.rolloutPercent, 10)
      }).then(() => {
        this.$message.success("segment updated");
      }, handleErr.bind(this));
    },
    putSegmentsReorder(segments) {
      Axios.put(`${API_URL}/flags/${this.flagId}/segments/reorder`, {
        segmentIDs: pluck(segments, "id")
      }).then(() => {
        this.$message.success("segment reordered");
      }, handleErr.bind(this));
    },
    handleSegmentsReorder(segments) {
      this.flag.segments = segments;
      this.putSegmentsReorder(segments);
    },
    handleCreateConstraint({ segment, constraint }) {
      Axios.post(
        `${API_URL}/flags/${this.flagId}/segments/${segment.id}/constraints`,
        constraint
      ).then(response => {
        let newConstraint = response.data;
        segment.constraints.push(newConstraint);
        segment.newConstraint = clone(DEFAULT_CONSTRAINT);
        this.$message.success("new constraint created");
      }, handleErr.bind(this));
    },
    handleUpdateConstraint({ segment, constraint }) {
      constraint.property = constraint.property.trim();
      constraint.value = constraint.value.trim();
      Axios.put(
        `${API_URL}/flags/${this.flagId}/segments/${segment.id}/constraints/${constraint.id}`,
        constraint
      ).then(() => {
        this.$message.success("constraint updated");
      }, handleErr.bind(this));
    },
    handleDeleteConstraint({ segment, constraint }) {
      if (!confirm("Are you sure you want to delete this constraint?")) {
        return;
      }
      Axios.delete(
        `${API_URL}/flags/${this.flagId}/segments/${segment.id}/constraints/${constraint.id}`
      ).then(() => {
        const index = segment.constraints.findIndex(
          c => c.id === constraint.id
        );
        segment.constraints.splice(index, 1);
        this.$message.success("constraint deleted");
      }, handleErr.bind(this));
    },
    deleteSegment(segment) {
      if (!confirm("Are you sure you want to delete this segment?")) {
        return;
      }

      Axios.delete(
        `${API_URL}/flags/${this.flagId}/segments/${segment.id}`
      ).then(() => {
        const index = this.flag.segments.findIndex(el => el.id === segment.id);
        this.flag.segments.splice(index, 1);
        this.$message.success("segment deleted");
      }, handleErr.bind(this));
    },
    createSegment() {
      Axios.post(
        `${API_URL}/flags/${this.flagId}/segments`,
        this.newSegment
      ).then(response => {
        let segment = response.data;
        processSegment(segment);
        segment.constraints = [];
        this.newSegment = clone(DEFAULT_SEGMENT);
        this.flag.segments.push(segment);
        this.$message.success("new segment created");
        this.dialogCreateSegmentOpen = false;
      }, handleErr.bind(this));
    },
    fetchFlag() {
      Axios.get(`${API_URL}/flags/${this.flagId}`).then(response => {
        let flag = response.data;
        flag.segments = flag.segments || [];
        flag.variants = flag.variants || [];
        flag.tags = flag.tags || [];
        flag.segments.forEach(segment => processSegment(segment));
        flag.variants.forEach(variant => processVariant(variant));
        this.flag = flag;
        this.loaded = true;
      }, handleErr.bind(this));
      this.fetchEntityTypes();
    },
    fetchEntityTypes() {
      function prepareEntityTypes(entityTypes) {
        let arr = entityTypes.map(key => {
          let label = key === "" ? "<null>" : key;
          return { label: label, value: key };
        });
        if (entityTypes.indexOf("") === -1) {
          arr.unshift({ label: "<null>", value: "" });
        }
        return arr;
      }

      if (
        FLAGR_UI_POSSIBLE_ENTITY_TYPES &&
        FLAGR_UI_POSSIBLE_ENTITY_TYPES != "null"
      ) {
        let entityTypes = FLAGR_UI_POSSIBLE_ENTITY_TYPES.split(",");
        this.entityTypes = prepareEntityTypes(entityTypes);
        this.allowCreateEntityType = false;
        return;
      }

      Axios.get(`${API_URL}/flags/entity_types`).then(response => {
        const data = Array.isArray(response.data) ? response.data : [];
        this.entityTypes = prepareEntityTypes(data);
      }, handleErr.bind(this));
    },
    toggleShowMdEditor() {
      this.showMdEditor = !this.showMdEditor;
    },
    handleHistoryTabClick(tab) {
      if (tab.label == "History" && !this.historyLoaded) {
        this.historyLoaded = true;
      }
    }
  },
  mounted() {
    this.fetchFlag();
    this.loadAllTags();
  }
};
</script>
