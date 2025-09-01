/**
 * A script to find and build all WordPress block plugins in a monorepo.
 *
 * This script searches for all `block.json` files within the repository (excluding node_modules),
 * then runs `wp-scripts build` for each discovered block directory.
 * It runs the builds in parallel for efficiency.
 */

const { exec } = require('child_process');
const { glob } = require('glob');
const path = require('path');

// The command to run for building the blocks.
const command = 'npm install && npm run build && rm -rf node_modules';

console.log('Building all blocks...');

// Use glob to find all block.json files, ignoring node_modules and vendor directories.
glob('**/src', { ignore: ['**/node_modules/**', '**/vendor/**', '**/build/**'] })
  .then(async srcDirs => {
    console.log(`Found ${srcDirs.length} src directory(ies).`);

    // Sequentially build each src directory, waiting for each to complete.
    for (const srcDir of srcDirs) {
      console.log(`Building ${srcDir}...`);

      // Move one folder up and then run the build command.
      const buildDir = path.resolve(srcDir, '..');
      console.log(`Running build command in ${buildDir}...`);

      // Wait for the build command to complete before moving to the next
      await new Promise((resolve, reject) => {
        exec(command, { cwd: buildDir }, (error, stdout, stderr) => {
          if (error) {
            console.error(`Error building ${srcDir}:`, error);
            reject(error);
          } else {
            console.log(stdout);
            if (stderr) console.error(stderr);
            resolve();
          }
        });
      });
    }
    
    console.log('All builds completed!');
  });

