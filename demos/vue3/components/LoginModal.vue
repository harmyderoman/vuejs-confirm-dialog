<script setup lang="ts">
  defineProps({
    title: {
      type: String,
      default: 'Please log in',
    },
  })
  const emit = defineEmits(['confirm', 'cancel']) // must emits
  </script>
  
  <template>
    <form class="card shadow-xl flex flex-col gap-x-10px">
      <h1>{{ title }}</h1>
      <div class="form-control w-full max-w-xs">
        <label class="label">
          <span class="label-text">Nickname:</span>
        </label>
        <input
          type="text"
          placeholder="Type here"
          class="input input-bordered input-accent w-full max-w-xs"
        />
        <label class="label">
          <span class="label-text-alt error">Error</span>
        </label>
      </div>
      <div class="form-control w-full max-w-xs">
        <label class="label">
          <span class="label-text">Email:</span>
          <span class="label-text-alt">Alt label</span>
        </label>
        <input
          type="text"
          placeholder="Type here"
          class="input input-bordered input-info w-full max-w-xs"
        />
        <label class="label">
          <span class="label-text-alt">Alt label</span>
          <span class="label-text-alt">Alt label</span>
        </label>
      </div>
    </form>
  </template>