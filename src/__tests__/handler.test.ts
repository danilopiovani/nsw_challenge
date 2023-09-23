import { handler } from '../lambda/AddressApi/';
import { createMockEvent } from './utils/createMockEvent';

describe('handler', () => {
  it('should return a successful response', async () => {
    // Mocking the event object with your test data
    const event = createMockEvent('59+MOBBS+LANE+EPPING');
        
    // Invoking the Lambda function
    const result = await handler(event);

    // Performing assertions on the result
    expect(result.statusCode).toBe(200);
    expect(typeof result.body).toBe('string');
  });

  it('should handle errors and return an error response', async () => {
    // Mocking the event object with an error condition (location not found)
    const event = createMockEvent('9+MOBBS+LANE+EPPING');

    // Invoking the Lambda function
    const result = await handler(event);

    // Performing assertions on the error response
    expect(result.statusCode).toBe(500);
    expect(typeof result.body).toBe('string');
    expect(result.body).toContain('error');
  });

  it('should handle errors and return an error response', async () => {
    // Mocking the event object with an error condition (API error)
    const event = createMockEvent('%279+MOBBS+LANE+EPPING');

    // Invoking the Lambda function
    const result = await handler(event);

    // Performing assertions on the error response
    expect(result.statusCode).toBe(500);
    expect(typeof result.body).toBe('string');
    expect(result.body).toContain('error');
  });
});
