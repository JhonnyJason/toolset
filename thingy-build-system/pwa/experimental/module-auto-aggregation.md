# Module Auto-Aggregation

## The Problem

When using reusable modules (like `messageboxmodule`, `qrreadermodule`) in our PWA build system, we face a wiring problem:

**Current state:** Each module consists of three parts following our separation of concerns:
- `*.pug` - DOM structure
- `styles.styl` - styling
- `*module.coffee` - logic

**The pain points:**

1. **Manual wiring required** - When adding a module, you must:
   - Add `include ../newmodule/template.pug` to `indexbody.pug`
   - Add `@import '../newmodule/styles.styl'` to `allstyles.styl`
   - Add import + export in `allmodules.coffee`
   - Copy any worker files (e.g., `qr-scanner-worker.min.js` → `/scannerworker.js`)

2. **Undocumented assets** - Worker files and other assets needed by a module are not formally declared. You discover them by reading docs or hitting runtime errors.

3. **No single source of truth** - Module requirements are spread across README prose, code imports, and tribal knowledge.

---

## The Solution

Introduce a **module manifest** (`module.json`) that declaratively describes:
- What assets the module provides (structure, styles, code)
- Where structure should be placed (auto-aggregated vs manual)
- What external assets are needed (workers, fonts, etc.)
- What other modules it depends on

A **build-time aggregation script** reads these manifests and generates:
- `_auto-includes.pug` - top-level structure includes
- `allstyles.styl` - all style imports
- Copies worker/asset files to correct locations

---

## Module Manifest Schema

Each module can have a `module.json`:

```json
{
  "name": "qrreadermodule",
  "description": "QR code scanning component",
  "assets": {
    "structure": {
      "file": "qrreader.pug",
      "placement": "top"
    },
    "styles": "styles.styl",
    "code": "qrreadermodule.coffee",
    "workers": [
      {
        "npm": "qr-scanner/qr-scanner-worker.min.js",
        "dest": "/scannerworker.js"
      }
    ]
  },
  "dependencies": ["messageboxmodule", "utilsmodule", "configmodule"]
}
```

### Field Reference

| Field | Required | Description |
|-------|----------|-------------|
| `name` | Yes | Module directory name |
| `description` | No | Human-readable purpose |
| `assets.structure.file` | No | Pug template filename |
| `assets.structure.placement` | No | `"top"` = auto-aggregate, `"manual"` = consumer places |
| `assets.styles` | No | Stylus file to include in allstyles |
| `assets.code` | No | Main CoffeeScript file |
| `assets.workers[]` | No | Array of worker files to copy |
| `assets.workers[].npm` | Yes* | Path relative to node_modules |
| `assets.workers[].dest` | Yes* | Output path in public/static folder |
| `dependencies` | No | Other modules this one requires |

---

## How It Works

### 1. Discovery

Script scans `sources/source/*module/module.json` for all manifests.

### 2. Style Aggregation

Collects all `assets.styles` entries, generates:
```stylus
// Auto-generated - do not edit
@import '../moduleA/styles.styl'
@import '../moduleB/styles.styl'
```

### 3. Structure Aggregation

Collects modules where `assets.structure.placement == "top"`, generates:
```pug
//- Auto-generated - do not edit
include ../messageboxmodule/messagebox.pug
include ../qrreadermodule/qrreader.pug
```

### 4. Worker/Asset Copying

For each `assets.workers[]` entry, copies the file from `node_modules` to the specified destination.

### 5. Dependency Validation (Future)

Could warn if a module's dependencies don't have manifests or aren't included.

---

## Integration

### In indexbody.pug

```pug
//- Auto-generated top-level includes
include _auto-includes.pug

//- Manual structure below (placement: "manual" or no manifest)
header: include ../headermodule/header.pug
main
    include ../authframemodule/authframe.pug
    include ../sidenavmodule/sidenav.pug
    include ../contentmodule/content.pug
```

### In build pipeline

```json
{
  "scripts": {
    "aggregate": "coffee toolset/thingy-build-system/pwa/experimental/aggregate-modules.coffee",
    "build": "npm run aggregate && <existing build commands>"
  }
}
```

---

## Migration Strategy

1. **Incremental adoption** - Modules without `module.json` continue to work via manual wiring
2. **Start with new modules** - Add manifests to newly imported modules first
3. **Backfill existing** - Gradually add manifests to existing modules
4. **Deprecate manual** - Once all modules have manifests, remove manual entries from aggregation files

---

## Draft Script

See `aggregate-modules.coffee` in this directory.

**Current status:** Draft - not yet tested

**TODOs:**
- [ ] Test with actual module structure
- [ ] Handle edge cases (missing files, malformed JSON)
- [ ] Add dry-run mode for previewing changes
- [ ] Consider watch mode for development
- [ ] Validate dependency graph
