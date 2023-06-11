# lavadero-mobile

## Ejecución

1- Clonar el proyecto: `git clone https://github.com/AlanHoltz/lavadero-mobile.git`.

2- Instalar globalmente Ionic Framework: `npm install -g @ionic/cli`.

3- Dirigirse a la ruta principal, y ejecutar la aplicación localmente: `ionic serve`. De esta manera vamos a poder utilizar la aplicación de manera local. Si queremos testearla en un dispositivo móvil, hay que instalar `Android Studio` y crear un nuevo dispositivo virtual. También se puede usar un dispositivo propio. La realización de lo mencionado, se logra mediante los puntos siguientes.

4- Primero, añadimos el nuevo proyecto `Android` al build existente: `ionic capacitor add android`. Esto va a genera la carpeta que contiene los archivos compatibles con dicho sistema operativo.

5- Buildeamos el proyecto: `ionic capacitor build`.

6- Sincronizamos, es decir, copiamos los recursos web a la plataforma nativa (`Android`). También incluye la actualización e instalación de los plugins de `Capacitor`.

7- Abrimos el proyecto con Android Studio (ya habría que tener la instancia virtual creada), y ejecutamos el proyecto: `ionic capacitor open android`.
