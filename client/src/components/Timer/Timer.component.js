import React, { useEffect, useState } from 'react';
import { interval, Subject } from "rxjs";
import {
  scan,
  startWith,
  switchMap,
  takeWhile
} from "rxjs/operators";
import './timer.css';

const action$ = new Subject();

const observable$ = action$.pipe(
  switchMap(x => {
      return interval(1000).pipe(
        startWith(x),
        scan(number => number - 1),
        takeWhile(value => value >= 0)
      );
    }
));

export const Timer = ({ isYourTurn }) => {
  const [time, setTime] = useState(30);

  useEffect(() => {
    const subscription = observable$.subscribe(setTime);
    return () => {
      subscription.unsubscribe();
    }
  }, []);

  useEffect(() => {
      if(isYourTurn.turn) action$.next(30);
  }, [isYourTurn])

  return (
      <>
        { isYourTurn.turn && <span className="timer">{ time }</span> }
      </>
  )
}