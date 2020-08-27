<template>
  <b-container fluid>
    <!-- User Interface controls -->
    <b-row>
      <b-col sm="1" class="my-1">
        <b-button size="sm" variant="secondary" :to="{ name:'Listado'}">Volver</b-button>
      </b-col>
      <b-col sm="3" class="my-1">
        <h2>Novedades</h2>
      </b-col>
      <b-col sm="4" class="my-1">
        <b-form-group label-cols-sm="3" label="Filtrar" class="mb-0">
          <b-input-group>
            <b-form-input v-model="filter" placeholder="Buscar.."></b-form-input>
            <b-input-group-append>
              <b-button :disabled="!filter" variant="primary" @click="filter = ''">Limpiar</b-button>
            </b-input-group-append>
          </b-input-group>
        </b-form-group>
      </b-col>
      <b-col sm="3" class>
        <b-form-group label-cols-sm="3" label="Mostrar" class="mb-1">
          <b-form-select v-model="perPage" :options="pageOptions"></b-form-select>
        </b-form-group>
      </b-col>

      <b-col sm="1" v-if="excel">
        <b-button class="my-1" variant="success">
          <download-excel
            :before-finish="finishDownload"
            :before-generate="startDownload"
            :name="nameExcel"
            :title="TitleExcel"
            :fields="Fexcel"
            :data="items"
          >Excel</download-excel>
        </b-button>
      </b-col>
    </b-row>

    <hr />

    <div v-if="loading">
      <h2>Seleccione una categoria</h2>
    </div>
    <div v-else>
      <!-- Main table element -->
      <b-table
        striped
        small
        hover
        show-empty
        stacked="md"
        :sort-by.sync="sortBy"
        :sort-desc.sync="sortDesc"
        :items="items"
        :fields="fields"
        :current-page="currentPage"
        :per-page="perPage"
        :filter="filter"
        @filtered="onFiltered"
        :tbody-tr-class="rowClass"
      >
        <template v-slot:cell(actions)></template>
      </b-table>
    </div>

    <b-modal :id="infoModal.id" :title="infoModal.title" ok-only @hide="resetInfoModal">
      <b-table stacked :items="this.infoModal.content"></b-table>
    </b-modal>
    <b-row>
      <b-col md="6" class="my-1">
        <b-pagination
          v-model="currentPage"
          :total-rows="totalRows"
          :per-page="perPage"
          class="my-0"
        ></b-pagination>
      </b-col>
    </b-row>
  </b-container>
</template>

<script>
import Swal from "sweetalert2";
import axios from "axios";
export default {
  data() {
    return {
      sortBy: "fecha",
      sortDesc: true,
      loading: false,
      campos: [],
      items: [],
      totalRows: 1,
      currentPage: 1,
      perPage: 10,
      pageOptions: [5, 10, 15],
      filter: null,
      infoModal: {
        id: "info-modal",
        title: "",
        content: [],
        items: []
      }
    };
  },
  props: {
    data: Array,
    Fexcel: Object,
    TitleExcel: String,
    excel: Boolean,
    categoria: String,
    id: String
  },
  computed: {
    sortOptions() {
      // Create an options list from our fields
      return this.fields
        .filter(f => f.sortable)
        .map(f => {
          return {
            text: f.label,
            value: f.key
          };
        });
    },
    nameExcel() {
      return this.TitleExcel + ".xls";
    },
    fields() {
      let temp_fields = [];
      this.campos.map(campo => {
        let temp_campo = campo.split("_");
        temp_fields.push({
          key: campo,
          label: temp_campo[1].toUpperCase(),
          sortable: true,
          sortDirection: "desc"
        });
      });
      return temp_fields;
    }
  },
  mounted() {
    this.totalRows = this.items.length;
    console.log("historial", this.id, this.categoria);

    this.getData();
  },
  methods: {
    rowClass(item, type) {
      if (!item || type !== "row") return;
      if (item.temperatura > 37) return "table-danger";
    },
    infoTable(item, index, button) {
      this.infoModal.title = item.nombre;
      this.infoModal.content = [item.sintomas];
      this.$root.$emit("bv::show::modal", this.infoModal.id, button);
    },
    resetInfoModal() {
      this.infoModal.title = "";
      this.infoModal.content = [];
      this.infoModal.items = [];
    },
    onFiltered(filteredItems) {
      // Trigger pagination to update the number of buttons/pages due to filtering
      this.totalRows = filteredItems.length;
      this.currentPage = 1;
    },
    finishDownload() {
      Swal.fire({
        icon: "success",
        title: "Se ha generado tu reporte!",
        showConfirmButton: true
      });
    },
    startDownload() {
      console.log("Generando el reporte..");
    },
    getData() {
      let url =
        "https://hvequipos.000webhostapp.com/getNovedades.php?categoria=" +
        this.categoria +
        "&id=" +
        this.id;
      console.log(url);

      return axios
        .get(url)
        .then(response => {
          console.log(response.data);
          this.campos = Object.keys(response.data[0]);
          this.items = response.data;
        })
        .catch(error => {
          console.log(error);
        });
    }
  }
};
</script>
<style lang="css">
</style>