module.exports = {
  api: {
    output: {
      mode: 'tags',
      target: 'src/api/queries',
      schemas: 'src/api/models',
      client: 'react-query',
      override: {
        mutator: {
          path: 'src/api/queryInstance.ts',
          name: 'queryInstance',
        },
      },
    },
    input: {
      target: 'src/api/schema.yml',
    },
    hooks: {
      afterAllFilesWrite: 'yarn lint',
    },
  },
};
