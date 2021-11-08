<template>
  <v-card>
    <v-data-table
      :headers="headers"
      :items="usreList"
      item-key="full_name"
      class="table-rounded"
      hide-default-footer
      disable-sort
    >
      <!-- name -->
      <template #[`item.full_name`]="{item}">
        <div class="d-flex flex-column">
          <span class="d-block font-weight-semibold text--primary text-truncate">{{ item.full_name }}</span>
          <small>{{ item.post }}</small>
        </div>
      </template>
      <template #[`item.salary`]="{item}">
        {{ `$${item.salary}` }}
      </template>
      <!-- status -->
      <template #[`item.status`]="{item}">
        <v-chip
          small
          :color="statusColor[status[item.status]]"
          class="font-weight-medium"
        >
          {{ status[item.status] }}
        </v-chip>
      </template>
    </v-data-table>
  </v-card>
</template>

<script>
import { mdiSquareEditOutline, mdiDotsVertical } from '@mdi/js'
import data from './widgetDataTable'

export default {
  setup() {
    const statusColor = {
      /* eslint-disable key-spacing */
      Pending: 'primary',
      Success: 'success',
      Fail: 'error',
      Resigned: 'warning',
      QuotaLow: 'info',
      /* eslint-enable key-spacing */
    }

    return {
      headers: [
        { text: 'TRANSACTION', value: 'full_name' },
        { text: 'ADDRESS', value: 'address' },
        { text: 'DATE', value: 'start_date' },
        { text: 'AMOUNT', value: 'salary' },
        { text: 'ID', value: 'age' },
        { text: 'STATUS', value: 'status' },
      ],
      usreList: data,
      status: {
        1: 'Pending',
        2: 'Success',
        3: 'Fail',
        4: 'QuotaLow',
      },
      statusColor,

      // icons
      icons: {
        mdiSquareEditOutline,
        mdiDotsVertical,
      },
    }
  },
}
</script>
