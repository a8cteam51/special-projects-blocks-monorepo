#!/usr/bin/env node
/**
 * Scaffold a new block plugin with all the monorepo conventions already applied.
 *
 * Usage:
 *   npm run new-block -- <slug> ["Title"] [--dynamic] [--description "Short description."]
 *
 * It runs @wordpress/create-block to generate the working block, then overlays our
 * conventions: canonical plugin header (author, Update URI, license), the shared
 * self-update class + wiring, a non-boilerplate readme.txt, a CHANGELOG.md, and
 * normalized package.json / block.json metadata.
 *
 * Block registration code is left to create-block (it already emits the right pattern).
 */
'use strict';

const fs = require('fs');
const path = require('path');
const { spawnSync } = require('child_process');

// Pin create-block so scaffold output is reproducible. Bump deliberately.
const CREATE_BLOCK_VERSION = '4.92.0';

const NAMESPACE = 'a8csp';
const AUTHOR = 'Automattic Special Projects Team';
const AUTHOR_URI = 'https://specialprojects.automattic.com/';
const CONTRIBUTOR = 'wpspecialprojects';
const LICENSE = 'GPL-2.0-or-later';
const LICENSE_URI = 'https://www.gnu.org/licenses/gpl-2.0.html';
const UPDATE_HOST = 'https://opsoasis.wpspecialprojects.com';

const repoRoot = path.resolve(__dirname, '..');

function fail(msg) {
  console.error(`\n✖ ${msg}\n`);
  process.exit(1);
}

function titleCase(slug) {
  return slug.split('-').map((w) => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
}

// ---- parse args -----------------------------------------------------------
function parseArgs(argv) {
  const out = { slug: undefined, title: undefined, dynamic: false, description: undefined };
  const positional = [];
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (a === '--dynamic') out.dynamic = true;
    else if (a === '--description') out.description = argv[++i];
    else if (a.startsWith('--description=')) out.description = a.slice('--description='.length);
    else if (a.startsWith('--')) fail(`Unknown flag: ${a}`);
    else positional.push(a);
  }
  out.slug = positional[0];
  out.title = positional[1];
  return out;
}

const args = parseArgs(process.argv.slice(2));

if (!args.slug) {
  fail(
    'Missing block slug.\n  Usage: npm run new-block -- <slug> ["Title"] [--dynamic] [--description "..."]'
  );
}
if (!/^[a-z][a-z0-9-]*$/.test(args.slug)) {
  fail(`Invalid slug "${args.slug}". Use lowercase kebab-case, e.g. my-new-block.`);
}
const targetDir = path.join(repoRoot, args.slug);
if (fs.existsSync(targetDir)) {
  fail(`Directory "${args.slug}/" already exists. Remove it first or pick another slug.`);
}

const slug = args.slug;
const title = args.title || titleCase(slug);
const description = args.description || `${title} block.`;

// ---- 1. run create-block --------------------------------------------------
console.log(`\n▸ Scaffolding ${slug} with @wordpress/create-block@${CREATE_BLOCK_VERSION}...\n`);
const cbArgs = [
  '--yes',
  `@wordpress/create-block@${CREATE_BLOCK_VERSION}`,
  slug,
  '--namespace', NAMESPACE,
  '--title', title,
  '--short-description', description,
];
if (args.dynamic) cbArgs.push('--variant', 'dynamic');

const cb = spawnSync('npx', cbArgs, { cwd: repoRoot, stdio: 'inherit' });
if (cb.status !== 0) fail('create-block failed. See output above.');
if (!fs.existsSync(targetDir)) fail('create-block did not produce the expected directory.');

// ---- 2. overlay our conventions -------------------------------------------
console.log('\n▸ Applying monorepo conventions...');

const entryPhp = path.join(targetDir, `${slug}.php`);

// 2a. Canonical plugin header (replace create-block's header docblock).
const header = `<?php
/**
 * Plugin Name:       ${title}
 * Description:       ${description}
 * Requires at least: 6.7
 * Requires PHP:      7.4
 * Version:           0.1.0
 * Author:            ${AUTHOR}
 * Author URI:        ${AUTHOR_URI}
 * Update URI:        ${UPDATE_HOST}/${slug}/
 * License:           ${LICENSE}
 * License URI:       ${LICENSE_URI}
 * Text Domain:       ${slug}
 *
 * @package           wpcomsp
 */`;

let php = fs.readFileSync(entryPhp, 'utf8');
php = php.replace(/^<\?php\s*\n\/\*\*[\s\S]*?\*\//, header);

// 2b. Self-update wiring appended at EOF.
const selfUpdate = `

// If no other WPCOMSP block plugin already loaded the self-update class, load it.
if ( ! class_exists( 'WPCOMSP_Blocks_Self_Update' ) ) {
\trequire __DIR__ . '/classes/class-wpcomsp-blocks-self-update.php';

\t$wpcomsp_blocks_self_update = WPCOMSP_Blocks_Self_Update::get_instance();
\t$wpcomsp_blocks_self_update->hooks();
}

add_filter(
\t'wpcomsp_installed_blocks',
\tfunction ( $blocks ) {
\t\t$blocks[] = '${slug}'; // Enables auto-updates for this plugin.
\t\treturn $blocks;
\t}
);
`;
php = php.replace(/\s*$/, '\n') + selfUpdate;
fs.writeFileSync(entryPhp, php);

// 2c. Copy the shared self-update class.
const classesDir = path.join(targetDir, 'classes');
fs.mkdirSync(classesDir, { recursive: true });
fs.copyFileSync(
  path.join(repoRoot, '.utilities', 'class-wpcomsp-blocks-self-update.php'),
  path.join(classesDir, 'class-wpcomsp-blocks-self-update.php')
);

// 2d. Non-boilerplate readme.txt.
const readme = `=== ${title} ===
Contributors:      ${CONTRIBUTOR}
Tags:              block
Tested up to:      6.8
Stable tag:        0.1.0
License:           ${LICENSE}
License URI:       ${LICENSE_URI}

${description}

== Description ==

${description}

== Installation ==

1. Upload the \`${slug}\` folder to the \`/wp-content/plugins/\` directory, or install through the WordPress Plugins screen via **Plugins > Add New > Upload Plugin**.
2. Activate the plugin through the **Plugins** screen in WordPress.
3. Open any post or page in the block editor, click the **+** inserter, and search for **${title}**.

= Building from source =

Requirements: Node.js 18+.

1. \`cd ${slug}\`
2. \`npm install\`
3. \`npm run build\` — production build
4. \`npm start\` — development build with file watching

== Changelog ==

= 0.1.0 =
* Initial release.
`;
fs.writeFileSync(path.join(targetDir, 'readme.txt'), readme);

// 2e. CHANGELOG.md.
fs.writeFileSync(
  path.join(targetDir, 'CHANGELOG.md'),
  `# Changelog

All notable changes to this project will be documented in this file.

## 0.1.0

### Added

- Initial release.
`
);

// 2f. Normalize package.json metadata (create-block already provides the scripts).
{
  const p = path.join(targetDir, 'package.json');
  const raw = fs.readFileSync(p, 'utf8');
  const j = JSON.parse(raw);
  j.version = '0.1.0';
  j.description = description;
  j.author = AUTHOR;
  j.license = LICENSE;
  const indent = (raw.match(/\n(\s+)"/) || [, '\t'])[1];
  fs.writeFileSync(p, JSON.stringify(j, null, indent) + '\n');
}

// 2g. Ensure block.json description + textdomain. create-block nests the block
// under src/<slug>/, and multi-block plugins have several, so search recursively.
{
  const srcDir = path.join(targetDir, 'src');
  const blockJsons = [];
  (function walk(d) {
    if (!fs.existsSync(d)) return;
    for (const f of fs.readdirSync(d)) {
      const fp = path.join(d, f);
      if (fs.statSync(fp).isDirectory()) walk(fp);
      else if (f === 'block.json') blockJsons.push(fp);
    }
  })(srcDir);

  for (const b of blockJsons) {
    const raw = fs.readFileSync(b, 'utf8');
    const j = JSON.parse(raw);
    j.textdomain = slug;
    if (!j.description || j.description === 'Example block scaffolded with Create Block tool.') {
      j.description = description;
    }
    const indent = (raw.match(/\n(\s+)"/) || [, '\t'])[1];
    fs.writeFileSync(b, JSON.stringify(j, null, indent) + '\n');
    console.log(`  patched ${path.relative(targetDir, b)}`);
  }
}

// 2h. Remove any src/**/README.md boilerplate create-block emits (the interactive
// template ships one); our plugins document themselves via readme.txt.
{
  const srcDir = path.join(targetDir, 'src');
  (function walk(d) {
    if (!fs.existsSync(d)) return;
    for (const f of fs.readdirSync(d)) {
      const fp = path.join(d, f);
      if (fs.statSync(fp).isDirectory()) walk(fp);
      else if (f === 'README.md') {
        fs.rmSync(fp);
        console.log(`  removed ${path.relative(targetDir, fp)}`);
      }
    }
  })(srcDir);
}

// ---- 3. next steps --------------------------------------------------------
console.log(`
✔ Created ${slug}/ with monorepo conventions applied.

Next steps:
  1. cd ${slug} && npm install && npm run build
  2. Flesh out readme.txt (Description, add an FAQ) and src/ (edit.js, styles).
  3. Add a screenshot.png (1200x800) at the plugin root — used by tooling.
  4. Add a row for ${slug} to the inventory table in README.md.
  5. Open a "New block proposal" issue if you haven't already.
`);
