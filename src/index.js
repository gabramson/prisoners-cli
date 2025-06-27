#!/usr/bin/env node

import yargs from 'yargs';

const makePrisonerInfo = (prisonerCount, inactiveCount) => {
  return {
    prisonerCount: prisonerCount,
    inactiveCount: inactiveCount
  };
}

const initialize = (prisonerCount) => {
  const prisoners = Array.from({ length: prisonerCount }, () => makePrisonerInfo(1, 0));
  return {
    prisoners: prisoners,
    isSwitchOn: false,
    allCounted: false,
    iterations: 0
  }
}

const getNextPrisoner = (prisonerCount) => {
  const randomIndex = Math.floor(Math.random() * prisonerCount);
  return randomIndex;
}

const getPrisonerResultBase = (state, prisonersIndex) => {
  const currentPrisoner = state.prisoners[prisonersIndex];
  const prisonerCount = state.prisoners.length;
  const iterations = state.iterations + 1;
  if (currentPrisoner.prisonerCount === 0){
    return {...state, iterations: iterations + 1};
  }
  if (!state.isSwitchOn){
    const prisoners = [
      ...state.prisoners.slice(0, prisonersIndex),
      makePrisonerInfo(currentPrisoner.prisonerCount - 1, 0),
      ...state.prisoners.slice(prisonersIndex + 1)
    ];
    return {prisoners: prisoners, isSwitchOn: true, allCounted: false, iterations: iterations + 1}
  }
  if (state.isSwitchOn){
    const newPrisoner = makePrisonerInfo(currentPrisoner.prisonerCount + 1, 0);
    const prisoners = [
      ...state.prisoners.slice(0, prisonersIndex),
      newPrisoner,
      ...state.prisoners.slice(prisonersIndex + 1)
    ];
    const allCounted = newPrisoner.prisonerCount === prisonerCount;
    return {prisoners: prisoners, isSwitchOn: false, allCounted: allCounted, iterations: iterations + 1}
  }
}

const isGuaranteedLeader = (state, prisonersIndex) => {
  const currentPrisoner = state.prisoners[prisonersIndex];
  const prisonerCount = state.prisoners.length;
  return currentPrisoner.prisonerCount > prisonerCount / 2;
}

const getPrisonerResultOptLeader = (state, prisonersIndex) => {
  const currentPrisoner = state.prisoners[prisonersIndex];
  const prisonerCount = state.prisoners.length;
  if (!state.isSwitchOn && isGuaranteedLeader(state, prisonersIndex)) {
    return {...state, iterations: state.iterations + 1}
  }
  return getPrisonerResultBase(state, prisonersIndex);
}

const getPrisonerResultWithDelay = (factor, state, prisonersIndex) => {
  const currentPrisoner = state.prisoners[prisonersIndex];

  if (!state.isSwitchOn && currentPrisoner.inactiveCount < currentPrisoner.prisonerCount/factor) {
    const newPrisoner = makePrisonerInfo(currentPrisoner.prisonerCount, currentPrisoner.inactiveCount + 1) 
    const prisoners = [
      ...state.prisoners.slice(0, prisonersIndex),
      newPrisoner,
      ...state.prisoners.slice(prisonersIndex + 1)
    ];   
    return {...state, prisoners: prisoners, iterations: state.iterations + 1}
  }
  return getPrisonerResultBase(state, prisonersIndex);
}

const getPrisonerResultWithDelayAndLeader = (factor, state, prisonersIndex) => {
  const currentPrisoner = state.prisoners[prisonersIndex];

  if (!state.isSwitchOn && currentPrisoner.inactiveCount < currentPrisoner.prisonerCount/factor) {
    const newPrisoner = makePrisonerInfo(currentPrisoner.prisonerCount, currentPrisoner.inactiveCount + 1) 
    const prisoners = [
      ...state.prisoners.slice(0, prisonersIndex),
      newPrisoner,
      ...state.prisoners.slice(prisonersIndex + 1)
    ];    
    return {...state, prisoners: prisoners, iterations: state.iterations + 1}
  }
  return getPrisonerResultOptLeader(state, prisonersIndex);
}

const argv = yargs(process.argv.slice(2)).parse();
const prisonersCount = argv.prisoners || 143;
let getPrisonerResults;
switch (argv.strategy || 1){
  case 1:
    getPrisonerResults = getPrisonerResultBase;
    break;
  case 2:
    getPrisonerResults = getPrisonerResultOptLeader;
    break;
  case 3:
    getPrisonerResults = getPrisonerResultWithDelay.bind(null, argv.factor || 4);
    break;
  case 4:
    getPrisonerResults = getPrisonerResultWithDelayAndLeader.bind(null, argv.factor || 4);
    break;
}

const logResults = (state) => {
  console.log(`\nState after ${state.iterations} iterations:`);
  console.log(`Prisoners:`);
  state.prisoners.filter(prisoner=>prisoner.prisonerCount>0).forEach((prisoner, index) => {
    console.log(`Prisoner ${index}: Count = ${prisoner.prisonerCount}, Inactive = ${prisoner.inactiveCount}`);
  });
};

let state = initialize(prisonersCount);
let nextPrisoner;
while (!state.allCounted){
  nextPrisoner = getNextPrisoner(prisonersCount)
  state = getPrisonerResults(state, nextPrisoner);
  if (state.iterations % 10000 === 0) {
    logResults(state);
  }
}
logResults(state);
