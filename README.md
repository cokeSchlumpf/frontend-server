# Frontend Server

A simple container image to serve frontends including a simple proxy to call a backend API service. It basically forwards all requests with a common API prefix to the defined API-backend, all other requests will be resolved either with a static file, or with a default file (usually `index.html`).

The server is configured using environment variables:

| Environment Variable | Description |
| --- | --- |
| `SERVER_API_BASE_URL` | The base url of the backend API service to which API calls should be proxied |
| `SERVER_API_PATH_PREFIX` | The base path of API calls; All calls to this common prefix will be proxied to the API backend | 
| `SERVER_PORT` | The port to which the server should liisten | 

In a common scenario one would use the provided Docker image `cokeschlumpf/frontend-server:<TAG>` as base image for a container image which serves a frontend (e.g. with [React Create App](https://github.com/facebook/create-react-app)):

```Dockerfile
FROM cokeschlumpf/frontend-server:0.0.1
COPY ./build /usr/src/app/public
```

Then you can use the created image within a Kubernetes deployment. Assuming that there exists already a service called `backend` which actually provides the API:

```yaml
kind: Deployment
apiVersion: apps/v1
metadata:
  name: frontend
  namespace: default
  labels:
    k8s-app: frontend
spec:
  replicas: 1
  selector:
    matchLabels:
      k8s-app: frontend
  template:
    metadata:
      labels:
        k8s-app: frontend
    spec:
      containers:
        - name: frontend
          image: <YOUR_IMAGE>
          env:
            - name: SERVER_API_BASE_URL
              value: "http://backend:9080"
            - name: SERVER_API_PATH_PREFIX
              value: "/api"
            - name: SERVER_PORT
              value: 8080
          ports:
            - name: http
              containerPort: 8080
```

This allows you to easily implement backend and frontend independent from each other but with only one single entry point via the frontend deployment.