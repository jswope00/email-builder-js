import React from 'react';
import { describe, expect, it } from '@jest/globals';
import { render } from '@testing-library/react';
import { Button } from '.';
describe('block-button', () => {
    it('renders with default values', () => {
        expect(render(React.createElement(Button, null)).asFragment()).toMatchSnapshot();
    });
});
//# sourceMappingURL=index.spec.js.map