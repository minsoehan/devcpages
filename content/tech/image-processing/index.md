+++
date = '2025-10-03T10:16:09+06:30'
draft = false
title = 'Image Processing for Website'
categories = ['tech', 'dev']
tags = ['image', 'web']
[params.add]
    codeblock = true
+++

Image processing became essential part of web development nowadays. It is my way of image processing in [Arch Linux](https://archlinux.org/) with following steps:

1. Resizing big image before optimizing using [ImageMagic](https://imagemagick.org/) or [FFmpeg](https://ffmpeg.org/)
2. Optimizing image using:
    - [jpegoptim](https://github.com/tjko/jpegoptim) for JPG
    - [pngquant](https://pngquant.org/) for PNG or
    - [optipng](https://optipng.sourceforge.net/) for PNG or
    - [oxipng](https://github.com/oxipng/oxipng) for PNG or
    - [Squoosh](https://squoosh.app/) or [Squoosh GitHub](https://github.com/GoogleChromeLabs/squoosh) of Google for JPG and PNG
    {class="mb0"}
3. Convert image to `webp` format using `cwebp` of [libwebp](https://github.com/webmproject/libwebp)

### Install Required Software in Arch Linux {class="mt3rem"}

```text
pacman -S jpegoptim pngquant libwebp libwebp-utils
```

### Resize Image {class="mt3rem"}

Using [ImageMagic](https://imagemagick.org/)

```text
magick input.jpg -resize 1200x -strip -quality 85 output.jpg
```

Resize width to 1200px, keep aspect ratio, strip metadata.

- `-resize 1200x` → max width 1200px
- `-strip` → remove EXIF (saves KBs)
- `-quality 85` → good tradeoff for web

### Optimize Image {class="mt3rem"}

Using [jpegoptim](https://github.com/tjko/jpegoptim)

```text
jpegoptim --max=80 --strip-all *.jpg
```

Using [pngquant](https://pngquant.org/)

```text
pngquant --quality=65-80 --ext .png --force *.png
```

### Convert Image to WebP {class="mt3rem"}

using [cwebp](https://github.com/webmproject/libwebp)

```text
cwebp -q 80 input.jpg -o output.webp
```

### Workflow Conclusion

1. Resize first (ImageMagick → 1200px max width)
2. Optimize
    - `jpegoptim` (JPEGs)
    - `pngquant` (PNGs)
    {class="mb0"}
3. Convert to WebP (`cwebp -q 80`)

This gives me small, fast-loading, SEO-friendly images.
