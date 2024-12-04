<script lang="ts">
    export let userMessage: string;
    export let handleSuggestion: (suggestion: string) => void;
    export let sendMessage: () => void;

    // Función para manejar el evento de teclado
    function handleKeyDown(event: KeyboardEvent) {
        if (event.key === "Enter" && !event.shiftKey) {
            // Evitar el salto de línea si solo se presiona Enter
            event.preventDefault();
            sendMessage(); // Enviar el mensaje
        }
    }
</script>

<div class="bg-gray-200 px-4 py-4 flex flex-col">
    <!-- Botones de Sugerencia -->
    <div class="flex space-x-2 mb-2">
        <button 
            class="bg-[#094199] text-white px-3 py-2 rounded-full shadow-md hover:bg-[#094199] transition"
            on:click={() => handleSuggestion("RESUMEN DEL HISTORIAL")}
        >
            Resumen del historial
        </button>
        <button 
            class="bg-[#094199] text-white px-3 py-2 rounded-full shadow-md hover:bg-[#094199] transition"
            on:click={() => handleSuggestion("SUGERENCIAS DE DIAGNÓSTICO")}
        >
            Sugerencias de diagnóstico
        </button>
        <button 
            class="bg-[#094199] text-white px-3 py-2 rounded-full shadow-md hover:bg-[#094199] transition"
            on:click={() => handleSuggestion("SUGERIR TRATAMIENTO")}
        >
            Sugerir tratamiento
        </button>
    </div>


    <!-- Input de Texto y Botón de Enviar -->
    <div class="flex items-center">
        <div class="flex-1 mr-4">
            <input 
                class="w-full border rounded px-2 py-2" 
                type="text" 
                placeholder="Escribe tu mensaje aquí..."
                bind:value={userMessage}
                on:keydown={handleKeyDown}  
            />
        </div>
        <div>
            <button 
                class="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition"
                on:click={sendMessage}
            >
                Enviar
            </button>
        </div>
    </div>
</div>
