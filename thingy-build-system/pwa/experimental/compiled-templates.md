# Compiled Templates

## The Problem

When using templates for reusable UI components, we face a performance and elegance problem:

**Current state:** Templates are defined in Pug, rendered to HTML, placed in a hidden DOM element or `<template>` tag, then:
1. Read `innerHTML` at runtime
2. Mustache processes the string (string interpolation)
3. Set `innerHTML` on target container (DOM parsing happens again)

**The pain points:**

1. **Double parsing** - HTML is parsed twice: once when page loads (into hidden container), once when template is instantiated

2. **Runtime string processing** - Mustache operates on strings at runtime, no compile-time optimization

3. **No targeted updates** - To update one value, must re-render entire template string and re-parse

4. **Dependency on Mustache** - External library for simple interpolation

---

## The Solution

Compile Pug templates directly to CoffeeScript functions that:
- Create DOM via `document.createElement()` (no runtime parsing)
- Return an `update(data)` function that targets specific bound nodes
- Keep references to bound elements for surgical updates

**Input:** `templates/economic-area.pug`
```pug
.economic-area
  .title {=title}
  .value {=value}
  .flag: svg: use(href="{:iconHref}")
```

**Output:** `templates/economic-area.coffee` (auto-generated)
```coffee
export create = ->
  root = document.createElement("div")
  root.className = "economic-area"

  _title = document.createElement("div")
  _title.className = "title"
  root.appendChild(_title)

  _value = document.createElement("div")
  _value.className = "value"
  root.appendChild(_value)

  _flag = document.createElement("div")
  _flag.className = "flag"
  _svg = document.createElementNS("http://www.w3.org/2000/svg", "svg")
  _use = document.createElementNS("http://www.w3.org/2000/svg", "use")
  _svg.appendChild(_use)
  _flag.appendChild(_svg)
  root.appendChild(_flag)

  {
    el: root
    update: (d) ->
      _title.textContent = d.title if d.title?
      _value.textContent = d.value if d.value?
      _use.setAttribute("href", d.iconHref) if d.iconHref?
  }
```

**Usage:**
```coffee
import { create } from "./templates/economic-area.js"

{ el, update } = create()
container.appendChild(el)
update({ title: "Eurozone", value: "2.4%", iconHref: "#svg-europe-icon" })

# Later - surgical update, no re-parsing:
update({ value: "2.5%" })
```

---

## Binding Syntax

| Marker | Purpose | Compiled to |
|--------|---------|-------------|
| `{=varName}` | Text content | `el.textContent = d.varName` |
| `{:attrName}` | Attribute value | `el.setAttribute("attr", d.attrName)` |
| `{?condition}` | Conditional visibility | `el.hidden = !d.condition` |
| `{#listName}` | List iteration | Loop with sub-template |

### Examples

```pug
//- Text binding
.title {=title}

//- Attribute binding
svg: use(href="{:iconHref}")
input(value="{:inputValue}", disabled="{:isDisabled}")

//- Conditional
.error-message(data-if="{?hasError}") {=errorText}

//- List (future)
ul(data-each="{#items}")
  li.item {=items.name}
```

---

## File Structure

Templates live alongside module code:

```
sources/source/
  economicareamodule/
    templates/
      economic-area.pug      # Source template
      economic-area.coffee   # Auto-generated
      style.styl             # Styles (included normally)
    economicareasmodule.coffee
```

Or for simpler modules:
```
sources/source/
  mymodule/
    mymodule.pug            # If has {=} markers, compile to .coffee
    mymodule.styl
    mymodule.coffee
```

---

## Compilation Pipeline

### 1. Discovery

Scan for `.pug` files containing binding markers (`{=`, `{:`, `{?`, `{#`).

### 2. Parse Pug AST

Use Pug's lexer/parser to get the AST, not the HTML output.

### 3. Generate CoffeeScript

Walk the AST and generate:
- `document.createElement()` calls for each element
- Variable references for bound elements
- `update()` function with targeted setters

### 4. Output

Write `.coffee` file next to `.pug` file (or to build directory).

### 5. Integration

Generated `.coffee` files are imported like any other module code.

---

## Comparison

| Aspect | Mustache + innerHTML | Compiled Templates |
|--------|---------------------|-------------------|
| Runtime parsing | 2x (load + instantiate) | 0x (all at build time) |
| Update granularity | Full re-render | Surgical, per-binding |
| Dependencies | mustache.js | None |
| Bundle size | +8KB (Mustache) | Only generated code |
| Syntax | `{{var}}` in HTML string | `{=var}` in Pug |
| Type safety | None | Could add TS types |

---

## Styling

Styles remain in separate `.styl` files, included via normal aggregation:

```stylus
// economicareamodule/templates/style.styl
.economic-area
  display: flex
  flex-direction: column

  .title
    font-weight: bold

  .value
    font-size: 1.2em
```

This integrates with existing style aggregation (see `module-auto-aggregation.md`).

---

## Advanced: Event Bindings (Future)

Could extend syntax for event handlers:

```pug
button(@click="{handleClick}") Click me
input(@input="{onInput}", @blur="{onBlur}")
```

Compiles to:
```coffee
_button.addEventListener("click", (e) -> handlers.handleClick?(e))
```

Where `handlers` is passed to `create()` or `update()`.

---

## Implementation Approach

### Phase 1: Proof of Concept
- [ ] Manual conversion of one template (economic-area)
- [ ] Verify performance and ergonomics
- [ ] Refine binding syntax

### Phase 2: Basic Compiler
- [ ] Parse Pug AST (use `pug-lexer` + `pug-parser`)
- [ ] Handle basic elements, classes, IDs
- [ ] Handle `{=textBinding}` and `{:attrBinding}`
- [ ] Generate CoffeeScript output

### Phase 3: Integration
- [ ] Watch mode for development
- [ ] Integration with existing build pipeline
- [ ] Error messages with source locations

### Phase 4: Advanced Features
- [ ] Conditional visibility `{?condition}`
- [ ] List iteration `{#list}`
- [ ] Event bindings `{@event}`
- [ ] TypeScript type generation (optional)

---

## Inspiration

- **Svelte** - Compile-time approach, surgical updates
- **Lit** - Tagged template literals, efficient updates
- **SolidJS** - Fine-grained reactivity via compilation

Key difference: We want Pug syntax, CoffeeScript output, and no framework runtime.

---

## Status

**Current:** Concept documented

**Next steps:**
1. Manually convert `economic-area` template as proof of concept
2. Evaluate if complexity is worth the benefit for our scale
3. If yes, build minimal compiler for Phase 2
