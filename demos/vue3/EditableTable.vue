<script lang="ts" setup>
import { ref } from 'vue'
import PopupEdit from './components/PopupEdit.vue'
import { createConfirmDialog } from './../../src/createConfirmDialog'

const editValue = (val, rowId, key, event) => {
  console.log("event:")
  console.log(event)
  const popup = createConfirmDialog(PopupEdit)
  popup.reveal({ value: val, event: event })

  popup.onConfirm((data) => {
    table.value[rowId][key] = data
  })
}

const tableHead = ref({
  id: '\\',
  name: 'Name',
  job: 'Job',
  color: 'Favorite Color',
})

const table = ref([
  {
    id: 1,
    name: 'Cy Ganderton',
    job: 'Quality Control Specialist',
    color: 'Blue',
  },
  {
    id: 2,
    name: 'Hart Hagerty',
    job: 'Desktop Support Technician',
    color: 'Purple',
  },
  {
    id: 3,
    name: 'Brice Swyre',
    job: 'Tax Accountant',
    color: 'Red',
  },
])
</script>

<template>
  <div class="overflow-x-auto">
    <table class="table w-full">
      <thead>
        <tr>
          <th v-for="(col, i) in tableHead" :key="i">{{ col }}</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(row, i) in table" :key="i">
          <th
            v-for="(item, key, index) in row"
            @click="(event) => editValue(item, i, key, event)"
            :key="index"
          >
            {{ item }}
          </th>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<style>
th {
  cursor: pointer;
}
</style>
