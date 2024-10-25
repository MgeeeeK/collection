import React, { useMemo } from "react";
import { Droppable, Draggable } from "react-beautiful-dnd";
import {
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Button,
  Box,
  Typography,
  Stack,
} from "@mui/material";
import { Folder as FolderIcon, File as FileIcon } from "lucide-react";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { useCollection } from "../contexts/CollectionContext";

dayjs.extend(relativeTime);

interface ContentDisplayProps {
  selectedFolderId: number | null;
  onFolderClick?: (folderId: number | null) => void;
  onItemClick?: (itemId: number) => void;
}

interface DisplayItem {
  key: string;
  id: number;
  title: string;
  type: "folder" | "item";
  createdAt: Date;
  updatedAt: Date;
  size?: string;
  parentId: number | null;
}

const ItemIcon: React.FC<{ type: "folder" | "item" }> = ({ type }) =>
  type === "folder" ? (
    <FolderIcon size={24} color="#ffd591" />
  ) : (
    <FileIcon size={24} color="#1890ff" />
  );

const FolderHeader: React.FC<{
  selectedFolderId: number | null;
  currentFolder?: { title: string; isRoot: boolean } | null;
  itemCount: number;
  lastUpdated: string;
  onBack?: () => void;
}> = ({ selectedFolderId, currentFolder, itemCount, lastUpdated, onBack }) => {
  const isRoot = currentFolder?.isRoot;

  return (
    <Stack spacing={2} sx={{ mb: 2 }}>
      {selectedFolderId !== null && !isRoot && (
        <Button variant="text" onClick={onBack}>
          Back to All Files
        </Button>
      )}
      <Box>
        <Typography variant="h5">
          {isRoot
            ? "All Files"
            : currentFolder
              ? currentFolder.title
              : "All Files"}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {itemCount} items • Last updated {lastUpdated}
        </Typography>
      </Box>
    </Stack>
  );
};

const ListItemComponent: React.FC<{
  item: DisplayItem;
  index: number;
  onClick: () => void;
}> = React.memo(({ item, index, onClick }) => (
  <Draggable draggableId={String(item.id)} index={index}>
    {(provided, snapshot) => (
      <ListItem
        ref={provided.innerRef}
        {...provided.draggableProps}
        {...provided.dragHandleProps}
        button
        onClick={onClick}
        sx={{
          backgroundColor: snapshot.isDragging
            ? "action.hover"
            : "background.paper",
          ...provided.draggableProps.style,
        }}
      >
        <ListItemIcon>
          <ItemIcon type={item.type} />
        </ListItemIcon>
        <ListItemText primary={item.title} />
      </ListItem>
    )}
  </Draggable>
));

const DroppableContent: React.FC<{
  droppableId: string;
  children: React.ReactNode;
}> = ({ droppableId, children }) => (
  <Droppable droppableId={droppableId} type="NODE">
    {(provided, snapshot) => (
      <div ref={provided.innerRef} {...provided.droppableProps}>
        <List
          sx={{
            backgroundColor: snapshot.isDraggingOver
              ? "action.hover"
              : "transparent",
          }}
        >
          {children}
          {provided.placeholder}
        </List>
      </div>
    )}
  </Droppable>
);

const ContentDisplay: React.FC<ContentDisplayProps> = ({
  selectedFolderId,
  onFolderClick,
  onItemClick,
}) => {
  const { nodes } = useCollection();

  const displayNodes = useMemo(() => {
    return nodes
      .filter((node) => {
        const isRoot = node.title === "root" && node.parentId === null;
        return !isRoot && node.parentId === selectedFolderId;
      })
      .sort((a, b) => a.order - b.order);
  }, [nodes, selectedFolderId]);

  const currentFolder = useMemo(() => {
    return nodes.find(
      (node) => node.id === selectedFolderId && node.type === "folder"
    );
  }, [nodes, selectedFolderId]);

  const lastUpdated = useMemo(() => {
    if (displayNodes.length === 0) return "N/A";
    const maxDate = Math.max(
      ...displayNodes.map((node) => new Date(node.updatedAt).getTime())
    );
    return dayjs(maxDate).fromNow();
  }, [displayNodes]);

  const items = useMemo(() => {
    return displayNodes.map((node) => ({
      key: `${node.type}-${node.id}`,
      id: node.id,
      title: node.title,
      type: node.type as "folder" | "item",
      createdAt: new Date(node.createdAt),
      updatedAt: new Date(node.updatedAt),
      size:
        node.type === "folder"
          ? `${nodes.filter((n) => n.parentId === node.id).length} items`
          : "---",
      parentId: node.parentId || null,
    }));
  }, [displayNodes, nodes]);

  return (
    <Box sx={{ padding: 2 }}>
      <FolderHeader
        selectedFolderId={selectedFolderId}
        currentFolder={currentFolder}
        itemCount={displayNodes.length}
        lastUpdated={lastUpdated}
        onBack={() => onFolderClick?.(null)}
      />
      <DroppableContent
        droppableId={selectedFolderId ? `folder-${selectedFolderId}` : "root"}
      >
        {items.map((item, index) => (
          <ListItemComponent
            key={item.key}
            item={item}
            index={index}
            onClick={() =>
              item.type === "folder"
                ? onFolderClick?.(item.id)
                : onItemClick?.(item.id)
            }
          />
        ))}
      </DroppableContent>
    </Box>
  );
};

export default ContentDisplay;
