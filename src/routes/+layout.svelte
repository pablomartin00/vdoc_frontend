<script>
  // Puedes agregar aquí tu lógica si es necesario.
</script>

<svelte:head>
  <link href="/output.css" rel="stylesheet" />
</svelte:head>

<div class="w-full h-screen bg-gray-100 flex flex-col">
  <!-- Header con altura fija -->


  <!-- Contenedor del panel principal (barra lateral + área principal) -->
  <div class="flex flex-1 overflow-hidden">
    <!-- Barra lateral -->
    <nav class="bg-[#094199] w-16 p-4 flex-shrink-0">
      <div class="mb-2.5">
        <img src="/icon_1.png" alt="Icono 1" class="w-8 h-8">
      </div>
      <div class="mb-2.5">
        <img src="/icon_2.png" alt="Icono 2" class="w-8 h-8">
      </div>
      <div class="mb-2.5">
        <img src="/icon_3.png" alt="Icono 3" class="w-8 h-8">
      </div>
      <div>
        <img src="/icon_4.png" alt="Icono 4" class="w-8 h-8">
      </div>
    </nav>





    <!-- Contenedor principal para la página -->
    <main class="flex-1 overflow-auto p-4">
      <slot></slot>
    </main>
  </div>
</div>
