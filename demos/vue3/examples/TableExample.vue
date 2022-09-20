<script lang="ts" setup>
  import EditableTable from './../components/EditableTable.vue'
  </script>
  
  <template>
    <h2 class="card-title">Edit Table with Popup</h2>
    <p>
      You can use this package to create and reuse popups. 
    </p>
    <p>
      To edit the values in the table, click on one of the cells.
    </p>
  
    <div class="card shadow-xl mt-4 mb-4">
      <div class="justify-end card-body">
        <EditableTable />
      </div>
    </div>
    <p>
      <a 
        class="link link-primary" 
        href="https://github.com/harmyderoman/vuejs-confirm-dialog/blob/main/demos/vue3/components/EditableTable.vue">
          Editable Table Example
      </a>
    </p>
    <div class="divider"></div>
  </template>