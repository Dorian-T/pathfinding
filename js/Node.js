// Node class to store node data
class Node {
	constructor(id, x, y) {
		// display properties
		this.id = id;
		this.x = x;
		this.y = y;
		this.selected = false;

		// dijkstra properties
		this.edges = [];
		this.visited = false;
		this.previous = null;
		this.distance = Infinity;
	}

	// reset dijkstra properties
	reset() {
		this.visited = false;
		this.previous = null;
		this.distance = Infinity;
	}

	// select or unselect node
	select() {
		this.selected = !this.selected;
	}

	// set distance
	setDistance(distance) {
		this.distance = distance;
	}

	// set previous node
	setPrevious(previous) {
		this.previous = previous;
	}

	// visit node
	visit() {
		this.visited = true;
	}
}