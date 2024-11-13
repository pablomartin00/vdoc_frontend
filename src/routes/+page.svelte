<script lang="ts">
    import { onMount, afterUpdate } from 'svelte';

    let showForm = true;
    let messages = [];
    let userMessage = '';
    let selectedPatient = '';
    let loadingMessage = false;
    let patientFileContent = '';
    let isFirstMessage = true; // Nueva variable para controlar el scroll inicial
    let messagesContainer;
    let chatContainer;
    let pageScrollPosition = 0; // Nueva variable para mantener la posición de la página


    let patients = [
        { label: 'Legajo 1: Antonio Demo', value: 'demo1-ejemplo-fisioterapia.txt' },
        { label: 'Legajo 2 - Vacío', value: 'legajo2' },
        { label: 'Legajo 3 - Vacío', value: 'legajo3' }
    ];

    let userName = 'Usuario';
    let birthChartReport = '';

    async function loadPatientFile() {
        console.log('Función loadPatientFile llamada');
        console.log('Paciente seleccionado:', selectedPatient);

        if (selectedPatient === 'demo1-ejemplo-fisioterapia.txt') {
            try {
                const response = await fetch('/demo1-ejemplo-fisioterapia.txt');
                if (response.ok) {
                    patientFileContent = await response.text();
                    console.log('Contenido del legajo cargado:', patientFileContent);
                } else {
                    console.error('Error al cargar el archivo del legajo');
                    patientFileContent = 'Error al cargar el archivo de legajo.';
                }
            } catch (error) {
                console.error('Error al cargar el archivo:', error);
                patientFileContent = 'Error al conectar con el servidor para cargar el archivo.';
            }
        } else {
            patientFileContent = '';
            console.log('Legajo vacío seleccionado, contenido limpiado');
        }
    }

    function validateForm() {
        if (!selectedPatient) {
            alert('Por favor, selecciona un legajo médico.');
            return false;
        }
        return true;
    }

    // Función para guardar la posición actual de la página
    function saveScrollPosition() {
        pageScrollPosition = window.scrollY;
    }

    // Función para restaurar la posición de la página
    function restoreScrollPosition() {
        window.scrollTo(0, pageScrollPosition);
    }

    async function startChat() {
        if (!validateForm()) return;

        saveScrollPosition(); // Guardamos la posición actual
        loadingMessage = true;

        try {
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
                isFirstMessage = true;
                
                // Esperamos al siguiente ciclo para restaurar la posición
                setTimeout(() => {
                    restoreScrollPosition();
                }, 0);
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

        saveScrollPosition(); // Guardamos la posición actual de la página
        messages = [...messages, { role: 'user', content: userMessage }];
        
        try {
            const response = await fetch('/api/verify', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    user: userName,
                    question: userMessage,
                    token: 'mysecrettoken',
                    history: messages,
                    legajo: selectedPatient
                })
            });

            if (response.ok) {
                const responseData = await response.json();
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

        userMessage = '';
        isFirstMessage = false;
    }

    onMount(() => {
        document.addEventListener('keypress', handleKeyPress);
        return () => {
            document.removeEventListener('keypress', handleKeyPress);
        };
    });

    afterUpdate(() => {
        if (messagesContainer && !isFirstMessage) {
            // Solo hacemos scroll en el contenedor de mensajes, no en toda la página
            messagesContainer.scrollTop = messagesContainer.scrollHeight;
            
            // Restauramos la posición de la página
            restoreScrollPosition();
        }
    });

    function handleKeyPress(event: KeyboardEvent) {
        if (event.key === 'Enter' && !showForm) {
            sendMessage();
        }
    }


    let sugerencias = [
        '¿Desde cuándo presenta el paciente dolor en el hombro izquierdo, y cuál ha sido la evolución de los síntomas?',
        '¿Existen antecedentes traumáticos, intervenciones previas o factores que puedan predisponer al paciente a esta condición?',
        '¿Qué pruebas se han realizado para evaluar el dolor en el hombro y los síntomas asociados?',
        '¿Qué factores en la historia clínica podrían haber agravado el dolor tras la realización de ejercicios como flexiones?',
        '¿Cuáles son los hallazgos clínicos principales en la movilidad y el examen físico del hombro afectado?',
        '¿Cuál es el diagnóstico inicial para el dolor de hombro, y qué hipótesis clínicas se están considerando?',
        '¿Cuál es el plan terapéutico indicado actualmente para el dolor del paciente, y qué objetivos se esperan lograr?',
        '¿Hay síntomas neurológicos asociados, como adormecimiento o pérdida de sensibilidad en la extremidad afectada?',
        '¿Qué tipo de imágenes o pruebas adicionales están contempladas para este caso si no hay mejoría clínica?',
        '¿Cuándo está programada la próxima revisión de seguimiento para evaluar la respuesta al tratamiento?'
    ];
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

            <ul class="sugerencias-lista">
                {#each sugerencias as sugerencia}
                <li>{sugerencia}</li>
                {/each}
            </ul>
        </div>
    {/if}
</section>

<style>
    section {
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        padding: 0px 20px 20px 20px;
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
        max-width: 1000px;
        background: rgba(255, 255, 255, 0.9);
        padding: 20px;
        border-radius: 10px;
    }

    .messages {
        width: 100%;
        height: 200px;
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