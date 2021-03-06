# ATOM CSS

A [BEM](https://bem.info/method/ "BEM CSS")-based domain-specific language, because BEM wasn't confusing enough already.

# Usage

The point of ATOM CSS is to forcibly organize CSS by atoms and molecules. You get the side benifit of *drastically* reduced size of *huge* CSS frameworks.

# Disclaimer

If you believe that CSS works, has no problems, and is totally maintainable, ATOM is not for you.

ATOM is developed to work with BEM, so if you've found BEM to be suitably insufficient for your project, it's probably not for you. That being said, ATOM works with any CSS naming-convention. It works best with nested naming conventions.

Presently, you'd be insane to use ATOM if you don't have a single set of templates for your entire app and a uniform way to display them (or, in interview-initialism keywords: an SPA, a single-page app).

Presently, I wouldn't recommend ATOM at all. It's a working draft and more of a thought expirement. Eventually, I do believe a better *thing* will exist that sits between your CSS atoms and molecules. But ATOM is not perfect; it's not ideal; and it's utility is limited. It's more to draw attention to better developers that something like this *might* be useful in a more general way.

# What Are Atoms and Molecules

An atom is the idea of a style. Think of an underlined atom:

```css
.underlined {
  text-decoration: underlined;
}
```

Okay, that looks stupid, right? Why not just write the rule? Well, there's a few reasons. But let's explore first why atoms make sense:

```css
.rounded-slightly {
  -webkit-border-radius: 0.125em;
  -moz-border-radius: 0.125em;
  -ms-border-radius: 0.125em;
  border-radius: 0.125em;
}
```

Atoms are subjective. You might have an atom for each font-face, for each size, etc. Or you might have an atom for each use-case of font: `font-legal`, `font-title`, `font-subtitle`, which consist of faces, sizes, colors, decorations and so on. You might have both. It's up to you. And you'll notice it's really pretty similar to what you're already doing with SASS/LESS and `@include`s.

# Why The Middleman?

Isn't SASS enough?

Partially. SASS generates some really bloated CSS that isn't exactly render-friendly.

I believe that, in an ideal world, we would organize CSS in a way that makes sense. Since the tools don't yet exist to write CSS in terms of atoms and molecules efficiently, I believe that's the only thing standing in the way.

One of the reasons, you might first use to fight against atoms and molecules, is: "Well, I don't feel like writing ten classes out every time I want to style something instead of just one."

I don't blame you. That would be terrible. But it would be trivial to preprocess your templates to substitute a well-defined molecule/class name with the `N` atoms/classes of which it is composed.

But such a tool hadn't previously existed (AFAIK). The reason, I believe, is because you'd still have to send to the client `N` class names instead of one well-defined BEM class name. And that could really be costly in terms of bandwidth. Long list of `<li>`s? That's a lot of classes. Which means a lot of bandwidth. Which means slow pages. Which means no thanks.

Well, in the world of single-page apps, this actually makes total sense. We just haven't gotten around to solving this in a good way. Probably because we're too busy writting shitty CSS all the time...

# What's ATOM look like?

```atom
block {
  atom1;
  atom2;

  __element {
    atom3;
    atom4;

    --modifier {
      atom5;
      atom6;
    }
  }

  --modifier2 {
    atom7;
    atom8;
  }

  __element:nth-child(2n + 1) {
    atom9;
  }
}
```

If you're familiar with CSS, this might look horribly ineffiecient. Don't worry, ATOM combiles this into:

```json
{
  "block":["atom1","atom2"],
  "block__element":["atom3","atom4"],
  "block__element--modifier":["atom5","atom6"],
  "block--modifier2":["atom7","atom8"],
  "block__element:nth-child(2n + 1)":["atom9"]
}
```

Which if you had a template like:

```html
<div class="block block--modifier2">
  <p class="block__element">Hello, world!</p>
</div>
```

It would atomize into:

```html
<div class="atom1 atom2 atom7 atom8">
  <p class="atom3 atom4 block__element">Hello, world!</p>
</div>
```

Why's the `p` element still have the `block__element` attribute, you might ask? That's so CSS pseduo-classes still work. You need a unique identifier for this type of element for the `nth-child(2n + 1)` expression to work, so the BEM class needs to stay. All of this also means that you can't atomize pseduo-classes. So you need to include the entire CSS definition (as you usually do with standard SASS) for pseudo-class selector rules. Which is just another reason to try to limit these as much as possible (you should be anyway).

# Cons

* Using atoms means you need to know all the atoms. A large CSS codebase could easily consist of hundreds if not thousands of atoms. With good naming conventions, it shouldn't be too tricky to get the hang of. But it does introduce a learning curve.
* There are performance implications (albeit extremely minute) to rendering elements with `A*B` atomic classes as opposed to `B` God-classes.
* Without some framework like ATOM CSS, defining CSS in terms of atoms and molecules isn't really practical. And ATOM CSS is only practical in a well-constructed single page app. So the practicallity, presently, is pretty poor.

# Pros

* Once you master BEM (which is great independent of ATOM CSS), you have maintainable CSS.
* With ATOM, your pages will render faster.
* From a debugging standpoint, BEM names are meaningless. If something doesn't look right, the first thing you need to know is: which atoms compose this style... BEM is great for structure, but not so great for context. ATOM gives you the best of both worlds.

# Caveats

If you didn't notice, the ATOM syntax doesn't allow for you to style based on anything other than classes. This is intended. Which isn't to say styling based on tag name or attribute is bad. That's just supposed to be handled at a different level of CSS, inside of base.css or some equivalent.

# License

ATOM CSS is free--as in BSD. Hack your heart out, hackers.
