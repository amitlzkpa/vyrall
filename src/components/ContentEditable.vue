<template>
  <span>
    <div
      v-if="tag === 'div'"
      ref="editableDiv"
      :style="styleText"
      contenteditable
      v-on="listeners"
    />
    <p
      v-if="tag === 'p'"
      ref="editableP"
      :style="styleText"
      contenteditable
      v-on="listeners"
    />
    <span
      v-if="tag === 'span'"
      ref="editableSpan"
      :style="styleText"
      contenteditable
      v-on="listeners"
    />
    <div style="position: relative; width: 0; height: 0">
      <div
        v-if="!value"
        :style="`
          ${styleText}
          position: absolute;
          color: #DEDEDE;
          bottom: 0px;
          left: 0px;
          z-index: -9999;
          `"
      >
        {{ placeholderValue }}
      </div>
    </div>
  </span>
</template>

<script>
export default {
  props: {
    tag: {
      type: String,
      default: "span",
    },
    styleText: {
      type: String,
      default: "",
    },
    value: {
      type: String,
      default: "",
    },
    placeholderValue: {
      type: String,
      default: "",
    },
  },
  computed: {
    listeners() {
      return { ...this.$listeners, input: this.onInput };
    },
  },
  mounted() {
    switch (this.tag) {
      case "div": {
        this.$refs.editableDiv.innerText = this.value;
        break;
      }
      case "p": {
        this.$refs.editableP.innerText = this.value;
        break;
      }
      case "span": {
        this.$refs.editableSpan.innerText = this.value;
        break;
      }
    }
  },
  methods: {
    onInput(e) {
      this.$emit("input", e.target.innerText);
    },
  },
};
</script>