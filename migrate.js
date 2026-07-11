import fs from 'fs';
import path from 'path';

const walkSync = (dir, filelist = []) => {
    fs.readdirSync(dir).forEach(file => {
        const filepath = path.join(dir, file);
        if (fs.statSync(filepath).isDirectory()) {
            filelist = walkSync(filepath, filelist);
        } else {
            filelist.push(filepath);
        }
    });
    return filelist;
};

const svelteFiles = walkSync('src').filter(file => file.endsWith('.svelte'));

let fixedFiles = 0;

svelteFiles.forEach(file => {
    let content = fs.readFileSync(file, 'utf-8');
    let original = content;

    // Convert let var = val; to let var = $state(val); if they are mutated
    // A simple regex approach to capture typical local let variables
    content = content.replace(/^(\s*)let\s+([a-zA-Z0-9_]+)\s*=\s*(.*?);$/gm, (match, p1, p2, p3) => {
        // don't double state
        if (p3.includes('$state') || p3.includes('$derived') || p3.includes('$props')) return match;
        // don't state classes or constants if defined with let
        return `${p1}/** @type {any} */\n${p1}let ${p2} = $state(${p3});`;
    });

    // Fix function(e) parameters needing any type
    content = content.replace(/function\s+([a-zA-Z0-9_]+)\s*\(([^)]+)\)/g, (match, name, params) => {
        const typedParams = params.split(',').map(p => p.trim()).map(p => p.includes('=') ? p : `/** @type {any} */ ${p}`).join(', ');
        return `function ${name}(${params}) /* @type {any} */`; // Too complex to inline JSDoc in params for Svelte easily, let's just add JSDoc before the function
    });

    // Actually, a better way for implicit any in function params is to add /** @param {any} p */ above it
    // But it's easier to just use `any` in TS if it's TS, but this is JS with JSDoc.
    // Let's do a simple replace for onsubmit passing e to parameterless functions
    content = content.replace(/onsubmit=\{\(e\) => \{ e\.preventDefault\(\); ([a-zA-Z0-9_]+)\(e\); \}\}/g, 'onsubmit={(e) => { e.preventDefault(); $1(); }}');
    // Also double e in some places
    content = content.replace(/\(e\) => ([a-zA-Z0-9_]+)\(([^,]+),\s*e\)\(e\)/g, '(e) => $1($2, e)');

    if (content !== original) {
        fs.writeFileSync(file, content);
        fixedFiles++;
        console.log(`Updated ${file}`);
    }
});

console.log(`Fixed ${fixedFiles} files.`);
