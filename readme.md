# WP Special Projects - All Blocks

All namespacing should use `wpsp` as the value.

Genericize your blocks, do not include site names or data as part of the block markup or content.

Your plugin *must* contain a `CHANGELOG.md` file.

Your plugin must have an entrypoint with the same name as the folder, i.e. `hello-world/hello-world.php`.

## Introduction

To work on this repository we advise the use of the following instructions. Using `git sparse-checkout` will make sure you'll only download and work on files related to a specific block.

### Sparse Checkout

The instructions will show you how to use sparse-checkout to work on a single block. You can work on extra blocks on your site by running

`git sparse-checkout add %block_name%`

If you need to remove sparse-checkout functionality altogether, you can run:

`git sparse-checkout disable`

More information here: https://git-scm.com/docs/git-sparse-checkout

## Creating a new block

You can add a new block to the monorepo by running the following steps. Make sure you're starting from the `wp-content/plugins` folder:

``` bash
git clone --no-checkout --sparse https://github.com/a8cteam51/special-projects-blocks-monorepo/
cd special-projects-blocks-monorepo
npx @wordpress/create-block
git sparse-checkout init --cone
git sparse-checkout set %new_folder%
git checkout trunk
git checkout -b %branch_name%

git status //should only show your new folder - nothing else!
git add -A //adds your new folder and child files
composer install //installs the necessary code standard dependencies
git commit -m %commit_message% //please add the client we sent
git push

```

From here, you can start editing your block and follow the regular process to do so.

## Checkout and edit an existing block

**Do not forget that changing a block will auto update it on all sites that use this block. Please be careful!**

Start by downloading the block's zip file on your plugin folder

``` bash
git clone --no-checkout --sparse https://github.com/a8cteam51/special-projects-blocks-monorepo/
cd special-projects-blocks-monorepo
git sparse-checkout init --cone
git sparse-checkout set %new_folder%
git checkout trunk
git checkout -b %your_new_branch_name%

```

### Deprecating a block's old code

When updating a **static** block — if we add any changes to the edit or save functions, we should deprecate the block to make sure we're not impacting the user experience. This is a great source of information with code examples ranging from simpler to more complex ones here: https://developer.wordpress.org/news/2023/03/10/block-deprecation-a-tutorial/


## Partner Agnostic

Keep in mind that blocks in this repository can be installed on multiple sites.

When you need to make any changes, make sure those changes (design and/or functionality) are applicable to any other sites and are improving upon the existing code.

Make sure that project-specific styles and data go into the project code and not the block code in this repo .

### Adding site / partner specific styles

Any partner-specific styling rules should be added via a separate stylesheet that should be registered through https://developer.wordpress.org/themes/features/block-stylesheets/#registering-a-block-stylesheet

### Adding site / partner specific styles

How to extend or customize blocks in the monorepo, without directly editing the blocks themselves.
It’s important to avoid modifying blocks in the monorepo unless absolutely necessary. In that case please contact an engineering lead to discuss your modification plans. If you’re importing an existing block into your project block and need to modify the blocks functionality, styling, or output, there’s a variety of hooks and filters available to do this.



Re-styling the block: https://developer.wordpress.org/themes/features/block-stylesheets/

Writing block variations: https://developer.wordpress.org/block-editor/how-to-guides/block-tutorial/extending-the-query-loop-block/

Extending the block edit and save functions, e.g adding classes, adding new controls, add output wrapper: https://gutenberghub.com/how-to-create-block-visibility-extension/

Modifying block output: https://developer.wordpress.org/reference/hooks/render_block/
https://developer.wordpress.org/reference/hooks/render_block_this-name/

Modify block.json params: https://developer.wordpress.org/reference/hooks/register_block_type_args/

Enqueue/dequeue stylesheets and scripts from block.json: https://developer.wordpress.org/reference/hooks/register_block_type_args/

https://developer.wordpress.org/block-editor/reference-guides/filters/block-filters/
