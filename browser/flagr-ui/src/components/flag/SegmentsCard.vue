<template>
  <el-card class="segments-container">
    <template #header>
      <div class="el-card-header">
        <div class="flex-row">
          <div class="flex-row-left">
            <h2>Segments</h2>
          </div>
          <div class="flex-row-right">
            <el-tooltip
              content="You can drag and drop segments to reorder"
              placement="top"
              effect="light"
            >
              <el-button @click="onReorder">Reorder</el-button>
            </el-tooltip>
            <el-button @click="onCreate">New Segment</el-button>
          </div>
        </div>
      </div>
    </template>
    <div class="segments-container-inner" v-if="segments.length">
      <draggable v-model="localSegments" item-key="id" @start="drag = true" @end="onDragEnd">
        <template #item="{ element: segment }">
          <SegmentItem
            :segment="segment"
            :operatorOptions="operatorOptions"
            @save="onUpdateSegment"
            @delete="onDeleteSegment"
            @edit-distribution="onEditDistribution"
            @create-constraint="(constraint) => onCreateConstraint(segment, constraint)"
            @update-constraint="(constraint) => onUpdateConstraint(segment, constraint)"
            @delete-constraint="(constraint) => onDeleteConstraint(segment, constraint)"
          />
        </template>
      </draggable>
    </div>
    <div class="card--error" v-else>No segments created for this feature flag yet</div>
  </el-card>
</template>

<script>
import draggable from "vuedraggable";
import SegmentItem from "./SegmentItem.vue";

export default {
  name: "SegmentsCard",
  components: {
    draggable,
    SegmentItem
  },
  props: {
    segments: {
      type: Array,
      required: true
    },
    variants: {
      type: Array,
      required: true
    },
    operatorOptions: {
      type: Array,
      required: true
    }
  },
  emits: ["create", "update", "delete", "reorder", "edit-distribution", "create-constraint", "update-constraint", "delete-constraint"],
  data() {
    return {
      drag: false
    };
  },
  computed: {
    localSegments: {
      get() {
        return this.segments;
      },
      set(value) {
        // Emit the reordered segments
        this.$emit("reorder", value);
      }
    }
  },
  methods: {
    onCreate() {
      this.$emit("create");
    },
    onReorder() {
      this.$emit("reorder", this.segments);
    },
    onDragEnd() {
      this.drag = false;
    },
    onUpdateSegment(segment) {
      this.$emit("update", segment);
    },
    onDeleteSegment(segment) {
      this.$emit("delete", segment);
    },
    onEditDistribution(segment) {
      this.$emit("edit-distribution", segment);
    },
    onCreateConstraint(segment, constraint) {
      this.$emit("create-constraint", { segment, constraint });
    },
    onUpdateConstraint(segment, constraint) {
      this.$emit("update-constraint", { segment, constraint });
    },
    onDeleteConstraint(segment, constraint) {
      this.$emit("delete-constraint", { segment, constraint });
    }
  }
};
</script>
