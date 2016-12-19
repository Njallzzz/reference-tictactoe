2. Game URL (AWS) 54.154.103.115(ec2-54-154-103-115.eu-west-1.compute.amazonaws.com)

## Scripts

Outline what script files you created and the purpose of each file. Each file should be commented. This could be
- Docker build - dockerBuild - Compiles the program and builds a production docker image
- Docker compose - docker-compose.yml
- AWS Provisioning - provisioning/autoscript - Deploys a amazon VM and  installs and runs the scripts vm-script-1 and vm-script-2
- Other scripts - vm-script-1 & vm-script-2 - installs dependencies for VM to run docker container and docker compose

## Testing & logic

Outline what tests you created.
- UnitTests, server logic TDD (Git commit log) - As described on day 7
- Is the game playable? Yes

## Data migration
None

## Jenkins

Do you have the following Jobs and what happens in each Job:
- Commit Stage - Does Countinous Integration on Jenkins
- AWS Provision - Manually run autoscript when you want to push the latest container to production

Did you use any of the following features in Jenkins?
- Commit hooks

## Monitoring
Did you do any monitoring?
- URL: http://hugb.deadbyte.is/

## Other
- Added enviroment variables for postgres login for project container instead of using database.json, however is still required for database migration.
