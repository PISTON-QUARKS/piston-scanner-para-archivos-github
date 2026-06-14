#!/usr/bin/env node

const path = require('path');
const { scanDirectory, colors } = require('./scanner');

const VERSION = "1.0.0";

function printBanner() {
    console.log(`${colors.cyan}${colors.bold}`);
    console.log(`
  _____  _     _               _____                                 
 |  __ \\(_)   | |             / ____|                                
 | |__) |_ ___| |_ ___  _ __ | (___   ___ __ _ _ __  _ __   ___ _ __ 
 |  ___/ / __| __/ _ \\| '_ \\ \\___ \\ / __/ _\` | '_ \\| '_ \\ / _ \\ '__|
 | |   | \\__ \\ || (_) | | | |____) | (_| (_| | | | | | | |  __/ |   
 |_|   |_|___/\\__\\___/|_| |_|_____/ \\___\\__,_|_| |_|_| |_|\\___|_|   
                                                                     
    `);
    console.log(`=== Zero-Trust Local Auditor v${VERSION} ===`);
    console.log(`Engineered by Piston Quarks Architecture`);
    console.log(`${colors.reset}\n`);
}

async function main() {
    printBanner();

    // Obtener el argumento del directorio (por defecto el directorio actual)
    const targetDir = process.argv[2] || '.';
    const absolutePath = path.resolve(targetDir);

    console.log(`${colors.yellow}>> Iniciando escaneo profundo en: ${colors.reset}${absolutePath}\n`);

    const startTime = Date.now();
    const findings = await scanDirectory(absolutePath);
    const timeTaken = ((Date.now() - startTime) / 1000).toFixed(2);

    if (findings.length === 0) {
        console.log(`${colors.green}${colors.bold}[OK] Arquitectura Limpia.${colors.reset}`);
        console.log(`Cero secretos expuestos. Auditoría completada en ${timeTaken}s.\n`);
        process.exit(0);
    } else {
        console.log(`${colors.red}${colors.bold}[ALERTA DE SEGURIDAD] Se detectaron ${findings.length} vulnerabilidades críticas.${colors.reset}\n`);
        
        let criticals = 0;

        findings.forEach((f, idx) => {
            const isCritical = f.severity === 'CRITICAL';
            if (isCritical) criticals++;

            const color = isCritical ? colors.red : colors.yellow;
            console.log(`${color}[${f.severity}] ${f.type}${colors.reset}`);
            console.log(`  |- Descripción: ${f.description}`);
            console.log(`  |- Archivo:     ${f.file}`);
            console.log(`  |- Coincidencia:${colors.magenta} ${f.match} ${colors.reset}\n`);
        });

        console.log(`${colors.cyan}--- Resumen de Auditoría ---${colors.reset}`);
        console.log(`Vulnerabilidades Totales: ${findings.length}`);
        console.log(`Riesgos Críticos (Nivel 5): ${colors.red}${criticals}${colors.reset}`);
        console.log(`Tiempo de escaneo: ${timeTaken}s\n`);

        console.log(`${colors.bold}${colors.red}>> ACCIÓN REQUERIDA: Elimine los secretos del código e ignórelos en .gitignore${colors.reset}\n`);
        
        // Salir con código 1 para fallar pipelines CI/CD o Git Hooks
        process.exit(1);
    }
}

main();
