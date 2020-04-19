 - npm install
 - npm run dev (with arguments) - to run develop modle
 - npm run build - to comply to js
 - npm run test - unit test
 - node ./dist/index.js (with arguments) to run prod modle
 
 ## Arguments: 
 ###default 
   - portListenTo: '3000',
   - hostListenTo: 'localhost',
   - serverPort: '3000',

## Run cli with arguments:
```bash
 npm run dev portListenTo=3001 serverPort=3000 hostListenTo=localhost
 node ./dist/index.js portListenTo=3001 serverPort=3000 hostListenTo=localhost
```

## Run as a server chain
Start 5 terminals, and type one command below for each terminal

```bash
node ./dist/index.js portListenTo=3000 serverPort=3004 hostListenTo=localhost 
```
```bash
node ./dist/index.js portListenTo=3004 serverPort=3003 hostListenTo=localhost 
```
```bash
node ./dist/index.js portListenTo=3003 serverPort=3002 hostListenTo=localhost 
```
```bash
node ./dist/index.js portListenTo=3002 serverPort=3001 hostListenTo=localhost 
```
```bash
node ./dist/index.js portListenTo=3001 serverPort=3000 hostListenTo=localhost
```
