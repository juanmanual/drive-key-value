import main from './main';

jest.mock('@nestjs/core', () => {
    const mockApp = {
        listen: jest.fn()
    }
    return {
        NestFactory: {
            create: jest.fn().mockResolvedValue(mockApp),
        }
    }
});
jest.mock('./app.module');


describe('Main', () => {
    it('runs without failing', async () => {
        return main()
    });
})