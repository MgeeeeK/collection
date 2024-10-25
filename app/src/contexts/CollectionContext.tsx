import React, { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";
import Pusher from "pusher-js";
import Cookies from "js-cookie";
import { v4 as uuidv4 } from "uuid";
import { Node } from "@/types";
import { api } from "@/utils/api";

interface CollectionContextValue {
  nodes: Node[];
  addNode: (nodeData: Partial<Node>) => Promise<void>;
  moveNode: (
    nodeId: number,
    newParentId: number | null,
    newIndex: number
  ) => Promise<void>;
  toggleNode: (nodeId: number) => Promise<void>;
}

const CollectionContext = createContext<CollectionContextValue | undefined>(
  undefined
);

export const useCollection = () => {
  const context = useContext(CollectionContext);
  if (!context) {
    throw new Error("useCollection must be used within a CollectionProvider");
  }
  return context;
};

export const CollectionProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [nodes, setNodes] = useState<Node[]>([]);

  useEffect(() => {
    const setupUser = () => {
      let userUUID = Cookies.get("user_uuid");
      if (!userUUID) {
        userUUID = uuidv4();
        Cookies.set("user_uuid", userUUID, { expires: 365 });
      }
      return userUUID;
    };

    const setupAxiosInterceptor = (userUUID: string) => {
      axios.interceptors.request.use(
        (config) => {
          config.headers["x-user-uuid"] = userUUID;
          return config;
        },
        (error) => Promise.reject(error)
      );
    };

    const setupRealtimeUpdates = (userUUID: string) => {
      const pusher = new Pusher(import.meta.env.VITE_PUSHER_KEY, {
        cluster: import.meta.env.VITE_PUSHER_CLUSTER,
        forceTLS: true,
      });

      const channel = pusher.subscribe(`collection-updates-${userUUID}`);
      channel.bind("state-update", () => api.getState().then(setNodes));

      return () => {
        channel.unbind_all();
        channel.unsubscribe();
        pusher.disconnect();
      };
    };

    const userUUID = setupUser();
    setupAxiosInterceptor(userUUID);
    const cleanup = setupRealtimeUpdates(userUUID);

    api.getState().then(setNodes);

    return cleanup;
  }, []);

  const addNode = async (nodeData: Partial<Node>) => {
    try {
      const parentId = nodeData.parentId || null;
      const siblingsCount = nodes.filter(
        (node) => node.parentId === parentId
      ).length;
      await api.addNode({ ...nodeData, parentId, order: siblingsCount });
    } catch (error) {
      console.error("Error adding node:", error);
      throw error;
    }
  };

  const moveNode = async (
    nodeId: number,
    newParentId: number | null,
    newIndex: number
  ) => {
    const previousNodes = [...nodes];

    try {
      const nodeToMove = nodes.find((node) => node.id === nodeId);
      if (!nodeToMove) return;

      if (newParentId !== null) {
        const newParent = nodes.find((node) => node.id === newParentId);
        if (!newParent || newParent.type !== "folder") {
          throw new Error("Invalid parent node");
        }
      }

      const updatedNode = {
        ...nodeToMove,
        parentId: newParentId,
      };

      const filteredNodes = nodes.filter((node) => node.id !== nodeId);

      const siblingNodes = filteredNodes
        .filter((node) => node.parentId === newParentId)
        .sort((a, b) => a.order - b.order);

      siblingNodes.splice(newIndex, 0, updatedNode);

      const updatedSiblingNodes = siblingNodes.map((node, index) => ({
        ...node,
        order: index,
      }));

      const otherNodes = filteredNodes.filter(
        (node) => node.parentId !== newParentId
      );

      const updatedNodes = [...otherNodes, ...updatedSiblingNodes];
      setNodes(updatedNodes);

      await api.updateNode(nodeId, {
        parentId: newParentId,
        order: newIndex,
      });
    } catch (error) {
      console.error("Error moving node:", error);
      setNodes(previousNodes);
      throw error;
    }
  };

  const toggleNode = async (nodeId: number) => {
    try {
      const node = nodes.find((n) => n.id === nodeId);
      if (!node) return;
      await api.updateNode(nodeId, { isOpen: !node.isOpen });
    } catch (error) {
      console.error("Error toggling node:", error);
      throw error;
    }
  };

  return (
    <CollectionContext.Provider
      value={{
        nodes,
        addNode,
        moveNode,
        toggleNode,
      }}
    >
      {children}
    </CollectionContext.Provider>
  );
};
