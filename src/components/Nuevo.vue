<template>
  <b-card id="form_novedad" title="Crear elemento" class="mb-2">
    <b-button size="sm" variant="outline-danger" @click="toggle_nuevo()" id="closebtn">X</b-button>
    <b-form inline class="my-2">
      <label class="sr-only">Categoria</label>
      <b-form-select v-model="categoria" :options="optionsCategoria" size="md" class="m-2"></b-form-select>
      <label class="sr-only">Serie</label>
      <b-input placeholder="Serie o Identificador" v-model="serie" class="mb-2 mr-sm-2 mb-sm-0"></b-input>
    </b-form>
    <b-form inline class="my-2">
      <label class="sr-only">Nombre del elemento</label>
      <b-input placeholder="Nombre del elemento" v-model="name" class="mb-2 mr-sm-2 mb-sm-0"></b-input>
      <label class="sr-only">Marca</label>
      <b-input placeholder="Marca" v-model="marca" class="mb-2 mr-sm-2 mb-sm-0"></b-input>
    </b-form>
    <label class="sr-only">Frecuencia</label>
    <b-form-select v-model="frecuencia" :options="optionsFrecuencia" size="md" class="my-2"></b-form-select>
    <b-form v-if="isElectricos" inline>
      <VueCtkDateTimePicker
        formatted="LL"
        onlyDate
        output-format="YYYY-MM-DD"
        label="Fecha de fabricacion"
        v-model="fechaFab"
        buttonNowTranslation="Hoy"
        class="my-2"
        input-size="md"
        no-header
        no-button-now
      />
      <label class="sr-only">Talla</label>
      <b-input placeholder="Talla" v-model="electricosItems.talla" class="mb-2 mr-sm-2 mb-sm-0"></b-input>
      <label class="sr-only">Clase</label>
      <b-form-select v-model="electricosItems.clase" :options="optionsClase" size="md" class="my-2"></b-form-select>
    </b-form>
    <b-form v-if="isAlturas" inline>
      <VueCtkDateTimePicker
        formatted="LL"
        onlyDate
        output-format="YYYY-MM-DD"
        label="Fecha de fabricacion"
        v-model="fechaFab"
        buttonNowTranslation="Hoy"
        class="my-2"
        input-size="md"
        no-header
        no-button-now
      />
      <label class="sr-only">Talla</label>
      <b-input placeholder="Talla" v-model="alturasItems.talla" class="mb-2 mr-sm-2 mb-sm-0"></b-input>
      <label class="sr-only">Lote</label>
      <b-input placeholder="Lote" v-model="alturasItems.lote" class="mb-2 mr-sm-2 mb-sm-0"></b-input>
      <label class="sr-only">Capacidad</label>
      <b-input
        placeholder="Capacidad"
        v-model="alturasItems.capacidad"
        class="mb-2 mr-sm-2 mb-sm-0"
      ></b-input>
    </b-form>
    <template v-slot:footer>
      <div>
        <b-button size="md" class="mx-2" @click="onSubmit()" variant="success">Guardar</b-button>
      </div>
    </template>
  </b-card>
</template>
<script>
import VueCtkDateTimePicker from "vue-ctk-date-time-picker";
import "vue-ctk-date-time-picker/dist/vue-ctk-date-time-picker.css";
import Swal from "sweetalert2";

export default {
  data() {
    return {
      categoria: null,
      serie: "",
      name: "",
      marca: "",
      fechaFab: "",
      electricos: true,
      frecuencia: null,
      electricosItems: {
        talla: "",
        clase: null
      },
      alturasItems: {
        talla: "",
        lote: "",
        capacidad: ""
      },
      optionsCategoria: [
        { value: null, text: "Categoria" },
        { value: "electricos", text: "Electricos" },
        { value: "medida", text: "Medida" },
        { value: "alturas", text: "Alturas" }
      ],
      optionsFrecuencia: [
        { value: null, text: "Frecuencia" },
        "Mensual",
        "Bimensual",
        "Trimestral",
        "Semestral",
        "Anual"
      ],
      optionsClase: [{ value: null, text: "Clase" }, "0", "1", "2", "4"]
    };
  },
  computed: {
    isElectricos() {
      if (this.categoria == "electricos") {
        return true;
      }
      return false;
    },
    isAlturas() {
      if (this.categoria == "alturas") {
        return true;
      }
      return false;
    }
  },
  components: {
    VueCtkDateTimePicker
  },
  props: {
    toggle_nuevo: Function
  },
  methods: {
    checkForm() {        
      if (
        !this.categoria ||
        !this.serie ||
        !this.name ||
        !this.marca ||
        !this.frecuencia
      ) {
        return false;
      }
      if (this.categoria == "electricos") {
        if (
          !this.electricosItems.talla ||
          !this.electricosItems.clase ||
          !this.fechaFab
        ) {
          return false;
        }
        return true;
      } else if (this.categoria == "alturas") {
        if (
          !this.alturasItems.talla ||
          !this.alturasItems.lote ||
          !this.alturasItems.capacidad ||
          !this.fechaFab
        ) {
          return false;
        }
        return true;
      } else {
        return true;
      }
    },
    onSubmit() {
      if (!this.checkForm()) {
        Swal.fire({
          icon: "warning",
          title: "Falta información",
          showConfirmButton: true
        });
        return;
      }


      //   let url = "http://190.121.135.158/almacen/addNovedad.php";
      let formData = new FormData();
      formData.append("categoria", this.categoria);
      formData.append("serie", this.serie);
      formData.append("name", this.name);
      formData.append("marca", this.marca);
      formData.append("frecuencia", this.frecuencia);
      if (this.categoria == "electricos") {
        formData.append("talla", this.electricosItems.talla);
        formData.append("clase", this.electricosItems.clase);
        formData.append("fechafab", this.fechaFab);
      }
      if (this.categoria == "alturas") {
        formData.append("talla", this.alturasItems.talla);
        formData.append("lote", this.alturasItems.lote);
        formData.append("capacidad", this.alturasItems.capacidad);
        formData.append("fechafab", this.fechaFab);
      }
      console.log(formData);
      
    }
  }
};
</script>
<style scoped>
#closebtn {
  position: absolute;
  top: 0;
  right: 0;
}
</style>