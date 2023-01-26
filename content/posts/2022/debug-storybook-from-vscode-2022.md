---
title: Debug Storybook from VSCode (2022)
metaDesc: How to get VSCode working together with Storybook for effortless component debugging
legacyUrl: https://blog.bruceleeharrison.com/2022/01/26/debug-storybook-from-vscode-2022/
headerImage: /images/azure_synapse.jpg
date: !!timestamp '2022-01-26'
tags:
  - vscode
  - storybook
---

# Debug Storybook from VSCode (2022)

While working on a small personal project, I had a need to be able to debug Storybook. A quick Google search turned up tons of blogs that were many years out of date. I knew there had to be an easier way, and there was!

After a bit of playing around, the following simple setup allowed me to set breakpoints and debug React components hosted in Storybook, from within VSCode. You do not need to install the Debugger for Chrome extension!

```json
{
  "version": "0.2.0",
  "configurations": [
    {
      "name": "Storybook Debug",
      "type": "node-terminal",
      "request": "launch",
      "command": "npm run storybook",
      "internalConsoleOptions": "openOnFirstSessionStart",
      "serverReadyAction": {
        "pattern": "Local:.+(https?://[^:]+:[0-9]+)",
        "uriFormat": "%s",
        "action": "debugWithChrome"
      }
    }
  ]
}
```

Once you’ve added the Storybook Debug configuration to your launch.json, you should be able to run it from the debug menu.

![Image1](/assets/posts/2022/debug-storybook-from-vscode-1.png)

Assuming your components compile and Storybook launches successfully, Chrome will automatically open up and with the debugger attached. Now you can easily debug your components running in Storybook with VSCode.

![Image1](/assets/posts/2022/debug-storybook-from-vscode-2.png)

This configuration should continue to work for the foreseeable future, or at least until Storybook changes the message that appears in the terminal once it’s up an running. I had this working with Storybook 6.4.14. If it changes in the future, alter the serverReadyAction:pattern regex setting so it can match the new terminal output.

Note: There seems to be an issue with debugging and the Storybook webpack@5 experimental mode. I had to drop back to webpack@4 in order to get debugging working as described here.

Happy coding!
