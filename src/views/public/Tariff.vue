<script setup>
import { ref, onBeforeMount } from 'vue';
import { FilterMatchMode, FilterOperator } from 'primevue/api';

import { TariffService } from '../../service/TariffService';

const filters = ref(null);
const loading = ref(null);

const tariff = ref(null);

const filtersMedico = ref(null);
const loadingMedico = ref(null);

const tariffMedico = ref(null);

const expandedRows = ref([]);

const tariffService = new TariffService();

onBeforeMount(() => {
    tariffService.getTariff().then((data) => (tariff.value = data));
    tariffService.getTariffForMedico().then((data) => (tariffMedico.value = data));

    initFilters();
    initFiltersMedico();
});

const initFilters = () => {
    filters.value = {
        global: { value: null, matchMode: FilterMatchMode.CONTAINS },
        codigoSegus: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }] },
        nombre: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }] },
        costo: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }] }
    };
};
const initFiltersMedico = () => {
    filtersMedico.value = {
        global: { value: null, matchMode: FilterMatchMode.CONTAINS },
        codigoSegus: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }] },
        nombre: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }] },
        medico: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }] },
        costo: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }] }
    };
};

// const expandAll = () => {
//     expandedRows.value = products.value.reduce((acc, p) => (acc[p.id] = true) && acc, {});
// };
// const collapseAll = () => {
//     expandedRows.value = null;
// };
const formatCurrency = (value) => {
    return value.toLocaleString('es-PE', { style: 'currency', currency: 'PEN' });
};
</script>

<template>
    <div class="grid">
        <div class="col-12">
            <div class="card">
                <h5>Tarifario Clinica Santa Rosa</h5>
                <!-- v-model:expandedRows="expandedRows" -->
                <DataTable
                    :value="tariff"
                    :paginator="true"
                    :rows="10"
                    dataKey="idServicio"
                    :rowHover="true"
                    v-model:expandedRows="expandedRows"
                    :loading="loading"
                    :filters="filters"
                    showGridlines
                    :globalFilterFields="['codigoSegus', 'nombre', 'costo', 'grp_seg']"
                >
                    <template #header>
                        <div class="flex justify-content-between flex-column sm:flex-row">
                            <!-- <Button icon="pi pi-plus" label="Expand All" @click="expandAll" />
                            <Button icon="pi pi-minus" label="Collapse All" @click="collapseAll" /> -->
                            <InputText v-model="filters['global'].value" placeholder="Buscar..." />
                        </div>
                    </template>
                    <template #empty> No hay registros que mostrar </template>
                    <template #loading>Cargando tarifario porfavor espere </template>
                    <Column :expander="true" headerStyle="width: 3rem" />
                    <Column field="codigoSegus" header="Codigo Segus" :sortable="true">
                        <template #body="slotProps">
                            {{ slotProps.data.codigoSegus }}
                        </template>
                    </Column>
                    <Column field="nombre" header="Nombre Procedimiento" :sortable="true">
                        <template #body="slotProps">
                            {{ slotProps.data.nombre }}
                        </template>
                    </Column>
                    <Column field="grp_seg" header="Categoría" :sortable="true">
                        <template #body="slotProps">
                            {{ slotProps.data.grp_seg }}
                        </template>
                    </Column>
                    <Column field="costo" header="Costo" :sortable="true">
                        <template #body="slotProps">
                            {{ formatCurrency(Number(slotProps.data.costo)) }}
                        </template>
                    </Column>

                    <template #expansion="slotProps">
                        <div v-if="slotProps.data.personalized_tariff && slotProps.data.personalized_tariff.length > 0" class="p-3">
                            <h5>Personalizado {{ slotProps.data.nombre }}</h5>
                            <DataTable :value="slotProps.data.personalized_tariff">
                                <Column field="medico" header="Médico" :sortable="true">
                                    <template #body="slotProps">
                                        {{ slotProps.data.medico }}
                                    </template>
                                </Column>
                                <Column field="costoPersonalizado" header="Costo Personalizado" :sortable="true">
                                    <template #body="slotProps">
                                        {{ formatCurrency(slotProps.data.costoPersonalizado) }}
                                    </template>
                                </Column>
                            </DataTable>
                        </div>
                    </template>
                </DataTable>
            </div>
        </div>
        <div class="col-12">
            <div class="card">
                <h5>Tarifario MÉDICOS -> Clinica Santa Rosa</h5>
                <!-- v-model:expandedRows="expandedRows" -->
                <DataTable
                    :value="tariffMedico"
                    :paginator="true"
                    :rows="10"
                    dataKey="id_personalized_tariff"
                    :rowHover="true"
                    :loading="loadingMedico"
                    :filters="filtersMedico"
                    showGridlines
                    :globalFilterFields="['codigoSegus', 'nombre', 'costoPersonalizado', 'general_tariff.grp_seg', 'medico']"
                >
                    <template #header>
                        <div class="flex justify-content-between flex-column sm:flex-row">
                            <InputText v-model="filtersMedico['global'].value" placeholder="Buscar..." />
                        </div>
                    </template>
                    <template #empty> No hay registros que mostrar </template>
                    <template #loading>Cargando tarifario porfavor espere </template>
                    <Column field="codigoSegus" header="Codigo Segus" :sortable="true">
                        <template #body="slotProps">
                            {{ slotProps.data.codigoSegus }}
                        </template>
                    </Column>
                    <Column field="nombre" header="Nombre Procedimiento" :sortable="true">
                        <template #body="slotProps">
                            {{ slotProps.data.nombre }}
                        </template>
                    </Column>
                    <Column field="medico" header="Médico" :sortable="true">
                        <template #body="slotProps">
                            {{ slotProps.data.medico }}
                        </template>
                    </Column>
                    <Column field="general_tariff.grp_seg" header="Categoría" :sortable="true">
                        <template #body="slotProps">
                            {{ slotProps.data.general_tariff.grp_seg }}
                        </template>
                    </Column>
                    <Column field="costoPersonalizado" header="Costo" :sortable="true">
                        <template #body="slotProps">
                            {{ formatCurrency(Number(slotProps.data.costoPersonalizado)) }}
                        </template>
                    </Column>
                </DataTable>
            </div>
        </div>
    </div>
</template>

<style scoped lang="scss">
:deep(.p-datatable-frozen-tbody) {
    font-weight: bold;
}

:deep(.p-datatable-scrollable .p-frozen-column) {
    font-weight: bold;
}
</style>
