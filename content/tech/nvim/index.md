+++
date = '2026-09-13T10:55:01+06:30'
draft = false
title = 'Neovim'
categories = 'tech'
tags = [ 'nvim', 'code', 'texteditor' ]
[params.add]
    codeblock = true
+++

I finally returned to [Neovim](https://neovim.io/). The following setup is my personal and very minimal. As of 2026-09-13, The current Neovim `nvim` is:

```text
:$ nvim --version
NVIM v0.12.5
Build type: RelWithDebInfo
LuaJIT 2.1.1788856981
Run "nvim -V1 -v" for more info
```

Since 0.12 version, built-in autocompletion & LSP support is properly working. To get autocompletion and LSP working, the following options are important.
{class="mt3rem"}

```lua
vim.opt.autocomplete = ture
vim.opt.complete:append('o')
vim.opt.completeopt = { 'menuone', 'noselect' }
```

#### Recommended Options{class="mt3rem"}

```lua
vim.opt.cursorline = true
vim.opt.number = true
vim.opt.ignorecase = true
vim.opt.smartindent = true
vim.opt.breakindent = true
vim.opt.expandtab = true
vim.opt.tabstop = 4
vim.opt.shiftwidth = 4
vim.opt.wrap = false
vim.opt.autocomplete = true
vim.opt.termguicolors = true
vim.opt.timeoutlen = 300
vim.opt.signcolumn = "yes"
vim.opt.complete:append('o')
vim.opt.completeopt = { 'menuone', 'noselect' }
vim.g.mapleader = 'ff'
vim.g.netrw_banner = 0
vim.g.netrw_winsize = 20
vim.g.netrw_browse_split = 4
```

#### Language Server Protocol (LSP) and Autocompletion{class="mt3rem"}

Full LSP implementation (minimal and `nvim-lspconfig` plugin is recommended to install)

```lua
local capabilities = vim.lsp.protocol.make_client_capabilities()
vim.lsp.config("*", { capabilities = capabilities })
vim.lsp.config('astro', {
    init_options = {
        typescript = {
            tsdk = '/usr/lib/node_modules/typescript/lib',
        },
    },
})
vim.lsp.enable({ "astro", "bashls", "ts_ls", "html", "cssls", "clangd" })
vim.api.nvim_create_autocmd('LspAttach', {
  callback = function(ev)
    local client = assert(vim.lsp.get_client_by_id(ev.data.client_id))
    if client:supports_method('textDocument/completion') then
      vim.lsp.completion.enable(true, client.id, ev.buf, {autotrigger = true})
    end
  end,
})
```

#### Recommended Plugins{class="mt3rem"}

```lua
vim.pack.add({
    'https://github.com/neovim/nvim-lspconfig', -- lspconfig
    'https://github.com/mason-org/mason.nvim', -- mason to install lsp
    'https://github.com/marko-cerovac/material.nvim', -- material color
    { src = 'https://github.com/nvim-treesitter/nvim-treesitter', build = ':TSUpdate' }, -- treesitter for better colors
    'https://github.com/nvim-telescope/telescope.nvim', -- telescopt
    'https://github.com/nvim-lua/plenary.nvim', -- telescope deps pinentry
    { src = 'https://github.com/nvim-telescope/telescope-fzf-native.nvim', build = 'make' }, -- telescope recommended dep
    'https://github.com/windwp/nvim-autopairs', -- autopair
    'https://github.com/windwp/nvim-ts-autotag', -- nvim-ts-autotag for html tags enclosing
    'https://github.com/nvimdev/indentmini.nvim' -- indentmini for indent lines
})
vim.cmd 'colorscheme material'
vim.g.material_style = 'deep ocean'
require('nvim-treesitter').install { 'astro', 'bash', 'javascript', 'typescript', 'html', 'css', 'lua', 'json' }
require('indentmini').setup()
vim.cmd.highlight('IndentLine guifg=#223333')
vim.cmd.highlight('IndentLineCurrent guifg=#223333')
require('nvim-autopairs').setup()
local builtin = require('telescope.builtin')
vim.keymap.set('n', '<C-f>', builtin.find_files, { desc = 'Telescope find files' })
vim.keymap.set('n', '<leader>g', builtin.live_grep, { desc = 'Telescope live grep' })
vim.keymap.set('n', '<leader>b', builtin.buffers, { desc = 'Telescope buffers' })
vim.keymap.set('n', '<leader>fh', builtin.help_tags, { desc = 'Telescope help tags' })
require('mason').setup()
require('nvim-ts-autotag').setup()
```

#### Netrw implementation and Autocmd{class="mt3rem"}

```lua
vim.api.nvim_create_autocmd('VimEnter', {
    callback = function()
        vim.cmd('Vexplore')
    end
})
vim.api.nvim_create_autocmd('BufRead', {
    pattern = '*',
    callback = function()
        local first = vim.fn.getline(1)
        if first == "#!/bin/dash" or first == "#!/usr/bin/dash" then
            vim.bo.filetype = 'sh'
        end
    end
})
vim.api.nvim_create_autocmd({'BufNewFile', 'BufFilePre', 'BufRead'}, {
    pattern = '*.md',
    callback = function()
        vim.bo.filetype = 'markdown'
    end
})
vim.api.nvim_create_autocmd('FileType', {
    pattern = 'markdown',
    callback = function()
        vim.opt.conceallevel = 2
    end
})
vim.api.nvim_create_autocmd('FileType', {
    pattern = 'netrw',
    group = vim.api.nvim_create_augroup('custom-netrw', { clear = true }),
    callback = function()
        vim.keymap.set('n', 'l', '<CR>', { remap = true, buf = 0 })
        vim.keymap.set('n', 'h', 'gg<CR>', { remap = true, buf = 0 })
        vim.keymap.set('n', '-', '<Cmd>bd<CR>', { buf = 0 })
    end
})
vim.api.nvim_create_autocmd('TermOpen', {
    group = vim.api.nvim_create_augroup('custom-terminal', { clear = true }),
    callback = function()
        vim.keymap.set('t', '<C-/>', [[<C-\><C-n>]], { buf = 0 })
    end
})
```

#### Buffer Delete{class="mt3rem"}

```lua
-- Helper function to delete buffers without closing windows/splits
local function close_buffer(opts, wipeout)
    local target_buf = vim.api.nvim_get_current_buf()
    
    -- If a specific buffer number or name was passed as an argument, use that instead
    if opts.args and opts.args ~= "" then
        local bufnr = tonumber(opts.args)
        if bufnr and vim.api.nvim_buf_is_valid(bufnr) then
            target_buf = bufnr
        else
            -- Try to find buffer by name if a string argument was provided
            for _, b in ipairs(vim.api.nvim_list_bufs()) do
                if vim.api.nvim_buf_is_valid(b) and vim.fn.bufname(b):match(opts.args) then
                    target_buf = b
                    break
                end
            end
        end
    end

    if not vim.api.nvim_buf_is_valid(target_buf) then return end

    -- Find all windows currently displaying this buffer
    local windows = vim.fn.win_findbuf(target_buf)
    
    for _, win in ipairs(windows) do
        if vim.api.nvim_win_is_valid(win) then
            -- Switch the window to the alternate buffer, or create an empty scratchpad
            vim.api.nvim_win_call(win, function()
                local alt_buf = vim.fn.bufnr("#")
                if alt_buf > 0 and alt_buf ~= target_buf and vim.api.nvim_buf_is_valid(alt_buf) and vim.bo[alt_buf].buflisted then
                    vim.cmd("buffer #")
                else
                    vim.cmd("bnext") -- Try next buffer
                    if vim.api.nvim_get_current_buf() == target_buf then
                        -- No other listed buffers available, create an empty scratchpad
                        local scratch = vim.api.nvim_create_buf(true, false)
                        vim.api.nvim_win_set_buf(win, scratch)
                    end
                end
            end)
        end
    end

    -- Choose native command based on wipeout flag
    local cmd = wipeout and "bwipeout!" or "bdelete!"
    
    -- Final safety check: if buffer is modified and bang (!) wasn't used, warn user
    if vim.bo[target_buf].modified and not opts.bang then
        vim.notify("No write since last change (add ! to override)", vim.log.levels.ERROR)
        return
    end

    vim.cmd(string.format("%s %d", cmd, target_buf))
end

-- Create user commands with the exact properties from bufdelete
vim.api.nvim_create_user_command(
    'Bdelete',
    function(opts) close_buffer(opts, false) end,
    { bang = true, bar = true, count = true, addr = 'buffers', nargs = '*', complete = 'buffer' }
)

vim.api.nvim_create_user_command(
    'Bwipeout',
    function(opts) close_buffer(opts, true) end,
    { bang = true, bar = true, count = true, addr = 'buffers', nargs = '*', complete = 'buffer' }
)
```

#### Keymapping{class="mt3rem"}

```lua
vim.keymap.set('i', 'fj', '<Esc>')
vim.keymap.set('i', 'jf', '<Esc>')
vim.keymap.set('v', ';;', '<Esc>')
vim.keymap.set('i', '<C-Enter>', '<Esc>o')
vim.keymap.set('i', '<C-o>', '<CR><Esc>O')
vim.keymap.set('i', '<C-h>', '<Left>')
vim.keymap.set('i', '<C-j>', '<Down>')
vim.keymap.set('i', '<C-k>', '<Up>')
vim.keymap.set('i', '<C-l>', '<Right>')
vim.keymap.set('n', '<leader><space>', '<C-6>')
vim.keymap.set('n', '<C-c>', '<Cmd>Bdelete<CR>')
vim.keymap.set('n', '<leader>n', '<C-w>w')
vim.keymap.set('n', '<leader>w', '<C-w>w')
vim.keymap.set('n', '<leader>j', '<C-w>J')
vim.keymap.set('n', '<leader>k', '<C-w>K')
vim.keymap.set('n', '<leader>h', '<C-w>H')
vim.keymap.set('n', '<leader>l', '<C-w>L')
vim.keymap.set('n', '<leader>e', '<C-w>=')
vim.keymap.set('n', '<leader>m', '<C-w>_')
vim.keymap.set('n', '<leader>v', '<C-w>v')
vim.keymap.set('n', '<leader>s', '<C-w>s')
vim.keymap.set('n', '<leader>o', 'zO')
vim.keymap.set('n', '<leader>c', 'zC')
vim.keymap.set('n', '=', '<Cmd>Vexplore<CR>')
vim.keymap.set('n', '-', '<C-w>w<Cmd>bd<CR>')
vim.keymap.set('n', '<F7>', '<Cmd>setlocal spell!<CR>')
vim.keymap.set('n', '<F6>', '<Cmd>setlocal linebreak wrap!<CR>')
vim.keymap.set('n', '<C-b>', '<Cmd>ls<CR>:b<space>')
vim.keymap.set('n', 'el', vim.diagnostic.open_float, { desc = 'Error Line' }) -- error line
vim.keymap.set('n', '<C-/>', 'gcc', { remap = true, desc = 'comment current line' })
vim.keymap.set('v', '<C-/>', 'gc', { remap = true, desc = 'comment current line' })
```

#### Recommended YouTube Video{class="mt3rem"}

{{<youtube s7zb73fgXqU >}}

