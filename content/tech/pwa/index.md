+++
date = '2025-10-19T09:20:24+06:30'
draft = false
title = 'Progressive Web App (PWA)'
description = 'Progressive Web Apps (PWAs) are web apps built and enhanced with modern APIs.'
categories = ['tech', 'dev']
tag = ['web', 'PWA', 'bubblewrap', 'TWA' ]
[params.add]
    codeblock = true
+++

Progressive Web Apps (PWAs) are web apps built and enhanced with modern APIs to deliver enhanced capabilities, reliability, and installability while reaching anyone, anywhere, on any device, all with a single codebase. 

### Reads {class="mt3rem"}

[https://developers.google.com/codelabs/pwa-in-play#0](https://developers.google.com/codelabs/pwa-in-play#0)  
[https://web.dev/learn/pwa/](https://web.dev/learn/pwa/)  
[https://github.com/GoogleChromeLabs/bubblewrap/tree/main/packages/cli](https://github.com/GoogleChromeLabs/bubblewrap/tree/main/packages/cli)
[https://developer.mozilla.org/en-US/docs/Web/Progressive_web_apps](https://developer.mozilla.org/en-US/docs/Web/Progressive_web_apps)

### Steps {class="mt3rem"}

1. Make Website PWA Ready
2. Build PWA using [bubblewrap](https://github.com/GoogleChromeLabs/bubblewrap)
3. Signing the App

#### 1. Make Website PWA Ready {class="mt3rem"}

Create `/app.webmanifest` file with the following content:

```json {text="/app.webmanufest"}
{
  "name": "MGMAemp",
  "short_name": "MGMAemp",
  "start_url": "/",
  "scope": "/",
  "icons": [
    {
      "src": "/favicon/web-app-manifest-192x192.png",
      "sizes": "192x192",
      "type": "image/png",
      "purpose": "maskable"
    },
    {
      "src": "/favicon/web-app-manifest-512x512.png",
      "sizes": "512x512",
      "type": "image/png",
      "purpose": "maskable"
    }
  ],
  "theme_color": "#ffffff",
  "background_color": "#ffffff",
  "display": "standalone"
}
```

**Suggestion** Online favicon generators like [https://realfavicongenerator.net/](https://realfavicongenerator.net/) generates not only favicons, but also `site.webmanifest` file with PWA basic content:

```json {text="/site.webmanifest"}
{
  "name": "MyWebSite",
  "short_name": "MySite",
  "icons": [
    {
      "src": "/favicon/web-app-manifest-192x192.png",
      "sizes": "192x192",
      "type": "image/png",
      "purpose": "maskable"
    },
    {
      "src": "/favicon/web-app-manifest-512x512.png",
      "sizes": "512x512",
      "type": "image/png",
      "purpose": "maskable"
    }
  ],
  "theme_color": "#ffffff",
  "background_color": "#ffffff",
  "display": "standalone"
}
```

It is recommended to use https://realfavicongenerator.net/ and, just check and edit that `site.webmanifest` as needed.

At this stage, think of how browsers find that `app.webmanifest` file. That's where `<link>` in `<head>` section comes in. Link to the file in head section of every html files. See:

```html {text="index.html"}
...
<link rel="icon" type="image/png" href="/favicon/favicon-96x96.png" sizes="96x96" />
<link rel="icon" type="image/svg+xml" href="/favicon/favicon.svg" />
<link rel="shortcut icon" href="/favicon/favicon.ico" />
<link rel="apple-touch-icon" sizes="180x180" href="/favicon/apple-touch-icon.png" />
<link rel="manifest" href="/favicon/site.webmanifest" />

<link rel="sitemap" href="sitemap-index.xml">
...
```

In above example, the path is `/favicon/site.webmanifest` because it is using https://realfavicongenerator.net/.


#### 2. Build PWA using [bubblewrap](https://github.com/GoogleChromeLabs/bubblewrap) {class="mt3rem"}

Install [bubblewrap cli](https://github.com/GoogleChromeLabs/bubblewrap/tree/main/packages/cli) and, `init` and `build` as follows:

```text {text="bash"}
sudo su
npm i -g @bubblewrap/cli
```

Using `sudo npm i -g @bubblewrap/cli` is not recommended on that page. See:  
https://medium.com/@ExplosionPills/dont-use-sudo-with-npm-still-66e609f5f92  
https://medium.com/@ExplosionPills/dont-use-sudo-with-npm-5711d2726aa3

Then, `init` and `build` PWA using `bubblewrap`

```text {text="bash"}
bubblewrap init --manifest https://my-twa.com/app.webmanifest
```

It will initiate the process and create `keystore` which contains `SHA-256 fingerprint` key and others.

```text {text="bash"}
bubblewrap build
```

Type password that was given in the previous command. Building may take a bit some time and will generate the followings:

```text {text="bash"}
android.keystore
app/
app-release-bundle.aab
app-release-signed.apk
app-release-signed.apk.idsig
app-release-unsigned-aligned.apk
build/
build.gradle
gradle/
gradle.properties
gradlew
gradlew.bat
manifest-checksum.txt
settings.gradle
store_icon.png
twa-manifest.json
```

In above files, `app-release-bundle.aab` is supposed to be uploaded to Google Play Console, and `app-release-signed.apk` can be shared and installed other than via Play Store.

#### 3. Signing the App {class="mt3rem"}

Think of how the app `app-release-signed.apk` knows the website, `https://my-twa.com`, for e.g., that was given in the bubblewrap command, `bubblewrap init --manifest https://my-twa.com/manifest.json` is truly owned by the owner of the app. That is where **Signing the App** comes in. To sign the app, find the SHA-256 Fingerprint key using `keytool` as follow:

```text {text="bash"}
keytool -list -v -keystore android.keystore
```

Then create `assetlinks.json` because `bubblewrap build` command does not inherently create the assetlinks.json file. Instead, it generates the necessary information (like the SHA256 certificate fingerprint) that you need to manually create and host this file on your web server. To manually create `assetlinks.json` file, see:

```json {text="/.well-known/assetlinks.json"}
[
    {
        "relation": [
            "delegate_permission/common.handle_all_urls"
        ],
        "target": {
            "namespace": "android_app",
            "package_name": "com.mgmaemp.twa",
            "sha256_cert_fingerprints": [
                "SHA-256_Fingerprints"
            ]
        }
    },
    {
        "relation": [
            "delegate_permission/common.handle_all_urls"
        ],
        "target": {
            "namespace": "android_app",
            "package_name": "com.mgmaemp.twa",
            "sha256_cert_fingerprints": [
                "SHA-256_Fingerprints"
            ]
        }
    }
]
```

The file must be inside `/.well-known` like `/.well-known/assetlinks.json`. In above example, the `package_name` is the name given to the prompt of `init` command. The default suggestion is reversed domain name with `.twa` extension. For example, if the domain is `mgmaemp.com`, then the default suggested `package_name` would be `com.mgmaemp.twa`. And there are two json objects. They are:

- For `app-release-signed.apk`  
`SHA-256` key from `keytool -list -v -keystore android.keystore` command
- For `app-release-bundle.aab`  
`SHA-256` key will come form Google Play Console's Signing App

At this stage, `PWA`, `app-release-signed.apk` and `app-release-bundle.aab` are ready. Continue to https://play.google.com/console/signup.

In this article, you will notice TWA and be wondering what is TWA? A Trusted Web Activity (TWA) is an Android feature that allows a web application, specifically a Progressive Web App (PWA), to run within an Android app in a full-screen, browser-like environment powered by Chrome. Unlike traditional WebViews, which render content in a more isolated environment, TWAs leverage Chrome Custom Tabs to provide a seamless and performant experience. See:  
https://developer.chrome.com/docs/android/trusted-web-activity