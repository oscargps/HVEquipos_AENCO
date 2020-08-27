<template>
  <div>
    <tablaHistorial :excel="true" :id="id" :categoria="categoria" />
  </div>
</template>
<script>
import tablaHistorial from "@/components/tablaHistorial";
export default {
  components: {
    tablaHistorial
  },
  data() {
    return {
      categoria: this.$route.params.categoria,
      id: "",
    };
  },
  beforeMount(){
    let values = Object.values(this.$route.params.id);
    this.id = values[0];
    console.log('id=',this.id);
  }
};
</script>