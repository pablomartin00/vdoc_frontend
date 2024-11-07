<script lang="ts">
    import { onMount, afterUpdate } from 'svelte';

    let showForm = true;
    let messages = [];
    let userMessage = '';
    let selectedPatient = ''; // Para el legajo médico seleccionado
    let loadingMessage = false;
    let patientFileContent = ''; // Contenido del archivo de legajo seleccionado

    // Opciones de pacientes para el dropdown
    let patients = [
        { label: 'Legajo 1: Antonio Demo', value: 'demo1-ejemplo-fisioterapia.txt' },
        { label: 'Legajo 2 - Vacío', value: 'legajo2' },
        { label: 'Legajo 3 - Vacío', value: 'legajo3' }
    ];

    let userName = 'Usuario'; // Asumimos que esta variable puede ser un nombre de usuario
    let birthChartReport = ''; // Información adicional que puedas necesitar incluir

    async function loadPatientFile() {
        console.log('Función loadPatientFile llamada'); // Confirmación de que se llama a la función
        console.log('Paciente seleccionado:', selectedPatient); // Verificar qué legajo se seleccionó

        if (selectedPatient === 'demo1-ejemplo-fisioterapia.txt') {
            try {
                const response = await fetch('/demo1-ejemplo-fisioterapia.txt');
                if (response.ok) {
                    patientFileContent = await response.text();
                    console.log('Contenido del legajo cargado:', patientFileContent); // Mostrar contenido cargado
                } else {
                    console.error('Error al cargar el archivo del legajo');
                    patientFileContent = 'Error al cargar el archivo de legajo.';
                }
            } catch (error) {
                console.error('Error al cargar el archivo:', error);
                patientFileContent = 'Error al conectar con el servidor para cargar el archivo.';
            }
        } else {
            patientFileContent = ''; // Limpiar el contenido si se elige otro legajo
            console.log('Legajo vacío seleccionado, contenido limpiado');
        }
    }


    // Validación del formulario
    function validateForm() {
        if (!selectedPatient) {
            alert('Por favor, selecciona un legajo médico.');
            return false;
        }
        return true;
    }

    async function startChat() {
        if (!validateForm()) return;

        loadingMessage = true;

        try {
            // Llamada al backend para cargar el documento del legajo seleccionado
            const response = await fetch('/api/loaddocument', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ legajo: selectedPatient })
            });

            if (!response.ok) {
                throw new Error('Error al cargar el documento');
            }

            const result = await response.json();
            if (result.success) {
                messages = [
                    { role: 'assistant', content: 'Bienvenido al asistente médico virtual. ¿En qué puedo asistir en esta historia clínica?' }
                ];
                showForm = false;
            } else {
                alert('Error al cargar el documento del legajo.');
            }
        } catch (error) {
            console.error('Error al iniciar la consulta:', error);
            alert('Hubo un error al iniciar la consulta. Inténtalo de nuevo.');
        } finally {
            loadingMessage = false;
        }
    }

    async function sendMessage() {
        if (!userMessage.trim()) return;

        // Añadir el mensaje del usuario al historial de mensajes
        messages = [...messages, { role: 'user', content: userMessage }];

        try {
            // Realizar la llamada a la API con los datos proporcionados
            const response = await fetch('/api/verify', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    user: userName,
                    question: userMessage,
                    token: 'mysecrettoken', // Token para autenticación o identificación
                    history: messages,      // Historial de mensajes
                    legajo: selectedPatient // Legajo médico seleccionado
                })
            });

            if (response.ok) {
                const responseData = await response.json();
                // Añadir la respuesta del asistente al historial de mensajes
                messages = [...messages, { role: 'assistant', content: responseData.message }];
            } else {
                const errorData = await response.json();
                console.error('Error fetching data:', errorData.error);
                messages = [...messages, { role: 'assistant', content: 'Lo siento, hubo un error al procesar tu mensaje: ' + errorData.error }];
            }
        } catch (error) {
            console.error('Error fetching data:', error);
            messages = [...messages, { role: 'assistant', content: 'Lo siento, hubo un error de conexión. Por favor, verifica tu conexión e intenta nuevamente.' }];
        }

        // Limpiar el mensaje del usuario
        userMessage = '';
    }

    let messagesContainer;

    onMount(() => {
        document.addEventListener('keypress', handleKeyPress);
        return () => {
            document.removeEventListener('keypress', handleKeyPress);
        };
    });

    function handleKeyPress(event: KeyboardEvent) {
        if (event.key === 'Enter' && !showForm) {
            sendMessage();
        }
    }

    afterUpdate(() => {
        if (messagesContainer) {
            const lastMessage = messagesContainer.lastElementChild;
            if (lastMessage) {
                lastMessage.scrollIntoView({ behavior: 'smooth' });
            }
        }
    });
</script>



<svelte:head>
    <title>Asistente Médico Virtual</title>
    <meta name="description" content="Chat de consulta médica" />
</svelte:head>

<section>
    <h1>Asistente Médico Virtual</h1>

    {#if showForm}
        <div class="form-container">
            <div class="input-container">
                <label for="patient">Selecciona un legajo médico:</label>
                <select id="patient" bind:value={selectedPatient} on:change={loadPatientFile}>
                    <option value="" disabled selected>-- Selecciona un legajo --</option>
                    {#each patients as patient}
                        <option value={patient.value}>{patient.label}</option>
                    {/each}
                </select>
            </div>

            {#if patientFileContent}
                <div class="input-container">
                    <label>Detalles del Legajo:</label>
                    <!-- Textarea para mostrar el contenido de la historia clínica -->
                    <textarea readonly rows="10" bind:value={patientFileContent}></textarea>
                </div>
            {/if}


            <button on:click={startChat}>Iniciar consulta</button>
            {#if loadingMessage}
                <p>Iniciando consulta...</p>
            {/if}
        </div>
    {:else}
        <div class="chat-container">
            <div class="messages" bind:this={messagesContainer}>
                {#each messages as message}
                    <div class={message.role === 'assistant' ? 'assistant-message' : 'user-message'}>
                        {message.role === 'assistant' ? 'Asistente: ' : 'Tú: '}{message.content}
                    </div>
                {/each}
            </div>

            <div class="input-container">
                <input type="text" bind:value={userMessage} placeholder="Escribe tu mensaje aquí..." />
                <button on:click={sendMessage}>Enviar</button>
            </div>
        </div>
    {/if}
</section>

<style>
    section {
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        padding: 20px;
    }

    h1 {
        margin-bottom: 20px;
        font-family: 'Poppins', sans-serif;
        font-size: 2.5rem;
        font-weight: 600;
        text-align: center;
    }

    .form-container, .chat-container {
        width: 100%;
        max-width: 600px;
        background: rgba(255, 255, 255, 0.9);
        padding: 20px;
        border-radius: 10px;
    }

    .messages {
        width: 100%;
        height: 300px;
        margin-bottom: 20px;
        padding: 10px;
        overflow-y: auto;
        border: 1px solid #ccc;
        background: #fff;
    }

    .assistant-message {
        color: blue;
        margin-bottom: 10px;
    }

    .user-message {
        color: green;
        margin-bottom: 10px;
        text-align: right;
    }

    .input-container {
        display: flex;
        flex-direction: column;
        width: 100%;
        margin-bottom: 10px;
    }

    label {
        margin-bottom: 5px;
    }

    select, input, textarea {
        flex: 1;
        padding: 10px;
        margin-bottom: 10px;
    }

    button {
        padding: 10px;
        background-color: #4CAF50;
        color: white;
        border: none;
        cursor: pointer;
        transition: background-color 0.3s;
    }

    button:hover {
        background-color: #45a049;
    }
</style>
