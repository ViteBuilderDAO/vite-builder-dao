<template>
  <v-card>
    <div class="d-flex flex-sm-row flex-column">
      <div class="flex-grow-1">
        <v-card-title>
          <span class="me-3">Growth</span>
          <v-spacer></v-spacer>
          <span class="text-xs text--disabled cursor-pointer">View All</span>
        </v-card-title>

        <v-card-text>
          <v-list>
            <v-list-item
              v-for="(data,index) in growth"
              :key="data.img"
              :class="`d-flex px-0 ${index > 0 ? 'mt-4':''}`"
            >
              <v-img
                contain
                max-height="30"
                max-width="30"
                :src="data.img"
                class="me-3"
              ></v-img>

              <div class="d-flex align-center flex-grow-1 flex-wrap">
                <div class="me-auto pe-2">
                  <h4 class="font-weight-semibold">
                    {{ data.title }}
                  </h4>
                  <span class="text-xs">{{ data.subtitle }}</span>
                </div>

                <span class="font-weight-semibold success--text">{{ data.amount }}</span>
              </div>
            </v-list-item>
          </v-list>
        </v-card-text>
      </div>

      <v-divider
        class="my-sm-5 mx-5"
        :vertical="$vuetify.breakpoint.smAndUp"
      ></v-divider>

      <div class="flex-grow-1">
        <v-card-title>
          <span class="me-3">Decay</span>
          <v-spacer></v-spacer>
          <span class="text-xs text--disabled cursor-pointer">View All</span>
        </v-card-title>

        <v-card-text>
          <v-list>
            <v-list-item
              v-for="(data,index) in decay"
              :key="data.img"
              :class="`d-flex px-0 ${index > 0 ? 'mt-4':''}`"
            >
              <v-img
                max-height="30"
                max-width="30"
                :src="data.img"
                class="me-3"
              ></v-img>

              <div class="d-flex align-center flex-grow-1 flex-wrap">
                <div class="me-auto pe-2">
                  <h4 class="font-weight-semibold">
                    {{ data.title }}
                  </h4>
                </div>

                <span class="font-weight-semibold error--text">{{ data.amount }}</span>
              </div>
            </v-list-item>
          </v-list>
        </v-card-text>
      </div>
    </div>
  </v-card>
</template>

<script>
export default {
  setup() {
    const growth = [
      {
        img: require('@/assets/img/logos/vite.png'),
        title: 'VITE',
        amount: '+5.67%',
      },
      {
        img: require('@/assets/img/logos/vitc.png'),
        title: 'VITC',
        amount: '+4.2%',
      },
      {
        img: require('@/assets/img/logos/vx.png'),
        title: 'VX',
        amount: '+3.87%',
      },
      {
        img: require('@/assets/img/logos/bus.png'),
        title: 'BUS',
        amount: '+3.63%',
      },
      {
        img: require('@/assets/img/logos/arweave.png'),
        title: 'ARWEAVE',
        amount: '+2.11%',
      },
    ]
    const decay = [
      {
        img: require('@/assets/img/logos/nano.png'),
        title: 'NANO',
        amount: '-1.45%',
      },
      {
        img: require('@/assets/img/logos/cvc.png'),
        title: 'CVC',
        amount: '-1.870%',
      },
      {
        img: require('@/assets/img/logos/xrt.png'),
        title: 'XRT',
        amount: '-4.5%',
      },
      {
        img: require('@/assets/img/logos/tera.png'),
        title: 'TERA',
        amount: '-5.24%',
      },
      {
        img: require('@/assets/img/logos/bitcoin.png'),
        title: 'BTC',
        amount: '-5.24%',
      },
    ]

    return {
      growth,
      decay,
    }
  },
}
</script>
