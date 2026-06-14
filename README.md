# 🛡️ Piston Scanner | Zero-Trust Auditor

<div align="center">
  <img src="https://img.shields.io/badge/Security-DevSecOps-red?style=for-the-badge"/>
  <img src="https://img.shields.io/badge/Engine-Node.js-green?style=for-the-badge"/>
  <img src="https://img.shields.io/badge/Architecture-Zero_Trust-blue?style=for-the-badge"/>
</div>

## 📌 Visión General
**Piston Scanner** es una herramienta de Interfaz de Línea de Comandos (CLI) de grado militar desarrollada para realizar auditorías de seguridad en repositorios de código locales. 

Implementa principios **Zero-Trust** interceptando y enmascarando cualquier firma criptográfica o secreto hardcodeado (API Keys de AWS, JWTs, Llaves Privadas RSA) antes de que puedan ser expuestos en plataformas públicas o filtrados en logs de servidores.

### ⚡ Características Técnicas
*   **Motor Asíncrono Puro:** Escrito en Node.js nativo (cero dependencias pesadas de terceros) para anular el riesgo de vulnerabilidades de cadena de suministro (*Supply Chain Attacks*).
*   **Enmascaramiento (Masking):** Si detecta un secreto crítico, imprime una advertencia pero ofusca el valor en la consola (ej. `AKIAIO***MPLE`) para proteger los logs CI/CD.
*   **Prevención de Fugas:** Retorna códigos de error estandarizados (`exit 1`) que interrumpen automáticamente tuberías Jenkins, GitHub Actions o GitLab CI si detectan una vulnerabilidad.

## 🚀 Demostración en Acción

A continuación, una captura del escáner interceptando credenciales y bases de datos expuestas durante un análisis simulado:

```console
=== Zero-Trust Local Auditor v1.0.0 ===
Engineered by Piston Quarks Architecture

>> Iniciando escaneo profundo en: C:\Repositories\project-core

[ALERTA DE SEGURIDAD] Se detectaron 2 vulnerabilidades críticas.

[CRITICAL] AWS_ACCESS_KEY
  |- Descripción: Posible Clave de Acceso AWS (AKIA)
  |- Archivo:     C:\Repositories\project-core\config\cloud.js
  |- Coincidencia: AKIAIO***MPLE 

[HIGH] BLACKLISTED_FILE
  |- Descripción: Archivo no permitido detectado: users.sqlite
  |- Archivo:     C:\Repositories\project-core\database\users.sqlite
  |- Coincidencia: users.sqlite 

--- Resumen de Auditoría ---
Vulnerabilidades Totales: 2
Riesgos Críticos (Nivel 5): 1
Tiempo de escaneo: 0.12s

>> ACCIÓN REQUERIDA: Elimine los secretos del código e ignórelos en .gitignore
```

> **🔐 NOTA DE ARQUITECTURA:**
> Este proyecto fue orquestado por **[Rony Valverde](https://pistonquarks.com)** - Principal DevSecOps & AI Architect, como parte del ecosistema de seguridad de Piston Quarks.
