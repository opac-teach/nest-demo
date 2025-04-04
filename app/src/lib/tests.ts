import { ModuleMocker, MockFunctionMetadata } from 'jest-mock';

const moduleMocker = new ModuleMocker(global);

export const mockTheRest = (token: any) => {
  if (typeof token === 'function') {
    const mockMetadata = moduleMocker.getMetadata(
      token,
    ) as MockFunctionMetadata<any, any>;
    const Mock = moduleMocker.generateFromMetadata(mockMetadata);
    return new Mock();
  } else {
    return {};
  }
};
