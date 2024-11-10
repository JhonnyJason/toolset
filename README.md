# toolset - a collection of tools for developing on any thingy, by and for me, the JhonnyJason :D

# Why?
I recognized that the only reasonable way I develop is to develop on how I develop. 

This means that actually the biggest part of my development is in the updates and optimizations on how I build my code -> optimization of the same helper tools.

Another reason is I know what is done here, and I can just make an uptade as soon as I see something is actually unnecessary painful.

And maybe the most productivity related reason which IMO is totally underestimated. When I use the same tools for every project all the time, adjusting every kind of development to my thought optimal flow. Only then it becomes second nature or even primary nature. Then it is fun doing so, because it is your world.

I want to reduce this fragmentation of my mind. Fragmentation in the way of holding various similarily important contextes(well specifically here just the labeling layer) in my mind in parallel with limited judgement of which world is more important, because I need to zoom in and out of that said world anytime I decide to - now I need an App, - now I need an CLI, - now I need a Webinterface, etc. (like diving as a grown up into different worlds where people are running around in this world and you have to learn walking each time again xD because the labeling layer is the first basic thing to be able to move in these worlds - while I actually learn nothing new other than that I'm maybe even stupid? Ok and a bit endurance through hardship. And what is the point to be enduring really unnecessary hardship? Only the motivation to get rid of it ;-) I did that enough and here I am :D )

In contrast to the advice given: "Learn 10 new languages every year". I say, "Optimize your own language every year."
Look into other languages out of curiousity, yes. Become inspired if you really encounter a new concept, yes. Build translation layers to other languages - yes. But you don't have to learn garbage. And you decide what is garbage. So go your own way to follow what you decide is not garbage that is what you create, use and extend on every level. That is then your toolset :-) maybe it makes sense to have a repository for it and to use the same toolset everywhere?

The ultimate aim is to control the whole way from my personal IDE where I express myself in my own primary nature language which is being translated down to the various machine codes which can unambigously be understood by the corresponding machine ;-)

In between we may have a layer where we developers synchronize conceptually and structurally. But as long as we want to live in babylon, I would only hurt myself when subordinaing myself to yous this other guys language. In general by language I mean here the way of expressing myself. And developing is a way of expressing yourself. Adding what makes sense to you.

Just imagine everyone stubbornly using their own language and you're the only idiot who tries to understand everybody learning every language. Then you're that "Nice Guy" who has nothing to give. But you can understand everybody how they tell you in their world how superior they are. Because it's actually what everbody is saying all the time xD. So is this text. So do you, or if you don't you should^^. Keep in mind: "My expression is worth to be regarded as superior because it is one which will keep our tribe not just alive but also allows everyone to thrive." If that justification is right. Then you are right. And there is no doubt that your world is by far more valuable than the dull predetory ones. For the bright cooperative ones - we are not really in a competition, are we? Give the world all you've got. We need you, Thank you! :-)

So that for all the why it makes sense to create your own toolset xD

# What?
The current version is producing a specific `package.json` for each `thingy` we might want to develop.
There we have the pnpm scripts available to build and test our `thingy`. `thingy-build-system/producePackageJason.js` is responsible for this.

Therefore we have 4 major parts to consider.

1. `prepareThingyFor<thingyType>.pl`
1. `baseThingyInfo.js`
1. `specificThingyInfo.js`
1. set of scripts in `thingy-build-system/<thingyType>/`

The `prepareThingyFor<thingyType>.pl` script I use to call in the `individualize.js` when having created a `thingy`. It connects the specific `specificThingyInfo.js` from `thingy-build-system/<thingyType>/specificThingyInfo.js` by creating a symlink to `thingy-build-system/specificThingyInfo.js`.
It also tries to do the same for a potential `sourceInfo.js` we have in our `../sources/` directory. As we might want to have additional scripts and dependencies dependent on our thingys' source. Finally it calls the `thingy-build-system/producePackageJason.js` script to produce the `package.json`

The `baseThingyInfo` is defining the general properties for the `package.json` which work the same way for every of our thingy.

The `specificThingyInfo.js` introduces the type, scripts and dependencies specific to the `thingyType`.

Then `thingy-build-system/<thingyType>/` carries all the helper scripts having too much complexity for our `package.json` and where we donot need it to be a cli used as an npm module.

This way my toolset is currently producing the corresponding `package.json` for 5 `thingyTypes`

- pwa
- admin-pwa
- machine
- cli
- service

# How?

Requirements
---
Because I use `thingymodulecreate` here the toolset needs to meet it's requirements
* [GitHub account](https://github.com/) and/or [Gitlab account](https://gitlab.com/)
* [GitHub ssh-key access](https://help.github.com/en/github/authenticating-to-github/generating-a-new-ssh-key-and-adding-it-to-the-ssh-agent) and/or [Gitlab ssh-key-access](https://docs.gitlab.com/ee/gitlab-basics/create-your-ssh-keys.html)
* [GitHub access token (repo scope)](https://github.com/settings/tokens) and/or [Gitlab access token (api scope)](https://docs.gitlab.com/ee/user/profile/personal_access_tokens.html)
* [Git installed](https://git-scm.com/)
* [Node.js installed](https://nodejs.org/)

Furtherly for pwa and service testing
* [mkcert installed](https://github.com/FiloSottile/mkcert)

For service and machine testing
* [nginx installed](https://nginx.org/)
* [systemd installed](https://www.freedesktop.org/wiki/Software/systemd/)

For building app
* [cordova installed](https://cordova.apache.org/)
* ... further tools for building the App and running on your device

---

Structural Requirements
---
This toolset expects all thingies to have my thought structure for it.
The basic structure looks as follows:

In the thingy root we have
- `testing/`
- `output/`
- `sources/`
- `toolset/`

`output/` does not have any further structural requirements as the purpose of this submodule is to carry all the generated deployable production output.

`testing/` is totally specific to the `thingyType`.

`sources/` is also rather specific to the `thingyType` but it has many similarities across all `thingyTypes`. The purpose is that here is all the information available to completely build the `thingy` most independent of the build-system as possible. While we do then have some structural decisions which the build-system has to be aware of. Those are then thought to be consistent to the other `thingyTypes` as well and should make sense universally.
- `sources/ressources/`
- `sources/patches/`
- `sources/source/`
- `sources/sourceInfo.js`

`sources/ressources/` generally carries the static assets, usually here for completeness of the sources and their updates - then copied into the `output/` for deployment.

`sources/patches` has the purpose to carry patches we need for some node_modules. It also carries the script to be executed for applying those patches. Mostly used as workarounds for some unexpected behaviours.

`sources/source` generally carries all the code. Here I decided that it is cool to have a flat hierarchy of reasonably perceivable many modules. Which are then injected into the global scope, initialized and then may be used from anywhere in the code. I decided that the naming of `*module` identifies such a module to be used in that manner. So all relevant files of `sources/source/*module/` can be automatically importet from an automatically generated `sources/source/allmodules/allmodules.coffee` and `sources/source/allmodules/allstyles.styl` file. the relevant files are `<moduleName>.coffee` and `style.styl`. This way I may have modules which I use differently - that is being done by not naming the module `*module`. For example an often used module to not be included in the global scope anywhere is `index`.

I decided to write my code in [CoffeeScript](https://coffeescript.org/), [Stylus](http://stylus-lang.com/) and [Pug](https://pugjs.org/api/getting-started.html) because it is very nice to write that code then.

---

Behaviour
---
This is an rather general description of which parts are being processed in my toolset.
## Pug Processing
For Pug Processing there are is a designated place where the heads for a document are to be found. `sources/page-heads/<pageName>/document-head.pug` everything is included from here.

As I want to automatically include the appropriate `<pageName>.css` and `<pageName>.js` I include them from `toolset/build/includes/` - a dependency from the sources to the toolset^^ - as the toolset will link the correct files there. So we have the testing versions and the production versions included in the same way.

This way pug is used to stick it everything together for websites, pwas and apps.

### HTML and SVG
As pug provides the capability to include these files there is no problem with mixing it up and just include some HTML or SVG from somewhere.

Personally I rather convert it to pug as it is more convenient as I usually also want to work with these files.

### Markdown
Nice thing here is, you may also include markdown directly in pug.
```pug
include:markdown-it article.md
```

## Styls Processing
For stylus I also have specific entry points determined by what pages may be found at `sources/page-heads/`. Because I want to have a `<pageName>.css` for every page. 

These entry points are `<pageName>.styl`. So I usually have it in `sources/source/<pageName>/<pageName>.styl`.

From this entry point stylus follows the import statements. Very convenient is to import the `sources/source/allmodules/allstyles.styl` to have every style from all the modules available.

### CSS
For CSS we may just import it in the same way as the stylus where because the toolset is using the `--include-css` switch. So it is all bundled together in one beautiful(dirty) css file.

Further optimizations done on the css include [clean-css](https://www.npmjs.com/package/clean-css-cli) and [purge-css](https://www.purgecss.com/). This way I never have to have a bad conscience when importing the `allstyles.styl` ;-)


## Coffee Processing
Coffee processing is done very simple - every file which is found as `sources/source/*/*.coffee` is going to be transpiled to its JS in `toolset/build/js/`. 

Here it is important to notice that it would be a problem if we have multiple coffee files having the same name it does not matter where they are.

The rest is done by bundling it all together using [Webpack](https://webpack.js.org/). The toolset automatically generates the webpack configuration files for development bundling and production bundling in `.build-config/` by checking out our entry points.

Here it is also important to notice that any configuration adjustment which is not conflicting to what the toolset needs to write to the configuration file is preserved when generating the config file again.

For Websites these entry points are `<pageName>.js`. So I usually have them in `sources/source/<pageName>/<pageName>.coffee`.

### JS
As webpack is directly bundling the JS I have no troubles to just include other JS from somewhere. This is especially convenient when including from node_modules as webpack knows how to handle it.

Only for the cli I skip the bundling part. As the cli will be published on npm I consider it very nice to have it to be readable and separated javascript files.

---

Usage
---

Here there is a documentation on the specific capabilities which are thought to be used in the process of development of the produced `package.json` and are run by `$ pnpm run <name>`.

All starts off by calling `$ pnpm install` in the thingy root.
This will trigger the initialization of the build-system on `postinstall`.

## general commands
### $ pnpm run add-module `<moduleName>`
Convenience tool to create a new module `<moduleName>` at
`sources/source/<moduleName>/`.
Here [thingy-module-gen](https://www.npmjs.com/package/thingy-module-gen) is used to create the files. It carries it's own templates for a .pug, .styl and .coffee file.

It will ask which files you want in your module and instantly create it then call `sync-allmodules` to have the updates available in the files of `sources/source/allmodules/`.

### $ pnpm run use-thingysourcemodule
# To be done!



### $ pnpm run create-thingysourcemodule
# To be done!



### $ pnpm run sync-allmodules
This will trigger the scan for all relevant in `sources/source/*module/` and create the new `sources/source/allmodules/allmodules.coffee` and `sources/source/allmodules/allstyles.styl` files.

Usually this is only necessary when you manually introduced a new module.


### $ pnpm run to-sub `<moduleName>`
# To be done!

### $ pnpm run to-dir `<moduleName>`
# To be done!

### $ pnpm run deployment-build
This will trigger the production build with all it's optimization and the copying of the ressources to have the deployment version ready in the `output/` submodule.

### $ pnpm run check-deployment
This will first trigger the `deployment-build` and then link everything in a way that we may test the optimized version too if we want to make sure that the optimization does not yield any side-effects.

Finally it triggers the testing similar to what we have on the `test` command.


### $ pnpm run push
This will recursively push everything to the current `origin master` - also for every submodule.

Be sure that you have your ssh-key to your `cloudService` ready to be used silently in your terminal.

Here I use [thingysync](https://www.npmjs.com/package/thingysync).

### $ pnpm run pull
This will recursively pull everything from the current `origin master` - also for every submodule.

Be sure that you have your ssh-key to your `cloudService` ready to be used silently in your terminal.

Here I use [thingysync](https://www.npmjs.com/package/thingysync).

### $ pnpm run release
This will merge the current `origin master` of the `output/` submodule to `origin release` then also push it. Usually this will trigger the webhooks to further automated deployment steps.

For the cli however it will publish it to npm - so be sure to be logged into npm on your terminal where you call this command.

Be sure you have prepared the correct production build in the `output/` submodule before and have pushed everything to `origin master` first.

### $ pnpm run update-packages
This will check npm if any package has a newer version available. Then install the newer versions.

Here [npm-check-updates](https://www.npmjs.com/package/npm-check-updates) is used followed by an immediate call of `$ pnpm install`.

## app specific commands
### $ pnpm run test

This will build and watch all files up until the complete bundled html is ready - then it is running the UI in browser-sync. For App specific behaviour I usually create mocks in the `testing/` directory to be used for specific testing context.


## cli specific commands
### $ pnpm run test
For the cli it is reasonable to run through all testcases.

### $ pnpm-run update-cli-packages
Here we deal with the dependencies of the resulting output package. The relevant files {`package.json`, `package-lock.json`} here are usually kept in `sources/ressources/` directory.

So the result will be upgraded dependencies of the resulting cli in `output/` plus the upgrades being reflected in `sources/ressources/package.json`.

## machine specific commands
### $ pnpm run test

For a service it is run as nodemo service. (should be done better running testcases - WIP)

For the cli it is reasonable to run through all testcases.

For machines any automated testing is very difficult (WIP).


## pwa specific commands
### $ pnpm run test
This will build and watch all files - then is running the UI in browser-sync.

### $ pnpm run create-subapp
# To be done!

### $ pnpm run create-thingypagehead
# To be done!



## service specific commands
### $ pnpm run test
# To be done!

## website specific commands
### $ pnpm run test
# To be done!

