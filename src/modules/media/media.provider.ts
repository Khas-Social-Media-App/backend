import { v2 } from 'cloudinary';
import { CLOUDINARY } from '../../constansts/constants';

export const MediaProvider = {
  provide: CLOUDINARY,
  useFactory: (): any => {
    return v2.config({
      cloud_name: 'dyhvh13l2',
      api_key: '751636451357222',
      api_secret: '0Mz-EjLIVT_mdT1LHk7OKscTLII',
    });
  },
};
