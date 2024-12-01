<script lang="ts">
    import '../input.css';  // Asegúrate de que esta ruta sea correcta
    import { onMount, afterUpdate } from 'svelte';

    let messages = [];
    let userMessage = '';
    let selectedPatient = '';
    let isFirstMessage = true;
    let messagesContainer;
    let patientFileContent = ''; // Añadida esta línea

    let patients = [
        { label: 'Legajo 1: Antonio Demo', value: 'demo1-ejemplo-fisioterapia.txt' },
        { label: 'Legajo 2 - Vacío', value: 'legajo2' },
        { label: 'Legajo 3 - Vacío', value: 'legajo3' }
    ];

    let userName = 'Usuario';

    async function loadPatientFile() {
        if (selectedPatient === 'demo1-ejemplo-fisioterapia.txt') {
            try {
                const response = await fetch('/demo1-ejemplo-fisioterapia.txt');
                patientFileContent = response.ok
                    ? await response.text()
                    : 'Error al cargar el archivo de legajo.';
            } catch (error) {
                patientFileContent = 'Error al conectar con el servidor para cargar el archivo.';
            }
        } else {
            patientFileContent = '';
        }
    }

    async function sendMessage() {
        if (!userMessage.trim()) return;
        messages = [...messages, { role: 'user', content: userMessage }];
        userMessage = '';
        try {
            const response = await fetch('/api/verify', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    user: userName,
                    question: userMessage,
                    history: messages,
                    legajo: selectedPatient
                })
            });
            const responseData = await response.json();
            messages = [...messages, { role: 'assistant', content: responseData.message }];
        } catch (error) {
            messages = [...messages, { role: 'assistant', content: 'Error procesando el mensaje.' }];
        }
        isFirstMessage = false;
    }

    function handleSuggestion(suggestion: string) {
    userMessage = suggestion;
    sendMessage();
    }


    afterUpdate(() => {
        if (messagesContainer && !isFirstMessage) {
            messagesContainer.scrollTop = messagesContainer.scrollHeight;
        }
    });
</script>

<svelte:head>
    <title>Asistente Médico Virtual</title>
    <meta name="description" content="Chat de consulta médica" />
</svelte:head>

<div class="w-full h-screen bg-gray-100 flex items-center justify-center">
    <div class="container mx-auto">
        <div class="flex border border-grey rounded shadow-lg h-[600px]">
            <!-- Left Panel -->
            <div class="w-1/3 border flex flex-col bg-white">
                <div class="py-2 px-3 bg-gray-100 flex flex-row justify-between items-center">
                    <h2 class="text-lg font-semibold text-gray-700">Legajos</h2>
                </div>

                <div class="py-2 px-3 bg-white">
                    <select 
                        class="w-full px-2 py-2 text-sm border rounded" 
                        bind:value={selectedPatient} 
                        on:change={loadPatientFile}
                    >
                        <option value="" disabled selected>-- Selecciona un legajo --</option>
                        {#each patients as patient}
                            <option value={patient.value}>{patient.label}</option>
                        {/each}
                    </select>
                </div>

                {#if patientFileContent}
                    <div class="px-3 py-2">
                        <label class="block text-sm font-medium text-gray-700 mb-1">Detalles del Legajo:</label>
                        <textarea 
                            readonly 
                            rows="10" 
                            class="w-full px-2 py-2 text-sm border rounded" 
                            bind:value={patientFileContent}
                        ></textarea>
                    </div>
                {/if}
            </div>

            <!-- Right Panel -->
            <div class="w-2/3 border flex flex-col">
                <div class="py-2 px-3 bg-gray-100 flex flex-row justify-between items-center">
                    <div class="flex items-center">
                        <p class="text-gray-700 font-semibold">Chat Médico</p>
                    </div>
                </div>

                <!-- Messages Area -->
                <div 
                    class="flex-1 overflow-auto p-3" 
                    style="background-color: #DAD3CC"
                    bind:this={messagesContainer}
                >
                    {#each messages as message}
                        <div 
                            class="flex mb-2 {message.role === 'user' ? 'justify-end' : ''}"
                        >
                            <div 
                                class="rounded py-2 px-3 {message.role === 'user' ? 'bg-green-100' : 'bg-gray-200'}"
                            >
                                <p class="text-sm">
                                    {message.role === 'assistant' ? 'Asistente: ' : 'Tú: '}
                                    {message.content}
                                </p>
                            </div>
                        </div>
                    {/each}
                </div>

                <!-- Input Area -->
                <div class="bg-gray-200 px-4 py-4 flex flex-col">
                    <!-- Botones de Sugerencia -->
                    <div class="flex space-x-2 mb-2">
                        <button 
                            style="background-color: #3b82f6; color: white; padding: 0.5rem 1rem; border-radius: 9999px; box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.1);"
                            on:click={() => handleSuggestion("RESUMEN DEL HISTORIAL")}
                        >
                            Resumen del historial
                        </button>
                        <button 
                            class="bg-blue-500 text-white px-3 py-2 rounded-full shadow-md hover:bg-blue-600 transition"
                            on:click={() => handleSuggestion("SUGERENCIAS DE DIAGNÓSTICO")}
                        >
                            Sugerencias de diagnóstico
                        </button>
                        <button 
                            class="bg-blue-500 text-white px-3 py-2 rounded-full shadow-md hover:bg-blue-600 transition"
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
            </div>
        </div>
    </div>
</div>