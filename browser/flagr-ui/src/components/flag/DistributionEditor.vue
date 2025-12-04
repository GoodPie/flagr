<template>
  <div>
    <div v-for="variant in variants" :key="'distribution-variant-' + variant.id">
      <div>
        <el-checkbox
          @change="(e) => selectVariant(e, variant)"
          :checked="!!localDistributions[variant.id]"
        ></el-checkbox>
        <el-tag type="danger" :disable-transitions="true">{{ variant.key }}</el-tag>
      </div>
      <el-slider
        v-if="!localDistributions[variant.id]"
        :value="0"
        :disabled="true"
        show-input
      ></el-slider>
      <div v-if="!!localDistributions[variant.id]">
        <el-slider
          v-model="localDistributions[variant.id].percent"
          :disabled="false"
          show-input
        ></el-slider>
      </div>
    </div>
    <el-button
      class="width--full"
      :disabled="!isValid"
      @click.prevent="onSave"
    >Save</el-button>

    <el-alert
      class="edit-distribution-alert"
      v-if="!isValid"
      :title="'Percentages must add up to 100% (currently at ' + percentageSum + '%)'"
      type="error"
      show-icon
    ></el-alert>
  </div>
</template>

<script>
import clone from "lodash.clone";

const DEFAULT_DISTRIBUTION = {
  bitmap: "",
  variantID: 0,
  variantKey: "",
  percent: 0
};

export default {
  name: "DistributionEditor",
  props: {
    variants: {
      type: Array,
      required: true
    },
    distributions: {
      type: Array,
      required: true
    }
  },
  emits: ["save", "cancel"],
  data() {
    return {
      localDistributions: {}
    };
  },
  computed: {
    percentageSum() {
      return Object.values(this.localDistributions).reduce(
        (sum, d) => sum + (d.percent || 0),
        0
      );
    },
    isValid() {
      return this.percentageSum === 100;
    }
  },
  watch: {
    distributions: {
      immediate: true,
      handler(newVal) {
        this.localDistributions = {};
        newVal.forEach(distribution => {
          this.localDistributions[distribution.variantID] = clone(distribution);
        });
      }
    }
  },
  methods: {
    selectVariant(checked, variant) {
      if (checked) {
        const distribution = Object.assign(clone(DEFAULT_DISTRIBUTION), {
          variantKey: variant.key,
          variantID: variant.id
        });
        this.localDistributions[variant.id] = distribution;
      } else {
        delete this.localDistributions[variant.id];
      }
    },
    onSave() {
      const distributions = Object.values(this.localDistributions)
        .filter(distribution => distribution.percent !== 0)
        .map(distribution => {
          let dist = clone(distribution);
          delete dist.id;
          return dist;
        });
      this.$emit("save", distributions);
    }
  }
};
</script>
