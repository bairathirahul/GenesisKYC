import { FilterDeletedPipe } from './filter-deleted.pipe';

describe('FilterDeletedPipe', () => {
  it('create an instance', () => {
    const pipe = new FilterDeletedPipe();
    expect(pipe).toBeTruthy();
  });
});
