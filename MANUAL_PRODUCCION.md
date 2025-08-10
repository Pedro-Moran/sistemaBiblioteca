# Manual de despliegue a producción

Este documento describe los ajustes necesarios para preparar la aplicación de biblioteca para ambientes de producción.

## Backend (Spring Boot)
1. **Construcción**
   - Instala las dependencias y compila el proyecto:
     ```bash
     cd Backend/login-microsoft365
     mvn clean package -DskipTests
     ```
   - El artefacto generado se encuentra en `target/login-microsoft365-1.0.0.jar`.
2. **Configuración**
   - Ajusta los valores de `src/main/resources/application.properties`:
     - Define un `jwt.secret` seguro.
     - Actualiza `app.cors.allowed-origins` con el dominio público del frontend.
   - Para separar configuraciones por ambiente, utiliza variables de entorno o el perfil `spring.profiles.active=prod`.
3. **Ejecución**
   - Inicia el servicio en el servidor de producción:
     ```bash
     java -jar target/login-microsoft365-1.0.0.jar
     ```
   - Se recomienda administrarlo mediante un servicio del sistema o contenedor Docker.

## Frontend (Angular)
1. **Preparación**
   - Verifica los endpoints de la API en `src/environments/environment.ts`:
     - `apiUrl` debe apuntar al backend desplegado.
     - `filesUrl` debe referirse al dominio de archivos en producción.
2. **Construcción**
   - Desde la carpeta `Frontend/sakai-ng-master` ejecuta:
     ```bash
     npm install
     ng build --configuration production
     ```
   - Los archivos compilados quedarán en `dist/sakai-ng`.
3. **Publicación**
   - Copia el contenido de `dist/sakai-ng` a un servidor estático (Nginx, Apache, CDN, etc.).
   - Configura el servidor para servir `index.html` como fallback de rutas.

Con estos pasos el sistema quedará listo para operar en producción tanto en el backend como en el frontend.
