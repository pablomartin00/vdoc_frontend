<script lang="ts">
  import { messages } from '../../stores/messagesStore';
  import { onMount, afterUpdate } from 'svelte';

  // Referencia al contenedor de los mensajes
  let messagesContainer: HTMLElement;

  // Función para hacer scroll al fondo
  const scrollToBottom = () => {
    if (messagesContainer) {
      messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }
  };

  // Hacer scroll al fondo cuando el componente se monta o cuando los mensajes cambian
  onMount(scrollToBottom);
  afterUpdate(scrollToBottom);
</script>

<div 
  bind:this={messagesContainer} 
  class="flex-1 overflow-auto p-3 w-full"
  style="background-color: #DAD3CC; min-height: 0;" 
>
  {#each $messages as message}
    <div class="flex mb-2 {message.role === 'user' ? 'justify-end' : ''}">
      <div class="rounded py-2 px-3 {message.role === 'user' ? 'bg-green-100' : 'bg-gray-200'} max-w-[80%] break-words">
        <p class="text-sm">
          {message.role === 'assistant' ? 'Asistente: ' : 'Tú: '}
          {message.content}
        </p>
      </div>
    </div>
  {/each}
</div>
