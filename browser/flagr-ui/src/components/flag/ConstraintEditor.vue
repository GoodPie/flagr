<template>
  <div class="constraints">
    <div class="constraints-inner" v-if="constraints.length">
      <div v-for="constraint in constraints" :key="constraint.id">
        <el-row :gutter="3" class="segment-constraint">
          <el-col :span="20">
            <el-input
              size="small"
              placeholder="Property"
              v-model="constraint.property"
            >
              <template #prepend>Property</template>
            </el-input>
          </el-col>
          <el-col :span="4">
            <el-select
              class="width--full"
              size="small"
              v-model="constraint.operator"
              placeholder="operator"
            >
              <el-option
                v-for="item in operatorOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              ></el-option>
            </el-select>
          </el-col>
          <el-col :span="20">
            <el-input size="small" v-model="constraint.value">
              <template #prepend>Value&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</template>
            </el-input>
          </el-col>
          <el-col :span="2">
            <el-button
              type="success"
              plain
              class="width--full"
              @click="onUpdateConstraint(constraint)"
              size="small"
            >Save</el-button>
          </el-col>
          <el-col :span="2">
            <el-button
              type="danger"
              plain
              class="width--full"
              @click="onDeleteConstraint(constraint)"
              size="small"
            >
              <i class="el-icon-delete"></i>
            </el-button>
          </el-col>
        </el-row>
      </div>
    </div>
    <div class="card--empty" v-else>
      <span>No constraints (ALL will pass)</span>
    </div>
    <div>
      <el-row :gutter="3">
        <el-col :span="5">
          <el-input
            size="small"
            placeholder="Property"
            v-model="newConstraint.property"
          ></el-input>
        </el-col>
        <el-col :span="4">
          <el-select
            size="small"
            v-model="newConstraint.operator"
            placeholder="operator"
          >
            <el-option
              v-for="item in operatorOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-col>
        <el-col :span="11">
          <el-input size="small" v-model="newConstraint.value"></el-input>
        </el-col>
        <el-col :span="4">
          <el-button
            class="width--full"
            size="small"
            type="primary"
            plain
            :disabled="!newConstraint.property || !newConstraint.value"
            @click.prevent="onCreateConstraint"
          >Add Constraint</el-button>
        </el-col>
      </el-row>
    </div>
  </div>
</template>

<script>
export default {
  name: "ConstraintEditor",
  props: {
    constraints: {
      type: Array,
      required: true
    },
    operatorOptions: {
      type: Array,
      required: true
    },
    segmentNewConstraint: {
      type: Object,
      required: true
    }
  },
  emits: ["create", "update", "delete"],
  computed: {
    newConstraint() {
      return this.segmentNewConstraint;
    }
  },
  methods: {
    onCreateConstraint() {
      this.$emit("create", {
        property: this.newConstraint.property.trim(),
        operator: this.newConstraint.operator,
        value: this.newConstraint.value.trim()
      });
    },
    onUpdateConstraint(constraint) {
      this.$emit("update", constraint);
    },
    onDeleteConstraint(constraint) {
      this.$emit("delete", constraint);
    }
  }
};
</script>
