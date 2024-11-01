# Team 36 - Health Informatics Project

## Getting Started
Our application is containerized using Docker to make it easier to manage, reproduce, and distribute our app environment. After cloning the repository and installing Docker, you can manage the Docker containers using the following commands:

- **Start the app**: `make start`
- **Stop the app**: `make stop`
- **Build only the database**: `make db-only`
- **Rebuild containers (re-seeds database if needed)**: `make rebuild`
- **Remove volumes for a clean rebuild**: `make clean`
- **Check container status**: `make status`
- **Run all tests**: `make test`
- **Run unit tests**: `make unittest`
- **Run integration tests**: `make inttest`
- **View logs**: `make logs`

## Attached Debugging Flow
1. Start _only_ the database service in the Docker container from the command line using `make db-only`.
2. Enter breakpoints in the code where you want to debug.
3. Go to the _Run and Debug_ tab in VSCode.
4. In the drop-down menu, select `Next.js: debug full stack` and click the run button.
5. VSCode will launch the Chrome browser at our app address to use for debugging.

## Application Architecture
Here is an explanation of the folder structure we are using:
- team-36-monorepo
    - `__tests__`: contains all our unit and integrated tests
    - `/.github`: contains code related to GitHub issue templates and actions
    - `/.swc`: ???
    - `/db`: contains database-related code
    - `/docs`: contains documentation
    - `/lib`: contains services
    - `/pages`: contains our web page content
    - `/public`: contains public assets accessible by our web page (e.g. media)
    - `.babelrc`: used for jest testing 
    - `.dockerignore`: tells docker to ignore dynamic files
    - `.env.local`: local environment variables
    - `.gitignore`: tells git to ignore dynamic files in tracking
    - `docker-compose.yml`: code instruction for starting app and database
    - `Dockerfile`: code instruction for starting our app
    - `jest.config.js`: jest testing configuration
    - `Makefile`: short-command configuration
    - `package-lock.json`: package requirements for our application
    - `package.json`: package requirements for our application
    - `README.md`: documentation

## Database (PostgreSQL)
The database can be accessed and managed using any database management software, though for simplicity I would recommend using [pgAdmin](https://www.pgadmin.org/download/).

You can use the following information to access the database:
- User: `admin`
- Password: `password`
- Database: `team36db`
- Port: `5432`

## Testing
We use Jest, a testing framework commonly used for React projects for unit and integrated testing. It simplifies the process for making and running tests during the development process.

### Adding tests
We use a separate folder, `__tests__` in our root directory to store all our tests. It is important that we keep this name for the tests folder so that it is recognized by Jest. Inside, we can place all our test files which should include `test.js` in the name. 

In practice, it will probably be easiest to separate these test files by service. So, for example, I've included a file `users.test.js` which will be used for testing our `./lib/users.js` file. This can be used as an example for creating other test files.

### Running tests
- **Run all unit tests**: `make test`

It is not yet possible to run specific test files. When we have more test files, and if necessary, we can add functionality to quickly run tests for specific files. For now, just run `make test` to run all tests.

