<template>
  <el-card shadow="hover" class="segment grabbable">
    <div class="flex-row id-row">
      <div class="flex-row-left">
        <el-tag type="primary" :disable-transitions="true">
          Segment ID:
          <b>{{ segment.id }}</b>
        </el-tag>
      </div>
      <div class="flex-row-right">
        <el-button
          size="small"
          @click="onSave"
        >Save Segment Setting</el-button>
        <el-button @click="onDelete" size="small">
          <span class="el-icon-delete" />
        </el-button>
      </div>
    </div>
    <el-row :gutter="10" class="id-row">
      <el-col :span="15">
        <el-input
          size="small"
          placeholder="Description"
          v-model="segment.description"
        >
          <template #prepend>Description</template>
        </el-input>
      </el-col>
      <el-col :span="9">
        <el-input
          class="segment-rollout-percent"
          size="small"
          placeholder="0"
          v-model="segment.rolloutPercent"
          :min="0"
          :max="100"
        >
          <template #prepend>Rollout</template>
          <template #append>%</template>
        </el-input>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="24">
        <h5>Constraints (match ALL of them)</h5>
        <ConstraintEditor
          :constraints="segment.constraints"
          :operatorOptions="operatorOptions"
          :segmentNewConstraint="segment.newConstraint"
          @create="onCreateConstraint"
          @update="onUpdateConstraint"
          @delete="onDeleteConstraint"
        />
      </el-col>
      <el-col :span="24">
        <DistributionDisplay
          :distributions="segment.distributions"
          @edit="onEditDistribution"
        />
      </el-col>
    </el-row>
  </el-card>
</template>

<script>
import ConstraintEditor from "./ConstraintEditor.vue";
import DistributionDisplay from "./DistributionDisplay.vue";

export default {
  name: "SegmentItem",
  components: {
    ConstraintEditor,
    DistributionDisplay
  },
  props: {
    segment: {
      type: Object,
      required: true
    },
    operatorOptions: {
      type: Array,
      required: true
    }
  },
  emits: ["save", "delete", "edit-distribution", "create-constraint", "update-constraint", "delete-constraint"],
  methods: {
    onSave() {
      this.$emit("save", this.segment);
    },
    onDelete() {
      this.$emit("delete", this.segment);
    },
    onEditDistribution() {
      this.$emit("edit-distribution", this.segment);
    },
    onCreateConstraint(newConstraint) {
      this.$emit("create-constraint", newConstraint);
    },
    onUpdateConstraint(constraint) {
      this.$emit("update-constraint", constraint);
    },
    onDeleteConstraint(constraint) {
      this.$emit("delete-constraint", constraint);
    }
  }
};
</script>
