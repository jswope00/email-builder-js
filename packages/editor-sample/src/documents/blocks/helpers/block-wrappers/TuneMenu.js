import React from 'react';
import { ArrowDownwardOutlined, ArrowUpwardOutlined, ContentCopyOutlined, DeleteOutlined } from '@mui/icons-material';
import { IconButton, Paper, Stack, Tooltip } from '@mui/material';
import { resetDocument, setSelectedBlockId, useDocument } from '../../../editor/EditorContext';
import cloneDocumentBlock from '../cloneDocumentBlock';
const sx = {
    position: 'absolute',
    top: 0,
    left: -56,
    borderRadius: 64,
    paddingX: 0.5,
    paddingY: 1,
    zIndex: 'fab',
};
function findParentBlockId(blockId, document) {
    var _a, _b, _c, _d, _e;
    for (const [id, b] of Object.entries(document)) {
        if (id === blockId) {
            continue;
        }
        const block = b;
        switch (block.type) {
            case 'EmailLayout':
                if ((_a = block.data.childrenIds) === null || _a === void 0 ? void 0 : _a.includes(blockId)) {
                    return id;
                }
                break;
            case 'Container':
                if ((_c = (_b = block.data.props) === null || _b === void 0 ? void 0 : _b.childrenIds) === null || _c === void 0 ? void 0 : _c.includes(blockId)) {
                    return id;
                }
                break;
            case 'ColumnsContainer':
                if ((_e = (_d = block.data.props) === null || _d === void 0 ? void 0 : _d.columns) === null || _e === void 0 ? void 0 : _e.some((col) => { var _a; return (_a = col.childrenIds) === null || _a === void 0 ? void 0 : _a.includes(blockId); })) {
                    return id;
                }
                break;
        }
    }
    return null;
}
export default function TuneMenu({ blockId }) {
    const document = useDocument();
    const handleDuplicateClick = () => {
        const parentBlockId = findParentBlockId(blockId, document);
        const { document: newDocument, blockId: newBlockId } = cloneDocumentBlock(document, blockId);
        if (parentBlockId) {
            const parentBlock = newDocument[parentBlockId];
            switch (parentBlock.type) {
                case 'EmailLayout': {
                    if (!parentBlock.data.childrenIds) {
                        parentBlock.data.childrenIds = [];
                    }
                    const index = parentBlock.data.childrenIds.indexOf(blockId);
                    parentBlock.data.childrenIds.splice(index + 1, 0, newBlockId);
                    break;
                }
                case 'Container': {
                    if (!parentBlock.data.props) {
                        parentBlock.data.props = {};
                    }
                    if (!parentBlock.data.props.childrenIds) {
                        parentBlock.data.props.childrenIds = [];
                    }
                    const index = parentBlock.data.props.childrenIds.indexOf(blockId);
                    parentBlock.data.props.childrenIds.splice(index + 1, 0, newBlockId);
                    break;
                }
                case 'ColumnsContainer':
                    if (!parentBlock.data.props) {
                        parentBlock.data.props = { columns: [{ childrenIds: [] }, { childrenIds: [] }, { childrenIds: [] }] };
                    }
                    for (const column of parentBlock.data.props.columns) {
                        if (column.childrenIds.includes(blockId)) {
                            const index = column.childrenIds.indexOf(blockId);
                            column.childrenIds.splice(index + 1, 0, newBlockId);
                        }
                    }
                    break;
            }
            resetDocument(newDocument);
            setSelectedBlockId(newBlockId);
        }
    };
    const handleDeleteClick = () => {
        var _a, _b, _c;
        const filterChildrenIds = (childrenIds) => {
            if (!childrenIds) {
                return childrenIds;
            }
            return childrenIds.filter((f) => f !== blockId);
        };
        const nDocument = Object.assign({}, document);
        for (const [id, b] of Object.entries(nDocument)) {
            const block = b;
            if (id === blockId) {
                continue;
            }
            switch (block.type) {
                case 'EmailLayout':
                    nDocument[id] = Object.assign(Object.assign({}, block), { data: Object.assign(Object.assign({}, block.data), { childrenIds: filterChildrenIds(block.data.childrenIds) }) });
                    break;
                case 'Container':
                    nDocument[id] = Object.assign(Object.assign({}, block), { data: Object.assign(Object.assign({}, block.data), { props: Object.assign(Object.assign({}, block.data.props), { childrenIds: filterChildrenIds((_a = block.data.props) === null || _a === void 0 ? void 0 : _a.childrenIds) }) }) });
                    break;
                case 'ColumnsContainer':
                    nDocument[id] = {
                        type: 'ColumnsContainer',
                        data: {
                            style: block.data.style,
                            props: Object.assign(Object.assign({}, block.data.props), { columns: (_c = (_b = block.data.props) === null || _b === void 0 ? void 0 : _b.columns) === null || _c === void 0 ? void 0 : _c.map((c) => ({
                                    childrenIds: filterChildrenIds(c.childrenIds),
                                })) }),
                        },
                    };
                    break;
                default:
                    nDocument[id] = block;
            }
        }
        delete nDocument[blockId];
        resetDocument(nDocument);
    };
    const handleMoveClick = (direction) => {
        var _a, _b, _c;
        const moveChildrenIds = (ids) => {
            if (!ids) {
                return ids;
            }
            const index = ids.indexOf(blockId);
            if (index < 0) {
                return ids;
            }
            const childrenIds = [...ids];
            if (direction === 'up' && index > 0) {
                [childrenIds[index], childrenIds[index - 1]] = [childrenIds[index - 1], childrenIds[index]];
            }
            else if (direction === 'down' && index < childrenIds.length - 1) {
                [childrenIds[index], childrenIds[index + 1]] = [childrenIds[index + 1], childrenIds[index]];
            }
            return childrenIds;
        };
        const nDocument = Object.assign({}, document);
        for (const [id, b] of Object.entries(nDocument)) {
            const block = b;
            if (id === blockId) {
                continue;
            }
            switch (block.type) {
                case 'EmailLayout':
                    nDocument[id] = Object.assign(Object.assign({}, block), { data: Object.assign(Object.assign({}, block.data), { childrenIds: moveChildrenIds(block.data.childrenIds) }) });
                    break;
                case 'Container':
                    nDocument[id] = Object.assign(Object.assign({}, block), { data: Object.assign(Object.assign({}, block.data), { props: Object.assign(Object.assign({}, block.data.props), { childrenIds: moveChildrenIds((_a = block.data.props) === null || _a === void 0 ? void 0 : _a.childrenIds) }) }) });
                    break;
                case 'ColumnsContainer':
                    nDocument[id] = {
                        type: 'ColumnsContainer',
                        data: {
                            style: block.data.style,
                            props: Object.assign(Object.assign({}, block.data.props), { columns: (_c = (_b = block.data.props) === null || _b === void 0 ? void 0 : _b.columns) === null || _c === void 0 ? void 0 : _c.map((c) => ({
                                    childrenIds: moveChildrenIds(c.childrenIds),
                                })) }),
                        },
                    };
                    break;
                default:
                    nDocument[id] = block;
            }
        }
        resetDocument(nDocument);
        setSelectedBlockId(blockId);
    };
    return (React.createElement(Paper, { sx: sx, onClick: (ev) => ev.stopPropagation() },
        React.createElement(Stack, null,
            React.createElement(Tooltip, { title: "Move up", placement: "left-start" },
                React.createElement(IconButton, { onClick: () => handleMoveClick('up'), sx: { color: 'text.primary' } },
                    React.createElement(ArrowUpwardOutlined, { fontSize: "small" }))),
            React.createElement(Tooltip, { title: "Move down", placement: "left-start" },
                React.createElement(IconButton, { onClick: () => handleMoveClick('down'), sx: { color: 'text.primary' } },
                    React.createElement(ArrowDownwardOutlined, { fontSize: "small" }))),
            React.createElement(Tooltip, { title: "Duplicate", placement: "left-start" },
                React.createElement(IconButton, { onClick: handleDuplicateClick, sx: { color: 'text.primary' } },
                    React.createElement(ContentCopyOutlined, { fontSize: "small" }))),
            React.createElement(Tooltip, { title: "Delete", placement: "left-start" },
                React.createElement(IconButton, { onClick: handleDeleteClick, sx: { color: 'text.primary' } },
                    React.createElement(DeleteOutlined, { fontSize: "small" }))))));
}
//# sourceMappingURL=TuneMenu.js.map