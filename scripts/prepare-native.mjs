import { mkdir, copyFile } from 'node:fs/promises';

// Keep one canonical app source: the existing desktop/mobile HTML file.
// Copy it into Capacitor's webDir only during a native build.
await mkdir('www', { recursive: true });
await copyFile('index.html.html', 'www/index.html');
console.log('RadioTrack Pro web assets prepared in www/');
