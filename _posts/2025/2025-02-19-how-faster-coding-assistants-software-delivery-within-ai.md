---
title: How much faster can coding assistants really make software delivery?
date: 2025-02-19 12:21:42 + 0080
category: [Generative AI]
tags: [AI, Software Development]
image: /assets/attachments/2025/02/19_153820_d454fasfdf57.jpg
---

**Tl;dr: The claim that coding assistants can increase delivery speed by 50% is a wild overestimation. Our tests suggest the gains are more likely 10-15%. But that’s still a significant gain, and, given the current price of coding assistants like Copilot, incredibly cost effective.**

The metric that dominates discussions about the impact of coding assistants on software delivery teams is speed. While it may be referred to as productivity, what people really mean in most cases is “how much faster are we?” That’s why the expected answer to questions about productivity improvement is usually a single percentage value. However, while industry hype started at 50% productivity gains, it appears thinking has swung to the other extreme with people talking about a complete lack of productivity gains and, instead, a [41% increase in bug rates](https://resources.uplevelteam.com/gen-ai-for-coding){:target="_blank"}.

While equating productivity with speed is certainly open to question, we don’t wish to explore that here — we’ll look specifically at how a coding assistant can improve speed. True, speed itself can be difficult to pin down; however, in the context of software delivery, the best proxy variable we have for speed is story cycle time. To get an idea for the ballpark of cycle time improvements that are possible with a coding assistant, we have been using a heuristic — a kind of hypothesis about team gains when using a coding assistant — over the past year, and have been comparing it with the data and anecdata we receive from our teams and our clients.

## Our heuristic for estimating time saved using a coding assistant
![estimating table](/assets/attachments/2025/02/19_130932_65e91kltg01.webp)

We make the following assumptions for the “Optimistic” scenario in the table:

* Part of a team's cycle time spent on coding: [40%](https://github.blog/2023-06-13-survey-reveals-ais-impact-on-the-developer-experience/){:target="_blank"}
* Portion of that coding that is supportable by a coding assistant: [60%](https://github.blog/2023-02-14-github-copilot-now-has-a-better-ai-model-and-new-capabilities/){:target="_blank"}
* Whenever the team is using the coding assistant, they are [55%](https://github.blog/2022-09-07-research-quantifying-github-copilots-impact-on-developer-productivity-and-happiness/){:target="_blank"} faster

Those assumptions lead to a maximum decrease in cycle time of 13% — for this scenario with very optimistic assumptions. The mileage will vary for teams, based on their experience level, their tech stack and the types of tasks they are working on.

## Putting the heuristic to a test

Let’s put this estimation to a test with a case study. At one of our clients, our teams gathered data about their usage of GitHub Copilot, and documented their estimations of how much time they saved.

The team tracked 150 tickets over time and documented task type, Copilot usage and estimated time saved:
![estimated time saved](/assets/attachments/2025/02/19_130926_f97f1dhxa50.webp)

### Overall estimation of time savings

Based on the overall number of tickets, and the estimations of time saved per ticket, the team came to the following conclusions about overall time saved within their sprints:

* In the period of the study, the teams used GitHub Copilot for about 50% of their tickets.
* When Copilot was used, it was used to support these rough categories of tasks:
  * Generating tests: 23%
  * Generating business code: 41%
  * Generating scripts: 13%
  * Understanding code: 23%
* The estimated improvement when GitHub Copilot was used was about 30%.
  * Generating tests: 28%
  * Generating business code: 30%
  * Generating scripts: 39%
  * Understanding code: 22%
* Development work accounted for about 55% of the team's total time.
* This means there was an approximate cycle time improvement of about 8% in this particular case.

![estimated time saved](/assets/attachments/2025/02/19_130937_9eb51if2q92.webp)

## What was Copilot used for?

Most of the examples where teams indicated that **Copilot was particularly useful were related to tasks involving repetitive or boilerplate code.** When developers used Copilot to generate API contracts, add new fields to request bodies or write script functions, they estimated significant time savings—often in the range of 30% to 50%.

At the same time, we found that generating business function code can also be faster by 10-40%, but the usefulness of the AI assistance is limited by the business context, and the probability of the generated code being adjusted is relatively high. This led us to the conclusion that **what’s difficult for the developer is also difficult for Copilot** . To improve Copilot's accuracy and reduce the need for adjustments, it's essential to clearly define business functions, break tasks down into smaller tasks, and provide specific and detailed prompts. This will enhance the quality and precision of the generated code.

**Test generation** was another area where the teams used the coding assistant. For tasks like generating unit tests or creating test data, teams estimated savings between 15% and 50% of their time. Especially when writing basic tests for existing code, Copilot’s efficiency helped accelerate the process, allowing developers to focus on more complex aspects of their work.

The team also has a workflow to use Copilot for test-driven development (TDD) by generating initial failing tests for new functions, or getting suggestions for additional tests to improve code coverage, including edge cases and exception handling. **Continued use of TDD, with and without a coding assistant, increases code quality and mitigates potential risks associated with Copilot usage** . By reviewing a test first, developers can more systematically validate if the generated code is doing what they expect it to do.

**Explaining and analyzing code also proved somewhat useful with Copilot**, though the estimated time saved was often lower than for tickets where teams generated code—between 10% and 40%. For explaining unfamiliar code or generating a summary of deployment scripts, Copilot provided a good starting point, helping developers navigate code they didn’t write themselves. This was particularly useful to understand complex business logic, or even use generated explanations in requirements analysis meetings to share business context.

## When developers chose not to use Copilot

There were also tasks where developers deliberately chose not to use Copilot, or found it less effective. Patterns emerged around tasks that were more exploratory or required a high level of context-specific understanding.

1. **Incident response:** Some teams, especially those working on legacy projects, spent a considerable portion of their time responding to on-call support, where they needed to check logs, runtime environments, etc. across different systems. This kind of real-time diagnostic work across systems is beyond the scope of GitHub Copilot. It remains to be seen if the emerging integrations between coding assistants and infrastructure providers (like [this Copilot integration with Azure](https://marketplace.visualstudio.com/items?itemName=ms-azuretools.vscode-azure-github-copilot){:target="_blank"}) will be helpful for these types of tasks in the future.
2. **Simple or minor code changes:** For **very simple bug fixes** or **minor code changes**, developers found it faster to manually write the code rather than use Copilot. These tasks were often so straightforward that the overhead of interacting with an AI-generated suggestion outweighed the benefit.
3. **Complex business logic and refactoring:** For tasks involving **complex business logic** or **significant refactoring**, Copilot was often deemed unsuitable. These tickets required a deep understanding of the system context and nuances, something that Copilot struggles with due to its limited ability to grasp business-specific intricacies.
4. **Vulnerability fixes:** Tickets involving **security fixes** or **vulnerability patches** were often completed manually or with existing deterministic tooling, as they required precision and attention to detail. Developers were cautious about using AI-generated suggestions when security was at stake, favoring a hands-on approach instead.

## What did we learn about the impact of Copilot on developer speed?

This case study is one of the many data points that aligns with our original heuristic. At other organizations, even without detailed tracking of Copilot usage, we observe similar levels of estimated impact on team speed of between 5-15%. And, so far, we haven't encountered a single team claiming a 50% reduction in cycle time with GitHub Copilot, or anything near that level.

Is this bad news for coding assistants, then? Does this mean that they are not worth the hassle and the money? No, we're still recommending coding assistant use to our clients, and we still believe they are here to stay.

* **Anchoring effect:** Because of misunderstood or misleading marketing materials and numbers taken out of context, the industry was [anchored](https://en.wikipedia.org/wiki/Anchoring_effect){:target="_blank"} to a 50% number last year, which now makes it seem like 10-15% are not a lot. When looked at without that bias though, IF a team can achieve a 10% increase in speed, that is actually great.
* **Cost-benefit:** Today's coding assistants cost less than 0.01% of what a typical delivery team's run rate is, which seems very low compared to the potential improvements.
* **The tools are still a moving target:** New and more powerful features are being released in coding assistants that could further increase the impact. For example, since the team gathered this data, GitHub Copilot and other editors released [multi-file editing features](https://martinfowler.com/articles/exploring-gen-ai.html#memo-11){:target="_blank"} that can help developers with larger implementations.
* **Cycle time is not the full picture:** The numbers in this article are only looking at cycle time estimations, when we need to consider overall productivity across research, planning, analysis, development, testing, deployment, and maintenance. There are also many other dimensions to consider that can be impacted by AI tools, like onboarding time, learning time and increase in test coverage.

Finally, we want to caution that the amount of effort spent on tracking and measuring speed improvements from coding assistants in a very detailed way can be wasted efforts. Developer surveys show over and over again that there is value here for developer experience. We recommend that organizations instead:

* Look at the big picture of how they are monitoring [delivery effectiveness](https://martinfowler.com/articles/developer-effectiveness.html){:target="_blank"} overall, fixate less on speed, and less on how this one tool impacts the team.
* Improve the real available development time of developers, and at the same time make the problems and tasks as clear and specific as possible before using a coding assistant.
* Spend that energy on monitoring the medium- to long-term risks of introducing coding assistants.

[**公司Global网站发布**](https://www.thoughtworks.com/en-sg/insights/blog/generative-ai/how-faster-coding-assistants-software-delivery){:target="_blank"}

