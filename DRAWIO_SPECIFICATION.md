# Jenga Architecture System - Draw.io Diagram Specification

This document provides the specifications to recreate your whiteboard architecture diagram in Draw.io.

## Draw.io Components Setup

### 1. Canvas Setup
- **Canvas Size**: 1200 x 800 pixels
- **Grid**: Enabled (20px spacing)
- **Background**: White

### 2. Component Specifications

#### User Interface Layer (Blue Theme)
1. **User Login Component**
   - Shape: Rounded Rectangle
   - Size: 120 x 80 px
   - Color: #E3F2FD (light blue background)
   - Border: #1976D2 (blue, 2px)
   - Icon: 👤 + "User Login"
   - Position: X:50, Y:100

2. **Authentication Guard**
   - Shape: Diamond/Hexagon
   - Size: 140 x 80 px  
   - Color: #F3E5F5 (light purple background)
   - Border: #7B1FA2 (purple, 2px)
   - Icon: 🔐 + "Authentication Guard"
   - Position: X:250, Y:100

3. **React UI Frontend**
   - Shape: Rounded Rectangle
   - Size: 120 x 80 px
   - Color: #E8F5E8 (light green background)
   - Border: #388E3C (green, 2px)
   - Icon: ⚛️ + "React UI (Frontend)"
   - Position: X:450, Y:100

#### Processing Layer (Orange Theme)
4. **API Layer Backend**
   - Shape: Rounded Rectangle
   - Size: 140 x 80 px
   - Color: #FFF3E0 (light orange background)
   - Border: #F57C00 (orange, 2px)
   - Icon: 🔄 + "API Layer (Backend)"
   - Position: X:300, Y:250

#### Data Layer (Pink/Red Theme)  
5. **RAS Database**
   - Shape: Cylinder/Database
   - Size: 160 x 100 px
   - Color: #FCE4EC (light pink background)
   - Border: #C2185B (pink, 2px)
   - Icon: 🗄️ + "RAS Database (Redis/Auth/Storage)"
   - Position: X:50, Y:400

6. **Data Pipeline**
   - Shape: Rounded Rectangle
   - Size: 140 x 80 px
   - Color: #E1F5FE (light cyan background)
   - Border: #0277BD (cyan, 2px)
   - Icon: 📊 + "Data Pipeline (Processing)"
   - Position: X:450, Y:400

7. **Data Normalization**
   - Shape: Rounded Rectangle  
   - Size: 140 x 80 px
   - Color: #F9FBE7 (light lime background)
   - Border: #689F38 (lime, 2px)
   - Icon: 🔧 + "Data Normalization"
   - Position: X:300, Y:550

### 3. Connection Flows

#### Flow Arrows Configuration
- **Style**: Curved connectors with arrows
- **Width**: 2px
- **Color**: #666666 (dark gray)
- **Arrow Style**: Standard arrow heads

#### Connection Specifications:
1. **User Login → Auth Guard**
   - Style: Animated blue arrow
   - Label: "Login Request"

2. **Auth Guard → React UI**  
   - Style: Animated green arrow
   - Label: "Authorized Access"

3. **React UI → API Layer**
   - Style: Animated orange arrow  
   - Label: "API Calls"

4. **API Layer → RAS Database**
   - Style: Bidirectional pink arrow
   - Label: "Store/Retrieve Data"

5. **API Layer → Data Pipeline**
   - Style: Animated cyan arrow
   - Label: "Process Data"

6. **Data Pipeline → Data Normalization**
   - Style: Animated lime arrow
   - Label: "Normalize"

7. **RAS Database → Data Normalization**
   - Style: Dashed gray arrow
   - Label: "Raw Data"

### 4. Additional Visual Elements

#### Background Zones
1. **Frontend Zone**
   - Shape: Large rounded rectangle (background)
   - Color: Light blue (#F5F9FF)
   - Contains: User Login, Auth Guard, React UI
   - Position: X:25, Y:75, Width:470, Height:130

2. **Backend Zone**  
   - Shape: Large rounded rectangle (background)
   - Color: Light orange (#FFFAF5)
   - Contains: API Layer
   - Position: X:275, Y:225, Width:190, Height:130

3. **Data Zone**
   - Shape: Large rounded rectangle (background)
   - Color: Light pink (#FFF8FA)
   - Contains: Database, Pipeline, Normalization  
   - Position: X:25, Y:375, Width:570, Height:200

#### Title and Labels
- **Main Title**: "Jenga Architecture System"
  - Font: Arial Bold, 24px
  - Position: X:400, Y:30

- **Zone Labels**:
  - "User Interface Layer" (Frontend Zone)
  - "API Processing Layer" (Backend Zone)  
  - "Data Storage & Processing Layer" (Data Zone)

### 5. Draw.io Import Instructions

1. **Open Draw.io** (app.diagrams.net)
2. **Create New Diagram** → Blank Diagram
3. **Set Canvas Size** → File → Page Setup → Custom (1200x800)
4. **Add Shapes**:
   - Use "General" shapes for rectangles
   - Use "Entity Relation" for database cylinder
   - Use "Arrows" for connectors

5. **Apply Styling**:
   - Select each shape → Format Panel → Fill/Border colors as specified
   - Add icons using Insert → Special Characters (emoji)

6. **Create Connections**:
   - Use Connector tool
   - Style connections per specifications above
   - Add labels by double-clicking connectors

### 6. Export Options
- **For Web**: SVG format
- **For Documents**: PNG (300 DPI)  
- **For Editing**: .drawio format

## Architecture Flow Description

This diagram represents the complete system flow from your whiteboard:

1. **User Authentication Flow**: Users log in through the authentication guard to access the React frontend
2. **API Integration**: The frontend communicates with the backend API layer for all operations  
3. **Data Management**: The API layer manages data storage/retrieval from the RAS database system
4. **Data Processing**: Raw data flows through the processing pipeline for normalization
5. **System Integration**: All components work together to provide a complete architecture solution

The diagram maintains the visual hierarchy and relationships from your original whiteboard while adding professional styling and clear component boundaries.