# Medición de conversiones — Google Ads

Instrucciones para quien administra la cuenta de Google Ads de
**Rodolfo — Plomero y Gasista Matriculado (CABA)**.

El sitio ya tiene el código de medición instalado y subido. Falta
**completar los IDs de la cuenta**: hasta que eso pase, el código está
inactivo a propósito y no envía nada.

---

## 1. Qué se mide

El sitio no tiene formularios. Los únicos contactos reales son:

| Conversión | Qué cuenta |
|---|---|
| **Click WhatsApp** | Click en cualquier botón o link que abra WhatsApp (botón flotante, nav, hero, cierre, footer) |
| **Click llamada** | Click en cualquier link `tel:` (botón "Llamar" y el número escrito) |

Las dos están cableadas en las dos landings: `plomeria.html` y `gas.html`.

> **Importante:** se mide el *click*, no si la persona efectivamente
> escribió o habló. Es lo máximo medible sin la API de WhatsApp Business,
> y es el estándar para este tipo de negocio. Esperá que el conteo de
> conversiones sea algo más alto que los contactos reales.

---

## 2. Crear las acciones de conversión

En Google Ads: **Objetivos → Conversiones → Acciones de conversión →
Nueva acción de conversión → Sitio web**. Cuando pida verificar el
dominio, elegí **"Agregar una acción de conversión manualmente"**.

Creá **dos**, con esta configuración:

**A) Click WhatsApp**
- Categoría: `Contacto`
- Valor: *No usar un valor* (o un valor fijo si querés estimar ticket)
- Recuento: **Una** (una consulta por persona, no por cuántas veces clickea)
- Ventana de conversión: 30 días
- Incluir en "Conversiones": **Sí** (es la que debe optimizar la campaña)

**B) Click llamada**
- Igual que la anterior, categoría `Llamada telefónica`.

Al terminar, en cada una entrá a **"Etiqueta de conversión"** y copiá
los dos datos que da el snippet:

```
gtag('event', 'conversion', {'send_to': 'AW-123456789/AbC-D_efGhIjKlMn'});
                                         └─ ID ──┘ └──── etiqueta ────┘
```

Necesitás **1 ID de conversión** (el mismo para toda la cuenta) y
**2 etiquetas** (una por acción).

---

## 3. Pasarle los datos a quien toca el código

Mandale estos tres valores:

- **ID de conversión:** `AW-__________`
- **Etiqueta Click WhatsApp:** `__________`
- **Etiqueta Click llamada:** `__________`

En el código hay que reemplazar, en el `<head>` de **`plomeria.html` y
`gas.html`** (mismos valores en los dos archivos):

- `AW-XXXXXXXXXX` → el ID real. Buscar y reemplazar todas las
  ocurrencias del archivo: son 6 (4 en código y 2 en comentarios).
- `PEGAR_LABEL_WHATSAPP` → la etiqueta de Click WhatsApp.
- `PEGAR_LABEL_LLAMADA` → la etiqueta de Click llamada.

Nada más. La lógica de los clicks ya está en `script.js` y no hay que
tocarla.

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

1. Instalá la extensión **Google Tag Assistant** en Chrome.
2. Abrí `plomeria.html` con la extensión activa.
3. Clickeá el botón de WhatsApp y después el de llamar.
4. En Tag Assistant tenés que ver, por cada click, un evento
   `conversion` con el `send_to` correspondiente.
5. En Google Ads, el estado de cada acción pasa de **"Sin actividad
   reciente"** a **"Registrando conversiones"** en un plazo de hasta 24 h
   (a veces 3 h).

Si Tag Assistant no muestra nada: lo más probable es que los
placeholders (`AW-XXXXXXXXXX`, `PEGAR_...`) sigan sin reemplazar. El
código está escrito para no disparar nada mientras eso pase.

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
