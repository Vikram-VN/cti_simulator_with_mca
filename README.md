# UEF MCA Detailed application

## Set up the environment

- `npm install` - to install the packages
- npm run dev - to start the development server
- npm run build - builds production build in dis
- node ./dist/app.js

See package.json for more details. At the time of development the nodejs version is v14.16

- client app: https://localhost:3000/cti-simulator/pages/client-app
- end user app: https://localhost:3000/cti-simulator/pages/cti-admin

## Introduction

This application uses the following frameworks / libraries. Please familiarise with the
concepts.
- [Knockout.JS](https://knockoutjs.com/) MVVM is used for UI.
- [Socket.io](https://socket.io/) For realtime communication between the MCA Toolbar and End User page.
- [UI Events Framework](https://docs.oracle.com/en/cloud/saas/b2b-service/23a/fairs/load-the-exernal-application-inside-service-center.html#UI-Events-Framework-16) For communication between the MCA Toolbar and Fusion Application.
- [Express JS](https://expressjs.com/) - NodeJS, ExpressJS, EJS Templates
- [Typescript](https://www.typescriptlang.org/) - Makes life easy. uiEventsFramework.d.ts has all the type definitions.

## Detailed description



### Initialise the application

As soon as the client Application is loaded in the MCA toolbar, two actions are performed and four subscriptions are 
registered to the fusion application using UEF. The purpose of those API calls are mentioned below 
- GetConfiguration API: Among other details, the response has the current loggedIn agent in the fusion 
  application. This logged in and logged out agent details will pushed to app-server and end user page.
- AgentStateEvent API: With this API we can set the availability of the agent.
- onOutgoingEvent API:
- onToolbarInteractionCommand API:
- onToolbarAgentCommand API:
- onDataUpdatedEvent API:

### Outbound Call

- Agent press on a number in the fusion application and an `onOutGoingEvent` is triggered from fusion application.
- Since this event is subscribed, client application receives it and check with the end user.
    - If connect is received from the end user page, a NewCommEvent action is performed with the payload from onOutgoingEvent.
    - if fail is received from the end user page, an outBoundCommError action is performed with the error details, 
      followed by CloseCommEvent action with reason as REJECT.
- Once a NewCommEvent response is received, a StartCommEvent action is fired, and the communication starts.
- To end the communication there are three ways
    - End User press the hang up button: This is notified to the toolbar (here we use socket) and the toolbar performs
      CloseCommEvent action with reason 'WRAPUP'.
    - Agent press the hangup button in the toolbar: The toolbar performs CloseCommEvent action with reason 'WRAPUP'.
    - Agent press an End Call button in the fusion application: onToolbarInteraction event is fired which the mca 
      toolbar listens and performs CloseCommEvent action with reason 'WRAPUP'
      
### Inbound Call



## Source Code detailed description

### Client Application

### End User Application

End user application is same as the cti admin

- `src/ts/cti` has classes for communication between end user and toolbar application
- `src/ts/models` has uefChannel that initialises uef and various contexts. 
In this code client library is injected.
- src/ts/viewModels contains view models binded to UI - used knockoutjs
- The clientApp.ts and clientAdmin.ts are loaded to mca toolbar and end user page respectively
- Server related configurations like port, certificate details are on src/app.ts
- Templates are in views folder
- It uses socket.io library which is configured on app.ts

The application is available at \
End user: https://localhost:3000/cti-simulator/pages/cti-admin \
Toolbar App: https://localhost:3000/cti-simulator/pages/client-app
