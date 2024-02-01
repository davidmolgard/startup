# startup
### Elevator pitch

With so many playable characters in the game of Super Smash Brothers Ultimate, it can be hard to always remember how to play against everyone! Well worry no longer. With this website, you can easily keep track of notes on how you beat each character last time you played them, including stage ban information. Also if you need to fill in your matchup knowledge, ask others for their experience seamlessly.

### Design

![IMG_3026](https://github.com/davidmolgard/startup/assets/145723824/00e51592-e6aa-4c52-9b7b-c6378db7897e)


### Key features

- Secure login over HTTPS
- Ability to edit and store matchup knowledge
- Display of matchup knowledge and stage bans
- Notes are persistently stored
- Ability to select your main and display it for other users to see
- Ability to see other online users and request knowledge from them.
- Display of upcoming major tournaments

### Technologies

I am going to use the required technologies in the following ways.

- **HTML** - Uses correct HTML structure for application. Four HTML pages. One for login/home screen, one for profile, one for matchup notes, and one to connect with other players and share matchup knowledge.
- **CSS** - Application styling that looks good on different screen sizes, uses good whitespace, color choice and contrast.
- **JavaScript** - Provides login, profile editing, choosing a matchup, typing in notes, selecting stages, requesting matchup knowledge, and backend endpoint calls.
- **Service** - Backend service with endpoints for:
  - login
  - retrieving profile information
  - editing profile information
  - retrieving matchup notes
  - editing matchup notes
- **DB/Login** - Store users, profile settings, and matchup info in database. Register and login users. Credentials securely stored in database. Can't edit/view notes unless authenticated.
- **WebSocket** - Displays all users logged in, allows requests for matchup knowledge, which can be accepted or rejected.
- **React** - Application ported to use the React web framework.

