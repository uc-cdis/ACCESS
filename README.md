ACCESS
======


# Running locally

Run the following commands:

```
export PORT=8000
export SKIP_PREFLIGHT_CHECK=true
export REACT_APP_REDIRECT_URL=http://localhost:8000/login
export REACT_APP_CLIENT_ID=<YOURCLIENTIDHERE>
npm start
```


# Running with Docker

1. Set up your credentials locally in `.env.development.local`
```
REACT_APP_CLIENT_ID=<YOURCLIENTIDHERE>
REACT_APP_REDIRECT_URL=http://localhost:8000/login
```

2. Build the container
```
docker build -t access .
```

3. Run the container
```
docker run --rm -p 8000:8000 -v "$PWD"/src:/app/src -ti access
```

4. Navigate to `http://localhost:8000` in your browser.
