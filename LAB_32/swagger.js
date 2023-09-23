let openapi = {
	openapi: '3.0.1',
	info: {
		description: 'Phone Dictionary',
		version: '1.0.0',
		title: 'Phone Dictionary',
		contact: {
			email: 'test@icloud.com',
		},
		license: {
			name: 'Apache 2.0',
			url: 'http://www.apache.org/licenses/LICENSE-2.0.html',
		},
	},
	servers: [
		{
			url: 'http://localhost:3000',
			variables: { port: { default: 3000 } },
		},
	],
	paths: {
		'/TS': {
			get: {
				tags: ['CRUD operations'],
				description: 'Get phone dictionary',
				operationId: 'getTS',
				responses: {
					200: {
						description: 'Dictionary list',
						content: {
							'application/json': {
								schema: { type: 'object' },
								example: {
									name: 'Name',
									number: '292351401',
								},
							},
						},
					},
				},
			},
			post: {
				tags: ['CRUD operations'],
				description: 'Post phone dictionary',
				operationId: 'postTS',
				requestBody: {
					content: {
						'application/json': {
							name: 'Dictionary line',
							schema: { type: 'object' },
							required: true,
							description: 'Post data for dictionary',
							example: {
								name: 'Name',
								number: '1313',
							},
						},
					},
				},
				responses: {
					200: {
						description: 'OK message for post',
						content: {
							'application/json': {
								schema: { type: 'object' },
								example: {
									message: 'Line is posted',
								},
							},
						},
					},
					400: {
						description: 'Missing parameters',
						content: {
							'application/json': {
								schema: { type: 'object' },
								example: {
									message: 'One or more of parameters are missing',
								},
							},
						},
					},
				},
			},
			put: {
				tags: ['CRUD operations'],
				description: 'Put phone dictionary',
				operationId: 'putTS',
				requestBody: {
					content: {
						'application/json': {
							name: 'Dictionary line',
							schema: { type: 'object' },
							required: true,
							description: 'Put data for dictionary',
							example: {
								name: 'Sidorov',
								number: '1313',
							},
						},
					},
				},
				responses: {
					200: {
						description: 'OK message for put',
						content: {
							'application/json': {
								schema: { type: 'object' },
								example: {
									message: 'Line is updated',
								},
							},
						},
					},
					400: {
						description: 'Missing parameters',
						content: {
							'application/json': {
								schema: { type: 'object' },
								example: {
									message: 'One or more of parameters are missing',
								},
							},
						},
					},
				},
			},
			delete: {
				tags: ['CRUD operations'],
				description: 'Delete phone dictionary',
				operationId: 'delTS',
				requestBody: {
					content: {
						'application/json': {
							name: 'Dictionary line',
							schema: { type: 'object' },
							required: true,
							description: 'Put data for dictionary',
							example: {
								name: 'Sidorov'
							},
						},
					},
				},
				responses: {
					200: {
						description: 'OK message for delete',
						content: {
							'application/json': {
								schema: { type: 'object' },
								example: {
									message: 'Line is deleted',
								},
							},
						},
					},
					400: {
						description: 'Missing parameters',
						content: {
							'application/json': {
								schema: { type: 'object' },
								example: {
									message: 'One or more of parameters are missing',
								},
							},
						},
					},
				},
			},
		},
	},
};
export default openapi;
