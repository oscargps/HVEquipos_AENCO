<template>
  <div>
    <tabletemplate :excel="true" :clickNovedad="addNovedad" :clickNuevo="toggle_nuevo" />
    <!-- Formulario de novedad -->
    <div class="row align-items-center justify-content-center" id="form" v-if="novedades_form">
      <b-card id="form_novedad" header="Nueva Novedad">
        <b-button size="sm" variant="outline-danger" @click="toggle_novedadess()" id="closebtn">X</b-button>
        <div>
          <b-form inline>
            <label class="sr-only">Elemento</label>
            <b-input class="mb-2 mr-sm-2 mb-sm-0" disabled :value="novedad_form.name"></b-input>
            <label class="sr-only">Serie</label>
            <b-input class="mb-2 mr-sm-2 mb-sm-0" disabled :value="novedad_form.serie"></b-input>
          </b-form>
        </div>
        <VueCtkDateTimePicker
          formatted="LL"
          onlyDate
          output-format="YYYY-MM-DD"
          label="Fecha"
          v-model="novedad_form.fecha"
          buttonNowTranslation="Hoy"
          class="my-2"
                      no-header

        />
        <b-form-select
          v-model="novedad_form.tipo"
          :options="novedad_options"
          size="md"
          class="my-2"
        ></b-form-select>
        <b-form inline>
          <b-form-select
            v-model="novedad_form.estado"
            :options="novedad_estado_options"
            size="md"
            class="my-2"
          ></b-form-select>
          <label class="sr-only">N° de Certificado</label>
          <b-input
            class="mb-2 mr-sm-2 mb-sm-0"
            v-model="novedad_form.certificado"
            placeholder="N° certificado(opcional)
            "
          ></b-input>
        </b-form>
        <model-list-select
          class="my-2"
          :list="trabajadores"
          v-model="novedad_form.trabajador"
          option-text="name"
          option-value="cedula"
          placeholder="Trabajador asignado"
        ></model-list-select>
        <template v-slot:footer>
          <div>
            <b-button size="md" class="mx-2" @click="onSubmit()" variant="success">Guardar</b-button>
          </div>
        </template>
      </b-card>
    </div>
    <!-- Formulario de equipo nuevo -->
    <div class="row align-items-center justify-content-center" id="form" v-if="nuevo_form">
        <Nuevo :toggle_nuevo="toggle_nuevo"/>
    </div>
  </div>
</template>

<script>
import tabletemplate from "../components/tabletemplate";
import Nuevo from "../components/Nuevo";
import Swal from "sweetalert2";
import VueCtkDateTimePicker from "vue-ctk-date-time-picker";
import "vue-ctk-date-time-picker/dist/vue-ctk-date-time-picker.css";
import { ModelListSelect } from "vue-search-select";
import axios from "axios";
export default {
  data() {
    return {
      novedades_form: false,
      nuevo_form: false,
      categoria: "",
      novedad_form: {
        id: "",
        serie: "",
        name: "",
        fecha: "",
        tipo: null,
        estado: null,
        certificado: null,
        trabajador: ""
      },
      trabajadores: [
        {
          id: 1,
          name: "Juan"
        },
        {
          id: 2,
          name: "Pedro"
        },
        {
          id: 3,
          name: "Luis"
        }
      ],
      novedad_estado_options: [
        { value: null, text: "Estado de equipo" },
        "Apto",
        "No Apto"
      ],
      novedad_options: [
        { value: null, text: "Tipo de novedad" },
        "Asignación",
        {
          label: "Pruebas",
          options: [
            "Inspección",
            "Ensayo(Prueba de resistencia)",
            "Calibración",
            "Verificación"
          ]
        },
        "Reintegro"
      ]
    };
  },
  components: {
    VueCtkDateTimePicker,
    tabletemplate,
    ModelListSelect,
    Nuevo
  },

  mounted() {
    this.getPersonal();
  },
  methods: {
    clearForm() {
      this.novedad_form.id = "";
      this.novedad_form.serie = "";
      this.novedad_form.name = "";
      this.novedad_form.fecha = "";
      this.novedad_form.tipo = null;
      this.novedad_form.estado = null;
      this.novedad_form.certificado = 0;
      this.novedad_form.trabajador = "";
    },
    toggle_novedadess() {
      this.novedades_form = !this.novedades_form;
    },
    toggle_nuevo() {
      this.nuevo_form = !this.nuevo_form;
    },
    checkForm() {
      if (
        !this.novedad_form.tipo ||
        !this.novedad_form.estado ||
        !this.novedad_form.trabajador ||
        !this.novedad_form.fecha
      ) {
        return false;
      }
      return true;
    },
    getPersonal() {
      return axios
        .get("http://190.121.135.158/almacen/getPersonal.php")
        .then(response => {
          this.trabajadores = response.data;
        })
        .catch(error => {
          console.log(error);
        });
    },

    addNovedad(id, categoria) {
      this.categoria = categoria;
      this.toggle_novedadess();
      let values = Object.values(id);
      this.novedad_form.id = values[0];
      this.novedad_form.serie = values[1];
      this.novedad_form.name = values[2];
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
      let url = "https://hvequipos.000webhostapp.com/addNovedad.php";
      let formData = new FormData();
      formData.append("categoria", this.categoria);
      formData.append("id", this.novedad_form.id);
      formData.append("serie", this.novedad_form.serie);
      formData.append("fecha", this.novedad_form.fecha);
      formData.append("tipo", this.novedad_form.tipo);
      formData.append("estado", this.novedad_form.estado);
      formData.append("certificado", this.novedad_form.certificado);
      formData.append("trabajador", this.novedad_form.trabajador);
      axios
        .post(url, formData)
        .then(response => {
          console.log(response);
          this.toggle_novedadess();
          this.clearForm();
          Swal.fire({
            icon: "success",
            title: "Se ha registrado la novedad",
            showConfirmButton: true
          });
        })
        .catch(error => {
          console.log(error);
          Swal.fire({
            icon: "error",
            title: "Error",
            showConfirmButton: true
          });
        });
    }
  }
};
</script>

<style scoped>
#form {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.8);
  z-index: 3;
}
#form_novedad {
  height: 100%;
}
#closebtn {
  position: absolute;
  top: 0;
  right: 0;
}

</style>
