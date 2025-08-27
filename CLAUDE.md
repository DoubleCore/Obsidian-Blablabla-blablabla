# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a sample Obsidian plugin template that demonstrates basic functionality of the Obsidian plugin API. The plugin is written in TypeScript and uses esbuild for bundling. It serves as a starting template for developing new Obsidian plugins.

## Development Commands

- `npm run dev` - Start development mode with watch mode and inline sourcemaps
- `npm run build` - Build the plugin for production (runs TypeScript type checking first, then esbuild with minification)
- `npm run version` - Bump version in manifest.json and versions.json (run after updating minAppVersion manually)
- `npm version patch/minor/major` - Automated version bumping that updates manifest.json, package.json, and versions.json

## Build System

The project uses esbuild configured in `esbuild.config.mjs` with the following characteristics:
- Entry point: `main.ts`
- Output: `main.js` (CommonJS format)
- External dependencies: obsidian, electron, and various CodeMirror modules
- Development mode: inline sourcemaps, watch mode
- Production mode: minified, no sourcemaps

## Code Architecture

The main plugin class `MyPlugin` extends the base `Plugin` class from the Obsidian API and demonstrates:

1. **Plugin Lifecycle**: `onload()` and `onunload()` methods
2. **UI Components**: 
   - Ribbon icon with click handler
   - Status bar item
   - Modal dialogs (`SampleModal`)
   - Settings tab (`SampleSettingTab`)

3. **Commands**: Three types of commands registered:
   - Simple command with callback
   - Editor command with `editorCallback`
   - Complex command with `checkCallback` for conditional execution

4. **Settings Management**: 
   - Settings interface (`MyPluginSettings`)
   - Load/save methods using `loadData()` and `saveData()`
   - Settings tab with text input

5. **Event Management**: 
   - DOM events registered with `registerDomEvent()` (auto-cleanup on disable)
   - Intervals registered with `registerInterval()` (auto-cleanup on disable)

## Plugin Configuration

- Plugin ID and metadata defined in `manifest.json`
- Version compatibility tracked in `versions.json`
- Minimum Obsidian version: 0.15.0
- Styles defined in `styles.css` (included with plugin)

## TypeScript Configuration

- Target: ES6, Module: ESNext
- Strict type checking enabled
- Includes DOM and ES5/6/7 libraries
- Source maps enabled for development

## Distribution

When releasing, distribute these files:
- `main.js` (compiled bundle)
- `manifest.json` (plugin metadata)
- `styles.css` (plugin styles)

The plugin follows Obsidian's standard plugin structure and distribution format.