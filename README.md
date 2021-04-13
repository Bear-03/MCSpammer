# McSpammer
Utility to spam a server with predefined messages without opening the game.

*Note: feel free to open issues and pull requests, but the project will unlikely recieve any updates from myself*

## Usage
You must have node.js installed

### config.json setup
```json
{
     "account": {
          "email": "your-email",
          "pass": "*your-password"
     },
     "mc": {
          "ip": "your-ip",
          "port": 25565,
          "version": "your-version"
     },
     "spammer": {
          "spamFileFolder": "spam_files",
          "logsFolder": "logs",
          "delay": 300,
          "limit": 72,
          "spamOnJoin": true,
          "disconnectThreshold": 15,
          "randomness": 5000,
          "maxLogFiles": 10
     }
}
```
#### Account
Info needed in order to join the game and server
* **email**: the email of your account.
* **pass**: your password.

#### MC
Server and game info
* **ip**: the ip of the server to join.
* **port**: the port of the server to join. `25565` in most cases.

#### Spammer
Info about the program itself, such as file paths
* **spamFileFolder**: folder with the text files that store the messages to send for each server. Each file name should follow this format: `[ip].txt`. (example: hypixel.net.txt), and contain a message *per line*.
* **logsFolder**: folder where the chat output will be stored,
* **delay**: delay between messages.
* **limit**: target number of messages to send.
* **spamOnJoin**: whether or not to send a message just when the account joins the server.
* **disconnectThreshold**: life points below which the account will me disconnected.
* **randomness**: max random delay added to the base in order to bypass some antibot plugins.
* **maxLogFiles**: maximum number of files in the chatlogs folder.
