import { asNexusMethod, objectType } from 'nexus';
import { GraphQLUpload } from 'apollo-server-micro';

export const Upload = asNexusMethod(GraphQLUpload, 'Upload');

export const UploadFile = objectType({
  name: 'UploadFile',
  definition(t) {
    t.string('uri');
    t.string('filename');
  },
});
