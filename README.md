## Description

This is an application to help handle the process of getting usage data from an internal system such as a timeseries database, and exporting it to Paigo, in order to bill on that usage.

## Dependencies

To run the app:

- Docker
  Building:
- Node 16.x
- Docker
- npm

## Installation

```bash
$ npm install
```

To run the application SQLLite is required:
`https://www.servermania.com/kb/articles/install-sqlite`

## Running the app

The application is packaged as a docker file, the latest version is here: public.ecr.aws/m6j0z5r2/paigo-starter-app:live
You can alternatively clone and build the app yourself locally.


```bash
# Run the app
$ docker run public.ecr.aws/m6j0z5r2/paigo-starter-app:live -p 3000:3000
```

## Local Development

After installing with `npm ci` use the below commands to start the application. Watch mode will recompile the application as changes are made.  
```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

```
