<template>
  <div class="t-button" @click="clickHandle">button {{ cnt }}</div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';
import { logger } from '../utils/index';

export default defineComponent({
  name: 'TButton',
  setup() {
    const cnt = ref(0);
    return {
      cnt,
      clickHandle() {
        cnt.value++;
        logger.info(`button clicked ${cnt.value}`);
      },
    };
  },
});
</script>

<style scoped>
.t-button {
  width: 100px;
  height: 30px;
  display: flex;
  justify-content: center;
  align-items: center;
  border: 1px solid #f40;
  color: #fff;
  background-color: #008c8c;
  cursor: pointer;
}
</style>
