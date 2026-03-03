import React from 'react';
import { describe, expect, it } from '@jest/globals';
import { render } from '@testing-library/react';
import { Avatar } from '.';
describe('block-avatar', () => {
    describe('Avatar', () => {
        it('renders with default values', () => {
            expect(render(React.createElement(Avatar, null)).asFragment()).toMatchSnapshot();
        });
    });
});
//# sourceMappingURL=index.spec.js.map