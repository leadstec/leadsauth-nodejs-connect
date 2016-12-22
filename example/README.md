#Basic NodeJS Example


##Start and configure LeadsAuth

###Start LeadsAuth:

Open the LeadsAuth admin console, click on Add Realm, click on import 'Select file', 
select demo-realm.json and click Create.

Link the HEAD code of leadsauth-connect by running:

```
npm link ../
```

Install the dependencies and start NodeJS example by running:

```
npm install
npm start
```

Open the browser at http://localhost:3000/ and login with username: 'user', and password: 'password'.
