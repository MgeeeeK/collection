# Collection App

## Getting Started

### Prerequisites

- **Node.js** (version 20 or above)
- **npm**

### Installation

1. **Clone the Repository**

   ```bash
   git clone https://github.com/MgeeeeK/collection.git
   cd collection
   ```

2. **Backend Setup**

   ```bash
   cd backend
   npm install
   ```

3. **Frontend Setup**

   ```bash
   npm install
   ```

### Configuration

#### Pusher Setup

- Sign up for a [Pusher](https://pusher.com) account and create a new app.
- Note down the **App ID**, **Key**, **Secret**, and **Cluster**.

#### Environment Variables

Create `.env` files in both the `backend` and `app` directories with the following content:

- **Backend (`backend/.env`):**

  ```
  export PORT=
  export DB_HOST=
  export DB_NAME=
  export DB_PASSWORD=
  export DB_USER=
  export DB_PORT=
  export DB_SSL=
  export PUSHER_CLUSTER=
  export PUSHER_SECRET=
  export PUSHER_KEY=
  export PUSHER_APP_ID=
  ```

- **Frontend (`app/.env`):**

  ```
  VITE_PUSHER_KEY=
  VITE_PUSHER_CLUSTER=
  ```

### Running the Application

1. **Start the Backend Server**

   ```bash
   cd backend
   npm start
   ```

2. **Start the Frontend Development Server**

   ```bash
   cd ../app
   npm run dev
   ```

3. **Access the App**

   Open your browser and navigate to `http://localhost:3000`.


## Project Structure

- **app/**: Contains the frontend code built with Vite and React.
- **backend/**: Contains the backend code built with Express and TypeORM.

## Backend Entities

### Node Entity

Represents an item or folder in the collection.

```typescript
@Entity("node")
export class Node extends MetadataBase {
  @Column() title: string;
  @Column({ type: "enum", enum: NodeType }) type: NodeType;
  @Column({ nullable: true }) icon?: string;
  @Column({ default: false }) isRoot: boolean;
  @Column({ default: true }) isOpen: boolean;
  @Column() order: number;
  @Column() sessionId: number;
  @Column({ nullable: true }) parentId?: number;

  @ManyToOne(() => Session, (session) => session.nodes)
  session: Session;

  @ManyToOne(() => Node, (node) => node.children)
  parent?: Node;

  @OneToMany(() => Node, (node) => node.parent)
  children?: Node[];
}
```

### Session Entity

Represents a user session.

```typescript
@Entity("session")
export class Session extends MetadataBase {
  @Column() uuid: string;

  @OneToMany(() => Node, (node) => node.session)
  nodes: Node[];
}
```

## Notes

- **Real-Time Functionality**: Pusher is used to broadcast changes in the collection to all connected clients.
- **Session Management**: Each user session is tracked using a UUID stored in cookies.
