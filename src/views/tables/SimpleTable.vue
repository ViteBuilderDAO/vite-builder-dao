<template>
  <v-row>
    <!-- basic -->
    <v-col cols="12">
      <v-card>
        <v-card-title>Basic</v-card-title>
        <demo-tables-basic></demo-tables-basic>
      </v-card>
    </v-col>

    <!-- dark -->
    <v-col cols="12">
      <v-card>
        <v-card-title>Dark</v-card-title>
        <v-card-text>
          Use <code>dark</code> prop to switch table to the dark theme.
        </v-card-text>
        <demo-tables-dark></demo-tables-dark>
      </v-card>
    </v-col>

    <!-- Dense -->
    <v-col cols="12">
      <v-card>
        <v-card-title>Dense</v-card-title>
        <v-card-text>
          You can show a dense version of the table by using the <code>dense</code> prop.
        </v-card-text>
        <demo-tables-dense></demo-tables-dense>
      </v-card>
    </v-col>

    <!-- height -->
    <v-col cols="12">
      <v-card>
        <v-card-title>Height</v-card-title>
        <v-card-text>
          Use the <code>height</code> prop to set the height of the table.
        </v-card-text>
        <demo-tables-height></demo-tables-height>
      </v-card>
    </v-col>

    <!-- fixed header -->
    <v-col cols="12">
      <v-card>
        <v-card-title>Fixed header</v-card-title>
        <v-card-text>
          Use the <code>fixed-header</code> prop together with the <code>height</code> prop to fix the header to the top of the table.
        </v-card-text>

        <demo-tables-fixed-header></demo-tables-fixed-header>
      </v-card>
    </v-col>
  </v-row>
</template>

<script>
const DemoTablesBasic = () => import('./demos/DemoSimpleTableBasic.vue')
const DemoTablesDark = () => import('./demos/DemoSimpleTableDark.vue')
const DemoTablesDense = () => import('./demos/DemoSimpleTableDense.vue')
const DemoTablesHeight = () => import('./demos/DemoSimpleTableHeight.vue')
const DemoTablesFixedHeader = () => import('./demos/DemoSimpleTableFixedHeader.vue')

export default {
  components: {
    DemoTablesBasic,
    DemoTablesDark,
    DemoTablesDense,
    DemoTablesHeight,
    DemoTablesFixedHeader,
  },
  setup() {
    return {}
  },
}
</script>
