import { RecordParser } from '../src/libs/workflow-config/record-parser';

describe('RecordParser', () => {
  it('RecordParser undefined parseBoolean', async () => {
    const record = new RecordParser({});
    expect(false).toEqual(record.parseBoolean('UNKNOWN_KEY'));
  });

});
