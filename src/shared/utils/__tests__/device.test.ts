/* eslint-disable import/first */
jest.mock('react-native', () => {
  const RN = jest.requireActual('react-native');
  RN.Dimensions.get = () => ({ width: 375, height: 812 });
  RN.Platform.OS = 'ios';
  return RN;
});

import { device } from '../device';

describe('device', () => {
  it('has width and height from Dimensions', () => {
    expect(device.width).toBe(375);
    expect(device.height).toBe(812);
  });

  it('detects iOS platform', () => {
    expect(device.isIOS).toBe(true);
    expect(device.isAndroid).toBe(false);
  });

  it('detects small device', () => {
    expect(device.isSmallDevice).toBe(false);
    expect(device.isTablet).toBe(false);
  });

  it('detects notch', () => {
    expect(device.hasNotch).toBe(true);
  });
});
