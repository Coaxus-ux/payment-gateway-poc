# Payment Gateway POC

Prueba de concepto de una pasarela de pagos e-commerce construida con React, TypeScript y Vite. La aplicacion permite a los usuarios navegar un catalogo de productos, gestionar un carrito de compras y completar transacciones a traves de un flujo de checkout multi-paso con validacion de tarjetas de credito/debito.

## Stack Tecnologico

| Categoria     | Tecnologia                   | Version         |
| ------------- | ---------------------------- | --------------- |
| Framework     | React                        | 19.2.0          |
| Lenguaje      | TypeScript                   | 5.9.3           |
| Build Tool    | Vite (SWC)                   | 7.2.4           |
| Estado Global | Redux Toolkit                | 2.6.1           |
| Routing       | React Router DOM             | 7.13.0          |
| Estilos       | Tailwind CSS                 | 4.1.18          |
| Animaciones   | GSAP                         | 3.14.2          |
| Iconos        | React Icons                  | 5.5.0           |
| Testing       | Jest + React Testing Library | 29.7.0 / 16.3.2 |
| Linting       | ESLint                       | 9.39.1          |

## Estructura del Proyecto

```
src/
├── api/                          # Capa de servicios HTTP
│   ├── client.ts                 # Cliente fetch generico con manejo de errores
│   ├── products.ts               # Endpoints de productos (GET /products, GET /products/:id)
│   ├── transactions.ts           # Endpoints de transacciones (POST, PATCH, pago)
│   ├── customers.ts              # Lookup de clientes por email
│   └── admin.ts                  # Consulta de transacciones (admin)
│
├── assets/                       # Recursos estaticos (imagenes, SVGs)
│
├── components/
│   ├── checkout/                 # Componentes del flujo de checkout
│   │   ├── ProductDetailStep.tsx # Paso 1: Revision del producto
│   │   ├── EmailLookupStep.tsx   # Paso 2: Busqueda de email del cliente
│   │   ├── BillingFormStep.tsx   # Paso 3: Formulario de datos, direccion y tarjeta
│   │   ├── OrderSummaryStep.tsx  # Paso 4: Resumen de la orden
│   │   ├── CheckoutResultStep.tsx# Paso 5: Resultado (exito/error)
│   │   └── CheckoutProgress.tsx  # Indicador visual de progreso
│   ├── product/                  # Componentes de detalle de producto
│   │   ├── ProductGallery.tsx    # Galeria de imagenes con vista principal
│   │   ├── ProductInfo.tsx       # Nombre, precio, stock, descripcion
│   │   ├── ProductFeatures.tsx   # Caracteristicas destacadas
│   │   ├── ProductActions.tsx    # Botones "Agregar al carrito" y "Comprar ahora"
│   │   └── BackButton.tsx        # Navegacion de regreso
│   ├── CartDrawer.tsx            # Drawer lateral del carrito
│   ├── CartItemRow.tsx           # Fila individual del carrito con controles
│   ├── CheckoutModal.tsx         # Modal contenedor del checkout multi-paso
│   ├── EmptyCart.tsx              # Estado vacio del carrito
│   ├── Header.tsx                # Header sticky con boton del carrito
│   ├── ProductCard.tsx           # Card del catalogo con efecto 3D hover
│   ├── QuantitySelector.tsx      # Selector de cantidad (+/-)
│   └── Toast.tsx                 # Notificaciones con auto-dismiss
│
├── constants/
│   ├── index.ts                  # Constantes generales de la app
│   └── api.ts                    # Constantes de la API
│
├── hooks/                        # Custom React Hooks
│   ├── useFlyingAnimation.ts     # Animacion de item volando al carrito
│   ├── useDrawerAnimation.ts     # Animacion slide del drawer
│   ├── useModalAnimation.ts      # Animacion de entrada del modal
│   ├── usePageTransition.ts      # Transicion entre paginas
│   ├── useHeroImageAnimation.ts  # Animacion de imagen hero
│   └── useSwipeToDelete.ts       # Gesto swipe para eliminar items
│
├── pages/
│   ├── HomePage.tsx              # Catalogo de productos con carrito y checkout
│   ├── ProductDetailPage.tsx     # Detalle y galeria de un producto
│   └── AdminPage.tsx             # Panel de administracion
│
├── store/                        # Redux Store
│   ├── index.ts                  # Configuracion del store con persistencia
│   ├── hooks.ts                  # Hooks tipados (useAppDispatch, useAppSelector)
│   ├── cart/
│   │   ├── slice.ts              # Reducers del carrito y checkout
│   │   ├── selectors.ts          # Selectores memoizados
│   │   └── testUtils.ts          # Utilidades para tests
│   └── products/
│       ├── slice.ts              # Async thunks y reducers de productos
│       └── selectors.ts          # Selectores de productos
│
├── types/
│   └── index.ts                  # Tipos e interfaces TypeScript
│
├── utils/
│   ├── pricing.ts                # Formateo de moneda (COP), calculos de totales
│   ├── payment.ts                # Validacion Luhn, deteccion de marca, sanitizacion
│   └── cn.ts                     # Utilidad para class names (Tailwind)
│
├── App.tsx                       # Configuracion del router
├── main.tsx                      # Entry point con Redux Provider
└── index.css                     # Estilos globales y variables CSS
```

## Funcionalidades Principales

### Catalogo de Productos

- Grid responsivo de productos con animaciones GSAP escalonadas
- Cards con efecto 3D al pasar el mouse
- Indicador de disponibilidad de stock
- Navegacion a detalle de producto

### Detalle de Producto

- Galeria multi-imagen con vista principal y thumbnails
- Descripcion extendida y caracteristicas
- Acciones: agregar al carrito o comprar directamente
- Animacion de transicion de pagina

### Carrito de Compras

- Drawer lateral con animacion slide
- Gesto swipe-to-delete en items
- Control de cantidad con botones +/-
- Persistencia en `localStorage` (clave `pgp_cart_v1`)
- Badge en header con total de items
- Calculo de subtotal en tiempo real

### Checkout Multi-paso

El flujo de checkout se ejecuta dentro de un modal con 5 pasos:

1. **Detalle del Producto** - Revision del producto seleccionado
2. **Email Lookup** - Busqueda del cliente por email (detecta clientes existentes y autocompleta datos previos)
3. **Formulario de Facturacion** - Datos del cliente, direccion de entrega y datos de tarjeta de credito/debito
4. **Resumen de Orden** - Revision completa con opcion de editar direccion de entrega
5. **Resultado** - Confirmacion de exito o mensaje de error con ID de transaccion

### Validacion de Pagos

- Algoritmo de Luhn para numeros de tarjeta
- Deteccion automatica de marca (Visa / Mastercard)
- Validacion de fecha de expiracion
- Validacion de CVC
- Sanitizacion de inputs

### Panel de Administracion

- Busqueda de transacciones por email del cliente
- Historial completo con detalles de cada transaccion
- Informacion del cliente y direccion de entrega
- Desglose de items con precios

### Manejo de Errores

- Deteccion de productos sin stock (`OUT_OF_STOCK`)
- Recuperacion por discrepancia de precios (`AMOUNT_MISMATCH`)
- Reintentos en fallos de pago (`PAYMENT_FAILED`)
- Tracking de Request IDs para soporte y debugging
- Notificaciones toast con auto-dismiss

### Animaciones (GSAP)

- Animacion de item volando hacia el carrito
- Slide del drawer del carrito
- Entrada y transicion de pasos del modal
- Animaciones escalonadas en el catalogo
- Efecto hero en imagenes de producto
- Transiciones de pagina con fade

## Requisitos Previos

- **Node.js** >= 18
- **npm** o **yarn**
- Backend API corriendo (ver seccion de configuracion)

## Instalacion

```bash
# Clonar el repositorio
git clone <url-del-repositorio>
cd payment-gateway-poc

# Instalar dependencias
npm install
```

## Configuracion

Crear un archivo `.env` en la raiz del proyecto basado en `.env.example`:

```env
VITE_API_BASE_URL=http://localhost:3000
```

| Variable            | Descripcion              | Default                 |
| ------------------- | ------------------------ | ----------------------- |
| `VITE_API_BASE_URL` | URL base del backend API | `http://localhost:3000` |

## Scripts Disponibles

```bash
# Servidor de desarrollo
npm run dev

# Build de produccion (type-check + bundle)
npm run build

# Preview del build de produccion
npm run preview

# Ejecutar tests
npm test

# Tests en modo watch
npm run test:watch

# Linting
npm run lint
```

## Rutas de la Aplicacion

| Ruta                  | Pagina            | Descripcion                       |
| --------------------- | ----------------- | --------------------------------- |
| `/`                   | HomePage          | Catalogo de productos con carrito |
| `/product/:productId` | ProductDetailPage | Detalle y galeria de un producto  |
| `/admin`              | AdminPage         | Panel de administracion           |

## Estado Global (Redux)

```
store
├── products
│   ├── items: Product[]
│   ├── status: 'idle' | 'loading' | 'succeeded' | 'failed'
│   ├── error: ApiErrorPayload | null
│   ├── detailStatus: 'idle' | 'loading' | 'succeeded' | 'failed'
│   └── detailError: ApiErrorPayload | null
│
└── cart
    ├── items: CartItem[]
    └── checkoutData
        ├── selection: CheckoutSelection | null
        ├── customer: CheckoutCustomer
        ├── delivery: CheckoutDelivery
        ├── transactionId?: string
        ├── deliveryId?: string
        └── lastRequestId?: string
```

- El carrito se persiste automaticamente en `localStorage`
- Los selectores estan memoizados con `createSelector`
- Los async thunks manejan la carga de productos con estados de loading/error separados para listado y detalle

## Testing

Los tests cubren las siguientes areas:

- **Store (cart):** reducers, selectores, persistencia en localStorage
- **Componentes:** CartDrawer, CheckoutModal
- **Checkout Steps:** ProductDetailStep, BillingFormStep, OrderSummaryStep, CheckoutResultStep

```bash
# Ejecutar todos los tests
npm test

# Ejecutar en modo watch
npm run test:watch
```

## Moneda

La aplicacion esta configurada por defecto para trabajar con **COP (Peso Colombiano)** usando el locale `es-CO`. El formateo de precios no incluye decimales.

## Build de Produccion

El build de produccion genera chunks optimizados:

- **vendor** - React y React DOM
- **animations** - GSAP
- **app** - Codigo de la aplicacion

```bash
npm run build
```

Los archivos generados se encuentran en el directorio `dist/`.
