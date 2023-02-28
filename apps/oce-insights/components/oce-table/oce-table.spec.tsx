import { render } from '@testing-library/react';

import OceTable from './oce-table';

describe('OceTable', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<OceTable />);
    expect(baseElement).toBeTruthy();
  });
});
