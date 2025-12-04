<template>
  <el-card class="variants-container">
    <template #header>
      <div class="clearfix">
        <h2>Variants</h2>
      </div>
    </template>
    <div class="variants-container-inner" v-if="variants.length">
      <div v-for="variant in variants" :key="variant.id">
        <VariantItem
          :variant="variant"
          :isInUse="isVariantInUse(variant)"
          @save="onUpdateVariant"
          @delete="onDeleteVariant"
        />
      </div>
    </div>
    <div class="card--error" v-else>No variants created for this feature flag yet</div>
    <div class="variants-input">
      <div class="flex-row equal-width constraints-inputs-container">
        <div>
          <el-input placeholder="Variant Key" v-model="newVariantKey"></el-input>
        </div>
      </div>
      <el-button
        class="width--full"
        :disabled="!newVariantKey"
        @click.prevent="onCreateVariant"
      >Create Variant</el-button>
    </div>
  </el-card>
</template>

<script>
import VariantItem from "./VariantItem.vue";

export default {
  name: "VariantsCard",
  components: {
    VariantItem
  },
  props: {
    variants: {
      type: Array,
      required: true
    },
    segments: {
      type: Array,
      required: true
    }
  },
  emits: ["create", "update", "delete"],
  data() {
    return {
      newVariantKey: ""
    };
  },
  methods: {
    isVariantInUse(variant) {
      return this.segments.some(segment =>
        segment.distributions.some(
          distribution => distribution.variantID === variant.id
        )
      );
    },
    onCreateVariant() {
      if (this.newVariantKey.trim()) {
        this.$emit("create", { key: this.newVariantKey.trim() });
        this.newVariantKey = "";
      }
    },
    onUpdateVariant(variant) {
      this.$emit("update", variant);
    },
    onDeleteVariant(variant) {
      this.$emit("delete", variant);
    }
  }
};
</script>
