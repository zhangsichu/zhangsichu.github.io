# Blog Tag Standardization Rules

## Overview
This file defines the standardized tag system for the blog. All blog posts must use tags from the approved list below. This ensures consistency and improves content discoverability.

## Approved Tags List

### English Tags
- **AI** - Artificial intelligence, machine learning, AI tools, coding assistants, generative AI
- **C#** - C# programming language, .NET development, C# specific topics
- **C++/C** - C++ and C programming languages, low-level programming
- **Cache** - Caching strategies, performance optimization through caching
- **CSS** - Cascading Style Sheets, web styling, frontend design
- **Database** - Database systems, data management, database design
- **Debugging** - Debugging techniques, troubleshooting, error resolution
- **Design** - Software design, UI/UX design, system architecture
- **Design Pattern** - Software design patterns, architectural patterns
- **GUI** - Graphical User Interface, desktop applications, UI components
- **HTML** - HyperText Markup Language, web markup, frontend development
- **Life** - Personal life, experiences, non-technical content
- **Mobile** - Mobile development, mobile apps, mobile technologies
- **Multithreading** - Concurrent programming, threading, parallel processing
- **Performance** - Performance optimization, system performance, speed improvements
- **Product** - Product management, product development, business aspects
- **Programming** - General programming topics, coding practices
- **Security** - Security practices, cybersecurity, secure development
- **Software Development** - Software engineering, development processes, methodologies
- **SQL** - Structured Query Language, database queries, data manipulation
- **Travel** - Travel experiences, trips, travel-related content
- **Web** - Web development, web technologies, internet-related topics

### Chinese Tags
- **同学会** - Class reunions, alumni gatherings, school-related events
- **多线程** - Multithreading (Chinese equivalent)
- **大制作** - Large-scale projects, major productions, significant works
- **新年** - New Year celebrations, holiday content
- **演讲** - Public speaking, presentations, talks
- **社区** - Community building, community management, community events
- **转载** - Reposted content, shared articles, external content
- **随感** - Personal reflections, thoughts, casual observations

## Tag Usage Rules

### 1. Tag Selection Guidelines
- Use 2-7 tags per post for optimal categorization
- Include at least one primary topic tag
- Use both English and Chinese tags when appropriate
- Avoid redundant tags (e.g., don't use both "Programming" and "C#" for a C# specific post)

### 2. Tag Mapping Rules
When reviewing existing posts, map current tags to standardized ones:

**Technology-Specific Mapping:**
- `.NET` → `C#`
- `ASP.NET` → `C#` + `Web`
- `JavaScript` → `Web`
- `Python` → `Programming`
- `Java` → `Programming`
- `React/Angular/Vue` → `Web`
- `Node.js` → `Web`
- `Docker/Kubernetes` → `Software Development`
- `Git` → `Software Development`
- `Testing` → `Software Development`
- `DevOps` → `Software Development`

**Content-Type Mapping:**
- `Tutorial` → `Programming` or specific tech tag
- `Review` → `Product`
- `Case Study` → `Software Development`
- `Interview` → `Life`
- `Conference` → `演讲`
- `Meetup` → `社区`
- `Workshop` → `演讲`

**AI-Related Mapping:**
- `Machine Learning` → `AI`
- `Deep Learning` → `AI`
- `Neural Networks` → `AI`
- `ChatGPT` → `AI`
- `Copilot` → `AI`
- `Prompt Engineering` → `AI`

### 3. Tag Combination Guidelines
**Common Combinations:**
- Technical posts: `[Technology Tag] + [Software Development]`
- Web development: `[Web] + [CSS/HTML] + [Design]`
- Performance posts: `[Performance] + [Technology Tag]`
- Security posts: `[Security] + [Technology Tag]`
- Life/Personal posts: `[Life] + [随感/Travel]`
- Community posts: `[社区] + [演讲]`

### 4. Validation Rules
Before publishing any post, ensure:
- All tags are from the approved list
- No more than 7 tags per post
- No fewer than 2 tags per post
- Tags are relevant to the post content
- No duplicate or redundant tags

### 5. Tag Review Process
When reviewing existing posts:
1. Check if current tags are in the approved list
2. Map any non-standard tags to approved equivalents
3. Ensure tag relevance to content
4. Optimize tag count (2-7 tags)
5. Update front matter accordingly

### 6. New Post Guidelines
When creating new posts:
1. Identify the primary topic
2. Select 2-3 relevant tags from the approved list
3. Consider adding a secondary topic tag if applicable
4. Use Chinese tags for culturally relevant content
5. Validate against the approved list before publishing

## Implementation Commands

### To find posts with non-standard tags:
```bash
find _posts -name "*.md" -exec grep "^tags:" {} \; | grep -v "\[.*\]" | grep -v "tags: \[.*\]"
```

### To list all current tags:
```bash
find _posts -name "*.md" -exec grep "^tags:" {} \; | sed 's/tags: \[//' | sed 's/\]//' | tr ',' '\n' | sed 's/^ *//' | sed 's/ *$//' | sort | uniq
```

### To validate a specific post's tags:
```bash
grep "^tags:" _posts/YEAR/FILENAME.md
```

## Maintenance
- Review and update this rule file quarterly
- Add new standardized tags only after careful consideration
- Maintain backward compatibility when possible
- Document any tag changes in commit messages

## Notes
- The tag "AI" specifically refers to artificial intelligence topics
- Chinese tags should be used for culturally specific content
- Tag combinations should reflect the post's primary and secondary themes
- This standardization improves searchability and content organization 