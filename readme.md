# http 

Create http request handler and http response objects.


# Quick start

You can use the library to create an http response object like so:
```javascript
const { HttpResponseBuilder } = require('../index.js');
const response = HttpResponseBuilder.Ok().build();
```

This will create below response object:
```javascript
HttpResponse {
    statusCode: 200,
    headers: { 'content-type': 'application/json' },
    body: {}
}
```

You can also add headers and a body to your response object.
