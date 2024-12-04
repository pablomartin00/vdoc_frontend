<script lang="ts">
    import { messages, userMessage, isFirstMessage, selectedPatient, addMessage } from '../stores/messagesStore';

    // Usar un reactive statement ($: ) para hacer seguimiento cuando cambia el store
    $: console.log('Valor de selectedPatient en page.svelte:', $selectedPatient);
    
    import { loadPatientFile } from '../utils/loadPatientFile';
    import Legajos from '$lib/components/Legajos.svelte';
    import MessageList from '$lib/components/MessageList.svelte';
    import InputMessage from '$lib/components/InputMessage.svelte';
    import { afterUpdate, onMount } from 'svelte';

    let patients = [
        { label: 'Legajo 1: Antonio Demo', value: 'demo1-ejemplo-fisioterapia.txt' },
        { label: 'Legajo 2 - Vacío', value: 'legajo2' },
        { label: 'Legajo 3 - Vacío', value: 'legajo3' }
    ];

    let userName = 'Usuario';
    let patientFileContent = ''; // Contenido del archivo de legajo
    let messagesContainer: HTMLElement;

    // Función para cargar el archivo del paciente seleccionado
    async function loadPatientFileContent() {
        patientFileContent = await loadPatientFile($selectedPatient);
    }

    async function sendMessage() {
        if (!$userMessage.trim()) return; // No enviar si está vacío

        // Verifica el valor del legajo antes de enviarlo
        console.log("Legajo seleccionado al enviar mensaje:", $selectedPatient);

        // Agregar mensaje del usuario al store
        addMessage('user', $userMessage);
        const currentMessage = $userMessage;
        userMessage.set(''); // Limpiar el campo después de enviar

        try {
            const response = await fetch('/api/verify', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    user: userName,
                    question: currentMessage,
                    history: $messages,
                    legajo: $selectedPatient
                })
            });
            const responseData = await response.json();

            // Agregar respuesta del asistente al store
            addMessage('assistant', responseData.message);
        } catch (error) {
            addMessage('assistant', 'Error procesando el mensaje.');
        }
        isFirstMessage.set(false);
    }

    // Controlar sugerencias predefinidas para mensajes
    function handleSuggestion(suggestion: string) {
        userMessage.set(suggestion); // Actualiza directamente el store
        sendMessage(); // Envía el mensaje automáticamente
    }

    // Función para hacer scroll hacia abajo
    const scrollToBottom = () => {
        if (messagesContainer) {
            messagesContainer.scrollTop = messagesContainer.scrollHeight;
        }
    };

    // Después de cada actualización, hacemos scroll al contenedor de mensajes
    afterUpdate(() => {
        if (!$isFirstMessage && messagesContainer) {
            scrollToBottom();
        }
    });

    // Al montar el componente, hacer scroll hacia abajo
    onMount(() => {
        scrollToBottom();
    });
</script>

<div class="container w-full h-screen flex">
  <!-- Panel izquierdo: Legajos -->
  <div class="left-panel flex-[2] h-full border-r border-gray-400 bg-red-200 overflow-auto">
    <Legajos {patients} bind:selectedPatient={$selectedPatient} />
  </div>

  <!-- Panel derecho: Chat -->
  <div class="right-panel flex-[3] h-full flex flex-col border-l border-gray-400 bg-green-200 max-h-screen">
    <!-- Header del Chat -->
    <div class="chat-header py-2 px-3 bg-gray-100 flex justify-between items-center">
      <p class="text-gray-700 font-semibold">Chat Médico</p>
    </div>

    <!-- Contenedor de los mensajes -->
    <div class="messages-container flex-1 overflow-auto p-3" style="background-color: #DAD3CC;" bind:this={messagesContainer}>
      <MessageList />
    </div>

    <!-- Input de Mensajes (siempre visible en la parte inferior) -->
    <div class="input-container p-3 bg-gray-100">
      <InputMessage bind:userMessage={$userMessage} {handleSuggestion} {sendMessage} />
    </div>
  </div>
</div>

