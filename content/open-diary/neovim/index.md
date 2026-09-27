+++
date = '2026-09-26T15:46:16+06:30'
draft = false
title = 'Open GUI and Termianl in Neovim'
categories = ['open diary', 'tech']
tags = ['terminal', 'neovim']
[params.add]
    codeblock = true
+++

[Neovim](https://neovim.io/) ဆီ ပြန်ရောက်လာပြန်ပြီ။ web development အတွက် [vscode](https://code.visualstudio.com/) ကို သုံးခဲ့တာ။ ကောင်းပါတယ်။ ဒါပေမယ့် ဘာလုပ်လုပ် Linux Terminal ကိုဖွင့်ချင်တာက အကျင့်။ အရင် nvim ထဲ `<Esc>`  အတွက် `;;` ကို နှိပ်တာ။ vscode ထဲမှာလည်း `;;` ကိုချည်း ခဏခဏ မှားနှိပ်နေခဲ့တယ်။

Website တွေလုပ်တော့ VSCode သုံးခဲ့ရခြင်းအကြောင်းက မြန်မာစာရိုက်ရ အဆင်ပြေလို့။ Terminal ထဲ မြန်မာစာရိုက်ဖို့ ဘာနေနေ အဆင်ကိုမပြေ။ Terminal ဆိုတာမျိုးက row တွေ၊ column တွေနဲ့ စာလုံးတစ်လုံးချင်းစီ အတွက် cell တစ်ခုစီ နေရာချထားတာမျိုး။ ဒါကြောင့် terminal ထဲမှာဆိုရင် စာလုံးတစ်လုံးချင်းစီရဲ့ အကျယ် (width) ညီမျှတဲ့ monospace font တွေကိုပဲ သုံးရတာ။ မြန်မာစာလုံးတွေက အပေါ်ရောက်လိုက် အောက်ရောက်လိုက်။ အဲ့ဒါကို ဖြေရှင်းဖို့ nvim ထဲမှာ cmd သို့မဟုတ် keymap ကနေ လက်ရှိဖွင့်ထားတဲ့ ဖိုင်ကို mousepad သို့မဟုတ် GUI Text Writing ဆော့ဖ်ဝဲလ်တစ်ခုခုနဲ့ ဖွင့်လိုက်တာပဲ။ မဆိုးဘူး အဆင်ပြေပါတယ်။ ဒီစာမျက်နှာကို အဲ့သည့်လို mousepad နဲ့ ဖွင့်ပြီးရိုက်ထားတယ်။ ဒီလို လုပ်ဖို့ nvim ရဲ့ config ဖိုင်တွေထဲ usercmd လေးတစ်ခုတော့ ရေးတတ်ဖို့လိုတယ်။ အောက်မှာ နမူနာ။

```lua
vim.api.nvim_create_user_command('Openingui', function(opts)
    local curfile = vim.api.nvim_buf_get_name(0)
    if curfile == '' then
        vim.notify('No filename associated with the current buffer', vim.log.levels.WARN)
        return
    end
    local sname = opts.args
    local software
    if sname != '' and vim.fn.executable(sname) == 1 then
        software = sname
    else
        software = 'mousepad'
        if vim.fn.executable(software) ~= 1 then
            vim.notify('No executable software', vim.log.levels.WARN)
            return
        end
    end
    vim.fn.jobstart({ software, curfile }, { detach = true })
end, { nargs = '?' })
```

နောက်တစ်ခုက terminal ကိစ္စ။ nvim ထဲကနေ file တွေ folder တွေ ပြုပြင်စီမံဖို့ သို့မဟုတ် git push လုပ်ဖို့ terminal လိုတယ်။ VSCode မှာဆို Ctrl+`` ကို နှိပ်တယ်။ vnim မှာကြတော့ `:terminal` ဆိုပြီး ဖွင့်ရတယ်။ ခက်တာက အကိုင်တွယ်ရခက်တာပဲ။ nvim ရဲ့ terminal က normal mode နဲ့ စတယ်။ စာရိုက်ဖို့ i ကို အရင်နှိပ်ရတယ်။ အဲ့သည့်အထိ ပြဿနာသိပ်မကြီးသေး။ insert mode ကနေ ပြန်ထွက်ဖို့ကိစ္စမှာ စခက်တော့တယ်။ `Ctrl+\ Ctrl+n` ကို နှိပ်ရတယ်။ normal mode ထဲကို ပြန်ရောက်မှ `:bd!` နဲ့ ပြန်ထွက်လို့ရပါတယ်။ အဲ့ဒါကို အဆင်ပြေအောင် terminal အတွက် autocmd တစ်ခုရေးရတယ်။

```lua
local custerm = vim.api.nvim_create_augroup('custom-terminal', { clear = true })
vim.api.nvim_create_autocmd('TermOpen', {
    group = custerm,
    callback = function()
        vim.keymap.set('t', '<C-t>', [[<C-\><C-n><Cmd>bd!<CR>]], { buf = 0 })
        vim.keymap.set('t', '<C-w>w', [[<C-\><C-n><C-w>w]], { buf = 0 })
        vim.keymap.set('t', '<leader>n', [[<C-\><C-n><C-w>w]], { buf = 0 })
        vim.keymap.set('n', '<C-t>', [[<Cmd>bd!<CR>]], { buf = 0 })
    end
})
vim.api.nvim_create_autocmd('BufEnter', {
    pattern = 'term://*',
    group = custerm,
    callback = function()
        vim.cmd('startinsert')
    end
})
```

terminal ကိစ္စပြီးတဲ့အခါ ကိုယ်တိုင်ရဲ့ keymap logic ပြောင်းလဲသွားတာကိုလည်း မှတ်တမ်းတင်ရမယ်။ အရင်က insert mode ကနေထွက်ဖို့ ရှေ့မှာပြောခဲ့သလို `;;` ကိုနှိပ်ခဲ့တယ်။ shell script တွေရေးရင် case statement တွေရဲ့ အဆုံးနေရာက `;;` တွေကို တစ်ခုနဲ့တစ်ခု အချိန်လေး ခဏစောင့်သည်းခံပြီး ရိုက်ခဲ့တယ်။ ဒီနေရာမှာ မှတ်စရာတစ်ခုက option တွေထဲက `vim.opt.timeoutlen = 300` ဟာ အရေးပါတယ်ဆိုတာပဲ။ ထားပါတော့ အဲ့ဒါ။ အဲ့လိုနဲ့ နောက်ပိုင်း Typescript (Javascript) ကို ရေးတော့ `;` ဟာ statement တိုင်းရဲ့ အဆုံးသတ်ဖြစ်နေတယ်။ အဆင်မပြေတော့ဘူး။ အဲ့ဒါနဲ့ nvim ထဲမှာ insert mode ကနေထွက်ဖို့ `fj` နဲ့ `jf` နှစ်ခုကို ရွေးလိုက်တယ်။ `dk` နဲ့ `kd` ကိုလည်း စမ်းခဲ့တယ်။ အဆင်ပြေပါတယ်။ ဒါပေမယ့် insert mode ထဲ `dk` ကို အကျင့်ပါနေတဲ့လက်က normal mode ထဲ `dk` ကိုနှိပ်မိတော့ သေပြီပေါ့။ အဲ့ဒါနဲ့ `dk` ကို မရည်ရွယ်ဘဲ မှားမနှိပ်မိဖို့ `fj` နဲ့ `jf` နှစ်ခုကိုပဲ ရွေးလိုက်တယ်။ keymap ဟာ အပေါ်မှာပြောခဲ့တဲ့ terminal ကို အဖွင့်အပိတ်လုပ်တာနဲ့လည်း ဆက်စပ်နေတာကြောင့် အောက်မှာ နမူနာတစ်ခု ချပေးထားမယ်။

```lua
vim.keymap.set('i', 'fj', '<Esc>')
vim.keymap.set('i', 'jf', '<Esc>')
vim.keymap.set('n', '<C-j>', 'gj')
vim.keymap.set('n', '<C-k>', 'gk')
vim.keymap.set('i', '<S-Enter>', '<Esc>o')
vim.keymap.set('i', '<C-Enter>', '<CR><Esc>O')
vim.keymap.set('i', '<C-/>', '<C-x><C-f>')
vim.keymap.set('n', '<C-c>', '<Cmd>Bdelete<CR>')
vim.keymap.set('n', '-', '<Cmd>NvimTreeToggle<CR>')
vim.keymap.set('n', '<C-b>', '<Cmd>buffers<CR>:buffer<space><C-e>')
vim.keymap.set('n', '<C-t>', '<Cmd>split term://bash<CR>')
vim.keymap.set('n', '<C-/>', 'gcc')
vim.keymap.set('v', '<C-/>', 'gc')
vim.keymap.set('c', '<C-/>', '<Backspace>/')
vim.keymap.set('n', '<space>', '<C-^>')
vim.keymap.set('n', '<S-Space>', '<C-w>w')
vim.keymap.set('n', '<C-Space>', '<Cmd>bnext<CR>')
vim.keymap.set('n', '<C-S-Space>', '<Cmd>bprevious<CR>')
vim.keymap.set('n', '<leader>n', '<C-w>w')
```

နောက်တစ်ခုက buffer delete ပြဿနာ။ `:bd` နဲ့ ဖျက်တဲ့အခါ ရှိနေတဲ့ window layout ပျက်သွားတယ်။ အဲ့ဒါကြောင့် [bufdelete](https://github.com/famiu/bufdelete.nvim) လို plugin မျိုး ရှိနေတာဖြစ်တယ်။ အမှန်တော့ buffer delete ပြဿနာအတွက် usercmd တစ်ခုရေးထားရုံနဲ့တင် လုံလောက်သင့်တယ်။ အခြေခံအားဖြင့် buffer delete မလုပ်ခင် buffer number ကိုမှတ်၊ ပြီးတော့ `:bnext` လုပ်ကြည့်လိုက်၊ မရရင် ဖျက်ချင်တဲ့ buffer ဟာ သက်ဆိုင်ရာ window မှာ နောက်ဆုံးတစ်ခုဖြစ်လို့ အခြားတစ်ဖက်မှာ window တစ်ခုရှိနေရင် ပုံစံချထားတဲ့ window layout ပျက်တော့မယ်။ ဒါကြောင့် scratch buffer တစ်ခု ဖန်တီးပြီး အစားထိုး၊ ပြီးတော့မှ ဖျက်ချင်တာကို ဖျက်။ usercmd နမူနာက အောက်မှာ။

```lua
vim.api.nvim_create_user_command('Bdelete', function()
    local buf = vim.api.nvim_get_current_buf()
    if vim.bo[buf].modified then
        vim.notify('Buffer has unsaved changes', vim.log.levels.WARN)
    end
    local win = vim.api.nvim_get_current_win()
    vim.cmd('bnext')
    if buf == vim.api.nvim_get_current_buf() then
        local scratch = vim.api.nvim_create_buf(true, false)
        vim.api.nvim_win_set_buf(win, scratch)
    end
    vim.cmd('bdelete ' .. buf)
end, {})
```

Autocompletion အတွက်ကိုတော့ built-in တွေကိုပဲ သုံးဖို့ ဆုံးဖြတ်လိုက်တယ်။ Language Server Protocol (LSP) ကိုကြတော့ အနည်းဆုံး [lspconfig](https://github.com/neovim/nvim-lspconfig) plugin ကို install မှပဲ အဆင်ပြေတယ်။ programming language တစ်ခုချင်းစီအတွက် `vim.lsp.config({...})` တစ်ခုစီ လုပ်မနေနိုင်။ Autocompletion နဲ့ LSP အတွက် နောက်စာမျက်နှာတစ်ခု သပ်သပ်ရေးမှ အဆင်ပြေမယ်။
