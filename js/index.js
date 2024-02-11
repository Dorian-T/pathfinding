const canvas = document.querySelector("canvas");
const ctx = canvas.getContext("2d");

window.onload = () => {
	graph = new Graph();
	addEvents();
}


// Display :

// Add all events
function addEvents() {
	// canvas click
	canvas.addEventListener("click", (e) => {
		// get click position with a margin of 15px
		let xmin = e.offsetX - 15;
		let xmax = e.offsetX + 15;
		let ymin = e.offsetY - 15;
		let ymax = e.offsetY + 15;

		// check if a node is clicked
		let bool = false;

		// loop through all nodes
		for(let i = 0; i < graph.nodes.length; i++) {
			// if node is clicked, select it
			if(graph.nodes[i].x >= xmin && graph.nodes[i].x <= xmax && graph.nodes[i].y >= ymin && graph.nodes[i].y <= ymax) {
				graph.nodes[i].select();
				bool = true;

				// if two nodes are selected, add edge
				for(let j = 0; j < graph.nodes.length; j++) {
					if(graph.nodes[j].selected && graph.nodes[j].id != graph.nodes[i].id) {
						graph.addEdge(graph.nodes[i].id, graph.nodes[j].id, askWeight());
						graph.nodes[i].select();
						graph.nodes[j].select();
						break;
					}
				}
				break;
			}
		}

		// if no node is clicked, add node
		if(!bool)
			graph.addNode(e.offsetX, e.offsetY);
		draw(graph);
	});

	// start button
	document.getElementById("start").addEventListener("click", () => {
		if(graph.nodes.length >= 2) {
			// ask user for start node
			let start = prompt("Entrer le noeud de départ");
			if(start == null || start == "" || !Number.isInteger(Number(start)) || start < 0 || start >= graph.nodes.length)
				start = 0;

			// ask user for end node
			let end = prompt("Entrer le noeud d'arrivée");
			if(end == null || end == "" || !Number.isInteger(Number(end)) || end < 0 || end >= graph.nodes.length)
				end = graph.nodes.length - 1;

			// run dijkstra's algorithm
			dijkstra(graph, Number(start), Number(end));
		}
	});

	// reset button
	document.getElementById("reset").addEventListener("click", () => {
		graph = new Graph();
		draw(graph);
	});
}

// Draw graph
function draw(graph) {
	// clear canvas
	ctx.clearRect(0, 0, canvas.width, canvas.height);

	drawEdges(graph);
	drawNodes(graph);
}

// Draw all edges
function drawEdges(graph) {
	for(let i = 0; i < graph.edges.length; i++) {
		// draw line
		let node1 = graph.nodes[graph.edges[i].node1];
		let node2 = graph.nodes[graph.edges[i].node2];
		ctx.beginPath();
		ctx.moveTo(node1.x, node1.y);
		ctx.lineTo(node2.x, node2.y);
		ctx.strokeStyle = "#000000";
		ctx.lineWidth = 3;
		ctx.stroke();

		// draw circle behind weight
		ctx.beginPath();
		ctx.arc((node1.x + node2.x) / 2, (node1.y + node2.y) / 2, 15, 0, 2 * Math.PI);
		ctx.fillStyle = "#ffffff";
		ctx.fill();

		// draw weight
		ctx.font = "30px Arial";
		ctx.textAlign = "center";
		ctx.textBaseline = "middle";
		ctx.fillStyle = "#000000";
		ctx.fillText(graph.edges[i].weight, (node1.x + node2.x) / 2, (node1.y + node2.y) / 2);
	}
}

// Draw all nodes
function drawNodes(graph) {
	for(let i = 0; i < graph.nodes.length; i++) {
		// draw circle
		ctx.beginPath();
		ctx.arc(graph.nodes[i].x, graph.nodes[i].y, 15, 0, 2 * Math.PI);
		ctx.fillStyle = "#000000";
		ctx.fill();

		// draw id
		ctx.font = "24px Arial";
		ctx.textAlign = "center";
		ctx.textBaseline = "middle";
		ctx.fillStyle = "#ffffff";
		ctx.fillText(graph.nodes[i].id, graph.nodes[i].x, graph.nodes[i].y);

		// draw selected
		if(graph.nodes[i].selected) {
			ctx.beginPath();
			ctx.arc(graph.nodes[i].x, graph.nodes[i].y, 20, 0, 2 * Math.PI);
			ctx.lineWidth = 1;
			ctx.stroke();
		}
	}
}

// Ask user for weight
function askWeight() {
	let weight = prompt("Entrer la durée du trajet");
	if(weight == null || weight == "" || !Number.isInteger(Number(weight)) || weight < 1)
		weight = 1;
	return Number(weight);
}


// Dijkstra's algorithm :

function dijkstra(graph, start, end) {
	graph.reset(start);
	let node = start;
	graph.nodes[node].visit();
	while(node != end) {
		// loop through all edges of the node
		for(let i = 0; i < graph.nodes[node].edges.length; i++) {
			let edge = graph.edges[graph.nodes[node].edges[i]];
			let otherNode = edge.node1 == node ? edge.node2 : edge.node1;
			
			// if the other node is unvisited and the distance is shorter through this node, update the distance and previous node
			if(!graph.nodes[otherNode].visited && graph.nodes[node].distance + edge.weight < graph.nodes[otherNode].distance) {
				graph.nodes[otherNode].setDistance(graph.nodes[node].distance + edge.weight);
				graph.nodes[otherNode].setPrevious(node);
			}
		}

		// choose next node : the closest unvisited node
		node = getClosestNode(graph, node);
		graph.nodes[node].visit();
	}
	drawDijkstra(graph, start, end);
}

// Get closest unvisited node
function getClosestNode(graph, current) {
	let closestNode = null;

	// loop through all nodes connected to the current node
	for(let i = 0; i < graph.nodes[current].edges.length; i++) {
		let edge = graph.nodes[current].edges[i];
		let otherNode = graph.edges[edge].node1 == current ? graph.edges[edge].node2 : graph.edges[edge].node1;

		// if the node is unvisited and the closest node is null or the distance is shorter through this node, update the closest node
		if(!graph.nodes[otherNode].visited && (closestNode == null || graph.nodes[otherNode].distance < graph.nodes[closestNode].distance))
			closestNode = otherNode;
	}
	return closestNode;
}

// Draw shortest path
function drawDijkstra(graph, start, end) {
	let node = end;
	ctx.beginPath();
	ctx.moveTo(graph.nodes[node].x, graph.nodes[node].y);
	while(node != start) {
		ctx.lineTo(graph.nodes[graph.nodes[node].previous].x, graph.nodes[graph.nodes[node].previous].y);
		node = graph.nodes[node].previous;
	}
	ctx.lineWidth = 5;
	ctx.strokeStyle = "rgba(0, 255, 0, 0.5)";
	ctx.stroke();
}