<script lang="ts">
    export let userMessage: string;
    export let handleSuggestion: (suggestion: string) => void;
    export let sendMessage: () => void;
</script>

<div class="p-2 flex items-center">
    <input
        type="text"
        bind:value={userMessage}
        class="w-full p-2 border rounded"
        placeholder="Escribe un mensaje..."
    />
    <button on:click={sendMessage} class="ml-2 bg-blue-500 text-white px-4 py-2 rounded">
        Enviar
    </button>
</div>
