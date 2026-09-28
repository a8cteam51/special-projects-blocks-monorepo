# Third-party blocks

Before proposing a new block, check whether a vetted third-party plugin already covers
the need. Every plugin listed here has passed the Special Projects plugin review; the
**Review** column links the decision. Approval covers the plugin, including future
versions, so entries don't record a reviewed version.

| Need | Plugin | Get it from | Review | Notes |
| --- | --- | --- | --- | --- |
| Filter Query Loop results by taxonomy, post type or search, without a page reload | [Query Loop Filters](https://github.com/humanmade/query-filter) by Human Made | [GitHub releases](https://github.com/humanmade/query-filter/releases) (`query-filter-vX.Y.Z.zip`), or Composer: `humanmade/query-filter` | [T51ENG-768](https://linear.app/a8c/issue/T51ENG-768). Replaces the block proposed in [#18](https://github.com/a8cteam51/special-projects-blocks-monorepo/issues/18). | Not on WordPress.org: the `query-filter` plugin there is an unrelated, abandoned plugin. Install the release zip rather than the source, which has a placeholder version. No update URI, so it won't auto-update. Requires WordPress 6.6+ and PHP 8.2+. |

## Adding a plugin

1. Get the plugin reviewed through the
   [Special Projects plugin review](https://wpspecialprojectsp2.wordpress.com/developer-handbook/reviewing-plugins/).
   Plugins approved for a single project only (for example, because of a paid upsell)
   don't belong here.
2. Open a pull request adding a row: the need in plain words, where to install it from,
   the review link, and anything a site builder needs to know (requirements, how it
   updates, gotchas).
3. If the plugin replaces a new block proposal, close that issue from the pull request.
