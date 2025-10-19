+++
date = '2025-06-25T16:35:27+06:30'
draft = false
title = 'Search in this Site'
description = 'Search in this personal website of Min Soe Han. Useful for searching Myanmar Labor Laws provisions, tech notes of scripting, linux and others.'
[params.add]
    search = true
+++

{{< inner-html >}}
<div id="search"></div>
<script>
    window.addEventListener('DOMContentLoaded', (event) => {
        new PagefindUI({
            element: "#search",
            showSubResults: true,
            showImages: false,
            pageSize: 9
            });
    });
</script>
{{< /inner-html >}}