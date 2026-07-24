```
██████  ███████ ██████  ██████  ███████         ███████ ██      ███████
██   ██ ██   ██ ██   ██ ██   ██   ███           ██      ██        ███
██████  ███████ ██████  ██████    ███           ██      ██        ███
██  ██  ██   ██ ██      ██        ███           ██      ██        ███
██   ██ ██   ██ ██      ██      ███████         ███████ ███████ ███████
```

[![npm version](https://img.shields.io/npm/v/%40crafter%2Frappi-cli.svg)](https://www.npmjs.com/package/@crafter/rappi-cli)
[![GitHub](https://img.shields.io/github/stars/camilocbarrera/rappi-cli.svg?style=social)](https://github.com/camilocbarrera/rappi-cli)

Order from [Rappi](https://www.rappi.com.co/) directly from the terminal, via REST API, or as an MCP server for Claude. Built with Bun, TypeScript, Zod, and Hono.

## Install

```bash
# From npm (requires Bun)
bun add -g @crafter/rappi-cli

# Or clone and link
git clone https://github.com/camilocbarrera/rappi-cli.git
cd rappi-cli
bun install
bun link
```

## Setup

```bash
rappi login       # Opens browser — log in with your Rappi account
```

Or manually set your token:

```bash
rappi setup <bearer-token> [lat] [lng]
```

## CLI Usage

```bash
# Browse
rappi search "hamburguesa"              # Search products and stores
rappi restaurants 20                     # List nearby restaurants
rappi store 900006505                    # Store details and menu
rappi product 900006505 3522980          # Product options (toppings)

# Order
rappi add-to-cart 900006505 3522980 "McCombo" 1 "3525800"
rappi cart                               # View current cart
rappi tip 2000                           # Set delivery tip (COP)
rappi checkout                           # Preview order summary
rappi place-order                        # Place the order!
rappi orders                             # Track active orders

# Account
rappi whoami                             # User info + Prime status
rappi addresses                          # List saved addresses
rappi addresses set <id>                 # Set delivery address
```

## REST API

```bash
rappi server    # Starts on http://localhost:3100
```

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/whoami` | User info + Prime status |
| GET | `/api/search?q=pizza` | Search products and stores |
| GET | `/api/restaurants?limit=20` | Nearby restaurants |
| GET | `/api/store/:id` | Store detail + menu |
| GET | `/api/product/:storeId/:productId` | Product toppings |
| POST | `/api/cart/add` | Add to cart |
| GET | `/api/cart` | View cart |
| POST | `/api/cart/recalculate` | Recalculate totals |
| POST | `/api/tip` | Set tip |
| GET | `/api/checkout` | Checkout preview |
| POST | `/api/place-order` | Place order |
| GET | `/api/orders` | Track orders |
| GET | `/api/addresses` | List addresses |
| POST | `/api/addresses/set` | Set address |

## MCP Server (Claude Integration)

The Rappi CLI includes an MCP (Model Context Protocol) server that lets Claude use Rappi tools natively — no CLI commands needed.

### Setup for Claude Code

Add `.mcp.json` to your project root:

```json
{
  "mcpServers": {
    "rappi": {
      "command": "bun",
      "args": ["run", "/path/to/rappi-cli/src/mcp/index.ts"]
    }
  }
}
```

### Setup for Claude Desktop

Add to `~/Library/Application Support/Claude/claude_desktop_config.json`:

```json
{
  "mcpServers": {
    "rappi": {
      "command": "/path/to/.bun/bin/bun",
      "args": ["run", "/path/to/rappi-cli/src/mcp/index.ts"]
    }
  }
}
```

> Use the full path to `bun` for Claude Desktop (run `which bun` to find it).

### Available Tools

| Tool | Description |
|------|-------------|
| `whoami` | User profile + Prime status |
| `search` | Search products and stores |
| `list_restaurants` | Nearby restaurants |
| `get_store` | Store detail + menu |
| `get_product_options` | Product toppings/customization |
| `add_to_cart` | Add to cart with toppings and price |
| `get_cart` | View current cart |
| `checkout_preview` | Order summary with price breakdown |
| `set_tip` | Set delivery tip |
| `place_order` | Place the order |
| `track_orders` | Track active orders |
| `list_addresses` | List saved addresses |
| `set_address` | Set delivery address |

## Architecture

```
src/
  constants.ts       → URLs, headers, defaults
  http.ts            → Typed HTTP helpers (get/post/put)
  config.ts          → Config load/save with Zod validation
  formatters.ts      → Price formatting (COP)
  schemas/           → Zod schemas (auth, address, search, store, product, cart, checkout, order)
  services/          → Business logic (shared by CLI, API + MCP)
  api/app.ts         → Hono REST API
  mcp/index.ts       → MCP server (13 tools for Claude)
  commands/          → CLI commands
index.ts             → CLI entry point
server.ts            → API server entry point
```

## Tech Stack

- [Bun](https://bun.sh) — Runtime
- [TypeScript](https://www.typescriptlang.org/) — Type safety
- [Zod](https://zod.dev/) — Schema validation
- [Hono](https://hono.dev/) — REST API framework
- [Playwright](https://playwright.dev/) — Browser login automation
- [MCP SDK](https://modelcontextprotocol.io/) — Claude integration (13 tools)
