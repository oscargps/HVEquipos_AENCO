<template>
  <b-container fluid>
    <!-- User Interface controls -->
    <b-row>
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
      <b-col sm="3" class="my-1">
        <b-button-group>
          <b-button @click="getData('alturas')">Alturas</b-button>
          <b-button @click="getData('electricos')">Eléctricos</b-button>
          <b-button @click="getData('medida')">Medida</b-button>
        </b-button-group>
      </b-col>
      <b-col sm="1" class="my-1">
        <b-button variant="primary" @click="clickNuevo(categoria)">
          Nuevo
        </b-button>
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
        <template v-slot:cell(actions)="row">

          <b-button variant="primary" size="sm" class="m-2" @click="clickNovedad(row.item, categoria)">Agregar novedad</b-button>
          <b-button variant="info" size="sm" :to="{ name:'historial', params: { categoria:categoria, id:row.item}}">Ver Historial</b-button>
        </template>
        <template v-slot:row-details="row">
          <b-card :title="row.item.familiar">
            <b-table
              stacked
              :fields="[{key: 'telefono',label: 'Telefono'},{key: 'correo',label: 'Correo'}]"
              :items="[row.item]"
            ></b-table>
          </b-card>
        </template>
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
      loading: true,
      items: [],
      campos: null,
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
    Listado: Boolean,
    clickNovedad:Function,
    clickNuevo: Function
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
      temp_fields.push({ key: "actions", label: "" });
      return temp_fields;
    }
  },
  mounted() {
    // this.getData();
    this.totalRows = this.items.length;
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
    info(item, index, button) {
      if (this.reportes) {
        this.infoModal.title = item.name;
        this.infoModal.content = this.getFolder(item.tipo_reporte) + item.img;
        this.$root.$emit("bv::show::modal", this.infoModal.id, button);
      } else {
        this.infoModal.title = item.name;
        this.infoModal.content = this.folder + item.img;
        this.$root.$emit("bv::show::modal", this.infoModal.id, button);
      }
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
    getData(categoria) {
      this.loading = true;
      this.categoria = categoria
      console.log("Getting data of " + categoria);
      let url =
        "http://190.121.135.158/almacen/getData.php?categoria=" + categoria;
      console.log(url);

      return axios
        .get(url)
        .then(response => {
          this.loading = false;
          this.campos = Object.keys(response.data[0]);
          this.items = response.data;
          this.filter = " ";
          this.filter = null;
        })
        .catch(error => {
          console.log(error);
        });
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
    }
  }
};
</script>
<style lang="css">
.evidencia {
  width: 80%;
}
</style>