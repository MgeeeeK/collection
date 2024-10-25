import React from "react";
import {
  ChevronRight,
  ChevronDown,
  Folder as FolderIcon,
  File as FileIcon,
} from "lucide-react";
import { useCollection } from "../contexts/CollectionContext";
import { Node } from "../types";
import { Box, IconButton, Typography } from "@mui/material";
import { Droppable } from "react-beautiful-dnd";

interface FolderTreeProps {
  onSelectFolder: (folderId: number | null) => void;
}

const FolderTree: React.FC<FolderTreeProps> = ({ onSelectFolder }) => {
  const { nodes } = useCollection();

  const rootNodes = nodes
    .filter((node) => (node.parentId || null) === null)
    .sort((a, b) => a.order - b.order);

  return (
    <Box sx={{ p: 2 }}>
      {rootNodes.map((node) => (
        <NodeItem
          key={node.id}
          node={node}
          level={0}
          onSelectFolder={onSelectFolder}
        />
      ))}
    </Box>
  );
};

interface NodeItemProps {
  node: Node;
  level: number;
  onSelectFolder: (folderId: number | null) => void;
}

const NodeItem: React.FC<NodeItemProps> = ({ node, level, onSelectFolder }) => {
  const { nodes, toggleNode } = useCollection();
  const isFolder = node.type === "folder";

  const childNodes = nodes
    .filter((childNode) => (childNode.parentId || null) === node.id)
    .sort((a, b) => a.order - b.order);

  const handleClick = () => {
    if (isFolder) {
      onSelectFolder(node.id);
    }
  };

  const content = (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        gap: 1,
        p: 1,
        pl: level * 2,
        "&:hover": {
          bgcolor: "action.hover",
        },
        cursor: "pointer",
      }}
      onClick={handleClick}
    >
      {isFolder && (
        <IconButton
          size="small"
          onClick={(e) => {
            e.stopPropagation();
            toggleNode(node.id);
          }}
          sx={{ p: 0.5 }}
        >
          {node.isOpen ? <ChevronDown size={18} /> : <ChevronRight size={18} />}
        </IconButton>
      )}
      <div>
        {isFolder ? (
          <FolderIcon size={18} color="#1976d2" />
        ) : (
          <FileIcon size={18} color="#757575" />
        )}
      </div>
      <Typography variant="body2">{node.title}</Typography>
    </Box>
  );

  return (
    <>
      {isFolder ? (
        <Droppable droppableId={`folder-${node.id}`} type="NODE">
          {(provided, snapshot) => (
            <Box
              ref={provided.innerRef}
              {...provided.droppableProps}
              sx={{
                backgroundColor: snapshot.isDraggingOver
                  ? "action.hover"
                  : "transparent",
              }}
            >
              {content}
              {provided.placeholder}
            </Box>
          )}
        </Droppable>
      ) : (
        content
      )}
      {isFolder && node.isOpen && childNodes.length > 0 && (
        <Box>
          {childNodes.map((childNode) => (
            <NodeItem
              key={childNode.id}
              node={childNode}
              level={level + 1}
              onSelectFolder={onSelectFolder}
            />
          ))}
        </Box>
      )}
    </>
  );
};

export default FolderTree;
