# Rs Task

## Instructions:


Run the following commands to create tables and insert fake data:

```
npm i
node ./schema/create-tables.js
node ./schema/init.js
```
Run the lambda with SAM:

```
sam local invoke -e event.json RsTask | jq
```

---