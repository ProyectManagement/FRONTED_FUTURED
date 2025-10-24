# AngularFromScratch

Este proyecto fue generado con [Angular CLI](https://github.com/angular/angular-cli) versión 20.3.2.

## 🚀 Configuración inicial después de clonar

### **Primeros pasos después de descargar/clonar el repositorio:**

1. **Navegar al directorio del proyecto:**

cd nombre-del-proyecto


2. **Instalar dependencias:**
   
npm install

4. **Ejecutar el servidor de desarrollo:**

ng serve

4. **Abrir en el navegador:**
   Una vez que el servidor esté ejecutándose, navega a `http://localhost:4200/`. La aplicación se recargará automáticamente cuando modifiques cualquier archivo fuente.

## 📋 Comandos útiles de desarrollo

### **Servidor de desarrollo**

ng serve
# o con puerto específico
ng serve --port 4201
# o abrir automáticamente el navegador

### **Generar componentes**
Angular CLI incluye herramientas poderosas para generar código. Para generar un nuevo componente, ejecuta:

ng generate component nombre-del-componente

Para ver una lista completa de schematics disponibles (como `components`, `directives`, o `pipes`), ejecuta:

ng generate --help

### **Build del proyecto**
Para compilar el proyecto ejecuta:

ng build

Esto compilará tu proyecto y almacenará los artefactos en el directorio `dist/`. Por defecto, el build de producción optimiza tu aplicación para mejor rendimiento y velocidad.

## 🧪 Testing

### **Ejecutar tests unitarios**
Para ejecutar tests unitarios con el test runner [Karma](https://karma-runner.github.io), usa el siguiente comando:

ng test

### **Ejecutar tests end-to-end**
Para testing end-to-end (e2e), ejecuta:

ng e2e

Angular CLI no incluye un framework de testing end-to-end por defecto. Puedes elegir uno que se adapte a tus necesidades.

## 📚 Recursos adicionales

Para más información sobre cómo usar Angular CLI, incluyendo referencias detalladas de comandos, visita la página [Angular CLI Overview and Command Reference](https://angular.dev/tools/cli).

## ⚠️ Notas importantes

- Asegúrate de tener **Node.js** y **npm** instalados en tu sistema
- La primera instalación de dependencias puede tomar algunos minutos
- Si encuentras errores, intenta eliminar la carpeta `node_modules` y ejecutar `npm install` nuevamente

¡Listo! Ahora puedes comenzar a desarrollar tu aplicación Angular.
