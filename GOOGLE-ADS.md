# Medición de conversiones — Google Ads

Instrucciones para quien administra la cuenta de Google Ads de
**Rodolfo — Plomero y Gasista Matriculado (CABA)**.

**Estado:** el código está instalado y **ya tiene cargado el ID
`AW-18449350229`** y la etiqueta que enviaron. Funciona apenas se
publique el sitio con estos cambios.

**Pendiente del lado de Ads:** la acción que crearon es de tipo
*"Vista de página"*. Hay que ajustarla (sección 3). Si no, el nombre y
la categoría en los informes no van a coincidir con lo que realmente
se mide.

---

## 1. Qué se mide

El sitio no tiene formularios. Los únicos contactos reales son:

| Conversión | Qué cuenta |
|---|---|
| **Click WhatsApp** | Click en cualquier botón o link que abra WhatsApp (botón flotante, nav, hero, cierre, footer) |
| **Click llamada** | Click en cualquier link `tel:` (botón "Llamar" y el número escrito) |

Las dos están cableadas en las dos landings: `plomeria.html` y
`gas.html`. **Hoy ambas reportan a la misma acción de conversión**, así
que en los informes se ven sumadas; para separarlas, ver la Opción B de
la sección 3.

> **Importante:** se mide el *click*, no si la persona efectivamente
> escribió o habló. Es lo máximo medible sin la API de WhatsApp Business,
> y es el estándar para este tipo de negocio. Esperá que el conteo de
> conversiones sea algo más alto que los contactos reales.

---

## 2. Por qué "no funcionaba"

Dos motivos, los dos ya resueltos o identificados:

1. **El código tenía los IDs sin completar.** Estaba puesto a propósito
   con valores de relleno (`AW-XXXXXXXXXX`) y escrito para no enviar
   nada hasta tenerlos. Ya se cargó el ID real y la etiqueta.
2. **Los cambios tienen que estar publicados.** Mientras el sitio en
   `rodolfoplomeria.com.ar` no tenga esta versión subida, cualquier
   verificación desde Google Ads va a decir que no encuentra la
   etiqueta. **Verificar recién después de publicar.**

---

## 3. Lo que falta ajustar en Google Ads

La acción que se compartió (`7kO2CIuM6ZsdENX8qt1E`) se creó como
**"Vista de página"**. Técnicamente la etiqueta sirve igual — es un
snippet manual y nosotros la disparamos en los clicks de contacto, no
al cargar la página — pero conviene corregir la configuración para que
los informes digan la verdad.

### Opción A (mínima, 2 minutos)

Entrar a **Objetivos → Conversiones → esa acción → Editar
configuración** y dejarla así:

| Campo | Valor |
|---|---|
| Nombre | `Contacto (WhatsApp o llamada)` |
| Categoría | `Contacto` |
| Valor | *No usar un valor* (hoy manda 1,00 ARS, que no significa nada) |
| Recuento | **Una** — si no, una misma persona que toca WhatsApp y después "Llamar" cuenta dos |
| Ventana de conversión | 30 días |
| Incluir en "Conversiones" | **Sí** |

Renombrar y cambiar la categoría **no cambia la etiqueta**, así que no
hay que volver a tocar el código.

### Opción B (recomendada) — separar WhatsApp de llamada

Mismo ajuste que arriba, y además crear una **segunda** acción para
poder ver cuál de los dos canales rinde más:

1. **Objetivos → Conversiones → Nueva acción de conversión → Sitio
   web**, y elegir **"Agregar una acción de conversión manualmente"**
   (no hace falta verificar el dominio).
2. Nombre `Click llamada`, categoría `Llamada telefónica`, resto igual
   a la tabla de arriba.
3. Copiar su etiqueta y mandarla a quien toca el código:

   ```
   gtag('event', 'conversion', {'send_to': 'AW-18449350229/AbC-D_efGhIjKlMn'});
                                            └─── ID ──┘ └──── etiqueta ────┘
   ```

El cambio en el código es una línea: en el `<head>` de `plomeria.html`
y `gas.html`, reemplazar el valor de `llamada:` dentro de
`window.ADS_CONVERSIONS` por la etiqueta nueva. Hoy las dos entradas
apuntan a la misma a propósito.

> **No hace falta** pegar ningún "fragmento de evento" en el `<head>`
> como dice el instructivo genérico de Google. Ese fragmento dispara la
> conversión **al cargar la página**, o sea contaría como contacto a
> cualquiera que simplemente entre al sitio, y arruinaría la
> optimización de las campañas. En este sitio la conversión se dispara
> por click, que es lo que ya está programado.
>
> Tampoco aplica nada de la sección **AMP** de ese instructivo: el sitio
> no usa AMP.

---

## 4. URLs finales de los anuncios

Usá siempre la landing que corresponde al rubro del anuncio:

| Campaña / grupo | URL final |
|---|---|
| Plomería, destapaciones, filtraciones, tanques | `https://rodolfoplomeria.com.ar/plomeria.html` |
| Gas, calderas, calefones, termotanques, estufas | `https://rodolfoplomeria.com.ar/gas.html` |

**Evitá apuntar al dominio raíz.** La raíz redirige a plomería y, aunque
el código ya reenvía el `gclid`, es un salto de más: suma latencia en
mobile y manda tráfico de gas a la landing equivocada, lo que baja el
nivel de calidad.

El seguimiento usa el parámetro `gclid` que Google agrega solo. **No hace
falta** ningún sufijo de URL ni plantilla de seguimiento. Si ya hay una
plantilla configurada con un redirector de terceros, avisá antes de
tocar nada: puede romper la atribución.

---

## 5. Verificar que quedó andando

**Primero publicar el sitio.** Hasta que estos cambios estén subidos a
`rodolfoplomeria.com.ar`, la etiqueta no existe en la web y cualquier
verificación va a fallar.

1. Instalar la extensión **Google Tag Assistant** en Chrome.
2. Abrir `https://rodolfoplomeria.com.ar/plomeria.html` con la extensión
   activa.
3. **Al cargar la página no tiene que aparecer ninguna conversión.**
   Si aparece, algo está mal: significa que se pegó de más el
   "fragmento de evento" del instructivo genérico.
4. Clickear el botón de WhatsApp. Ahí sí tiene que aparecer un evento
   `conversion` con `send_to: AW-18449350229/7kO2CIuM6ZsdENX8qt1E`.
5. Volver y clickear el botón de llamar: mismo evento.
6. Repetir en `gas.html`.
7. En Google Ads, el estado de la acción pasa de **"Sin actividad
   reciente"** a **"Registrando conversiones"** en hasta 24 h (a veces 3 h).

**Si no aparece nada:**

| Síntoma | Causa probable |
|---|---|
| Tag Assistant no detecta ninguna etiqueta | El sitio publicado todavía no tiene los cambios |
| La etiqueta carga pero el click no dispara nada | Hay un bloqueador de anuncios activo en el navegador — probar en ventana de incógnito sin extensiones |
| Ads sigue en "Sin actividad reciente" al otro día | Nadie clickeó todavía: la conversión es por click, no por visita |

---

## 6. Cosas a tener en cuenta

- **Mobile es la mayoría del tráfico.** En celular el click a WhatsApp
  abre la app y descarga la página; el evento se envía igual, pero puede
  haber una pérdida chica (bloqueadores, salidas muy rápidas). Un desvío
  de 5-10% contra los contactos reales es normal.
- **No dupliques la medición.** Si en algún momento se suma Google
  Analytics 4 con conversiones importadas a Ads, hay que elegir una sola
  fuente para los mismos clicks, o las conversiones se cuentan dos veces
  y las pujas automáticas se vuelven locas.
- **Consentimiento de cookies.** Hoy el sitio no tiene banner de
  cookies. Para tráfico de Argentina no es bloqueante; si en algún
  momento se hace campaña al EEE/Reino Unido, hay que implementar
  Consent Mode v2 antes.
- **Conversiones mejoradas:** no se pueden activar, porque requieren
  datos del usuario (mail o teléfono) y el sitio no los captura en
  ningún formulario.
