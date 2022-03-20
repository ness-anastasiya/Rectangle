// default array of rectangles
let rectanglesData = [
  {
    id: 0,
    x: 100,
    y: 100,
    width: 200,
    height: 150,
    radius: 10,
  },
  {
    id: 1,
    x: 400,
    y: 150,
    width: 300,
    height: 100,
    radius: 30,
  },
  {
    id: 2,
    x: 150,
    y: 400,
    width: 250,
    height: 150,
    radius: 20,
  },
];

// global function for getting rectangle by id
function getRectById(id) {
  return rectanglesData.find((rect) => rect.id === id);
}

// initialize container
const container = document.querySelector("#container");

// set draggable item
let currentItem = null;

// set current item properties
let activeItem = {
  id: "",
  type: "",
};

// add events to container
container.addEventListener("touchstart", startDrag, false);
container.addEventListener("touchend", endDrag, false);
container.addEventListener("touchmove", drag, false);

container.addEventListener("mousedown", startDrag, false);
container.addEventListener("mouseup", endDrag, false);
container.addEventListener("mousemove", drag, false);

const button = document.getElementById("btn");
button.addEventListener("click", createRect, false);

function startDrag(e) {
  if (e.target !== e.currentTarget) {
    activeItem.id = e.target.id;
    currentItem = e.target;

    if (e.target.className === "rect") {
      activeItem.type = "rect";

      // move note to the top in container and stay active
      const currentNode = document.getElementById(e.target.id);
      currentNode.remove();
      container.append(currentNode);
    }

    if (e.target.className === "dot") {
      activeItem.type = "dot";
    }

    if (currentItem == null) return;

    if (!currentItem.xOffset) {
      currentItem.xOffset = 0;
    }

    if (!currentItem.yOffset) {
      currentItem.yOffset = 0;
    }

    if (e.type === "touchstart") {
      currentItem.initialX = e.touches[0].clientX - currentItem.xOffset;
      currentItem.initialY = e.touches[0].clientY - currentItem.yOffset;
    } else {
      currentItem.initialX = e.clientX - currentItem.xOffset;
      currentItem.initialY = e.clientY - currentItem.yOffset;
    }
  }
}

function endDrag(e) {
  if (currentItem === null) return;

  currentItem.initialX = currentItem.currentX;
  currentItem.initialY = currentItem.currentY;

  const id = e.target.id;

  if (e.target.className === "rect") {
    const currentRect = rectanglesData.find((rect) => rect.id === id);
    if (currentRect) {
      // change rectangle object position
      currentRect.setPosition(currentItem.currentX, currentItem.currentY);
    }
  }

  isActive = false;
  activeItem.id = null;
  activeItem.type = "";
  currentItem = null;
}

function drag(e) {
  if (activeItem.id !== e.target.id) return;

  e.preventDefault();
  const currentItem = e.target;

  if (e.target.className === "rect") {
    if (e.type === "touchmove") {
      currentItem.currentX = e.touches[0].clientX - currentItem.initialX;
      currentItem.currentY = e.touches[0].clientY - currentItem.initialY;
    } else {
      currentItem.currentX = e.clientX - currentItem.initialX;
      currentItem.currentY = e.clientY - currentItem.initialY;
    }

    currentItem.xOffset = currentItem.currentX;
    currentItem.yOffset = currentItem.currentY;

    setTranslate(currentItem.currentX, currentItem.currentY, currentItem);
  }

  if (e.target.className === "dot") {
    // get rect by dot id
    const rectId = parseInt(e.target.id.match(/\d+/));
    const rect = document.getElementById(rectId);
    const rectObj = rectanglesData.find((rect) => rect.id === rectId);
    const rectWidth = rectObj.width;
    const rectRadius = rectObj.radius;

    let x = 0;

    if (e.type === "touchmove") {
      x = e.touches[0].clientX - currentItem.initialX;
    } else {
      x = e.clientX - currentItem.initialX;
    }

    // limit movement to the left by the middle of the side of the rectangle and
    // movement to the right by the edge of the rectangle
    if (x >= 0) {
      currentItem.currentX = Math.min(x, rectRadius);
    } else {
      currentItem.currentX = Math.max(x, 0 - (rectWidth / 2 - rectRadius));
    }
    currentItem.xOffset = currentItem.currentX;

    // change rectangle border radius
    rect.style["border-radius"] = rectRadius - currentItem.currentX + "px";

    setTranslate(currentItem.currentX, 0, currentItem);
  }
}

// change position
function setTranslate(xPos, yPos, item) {
  item.style.transform = "translate3d(" + xPos + "px, " + yPos + "px, 0)";
}

// draw rectangle
function drawRect(data) {
  const { id, x, y, width, height, radius } = data;

  const rect = document.createElement("div");
  rect.id = id;
  rect.innerText = id;
  rect.className = "rect";
  rect.style.left = x + "px";
  rect.style.top = y + "px";
  rect.style.width = width + "px";
  rect.style.height = height + "px";
  rect.style["border-radius"] = radius + "px";

  const dot = document.createElement("div");
  const dotTop = -15; // border width
  const dotRight = radius - 15; // rectangle radius - border width
  dot.id = `dot-${id}`;
  dot.className = "dot";
  dot.style.top = dotTop + "px";
  dot.style.right = dotRight + "px";

  rect.append(dot);
  container.append(rect);
}

// create rectangle object with incapsulated API
function Rectangle(data) {
  const { id, x, y, width, height, radius } = data;

  this.id = id;
  this.x = x;
  this.y = y;
  this.width = width;
  this.height = height;
  this.radius = radius;

  this.setPosition = function(x, y) {
    this.x = x;
    this.y = y;
  };

  this.setSize = function(width, height) {
    this.width = width;
    this.height = height;
  };

  this.setCornerRadius = function(radius) {
    this.radius = radius;
  };

  this.toJSON = function() {
    const rect = {
      id: this.id,
      x: this.x,
      y: this.y,
      width: this.width,
      height: this.height,
      radius: this.radius,
    };
    return JSON.stringify(rect);
  };

  return this;
}

// create new default rectangle and draw it
function createRect() {
  const date = new Date().getTime().toString();
  const id = +date.substring(date.length - 5);

  const rect = new Rectangle({
    id: id,
    x: 0,
    y: 0,
    width: 120,
    height: 100,
    radius: 15,
  });

  rectanglesData.push(rect);
  drawRect(rect);
}

// get rectanglesData, convert items to Rectangle object, draw them
function drawSavedRectangles() {
  rectanglesData = rectanglesData.map((rect) => {
    const rectangle = new Rectangle(rect);
    drawRect(rectangle);

    return rectangle;
  });
}

// call while initialize app
drawSavedRectangles();
