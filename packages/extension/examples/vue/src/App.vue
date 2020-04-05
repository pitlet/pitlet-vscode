<template>
hello world..........


</template>

<script>
import {ref} from 'vue'
export default {
  setup(){
    const x = ref(0)
    const increment = () => x.value++
    return {
      x,
      increment
    }
  }
}

</script>