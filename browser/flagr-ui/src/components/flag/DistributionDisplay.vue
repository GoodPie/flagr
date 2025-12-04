<template>
  <div class="segment-distributions">
    <h5>
      <span>Distribution</span>
      <el-button round size="small" @click="onEdit">
        <span class="el-icon-edit"></span> edit
      </el-button>
    </h5>
    <el-row type="flex" v-if="distributions.length" :gutter="20">
      <el-col
        v-for="distribution in distributions"
        :key="distribution.id"
        :span="6"
      >
        <el-card shadow="never" class="distribution-card">
          <div>
            <span size="small">{{ distribution.variantKey }}</span>
          </div>
          <el-progress
            type="circle"
            color="#74E5E0"
            :width="70"
            :percentage="distribution.percent"
          ></el-progress>
        </el-card>
      </el-col>
    </el-row>
    <div class="card--error" v-else>No distribution yet</div>
  </div>
</template>

<script>
export default {
  name: "DistributionDisplay",
  props: {
    distributions: {
      type: Array,
      required: true
    }
  },
  emits: ["edit"],
  methods: {
    onEdit() {
      this.$emit("edit");
    }
  }
};
</script>
