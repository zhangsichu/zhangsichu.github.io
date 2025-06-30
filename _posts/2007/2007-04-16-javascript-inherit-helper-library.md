---
title: JavaScript inherit helper library
date: 2007-04-16 09:55:30 + 0080
category: [Web开发]
tags: [Web, Software Development]
---

Generally define a JavaScript class using prototype chain. Because of JavaScript runtime executing and later binding, it’s hard to define a class like other oriental-object language C# or Java. In sometimes want to define a base class and it’s inherited class in JavaScript that is ungainly. Now the xbOject may give you a suitable solution. 

Description: 
xbObject is the root of the Class hierarchy. It serves as a means of guaranteeing that all classes have the minimal support required. It also is a means of quickly adding new features to all classes. xbObject is not intended to be instantiated.