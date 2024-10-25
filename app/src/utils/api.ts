import { Node } from "@/types";
import axios from "axios";

export const api = {
  async getState() {
    const { data } = await axios.get("/api/session/state");
    return data.nodes || [];
  },

  async addNode(nodeData: Partial<Node>) {
    return axios.post("/api/node", nodeData);
  },

  async updateNode(nodeId: number, data: Partial<Node>) {
    return axios.put(`/api/node/${nodeId}`, data);
  },
};
