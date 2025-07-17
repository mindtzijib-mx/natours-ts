# Guía de Upload de Fotos de Perfil

## 🚀 Funcionalidad Implementada

Se ha implementado la funcionalidad completa para que los usuarios puedan subir y actualizar sus fotos de perfil, basada en la implementación de `natourjs-pug`.

## 📁 Estructura de Archivos

```
backend/
├── public/
│   └── img/
│       └── users/
│           ├── default.jpg (foto por defecto)
│           └── user-[id]-[timestamp].jpeg (fotos de usuarios)
├── src/
│   ├── controllers/
│   │   └── user.controller.ts (funciones de upload y resize)
│   └── routes/
│       └── user.routes.ts (rutas actualizadas)

frontend/
├── src/
│   ├── components/
│   │   └── ProfilePhotoUpload.tsx (componente de upload)
│   └── pages/
│       └── ProfilePage.tsx (página de perfil)
```

## 🔧 Endpoints Disponibles

### 1. Actualizar Perfil con Foto

```
PATCH /api/v1/users/updateMe
Content-Type: multipart/form-data
Authorization: Bearer [token]

Body (form-data):
- photo: [archivo de imagen]
- name: [opcional]
- email: [opcional]
```

### 2. Obtener Foto del Usuario

```
GET /api/v1/users/me/photo
Authorization: Bearer [token]
```

### 3. Acceder a Fotos Estáticas

```
GET /img/users/[filename]
```

## 🧪 Cómo Probar con Postman

### 1. Subir una Foto de Perfil

1. **Método:** PATCH
2. **URL:** `http://localhost:3000/api/v1/users/updateMe`
3. **Headers:**
   - `Authorization: Bearer [tu_token_jwt]`
4. **Body:**
   - Selecciona `form-data`
   - Agrega key `photo` de tipo `File`
   - Selecciona una imagen desde tu computadora
5. **Enviar**

**Respuesta esperada:**

```json
{
  "status": "success",
  "data": {
    "user": {
      "_id": "...",
      "name": "...",
      "email": "...",
      "photo": "user-[id]-[timestamp].jpeg",
      "role": "user"
    }
  }
}
```

### 2. Ver la Foto Subida

1. **Método:** GET
2. **URL:** `http://localhost:3000/img/users/user-[id]-[timestamp].jpeg`
3. **Sin headers adicionales**

## 🖥️ Cómo Usar en el Frontend

### 1. Importar el Componente

```tsx
import ProfilePhotoUpload from "../components/ProfilePhotoUpload";
```

### 2. Usar en tu Componente

```tsx
const [userPhoto, setUserPhoto] = useState("default.jpg");

<ProfilePhotoUpload
  currentPhoto={userPhoto}
  onPhotoUpdate={(newPhoto) => setUserPhoto(newPhoto)}
/>;
```

## 📋 Características Implementadas

### Backend:

- ✅ Upload de archivos con Multer
- ✅ Validación de tipo de archivo (solo imágenes)
- ✅ Redimensionamiento automático a 500x500px con Sharp
- ✅ Conversión automática a JPEG con calidad 90%
- ✅ Nombres únicos: `user-[id]-[timestamp].jpeg`
- ✅ Almacenamiento en `public/img/users/`
- ✅ Servir archivos estáticos
- ✅ Foto por defecto: `default.jpg`

### Frontend:

- ✅ Componente de upload con preview
- ✅ Validación de archivos (tipo y tamaño)
- ✅ Indicador de carga
- ✅ Manejo de errores
- ✅ Interfaz intuitiva (click en la foto para cambiar)

## 🔒 Seguridad

- **Autenticación requerida:** Solo usuarios logueados pueden subir fotos
- **Validación de archivos:** Solo se permiten imágenes
- **Límite de tamaño:** Configurado en el frontend (5MB)
- **Procesamiento seguro:** Las imágenes se procesan y redimensionan en el servidor

## 🚀 Próximos Pasos

1. **Eliminar fotos anteriores:** Implementar limpieza de fotos viejas cuando se sube una nueva
2. **Múltiples tamaños:** Generar thumbnails de diferentes tamaños
3. **Cloud Storage:** Migrar a AWS S3 o Cloudinary para producción
4. **Compresión avanzada:** Optimizar más las imágenes para web

## 🐛 Troubleshooting

### Error: "Not an image! Please upload only images."

- **Causa:** El archivo no es una imagen válida
- **Solución:** Asegúrate de subir archivos .jpg, .png, .gif, etc.

### Error: "You are not logged in!"

- **Causa:** Token JWT no válido o expirado
- **Solución:** Inicia sesión nuevamente

### Error 404 al acceder a la imagen

- **Causa:** El archivo no existe o la ruta es incorrecta
- **Solución:** Verifica que el archivo esté en `backend/public/img/users/`

## 📝 Ejemplo de Uso Completo

```bash
# 1. Iniciar el backend
cd backend
npm run dev

# 2. Iniciar el frontend
cd frontend
npm run dev

# 3. Ir a http://localhost:5173 y usar el componente ProfilePage
```

¡La funcionalidad está lista para usar! 🎉
