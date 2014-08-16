# Best in Class Education

## Dev Setup
```git clone https://github.com/mikechriskelly/bestinclass.git```

```npm install```

```bundle install```

## Dev Workflow
```grunt serve``` # Use for local development. Serves at http://localhost:4000

```grunt build``` # Compiles everything to the _site directory

```grunt deploy``` # Push _site to remote server for production

## Center Info
List of center information should be maintained at:
- _data/locations.yml # record of all location for the location search feature
- locations/ # one page per center for center info page

Note: Do not edit locations/locations.json as it is updated automatically.

## Blog Info
The content for the two blogs are found in:
- news/_posts
- spotlight/_posts

Each blog post is a MarkDown text file. The filename determines the date and title. User dashes between words. For example:
2013-08-22-Test-Prep-for-Gifted-Students.md

Variable in the front matter:
- layout: [do not change]
- blog: ```news``` or ```spotlight```
- published: ```false``` or ```true``` [use false for drafts in progress]

## Blogging Workflow

1. Create or edit a MD file in news/_posts or spotlight/_posts
2. To preview your work live use ```grunt serve``` and open your browser to localhost:4000
3. To save file changes use ```git add news/_posts/2014-08-18-Your-New-Post.md``` and ```git commit -m "Added Post"```
4. To push changes to the live website use ```grunt deploy```