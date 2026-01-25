import { test } from '@playwright/test';

export function Step(stepName: string) {
  return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {
    const originalMethod = descriptor.value;

    descriptor.value = async function (...args: any[]) {
      return await test.step(stepName, async () => {
        return await originalMethod.apply(this, args);
      });
    };

    return descriptor;
  };
}
