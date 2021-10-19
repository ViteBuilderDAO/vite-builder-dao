<template>
  <QRCanvas :options="options" @beforeUpdate="onBeforeUpdate" @updated="onUpdated" />
</template>
 
<script>
import { QRCanvas } from 'qrcanvas-vue';
 
export default {
  components: {
    QRCanvas,
  },
  data() {
    return {
      options: {
        data: 'hello',
      },
    };
  },
  methods: {
    onBeforeUpdate() {
      console.log('beforeUpdate');
    },
    onUpdated() {
      console.log('updated');
    },
  },
};
</script>