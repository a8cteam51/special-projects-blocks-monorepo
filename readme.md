# WP Special Projects - All Blocks

All namespacing should use `wpsp` as the value.

Genericize your blocks, do not include site names or data as part of the block markup or content.

Your plugin *must* contain a `CHANGELOG.md` file.

Your plugin must have an entrypoint with the same name as the folder, i.e. `hello-world/hello-world.php`.

Creating a new block.

```console
npx @wordpress/create-block
```
