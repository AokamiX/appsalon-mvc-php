<h1 class="nombre-pagina">Crear Cuenta</h1>
<p class="descripcion-pagina">Llena el siguiente formulario para crear una cuenta</p>

<?php include_once __DIR__ . "/..//templates/alertas.php"; ?>

<form class="formulario" action="/crear-cuenta" method="POST">
    <div class="campo">
        <label for="nombre">Nombre</label>
        <input value="<?php echo s($usuario->nombre); ?>" type="text" placeholder="Tu Nombre" id="nombre" name="nombre">
    </div>

    <div class="campo">
        <label for="apellido">Apellido</label>
        <input value="<?php echo s($usuario->apellido); ?>" type="text" placeholder="Tu Apellido" id="apellido" name="apellido">
    </div>
    
    <div class="campo">
        <label for="telefono">Teléfono</label>
        <input value="<?php echo s($usuario->telefono); ?>" type="tel" placeholder="Tu Teléfono" id="telefono" name="telefono">
    </div>
    
    <div class="campo">
        <label for="email">E-mail</label>
        <input value="<?php echo s($usuario->email); ?>" type="email" placeholder="Tu E-mail" id="email" name="email">
    </div>

    <div class="campo">
        <label for="password">Password</label>
        <input type="password" placeholder="Tu Password" id="password" name="password">
    </div>

    <input type="submit" value="Crear Cuenta" class="boton">

</form>

<div class="acciones">
    <a href="/">¿Ya tienes una cuenta? Inicia Sesión</a>
    <a href="/olvide">¿Olvidaste tu password?</a>
</div>