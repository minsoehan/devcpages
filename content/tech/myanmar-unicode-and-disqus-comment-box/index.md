+++
date = '2025-08-09T10:29:36+06:30'
draft = false
title = 'Myanmar Unicode and Disqus Comment Box'
categories = 'tech'
tags = ['myanmar unicode', 'disqus']
+++

If you type Myanmar language online, you’ve probably met this problem:  
Everything’s fine — until you type ေ (the “E-vowel”) second time (E.g. the second ေ in ကောင်း ေကာင်း) in a Disqus comment box. Suddenly, the whole page reloads and even [Disqus](https://disqus.com) comment box disappears.

This is not a random glitch. It’s a combination of:

- The **Myanmar typing system**, where the vowel ေ is traditionally typed before the consonant (e.g., type ေ then က to get ေက) for typing ကောင်း.
- **Unicode order rules**, which expect consonants first (e.g., ကောင်း).
- A **Disqus input handling bug**, which misinterprets the second typing of ေ as a “Back” or “Reload” key sequence in certain browsers.

The result? Your carefully typed comment is gone.

### Why This Happens

In Unicode Myanmar, typing order is rearranged internally. The vowel ေ is placed in front visually but stored differently in the text.
Some input methods for Myanmar allow visual typing order (type ေ first), but Disqus’s comment iframe has JavaScript that reacts badly when this vowel is inserted before the consonant a second time — it treats it like a browser history command.

### Solution?

Sorry!. Even though we can come up with various fixes or workarounds, the real solution can only come from Disqus itself — or by changing the ingrained habit of many Myanmar users who insist on typing “ေ” first and going back to the days before an era of expensive "visual typing order" method.

This habit dates back to when developers implemented the costly “visual typing order” method, allowing typing the vowel “ေ” before a consonant at the expense of proper Unicode sequence. At the time, this was done in response to loud complaints from users who found it unbearable to type “ေ” after a consonant.

Now, years later, we are seeing the price of that decision: technical incompatibilities, like the Disqus input reload bug, that arise precisely because of the visual typing order approach.