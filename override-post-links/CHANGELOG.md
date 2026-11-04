## 0.1.3 (2026-10-27)

### Fixed

-   Single posts with a News Link redirect to the blog archive again, as documented. The redirect was unhooked in 0.1.1 (#41), in the change that guarded it against redirect loops. Return an empty string from `wpcomsp_override_post_links_redirect_url` to keep the singles accessible.
-   The readme's Stable tag matches the plugin version.

## 0.1.2 (2026-10-09)

### Removed

-   Self-update mechanism. Updates are now installed manually from GitHub releases.

## 0.1.1 (2025-08-02)

### Added

-   Update URI