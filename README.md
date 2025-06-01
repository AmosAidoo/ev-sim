# EV Charging Simulation Take Home

Given a parking lot, a set of charge point for electric vehicles (EVs), hourly probability distributions for EVs arriving and how much energy they would require, this project simulates charging scenarios for 1 year to determing key metrics like energy consumption and peak power loads.

## Project Structure

```
└── ev-sim
    └── packages
        └── simulation-lib
        └── task1
        └── task2b
```
This is a yarn workspaces monorepo. It contains three projects inside `packages` directory.
- `simulation-lib`: This is a complete well documented library which implements the simulation logic is used in the other projects.
- `task1`: This uses `simulation-lib` to implement Task 1.
- `task2b`: This is the backend part of the take home.

## Technologies Used

Both Task 1 and Task 2b were done in TypeScript. The tech stack for the backend(Task 2b) are as follows:
- Prisma
- Postgres
- Express
- Docker
- Joi (for request validation)
- Swagger and OpenAPI

## How to run

### Prerequisites
- Docker
- Docker Compose
- Node v20 or later
- Yarn v1.22.22

### Installation
```
git clone git@github.com:AmosAidoo/ev-sim.git
cd ev-sim
yarn install
```

### Environment Variables
There are two places these need to be set. One in the root of the project and the second in the backend at `./packages/task2b`. Each places have a `.env.example` that you can duplicate.

### Task 1
In the root of the project, execute the following command:
```
yarn task1
```

### Task 2
Execute the following command in the root to spin up a docker container.
```
docker compose up --build -d
```

Visit `http://localhost:3000/api-docs` in your browser to view the API docs.

## Bonus Questions in Task 1

1. When the simulation is run for chargepoints between 1 and 30, I noticed a general downward trend in the concurrency factor. Given the formular for concurrency factor, `actual_max_energy/theoretical_max_energy`, it makes sense. Smaller chargepoints mean that both values are very close. More chargepoints make `actual_max_energy` smaller, hence, reducing the overall value. A sample chart is below (Generated with Google Sheets):
![Charge Points vs Concurrency Factor](/bonus1.png "Charge Points vs Concurrency Factor")
2. I implemented the simulation library to support different timezones based on [luxon](https://moment.github.io/luxon/#/). Once you pass the timezone to the simulator, DST for that timezone will be applied.
3. I implemented the Xorshift pseudorandom number generator based on the [Wikipedia](https://en.m.wikipedia.org/wiki/Xorshift) example implementation. This allows us to pass in a seed for random-but-deterministic results.

## Assumptions

### Task 1 (Logic)
- When an EV is blocked from charging at a charge point, it wasn't stated what to do so I made an assumption that each charge point manages a queue of blocked EVs.
- There was a remaining 0.03% after summing up. I adjusted the probability for no charging demand from `34.31` to `34.34` percent.

### Task 2b (Backend)
- I assumed that running a simulation is based on the input parameters. As a result, you pass in an id of any of the input parameters and it appends a new immutable result to its outputs


