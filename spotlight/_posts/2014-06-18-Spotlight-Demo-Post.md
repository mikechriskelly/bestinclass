---
layout: post-spotlight
blog: spotlight
published: true
---

The filename of these MD files determines the date and title of blog posts. 

The YAML head matter at the tope of the MD file has important settings for the post:

* blog: set this to spotlight or news
* published: set to true (published) or false (unpublished for work in progress)
* categories: useful to track and filter posts (e.g. press release, announcement, media, etc.)

Images can be added to the post like using the tag below. Replace alignment with left or right for the image to be wrapped with the body text. Remove alignment for the image to be displayed as a block between paragraphs of text. Width should be set to the maximimum width you want the image displayed (it will scale down for small screens). Height can be left as auto. Title text is a short title and alt text is a description of the photo -- it is good to include this for SEO purposes. 

<!--more-->

Use the more tag to set the break point for a post summary -- like the one displayed on the homepage.  

{% img img-responsive alignment /spotlight/images/2014mathcompwin.jpg 300 auto 'title text' 'alt text' %}

All images for the Spotlight blog should be stored in the spotlight/images directory.

Lists are very easy to make. Just do this this:

* Red
* Green
* Blue

Note that it's important to have a line break between the body text and the list. Here's an ordered list:

1. Bird
2. McHale
3. Parish

### Subheadings are made like this
Followed by body text

This is a [Google](google.com "Title?") link. 
