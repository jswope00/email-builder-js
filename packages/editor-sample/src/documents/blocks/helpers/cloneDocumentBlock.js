function cloneChildrenIds(document, blockIds) {
    return blockIds.map((blockId) => {
        const newBlock = cloneBlock(document, blockId);
        const newBlockId = `block-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
        document[newBlockId] = newBlock;
        return newBlockId;
    });
}
function cloneBlock(document, blockId) {
    var _a, _b, _c, _d;
    const clone = structuredClone(document[blockId]);
    switch (clone.type) {
        case 'EmailLayout':
            throw new Error('Cloning EmailLayout blocks is not supported.');
        case 'Avatar':
        case 'Button':
        case 'Divider':
        case 'Heading':
        case 'Html':
        case 'Image':
        case 'Spacer':
        case 'Text':
            return clone;
        case 'Container':
            if ((_b = (_a = clone.data) === null || _a === void 0 ? void 0 : _a.props) === null || _b === void 0 ? void 0 : _b.childrenIds) {
                clone.data.props.childrenIds = cloneChildrenIds(document, clone.data.props.childrenIds);
            }
            return clone;
        case 'ColumnsContainer':
            if ((_d = (_c = clone.data) === null || _c === void 0 ? void 0 : _c.props) === null || _d === void 0 ? void 0 : _d.columns) {
                clone.data.props.columns[0].childrenIds = cloneChildrenIds(document, clone.data.props.columns[0].childrenIds);
                clone.data.props.columns[1].childrenIds = cloneChildrenIds(document, clone.data.props.columns[1].childrenIds);
                clone.data.props.columns[2].childrenIds = cloneChildrenIds(document, clone.data.props.columns[2].childrenIds);
            }
            return clone;
    }
}
export default function cloneDocumentBlock(originalDocument, originalBlockId) {
    const document = Object.assign({}, originalDocument);
    const blockId = `block-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
    document[blockId] = cloneBlock(document, originalBlockId);
    return {
        document,
        blockId,
    };
}
//# sourceMappingURL=cloneDocumentBlock.js.map