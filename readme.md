# WP Special Projects - All Blocks

All namespacing should use `wpsp` as the value.

Genericize your blocks, do not include site names or data as part of the block markup or content.

Your plugin *must* contain a `CHANGELOG.md` file.

Your plugin must have an entrypoint with the same name as the folder, i.e. `hello-world/hello-world.php`.

## Creating a new block

You can add a new block to the monorepo by running the following steps in any folder:

```
git clone --no-checkout --sparse https://github.com/a8cteam51/special-projects-blocks-monorepo/
cd special-projects-blocks-monorepo
npx @wordpress/create-block
git sparse-checkout init --cone
git sparse-checkout set %new_folder%
git checkout trunk
git checkout -b %branch_name%

git status //should only show your new folder - nothing else!
git add -A //adds your new folder and child files
git commit -m %commit_message% //please add the client we sent 
git push

```

From here, you can start editing your block.


## Editing an existing block

**Do not forget that changing a block will auto update it on all sites that use this block. Please be careful!**

Start by downloading the block's zip file on your plugin folder

```
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

Make sure that project-specific styles and data go into the project code and not the block in this repo

https://developer.wordpress.org/themes/features/block-stylesheets/#registering-a-block-stylesheet
