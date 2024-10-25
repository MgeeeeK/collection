import React, { useState, useEffect } from "react";
import { DragDropContext, DropResult } from "react-beautiful-dnd";
import { Add as AddIcon } from "@mui/icons-material";
import { Box, Button, CssBaseline } from "@mui/material";
import { useCollection } from "./contexts/CollectionContext";

import AppHeader from "./components/AppHeader";
import SideNav from "./components/SideNav";
import MainContent from "./components/MainContent.tsx";
import AddFolderDialog from "./components/AddFolderDialog";
import AddItemDialog from "./components/AddItemDialog";
import ContentDisplay from "@/components/ContentDisplay";
import FolderTree from "@/components/FolderTree";

interface DialogState {
  type: "folder" | "item" | null;
  isOpen: boolean;
}

interface AddItemValues {
  title: string;
  icon?: string;
}

interface AddFolderValues {
  title: string;
}

const App: React.FC = () => {
  const { nodes, addNode, moveNode } = useCollection();
  const [selectedFolderId, setSelectedFolderId] = useState<number | null>(null);
  const [dialog, setDialog] = useState<DialogState>({
    type: null,
    isOpen: false,
  });

  useEffect(() => {
    if (nodes.length > 0 && selectedFolderId === null) {
      const rootNode = nodes.find(
        (node) => node.parentId === null && node.isRoot
      );
      if (rootNode) {
        setSelectedFolderId(rootNode.id);
      }
    }
  }, [nodes, selectedFolderId]);

  const handleDragEnd = async (result: DropResult) => {
    const { destination, draggableId } = result;
    if (!destination) return;

    const nodeId = parseInt(draggableId);
    const destinationParentId = parseDestinationId(destination.droppableId);

    if (!isValidDestination(destinationParentId, nodes)) return;

    try {
      await moveNode(nodeId, destinationParentId, destination.index);
    } catch (error) {
      console.error("Error moving node:", error);
    }
  };

  const handleAddItem = async (values: AddItemValues) => {
    try {
      await addNode({
        title: values.title,
        type: "item",
        icon: values.icon,
        parentId: selectedFolderId,
      });
      closeDialog();
    } catch (error) {
      console.error("Error adding item:", error);
    }
  };

  const handleAddFolder = async (values: AddFolderValues) => {
    try {
      await addNode({
        title: values.title,
        type: "folder",
        isOpen: true,
        parentId: selectedFolderId,
      });
      closeDialog();
    } catch (error) {
      console.error("Error adding folder:", error);
    }
  };

  // Dialog controls
  const openDialog = (type: "folder" | "item") => {
    setDialog({ type, isOpen: true });
  };

  const closeDialog = () => {
    setDialog({ type: null, isOpen: false });
  };

  return (
    <DragDropContext onDragEnd={handleDragEnd}>
      <Box sx={{ display: "flex" }}>
        <CssBaseline />

        <AppHeader>
          <Box sx={{ flexGrow: 1 }} />
          <ActionButtons
            onAddFolder={() => openDialog("folder")}
            onAddItem={() => openDialog("item")}
          />
        </AppHeader>

        <SideNav>
          <FolderTree onSelectFolder={setSelectedFolderId} />
        </SideNav>

        <MainContent>
          <ContentDisplay
            selectedFolderId={selectedFolderId}
            onFolderClick={setSelectedFolderId}
          />
        </MainContent>

        <DialogManager
          dialog={dialog}
          onClose={closeDialog}
          onCreateFolder={handleAddFolder}
          onCreateItem={handleAddItem}
        />
      </Box>
    </DragDropContext>
  );
};

const ActionButtons: React.FC<{
  onAddFolder: () => void;
  onAddItem: () => void;
}> = ({ onAddFolder, onAddItem }) => (
  <>
    <Button color="inherit" startIcon={<AddIcon />} onClick={onAddFolder}>
      Add Folder
    </Button>
    <Button color="inherit" startIcon={<AddIcon />} onClick={onAddItem}>
      Add Item
    </Button>
  </>
);

const DialogManager: React.FC<{
  dialog: DialogState;
  onClose: () => void;
  onCreateFolder: (values: AddFolderValues) => void;
  onCreateItem: (values: AddItemValues) => void;
}> = ({ dialog, onClose, onCreateFolder, onCreateItem }) => (
  <>
    <AddFolderDialog
      open={dialog.type === "folder" && dialog.isOpen}
      onCreate={onCreateFolder}
      onCancel={onClose}
    />
    <AddItemDialog
      open={dialog.type === "item" && dialog.isOpen}
      onCreate={onCreateItem}
      onCancel={onClose}
    />
  </>
);

const parseDestinationId = (droppableId: string): number | null => {
  if (droppableId === "root") return null;
  if (droppableId.startsWith("folder-")) {
    return parseInt(droppableId.replace("folder-", ""));
  }
  return null;
};

const isValidDestination = (
  destinationId: number | null,
  nodes: any[]
): boolean => {
  if (destinationId === null) return true;
  const destinationNode = nodes.find((node) => node.id === destinationId);
  return destinationNode?.type === "folder";
};

export default App;
