const { HttpResponseBuilder } = require('../index.js');
const { describe, test, expect } = require('@jest/globals');

describe('response', () => {
    describe('status codes', () => {
        test('ok status', () => {
            const response = HttpResponseBuilder.Ok().build();
            // console.log(response);
            expect(response.statusCode).toBe(200);
        });

        test('NotFound status', () => {
            const response = HttpResponseBuilder.NotFound().build();
            // console.log(response);
            expect(response.statusCode).toBe(404);
        });
    })


    test('correct body', () => {
        const response = HttpResponseBuilder.Ok()
            .setBody({ name: 'Jack', age: 20 })
            .build();
        // console.log(response);
        expect(response.body).toMatchObject({ age: 20, name: 'Jack' })
    });

    test('add header', () => {
        const response = HttpResponseBuilder.Ok()
            .addHeader('authorization', 'basic XYZ')
            .build();
        // console.log(response);
        expect(response.headers).toMatchObject({ 'authorization': 'basic XYZ' });
    });

    test('statusMessage', () => {
        const response = HttpResponseBuilder.ServerError()
            .statusMessage('hard to explain')
            .build();
        console.log(response);
        expect(response.statusCode).toBe(500);
        expect(response.statusMessage).toBe('hard to explain');
    });
});

