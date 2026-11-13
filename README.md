# K-ancionero-Adonaí

Proyecto React + TypeScript con Vite. Conserva la biblioteca, setlists, modo escenario, calendario, editor, reproductor local, respaldos JSON y tutor musical.

## Ejecutar

```bash
npm install
npm run dev
```

Para generar la versión de despliegue:

```bash
npm run build
```

La carpeta `dist` se sirve por HTTPS para que el service worker pueda instalarse como PWA.

## Instalar en celular, tablet o computadora

1. Publica el proyecto en GitHub y activa GitHub Pages usando **GitHub Actions**.
2. Abre la dirección HTTPS de GitHub Pages en Chrome o Edge.
3. En el menú del navegador elige **Instalar aplicación** o **Añadir a pantalla de inicio**.
4. Confirma el nombre **K-ancionero-Adonaí** y su icono.

La dirección local `http://192.168.100.8:5175/` sirve para pruebas en la misma Wi-Fi. No permite instalar la PWA de forma completa en todos los teléfonos porque no usa HTTPS.

## Pruebas manuales

1. Crear una canción con letra y guardarla.
2. Editar una canción y crear una segunda versión, por ejemplo “En vivo” o “Capo 2”; comprobar que se puede elegir desde el setlist y el modo escenario.
3. Cerrar y abrir la aplicación; comprobar que la letra, versiones, setlists, tema y calendario siguen disponibles.
4. En Música, seleccionar varios audios desde Descargas/Música y comprobar que cada uno aparece en la playlist.
5. Reproducir, pausar, avanzar, retroceder, buscar en la barra y probar repetición.
6. Abrir el editor, cambiar el audio, quitarlo y cancelar la edición; comprobar que no aparecen audios incorrectos al volver a abrir.
7. Abrir Modo escenario, cambiar tono, activar desplazamiento y añadir una canción desde Remix.
8. Exportar un setlist `.ksetlist`; comprobar que el paquete contiene letras, versiones y audio.
9. Importar ese paquete en otra instalación; comprobar que actualiza las canciones del setlist y conserva las demás.
10. Probar Compartir en Android y seleccionar WhatsApp, Telegram o correo desde el menú del sistema.
11. Exportar un respaldo JSON, cambiar una canción y volver a importarlo; comprobar la confirmación y la restauración.
12. Abrir Tutor, consultar una pregunta e importar una base JSON de preguntas.
13. Verificar la letra en orientación vertical y horizontal.
14. Repetir en Honor, Huawei y Samsung con Chrome o el navegador disponible, usando un audio MP3 y uno WAV.

## Límites de verificación

La compilación y una comprobación local del servidor se ejecutaron correctamente. No se probaron dispositivos físicos, versiones concretas de Android/iOS ni sincronización en la nube. Los audios se guardan localmente en IndexedDB del navegador. El paquete `.ksetlist` sí puede llevar audios y versiones para compartirlos manualmente. No hay chat interno, cuentas ni sincronización automática en la nube.
