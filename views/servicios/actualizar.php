<h1 class="nombre-pagina">Actualizar Servicio</h1>
<p class="descripcion-pagina">Modifica los Valores del formulario</p>

<?php
    include_once __DIR__ . '/../templates/barra.php';
    include_once __DIR__ . '/../templates/alertas.php';
?>

<form method="POST" class="form">
    <?php
        include_once __DIR__ . '/formulario.php';
    ?>

    <input type="submit" class="boton" value="Actualizar Servicio">

</form>