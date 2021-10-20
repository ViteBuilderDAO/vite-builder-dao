<template>
  <div>
    <el-row
      type="flex"
      align="middle"
      class="row"
    >
      <el-col
        class="key-col col no-border label"
        :span="5"
      >
        Wallet Address
      </el-col>
      <el-col
        class="key-col col no-border"
        :span="16"
      >
        {{ account.address }}
      </el-col>
    </el-row>
  </div>
</template>

<script>
import { mapState } from 'vuex'

export default {
  computed: {
    ...mapState([
      'accounts',
    ]),
  },
}
</script>

<style lang="scss" scoped>
</style>
