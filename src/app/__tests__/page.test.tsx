import { render, screen } from '@testing-library/react';
import Home from '../page';

describe('Home Page', () => {
  it('renders the main headline', () => {
    render(<Home />);

    // The headline is split into two h1 tags, so we test for each part.
    const headlinePart1 = screen.getByRole('heading', {
      name: /Your new obsession/i,
    });
    const headlinePart2 = screen.getByRole('heading', {
      name: /has arrived./i,
    });

    expect(headlinePart1).toBeInTheDocument();
    expect(headlinePart2).toBeInTheDocument();
  });
});
