// .specs/tasks/draft/04-setup-eas-ios-build.md

# Spec: Configuración de Build Nativo para iOS (EAS)

## 1. Objetivo

Permitir que el equipo pruebe la aplicación FocoCero en dispositivos físicos iOS (iPhone 14 Pro) y Android, garantizando que las librerías nativas (MMKV, Crypto, SQLite) funcionen correctamente fuera de Expo Go.

## 2. Configuración de EAS

- **Profile:** development.
- **Platform:** ios.
- **Distribution:** internal (Ad-hoc).

## 3. Pasos Técnicos

1. Ejecutar `eas build:configure` para generar `eas.json`.
2. Vincular el proyecto con la cuenta de Expo.
3. Iniciar el build en la nube para registrar el UDID del iPhone.

## 4. Estrategia de Conexión (Túnel)

Dado que el iPhone y la PC pueden estar en redes distintas o tener firewalls, se utilizará el flag `--tunnel` para exponer el Metro Bundler a través de los servidores de Expo.
