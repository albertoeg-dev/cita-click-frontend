# 🔐 Configuración de Google OAuth2

Esta guía explica cómo configurar la autenticación con Google en el sistema de reservas.

---

## 📋 Requisitos Previos

- Cuenta de Google (Gmail)
- Acceso a [Google Cloud Console](https://console.cloud.google.com/)

---

## 🚀 Pasos de Configuración

### 1. Crear Proyecto en Google Cloud Console

1. Ve a [Google Cloud Console](https://console.cloud.google.com/)
2. Haz clic en el selector de proyectos en la parte superior
3. Haz clic en "**Nuevo Proyecto**"
4. Nombre del proyecto: `Sistema de Reservas` (o el nombre que prefieras)
5. Haz clic en "**Crear**"

### 2. Habilitar la API de Google+ (opcional, para información adicional)

1. En el menú lateral, ve a "**APIs y servicios**" > "**Biblioteca**"
2. Busca "Google+ API"
3. Haz clic en "**Habilitar**"

### 3. Configurar la Pantalla de Consentimiento OAuth

1. En el menú lateral, ve a "**APIs y servicios**" > "**Pantalla de consentimiento de OAuth**"
2. Selecciona "**Externos**" (para permitir cualquier cuenta de Google)
3. Haz clic en "**Crear**"

#### Información de la aplicación:
- **Nombre de la aplicación**: Sistema de Reservas
- **Correo electrónico de asistencia**: tu-email@gmail.com
- **Logotipo de la aplicación** (opcional): Sube un logo si lo tienes

#### Dominios autorizados:
- Para desarrollo local: No es necesario
- Para producción: Agrega tu dominio (ej: `tuapp.com`)

#### Información de contacto del desarrollador:
- Agrega tu email

4. Haz clic en "**Guardar y continuar**"

#### Alcances (Scopes):
- No es necesario agregar alcances adicionales
- Los alcances básicos (email, profile, openid) se incluyen automáticamente

5. Haz clic en "**Guardar y continuar**"

#### Usuarios de prueba (opcional):
- Agrega emails de usuarios para testing si la app está en modo "Testing"

6. Haz clic en "**Guardar y continuar**" y luego "**Volver al panel**"

### 4. Crear Credenciales OAuth 2.0

1. En el menú lateral, ve a "**APIs y servicios**" > "**Credenciales**"
2. Haz clic en "**+ CREAR CREDENCIALES**" en la parte superior
3. Selecciona "**ID de cliente de OAuth 2.0**"

#### Configuración:
- **Tipo de aplicación**: Aplicación web
- **Nombre**: Frontend - Sistema de Reservas

#### URIs de redireccionamiento autorizados:
Agrega los siguientes URLs:

**Para desarrollo:**
```
http://localhost:5173
http://localhost:5173/login
http://localhost:5173/register
```

**Para producción:**
```
https://tudominio.com
https://tudominio.com/login
https://tudominio.com/register
```

#### Orígenes de JavaScript autorizados:
```
http://localhost:5173         (desarrollo)
https://tudominio.com         (producción)
```

4. Haz clic en "**Crear**"

### 5. Obtener el Client ID

Después de crear las credenciales, verás un modal con:
- **Tu ID de cliente**: `XXXXXXXXXXXX-XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX.apps.googleusercontent.com`
- **Tu secreto de cliente**: (no lo necesitas para el frontend)

**Copia el ID de cliente** - lo necesitarás para configurar el frontend y backend.

---

## 🔧 Configuración del Frontend

### 1. Configurar Variables de Entorno

Crea un archivo `.env` en la raíz del proyecto frontend:

```bash
cp .env.example .env
```

Edita el archivo `.env` y agrega tu Client ID:

```env
VITE_GOOGLE_CLIENT_ID=tu-client-id-real-aqui.apps.googleusercontent.com
```

### 2. Verificar que el Script esté Cargado

El archivo `index.html` ya incluye el script de Google Identity Services:

```html
<script src="https://accounts.google.com/gsi/client" async defer></script>
```

### 3. Componentes Implementados

Ya están creados los siguientes componentes:

- ✅ `GoogleLoginButton.vue` - Botón reutilizable para Google Sign-In
- ✅ `LoginPage.vue` - Incluye botón de Google
- ✅ `RegisterPage.vue` - Incluye botón de Google
- ✅ `authService.js` - Método `googleAuth()`
- ✅ `authStore.js` - Acción `googleLogin()`

---

## 🔧 Configuración del Backend

### 1. Configurar application.properties

Edita el archivo `src/main/resources/application.properties`:

```properties
# GOOGLE OAUTH2 CONFIGURATION
google.client.id=tu-client-id-real-aqui.apps.googleusercontent.com
```

**O mejor aún**, usa variables de entorno:

```properties
google.client.id=${GOOGLE_CLIENT_ID:tu-client-id-por-defecto.apps.googleusercontent.com}
```

Luego configura la variable de entorno:

```bash
export GOOGLE_CLIENT_ID=tu-client-id-real.apps.googleusercontent.com
```

### 2. Servicios Implementados

Ya están implementados:

- ✅ `GoogleOAuthService.java` - Verifica tokens de Google
- ✅ `AuthController.java` - Endpoint `/auth/google`
- ✅ `AuthService.java` - Método `googleAuth()`
- ✅ `GoogleUserInfo.java` - DTO para información de Google

---

## 🧪 Probar la Integración

### 1. Iniciar el Backend

```bash
cd reservas-backend
./mvnw spring-boot:run
```

Verifica en los logs que se haya cargado el Client ID:
```
Initialized GoogleOAuthService with client ID: XXXX...
```

### 2. Iniciar el Frontend

```bash
cd reservas-frontend
npm run dev
```

### 3. Probar el Flujo

1. Abre http://localhost:5173/login
2. Haz clic en "**Continuar con Google**"
3. Selecciona tu cuenta de Google
4. Deberías ser redirigido al dashboard

---

## 🔍 Debugging

### Problemas Comunes

#### 1. "Google Identity Services no está cargado"

**Solución**:
- Asegúrate de que el script esté en `index.html`
- Recarga la página con cache limpio (Ctrl+Shift+R)
- Verifica la consola del navegador

#### 2. "Token de Google inválido o expirado"

**Solución**:
- Verifica que el Client ID en frontend y backend sea el mismo
- Verifica que los dominios autorizados estén configurados
- Intenta con otra cuenta de Google

#### 3. "Email de Google no verificado"

**Solución**:
- Solo se permiten cuentas de Google con email verificado
- Verifica tu cuenta de Google en https://myaccount.google.com

#### 4. "origin_mismatch" o "redirect_uri_mismatch"

**Solución**:
- Verifica que `http://localhost:5173` esté en los orígenes autorizados
- Verifica que las URIs de redireccionamiento incluyan `/login` y `/register`
- Los cambios en Google Cloud Console pueden tardar unos minutos

### Logs Útiles

**Frontend (Consola del navegador):**
```
[GoogleLoginButton] Iniciando autenticación con Google
[GoogleLoginButton] Google callback recibido
[GoogleLoginButton] Token recibido, autenticando con backend...
[AuthStore] Iniciando login con Google
[AuthStore] Login con Google exitoso
```

**Backend (Consola del servidor):**
```
Iniciando autenticación con Google...
Verificando token de Google...
Token de Google verificado exitosamente para: user@gmail.com
Login con Google exitoso para usuario existente: user@gmail.com
```

---

## 📊 Flujo Completo

### Flujo de Login/Registro con Google

```
1. Usuario hace clic en "Continuar con Google"
   ↓
2. Google muestra selector de cuenta
   ↓
3. Usuario selecciona cuenta y autoriza
   ↓
4. Google genera ID Token (JWT)
   ↓
5. Frontend recibe el token en callback
   ↓
6. Frontend envía token al backend (POST /auth/google)
   ↓
7. Backend verifica token con Google API
   ↓
8. Backend extrae información del usuario
   ↓
9. Backend busca usuario por email:

   Si existe:
   - Login: Actualiza info de Google
   - Genera JWT token propio

   Si NO existe:
   - Registro: Crea usuario y negocio
   - Genera JWT token propio
   ↓
10. Frontend recibe JWT token
    ↓
11. Frontend guarda token en localStorage
    ↓
12. Redirige a /dashboard
```

---

## 🔒 Seguridad

### Buenas Prácticas Implementadas

✅ **Verificación de Token en Backend**: No se confía solo en el frontend
✅ **Email Verificado**: Solo se permiten emails verificados por Google
✅ **Sin Almacenamiento de Contraseña**: Usuarios OAuth no tienen password
✅ **Provider ID**: Se almacena el Google ID para vincular cuentas
✅ **HTTPS en Producción**: Google requiere HTTPS para producción

### Información que Google Proporciona

- ✅ Email (verificado)
- ✅ Nombre completo
- ✅ Nombre de pila (given name)
- ✅ Apellido (family name)
- ✅ Foto de perfil (URL)
- ✅ Google ID (identificador único)
- ❌ Teléfono (no incluido en alcance básico)
- ❌ Dirección (no incluido en alcance básico)

---

## 📝 Notas Importantes

1. **Límites de Cuota**: Google tiene límites de requests por día
   - Desarrollo: Generalmente suficiente
   - Producción: Solicitar aumento si es necesario

2. **Modo Testing vs Producción**:
   - Testing: Solo usuarios específicos pueden autenticarse
   - Producción: Cualquier cuenta de Google puede autenticarse

3. **Actualizar a Producción**:
   - En Google Cloud Console > Pantalla de consentimiento OAuth
   - Cambiar de "Testing" a "En producción"
   - Puede requerir verificación de Google

4. **Usuarios Existentes con Email/Password**:
   - Si un usuario se registró con email/password
   - Y luego intenta con Google usando el mismo email
   - Se vinculará automáticamente y actualizará a provider "google"

---

## 🎉 ¡Listo!

La integración de Google OAuth2 está completa. Los usuarios ahora pueden:
- ✅ Iniciar sesión con Google
- ✅ Registrarse con Google
- ✅ Vincular cuenta existente con Google

Si tienes problemas, revisa la sección de **Debugging** o contacta al equipo de desarrollo.

---

**Última actualización**: 31 de Diciembre de 2025
