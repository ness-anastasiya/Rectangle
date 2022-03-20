# RECTANGLE

# How to start
1. npm i
2. npm run dev

# Description
This app allows you
1. Draw rectangles
2. Editing corner radius by dragging corner handle
3. Moving rectangles around by dragging them

# Behaviour
1. To creact new rectangle click "Creacte new rectangle" button
2. To move the rectangle make mouse down, drag the rectangle, make mouse up
3. To change border radius make mouse down on the dot, drag the dot, make mouse up
4. You can only move the dot horizontally along the border of the rectangle
5. Movement to the left is limited by the middle of the side of the rectangle
6. Movement to the right is limited by the edge of the rectangle

# How is a rectangle created?
1. Сonstructor function creates a new rectangle object
2. The draw function displays it on the screen

# Rectangle API
Each rectangle have the API that allows you:
1. Setting its position on the screen: rectangle.setPosition(x, y);
2. Setting its size: rectangle.setSize(width, height);
3. Setting the corner radius: rectangle.setCornerRadius(radius);
4. Serialising its state to JSON data: rectangle.toJSON();

# Global variables and methodes
You have an access to:
1. rectanglesData - array of defaults rectsngles
2. getRectById(id) - to find a specific rectangle

# Environment
The project is built using the parcel-bundler package
