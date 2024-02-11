// Graph class to store nodes and edges
class Graph {
	constructor() {
		this.nodes = [];
		this.edges = [];
	}

	// Add edge to graph
	addEdge(node1, node2, weight) {
		this.edges.push(new Edge(node1, node2, weight));
		this.nodes[node1].edges.push(this.edges.length - 1);
		this.nodes[node2].edges.push(this.edges.length - 1);
	}

	// Add node to graph
	addNode(x, y) {
		this.nodes.push(new Node(this.nodes.length, x, y));
	}

	// Set all nodes to default values
	reset(startNode) {
		for(let i = 0; i < this.nodes.length; i++) {
			this.nodes[i].reset();
			if(i == startNode)
				this.nodes[i].setDistance(0);
			else
				this.nodes[i].setDistance(Infinity);
		}
	}
};