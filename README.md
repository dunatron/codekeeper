## Overview

Getting [Silverstripe 4](http://doc.silverstripe.org/framework/en/installation/),
[react-create-app](http://doc.silverstripe.org/framework/en/installation/),
and [webpack3](https://webpack.js.org/) to play nice.

## What is in the Box? ##
The following tools are installed out of the box
* SilverStripe 4 CMS and Framework
* GraphQL
* Webpack 3
* ReactJS
* Apollo

## Why? ##

  
[Webpack3](https://webpack.js.org/) Webpack is an open-source JavaScript module bundler. Webpack takes modules with dependencies and generates static assets representing those modules.

[Apollo Client](http://dev.apollodata.com/) makes fetching the exact data you need for your component easy and allows you to put your queries exactly where you need them.  

[GraphQl](http://graphql.org/) Send a GraphQL query to your API and get exactly what you need, nothing more and nothing less. 
GraphQL queries always return predictable results. Apps using GraphQL are fast and stable because they control the data they get, not the server. 

[ReactJS](https://reactjs.org/) A JavaScript library for building user interfaces


**In a nutshell**  
GraphQL will create our API, Webpack 3 will compile our front-end application which will use Apollo to fetch Data for our react components

## Installation ##

* cd to your project root
* git clone[https://github.com/dunatron/ss4-reactjs.git](https://github.com/dunatron/ss4-reactjs.git)
* composer install 
* cd themes/react-app
* npm install -g yarn
* yarn install 

## Webpack Build Scripts ##
* npm run build:dev
* npm run build:watch
* npm run build:prod
* npm run build:env
* npm run build:location

*build:dev* will compile a bundle that will point to your graphql set at the *const graphqlURIDEV*  in webpack.config.js 
  
  *build:prod* will compile a bundle that will point to your graphql set at the *const graphqlURIPROD*  in webpack.config.js this should be the domain name of your live site  
  
  *build:watch* will compile a bundle that will point to your graphql set at the *const graphqlURIDEV*  in webpack.config.js It will then watch for changes in the `themes/react-app/src` directory  
  
  *build:env* compiles a bundles that uses your `.env` file to set the graphql endpoint as long as the `SS_BASE_URL="http://example.site.com"` has been set in the .env file  
  
  *buid:location* compiles a bundle that will point to your apps base domain at run time. It makes use of `window.location`  
  
  *ToDo:* make webpack do most of the work and set through one `BASE_URL_VARIABLE` build:location is the only exception.


## Setup ##
There is some configuration setup needed to point our application to our GraphQL API. Apollo Client needs the url. 
Luckily this has been integrated into the webpack configuration `themes/react-app/webpack.config.js`  

configure your DEV and PROD domain names/address  found at around line 17 and 18 
 
  `const graphqlURIDEV = 'http://192.168.50.74/graphql';`  
  `const graphqlURIPROD = 'http://ss4-react.whatshapp.nz/graphql';`
  
## Tools at your disposal ##
[SilverStripe-graphql-devtools](https://github.com/silverstripe/silverstripe-graphql-devtools) are installed out of the box which will help you write your GrapghQL Queries, all you need to do is append
`/dev/graphiql/` to your site base and you can start writing queries to implement on your ReactJS application. The below snippet was run using this tool, you can find an example of this 
in `themes/react-app/src/components/EventCard.jsx` and `themes/react-app/src/pages/EventList.jsx`
```
fragment testFrag on Event {
  Title
  Thumbnail
  BgColor
  Owner {
    Name
    Surname
  }
  Category {
    Name
  }
}
  
query readEvents {
  readEvents {
    edges {
      node {
        ID
        ...testFrag
      }
    }
  }
}
```


## Development and Contribution ##

If you would like to make changes to the SilverStripe core codebase, we have an extensive [guide to contributing code](http://doc.silverstripe.org/framework/en/misc/contributing/code).

## Links ##

 * [Changelogs](http://doc.silverstripe.org/framework/en/changelogs/)
 * [Bugtracker: Framework](https://github.com/silverstripe/silverstripe-framework/issues)
 * [Bugtracker: CMS](https://github.com/silverstripe/silverstripe-cms/issues)
 * [Bugtracker: Installer](https://github.com/silverstripe/silverstripe-installer/issues)
 * [Forums](http://silverstripe.org/forums)
 * [Developer Mailinglist](https://groups.google.com/forum/#!forum/silverstripe-dev)
 * [License](./LICENSE)
 
## Release Process ##
* `git checkout -b develop`
* `git pull origin develop`

This will bring your environment up to date with the `develop` branch.   
You should then create a branch e.g `feature/add-some-feature`
* `git checkout -b feature/add-some-feature`  

when you are done developing your feature you need to push your feature branch to the repository and reaise a pull request

* `git push origin HEAD` **OR** `git push origin feature/add-some-feature`

You then need to[raise a pull request](https://github.com/dunatron/react-add-form/pulls) between your feature branch and the develop branch

**Merging to master branch**  


* `git checkout develop`
* `git pull origin develop`
* run `git fetch origin --tags` this will get all the current tags so you can tag the next release, the tag to use is next in the sequence
* next we switch to release branch `git checkout -b RELEASE/x.x.x`
* `git add -A`
* `git commit -m "RELEASE x.x.x"`
* git tag x.x.x
* git push origin x.x.x
* `git push origin HEAD` **OR** `git push origin RELEASE/x.x.x`
* (NOTE check this) `git pull origin master` if this pull fails something has gone wrong

**Once the release has been merged to master**  

The develop branch will be behind by one commit so we need to bring the `develop` branch up to date with master
* `git checkout develop`
* `git pull origin master` 
* `git push origin develop`

## Editing this doc ##
NOTE:  

md new line just end current line with 2 blank spaces  
  
DO: create a new pull request when editing

## ToDo ##
* Move https://github.com/silverstripe/silverstripe-graphql-devtools to be a dev dependency in composer
* try to get npm graphql-docs implemented and working as dev-dependency
* cleanup front end dependencies like `isomorphic-fetch` and `whatwg-fetch`
* listen to `yarn` and cleanup warnings


