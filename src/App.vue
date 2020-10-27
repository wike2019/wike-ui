<template>
      <div class="container">
            <mHeader></mHeader>
            <router-view ></router-view>
      </div>
</template>


<script lang="ts">
      import mHeader from './components/header/index.vue'
      import { defineComponent} from 'vue'
      export default defineComponent({
            name: 'app',
            components: {
                  mHeader
            },
      })
</script>
