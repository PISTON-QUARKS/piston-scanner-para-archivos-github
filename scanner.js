const fs = require('fs').promises;
const path = require('path');
const rulesConfig = require('./rules.json');

// Colores ANSI para terminal sin dependencias
const colors = {
    red: '\x1b[31m',
    green: '\x1b[32m',
    yellow: '\x1b[33m',
    blue: '\x1b[34m',
    magenta: '\x1b[35m',
    cyan: '\x1b[36m',
    reset: '\x1b[0m',
    bold: '\x1b[1m'
};

const IGNORED_DIRS = ['node_modules', '.git', 'dist', 'build'];

/**
 * Escanea un directorio recursivamente
 * @param {string} dirPath - Ruta inicial
 * @returns {Promise<Array>} - Lista de vulnerabilidades encontradas
 */
async function scanDirectory(dirPath) {
    let findings = [];
    
    async function walk(currentPath) {
        const entries = await fs.readdir(currentPath, { withFileTypes: true });
        
        for (let entry of entries) {
            const fullPath = path.join(currentPath, entry.name);
            
            if (entry.isDirectory()) {
                if (!IGNORED_DIRS.includes(entry.name)) {
                    await walk(fullPath);
                }
            } else if (entry.isFile()) {
                const ext = path.extname(entry.name).toLowerCase();
                
                // Chequeo 1: Extensiones en lista negra
                if (rulesConfig.blacklisted_extensions.includes(ext) || rulesConfig.blacklisted_extensions.includes(entry.name)) {
                    findings.push({
                        file: fullPath,
                        type: 'BLACKLISTED_FILE',
                        severity: 'HIGH',
                        description: `Archivo no permitido detectado: ${entry.name}`,
                        match: entry.name
                    });
                    continue; // Si el archivo entero es un riesgo, no buscamos texto dentro para no saturar
                }

                // Chequeo 2: Contenido del archivo (Regex)
                try {
                    // Evitar leer archivos binarios comunes
                    if (['.png', '.jpg', '.jpeg', '.svg', '.mp4', '.mp3', '.exe', '.dll', '.so', '.pdf'].includes(ext)) {
                        continue;
                    }

                    const content = await fs.readFile(fullPath, 'utf8');
                    
                    for (let rule of rulesConfig.rules) {
                        const regex = new RegExp(rule.regex, 'g');
                        let match;
                        while ((match = regex.exec(content)) !== null) {
                            findings.push({
                                file: fullPath,
                                type: rule.id,
                                severity: rule.severity,
                                description: rule.description,
                                // Ocultar parcialmente el secreto por seguridad (Zero-Trust visual)
                                match: match[0].substring(0, 6) + '***' + match[0].slice(-4)
                            });
                        }
                    }
                } catch (err) {
                    // Archivos no legibles o sin permisos se ignoran silenciosamente
                }
            }
        }
    }
    
    try {
        await walk(dirPath);
        return findings;
    } catch (err) {
        console.error(`${colors.red}[ERROR] No se pudo acceder a la ruta: ${dirPath}${colors.reset}`);
        return [];
    }
}

module.exports = {
    scanDirectory,
    colors
};
