+++
date = '2025-08-13T13:33:08+06:30'
draft = false
title = 'My Neovim Setup'
description = 'Setting up Neovim for basic settings, colors, LSP, Auto-completion, and others.'
categories = ['tech', 'dev']
tags = 'nvim'
+++

{{< extlink "https://neovim.io/" "Neovim" >}} is a fork of {{< extlink "https://www.vim.org/" ""Vim >}} aiming to improve the codebase, allowing for easier implementation of APIs, improved user experience and plugin implementation.

### Setting up Neovim

This is my neovim setup of personal preference. The setup or configuration is all included in `~/.config/nvim/init.lua` file. Except native user settings, the following plugins are installed:

1. {{< extlink "https://github.com/savq/paq-nvim" "savq/paq-nvim" >}} plugin manager written in Lua.
2. {{< extlink "https://github.com/hrsh7th/nvim-cmp" "hrsh7th/nvim-cmp" >}} auto-completion.
3. {{< extlink "https://github.com/neovim/nvim-lspconfig" "neovim/nvim-lspconfig" >}} language server protocol (LSP).
4. {{< extlink "https://github.com/L3MON4D3/LuaSnip" "L3MON4D3/LuaSnip" >}} snippet engine.
5. {{< extlink "https://github.com/rafamadriz/friendly-snippets" "rafamadriz/friendly-snippets" >}} snippets.
6. {{< extlink "https://github.com/nvim-treesitter/nvim-treesitter" "nvim-treesitter/nvim-treesitter" >}} treesitter for better syntax highlighting colors.
7. {{< extlink "https://github.com/marko-cerovac/material.nvim" "marko-cerovac/material.nvim" >}} material colorscheme.
8. {{< extlink "https://github.com/nvim-telescope/telescope.nvim" "nvim-telescope/telescope.nvim" >}} telescope search tool.
9. {{< extlink "https://github.com/nvim-tree/nvim-tree.lua" "nvim-tree/nvim-tree.lua" >}} side bar file explorer.
10. {{< extlink "https://github.com/nvimdev/indentmini.nvim" "nvimdev/indentmini.nvim" >}} indent line.
11. {{< extlink "https://github.com/windwp/nvim-ts-autotag" "windwp/nvim-ts-autotag" >}} autoclose and autorename html tag.

The above plugins are not all plugins required because most of them require other plugins as dependencies. For example, {{< extlink "https://github.com/hrsh7th/nvim-cmp" "nvim-cmp" >}} requires the followings:

- {{< extlink "https://github.com/hrsh7th/nvim-cmp" "hrsh7th/cmp-nvim-lsp" >}} for nvim-lspconfig.
- {{< extlink "https://github.com/hrsh7th/nvim-cmp" "hrsh7th/cmp-buffer" >}} for buffer.
- {{< extlink "https://github.com/hrsh7th/nvim-cmp" "hrsh7th/cmp-path" >}} for path.
- {{< extlink "https://github.com/hrsh7th/nvim-cmp" "hrsh7th/cmp-cmdline" >}} for command prompt.

Full list of required plugins:

```lua
-- PLUGIN MANAGER @ paq plugin manager
require "paq" {
    "savq/paq-nvim", -- Let Paq manage itself
    { "nvim-treesitter/nvim-treesitter", build = ":TSUpdate" }, -- nvim-treesitter syntax
    "marko-cerovac/material.nvim", -- material.nvim colorshceme
    "neovim/nvim-lspconfig", -- nvim-lspconfig (Language Server Protocol)
    "hrsh7th/cmp-nvim-lsp", -- required for nvim-lspconfig
    "hrsh7th/cmp-buffer", -- required for buffer of nvim-cmp
    "hrsh7th/cmp-path", -- required for path of nvim-cmp
    "hrsh7th/cmp-cmdline", -- required for cmdline of nvim-cmp
    "hrsh7th/nvim-cmp", -- nvim-cmp for completion
    "L3MON4D3/LuaSnip", -- LuaSnip - snippet engine
    "saadparwaiz1/cmp_luasnip", -- required for LuaSnip
    "rafamadriz/friendly-snippets", -- friendly-snipptes (Snippets)
    "nvim-lua/plenary.nvim", -- plenary for telescope
    "nvim-telescope/telescope.nvim", -- telescope
    "nvim-tree/nvim-tree.lua", -- nvim-tree
    "nvim-tree/nvim-web-devicons", -- nvim-web-devicons for nvim-tree
    "nvimdev/indentmini.nvim", -- indent-mini
    "windwp/nvim-ts-autotag", -- nvim-ts-autotag
}
```

Native user settings and plugin settings in `~/.config/nvim/init.lua` file:

```lua
-- disable netrw for nvim-tree, this must be top
vim.g.loaded_netrw = 1
vim.g.loaded_netrwPlugin = 1

-- NEOVIM @ NATIVE lua setting.lua
vim.opt.cursorline = true        -- highlight current line
vim.opt.expandtab = true         -- spaces instead of tabs
vim.opt.number = true            -- show line numbers
vim.opt.scrolloff = 3            -- lines of context
vim.opt.tabstop = 4              -- size of indent
vim.opt.shiftwidth = 4           -- size of indent
vim.opt.smartindent = true       -- insert indents automatically
vim.opt.breakindent = true       -- setting breakindent
vim.opt.ignorecase = true        -- ignore case in search
vim.opt.smartcase = true         -- do not ignore case with capitals
vim.opt.termguicolors = true     -- truecolor support
vim.opt.wrap = false             -- disable line wrap
-- vim.opt.foldmethod = "indent"    -- set foldmethod to indent
vim.opt.timeoutlen = 300         -- time length between two key strokes for a certain function
vim.g.mapleader = 'ff'           -- set leader key to 'ff' (double stroke quickly with vim.opt.timeoutlen
vim.cmd([[filetype plugin on]])  -- filetype plugin on
vim.cmd([[
    autocmd BufRead * if getline(1) == '#!/bin/dash' | set filetype=sh | endif
    autocmd BufRead * if getline(1) == '#!/usr/bin/dash' | set filetype=sh | endif
]]) -- for syntax highlight for bash or dash script

vim.cmd([[
    autocmd BufNewFile,BufFilePre,BufRead *.md set filetype=markdown
    autocmd FileType markdown set conceallevel=2
]]) -- for markdown format
-- keybinding
vim.keymap.set('i', '<C-Enter>', '<Esc>o')
vim.keymap.set('i', ';;', '<Esc>')
vim.keymap.set('v', ';;', '<Esc>')
vim.keymap.set('n', '<leader>b', '<C-6>')
vim.keymap.set('n', '<leader>n', '<C-w>w')
vim.keymap.set('n', '<leader>w', '<C-w>w')
vim.keymap.set('n', '<leader> ', '<C-w>w')
vim.keymap.set('n', '<leader>j', '<C-w>J')
vim.keymap.set('n', '<leader>k', '<C-w>K')
vim.keymap.set('n', '<leader>h', '<C-w>H')
vim.keymap.set('n', '<leader>l', '<C-w>L')
vim.keymap.set('n', '<leader>f', '<C-w>_')
vim.keymap.set('n', '<leader>v', '<C-w>|')
vim.keymap.set('n', '<leader>e', '<C-w>=')
vim.keymap.set('n', '<leader>o', 'zO')
vim.keymap.set('n', '<leader>c', 'zC')
vim.keymap.set('n', '<F7>', ':setlocal spell!<CR>')
vim.keymap.set('n', '<F6>', ':setlocal linebreak wrap!<CR>')
vim.keymap.set('n', '<C-t>', ':NvimTreeToggle<CR>')
vim.cmd([[
    map <F2> O<Esc>i---<Esc>o<CR>###<CR><Esc>x:read! date '+\%F \%A \%R \%X'<CR>o<CR>body<CR><Esc>5kA<space>
    map <F3> i#<Esc>o<Esc>x:read! date '+\%F \%A \%R \%X'<CR>o<CR>body<Esc>4kA<space>
    map <F4> O<Esc>:read! date '+\%F \%A \%R \%X'<CR>kJo<Esc>o---<CR><Esc>kO<Esc>O
]]) -- F2, F3 and F4 for inserting date and formatting

-- PLUGIN MANAGER @ paq plugin manager
require "paq" {
    "savq/paq-nvim", -- Let Paq manage itself
    { "nvim-treesitter/nvim-treesitter", build = ":TSUpdate" }, -- nvim-treesitter syntax
    "marko-cerovac/material.nvim", -- material.nvim colorshceme
    "neovim/nvim-lspconfig", -- nvim-lspconfig (Language Server Protocol)
    "hrsh7th/cmp-nvim-lsp", -- required for nvim-lspconfig
    "hrsh7th/cmp-buffer", -- required for buffer of nvim-cmp
    "hrsh7th/cmp-path", -- required for path of nvim-cmp
    "hrsh7th/cmp-cmdline", -- required for cmdline of nvim-cmp
    "hrsh7th/nvim-cmp", -- nvim-cmp for completion
    "L3MON4D3/LuaSnip", -- LuaSnip - snippet engine
    "saadparwaiz1/cmp_luasnip", -- required for LuaSnip
    "rafamadriz/friendly-snippets", -- friendly-snipptes (Snippets)
    "nvim-lua/plenary.nvim", -- plenary for telescope
    "nvim-telescope/telescope.nvim", -- telescope
    "nvim-tree/nvim-tree.lua", -- nvim-tree
    "nvim-tree/nvim-web-devicons", -- nvim-web-devicons for nvim-tree
    "nvimdev/indentmini.nvim", -- indent-mini
    "windwp/nvim-ts-autotag", -- nvim-ts-autotag
}

-- SYNTAX @ nvim-treesitter
require'nvim-treesitter.configs'.setup {
    ensure_installed = { "bash", "c", "css", "html", "lua", "vim", "json", "markdown" },
    sync_install = false,
    auto_install = true,
    ignore_install = { "diff" },
    highlight = {
        enable = true,
        disable = { "diff" },
        additional_vim_regex_highlighting = false,
    },
}

-- COLORSCHEME @ material.nvim
vim.cmd "colorscheme material"
vim.g.material_style = "deep ocean"
-- setting StatusLine and StatusLineNC programmatically, this must be after colorscheme
vim.cmd.highlight({"StatusLine", "guifg=white", "guibg=black"})
vim.cmd.highlight({"StatusLineNC", "guifg=gray", "guibg=#111111"})

-- INDENT @ indent-mini
require("indentmini").setup()
vim.cmd.highlight('IndentLine guifg=#223333')
vim.cmd.highlight('IndentLineCurrent guifg=#223333')

-- LSP (Language Server Protocol) @ nvim-lspconfig
require'lspconfig'.bashls.setup{}
--Enable (broadcasting) snippet capability for completion
local capabilities = vim.lsp.protocol.make_client_capabilities()
capabilities.textDocument.completion.completionItem.snippetSupport = true
require'lspconfig'.html.setup {
    capabilities = capabilities,
}
require'lspconfig'.cssls.setup {
    capabilities = capabilities,
}

-- SNIPPET @ luasnip and friendly-snippets
require("luasnip.loaders.from_vscode").lazy_load()
require'luasnip'.filetype_extend("ruby", {"rails"})

-- COMPLETION @ nvim-cmp
local cmp = require'cmp'
cmp.setup({
    snippet = {
        -- REQUIRED - you must specify a snippet engine
        expand = function(args)
          require('luasnip').lsp_expand(args.body) -- For `luasnip` users.
        end,
    },
    window = {
        completion = {
            scrollbar = false,
        },
        documentation = cmp.config.window.bordered(),
    },
    mapping = cmp.mapping.preset.insert({
        ['<C-b>'] = cmp.mapping.scroll_docs(-4),
        ['<C-f>'] = cmp.mapping.scroll_docs(4),
        ['<C-Space>'] = cmp.mapping.complete(),
        ['<C-e>'] = cmp.mapping.abort(),
        -- ['<CR>'] = cmp.mapping.confirm({ select = true }), -- Accept currently selected item. Set `select` to `false` to only confirm explicitly selected items.
        ['<CR>'] = cmp.mapping.confirm({ select = false }), -- Setting `select` to `false` is the best - msh
    }),
    sources = cmp.config.sources({
        { name = 'nvim_lsp' },
        { name = 'luasnip' }, -- For luasnip users.
        { name = 'buffer' },
        { name = 'path' },
    })
})

-- Use buffer source for `/` and `?` (if you enabled `native_menu`, this won't work anymore).
cmp.setup.cmdline({ '/', '?' }, {
    mapping = cmp.mapping.preset.cmdline(),
    sources = {
        { name = 'buffer' },
    }
})

-- Use cmdline & path source for ':' (if you enabled `native_menu`, this won't work anymore).
cmp.setup.cmdline(':', {
    mapping = cmp.mapping.preset.cmdline(),
    sources = cmp.config.sources({
        { name = 'path' },
        { name = 'cmdline' },
    }),
    matching = { disallow_symbol_nonprefix_matching = false }
})

-- Set up lspconfig.
local capabilities = require('cmp_nvim_lsp').default_capabilities()
-- Replace <YOUR_LSP_SERVER> with each lsp server you've enabled.
require('lspconfig')['bashls'].setup {
    capabilities = capabilities
}
require('lspconfig')['html'].setup {
    capabilities = capabilities
}
require('lspconfig')['cssls'].setup {
    capabilities = capabilities
}

-- FILE EXPLORER @ nvim-tree/nvim-tree
-- ttf-nerd-fonts-symbols-mono is recommended to install for icon
-- optionally enable 24-bit colour
vim.opt.termguicolors = true
-- empty setup using defaults
local function my_on_attach(bufnr)
    local api = require "nvim-tree.api"
    local function opts(desc)
        return { desc = "nvim-tree: " .. desc, buffer = bufnr, noremap = true, silent = true, nowait = true }
    end
    -- default mappings
    api.config.mappings.default_on_attach(bufnr)
    -- custom mappings
    vim.keymap.set('n', '<C-t>', api.tree.toggle,        opts('Toggle'))
    vim.keymap.set('n', '?',     api.tree.toggle_help,   opts('Help'))
end
require("nvim-tree").setup {
    on_attach = my_on_attach,
}

-- EDIT SUPPORT
require('nvim-ts-autotag').setup()

-- FUZZY FINDER @ nvim-telescope
local builtin = require('telescope.builtin')
vim.keymap.set('n', '<leader>sf', builtin.find_files, {})
vim.keymap.set('n', '<leader>sg', builtin.live_grep, {})
vim.keymap.set('n', '<leader>sb', builtin.buffers, {})
vim.keymap.set('n', '<leader>sh', builtin.help_tags, {})
```
