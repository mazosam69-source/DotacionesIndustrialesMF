# Dotaciones Industriales MF

Landing page estática en HTML, CSS y JavaScript vanilla.

## Dónde cambiar información

- **Teléfonos, WhatsApp, dirección, año y mensaje inicial:** `js/config.js`.
- **URL pública:** define `siteUrl` en `js/config.js` cuando el dominio esté activo. Para previews de redes sociales, establece también `og:url` y `link rel="canonical"` en `index.html`, ya que algunos rastreadores no ejecutan JavaScript.
- **Textos y secciones de la página:** `index.html`.
- **Colores, tipografía, composición y responsive:** `css/styles.css`.
- **Menú, enlaces, formulario y efectos de entrada:** `js/main.js`.

`js/config.js` contiene información pública únicamente. No pongas contraseñas, tokens ni credenciales en archivos que se entregan al navegador.

## Reemplazar fotos

Las rutas locales se definen en `js/config.js`. El sitio intenta cargar primero el archivo local; mientras no exista, usa la foto temporal remota de Pexels.

| Archivo local | Uso |
| --- | --- |
| `images/hero/hero.jpg` | Hero |
| `images/nosotros/trabajo-industrial.jpg` | Nosotros |
| `images/productos/camisa-jean.jpg` | Dotación |
| `images/industria/seguridad-industrial.jpg` | Seguridad industrial |
| `images/productos/botiquin.jpg` | Primeros auxilios |
| `images/productos/extintor.jpg` | Extintores |
Coloca una fotografía con el nombre indicado y se usará automáticamente. Las imágenes de Pexels son temporales y no representan el local ni al personal de MF. Sus referencias están en los `README.txt` de cada carpeta.

El logo aprobado se conserva en `images/logo mf dotaciones industriales.jpeg`. El encabezado y el pie utilizan una copia horizontal optimizada en `images/logo-mf-horizontal.jpg`.

La sección **Encuéntranos** usa la dirección configurada y el centro de mapa verificado en `js/config.js` para mostrar el local con zoom de calle en un `iframe`, sin API key. Si cambia la ubicación, actualiza la dirección y `mapCenter`. El CTA abre la búsqueda de la dirección en Google Maps.

## SEO al publicar

El título, la descripción, Open Graph, Twitter Cards y los datos estructurados usan información confirmada. La foto de compartir es una imagen temporal de Pexels porque el proyecto aún no contiene archivos de imagen locales. Sustitúyela por una imagen local y una URL pública HTTPS cuando estén disponibles. No hay favicon en los archivos actuales; añade uno cuando exista un recurso de marca aprobado.

## Formulario

El formulario valida los campos en el navegador y prepara un mensaje con los datos para abrir WhatsApp. El visitante revisa y confirma el envío desde WhatsApp. Este sitio no almacena ni envía solicitudes a un servidor; una integración de recepción por correo o sistema comercial requerirá un backend o proveedor seguro, validación del lado servidor y controles básicos contra abuso.

## Vista local

Al ser un sitio estático, se puede abrir `index.html` en el navegador o servir la carpeta desde un servidor local simple.
