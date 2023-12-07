import * as core from '@actions/core';

export function setOutput<TValue>(value: TValue, outputName: string): TValue {
  const debugValue = JSON.stringify(value, null, 2);
  console.debug(debugValue);
  core.setOutput(outputName, JSON.stringify(value));
  return value;
}
