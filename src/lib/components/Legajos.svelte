<script lang="ts">
    import { loadPatientFile } from '../../utils/loadPatientFile';
    export let patients = [];
    export let selectedPatient: string | null = null;  // Recibir selectedPatient como propiedad
    export let patientFileContent = '';  // El contenido del archivo del paciente
    let showSelectMessage = true;

    // Cuando se seleccione un legajo
    const handleChange = async (event) => {
        const newSelectedPatient = event.target.value;
        console.log("Nuevo valor seleccionado en select:", newSelectedPatient);

        // Actualizamos el valor de selectedPatient solo si hay una selección
        if (newSelectedPatient !== '') {
            selectedPatient = newSelectedPatient;  // Actualizar selectedPatient directamente

            // Cargar el archivo correspondiente
            try {
                console.log("Cargando archivo para el legajo:", newSelectedPatient);
                patientFileContent = await loadPatientFile(newSelectedPatient);
                console.log("Contenido del archivo cargado:", patientFileContent); // Verifica el contenido cargado
            } catch (error) {
                console.error("Error al cargar el archivo:", error); // Mostrar detalles del error
                patientFileContent = `Error al cargar el archivo: ${error.message || 'Desconocido'}`;
            }
        }
    };
</script>

<div class="w-full h-full flex flex-col bg-white rounded-lg shadow-sm p-4">
  <!-- Título de la sección -->
  <div class="py-3 px-4 bg-gray-100 flex justify-between items-center rounded-t-lg">
    <h2 class="text-lg font-semibold text-gray-700">Legajos</h2>
  </div>

  <!-- Selección de paciente -->
  <div class="py-4 px-5 bg-white">
    <select
      class="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
      bind:value={selectedPatient}
      on:change={handleChange}
    >
      <!-- Mensaje de invitación si no se ha seleccionado un legajo -->
      <option value="" disabled selected={selectedPatient === ""}>
        -- Selecciona un legajo --
      </option>

      <!-- Opciones de pacientes -->
      {#each patients as patient}
        <option value={patient.value}>{patient.label}</option>
      {/each}
    </select>
  </div>

  <!-- Mostrar detalles del legajo si se ha seleccionado un paciente -->
  {#if patientFileContent}
    <div class="flex-1 px-5 py-4 overflow-auto">
      <label class="block text-sm font-medium text-gray-700 mb-2">Detalles del Legajo:</label>
      <textarea
        readonly
        class="w-full h-full px-3 py-2 text-sm border border-gray-300 rounded-lg bg-gray-50 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        bind:value={patientFileContent}
      ></textarea>
    </div>
  {/if}
</div>

