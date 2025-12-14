/**
 * @format
 * Snapshot test for PosterCard
 */
import React from 'react';
import ReactTestRenderer from 'react-test-renderer';
import PosterCard from '../components/PosterCard';
import { ThemeProvider } from '../theme/ThemeProvider';
import type { MediaItem } from '../api/types';

const mockItem: MediaItem = {
  id: '1',
  title: 'Sample Movie',
  poster: null,
  overview: 'Overview',
  type: 'movie',
};

describe('PosterCard', () => {
  it('renders correctly', () => {
    let tree;
    ReactTestRenderer.act(() => {
      tree = ReactTestRenderer.create(
        <ThemeProvider>
          <PosterCard item={mockItem} width={120} onPress={() => {}} />
        </ThemeProvider>,
      ).toJSON();
    });
    expect(tree).toMatchSnapshot();
  });
});


